import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { getIO } from '../../lib/socket';

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  discount: z.number().optional(),
  notes: z.string().optional(),
  modifiers: z.any().optional(),
});

const createOrderSchema = z.object({
  orderType: z.enum(['DINE_IN', 'TAKEAWAY', 'DELIVERY', 'ONLINE', 'IN_STORE', 'PICKUP', 'WALK_IN', 'APPOINTMENT']),
  items: z.array(orderItemSchema).min(1),
  customerId: z.string().nullable().optional(),
  tableId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  discountAmount: z.number().optional(),
  loyaltyPointsRedeemed: z.number().optional(),
  payments: z.array(z.object({
    method: z.enum(['CASH', 'CARD', 'UPI', 'WALLET', 'MIXED']),
    amount: z.number().positive(),
    reference: z.string().optional(),
  })).optional(),
});

export class OrderController {
  getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { page = '1', limit = '20', status, orderType, date } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = { branchId: req.user!.branchId };
      if (status) where.status = String(status);
      if (orderType) where.orderType = String(orderType);
      if (date) {
        const startDate = new Date(String(date));
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        where.createdAt = { gte: startDate, lt: endDate };
      }

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            items: { include: { product: { select: { name: true } } } },
            customer: { select: { firstName: true, lastName: true } },
            table: { select: { name: true } },
            payments: true,
          },
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' },
        }),
        prisma.order.count({ where }),
      ]);

      res.json({
        success: true,
        data: orders,
        pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: {
          items: { include: { product: true } },
          customer: true,
          table: true,
          payments: true,
          user: { select: { firstName: true, lastName: true } },
        },
      });
      if (!order) throw new AppError('Order not found', 404);
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = createOrderSchema.parse(req.body);

      const subtotal = data.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity - (item.discount || 0),
        0
      );
      const taxAmount = subtotal * 0.085; // configurable
      const discountAmount = data.discountAmount || 0;
      const totalAmount = subtotal + taxAmount - discountAmount;

      const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${uuidv4().slice(0, 4).toUpperCase()}`;

      const order = await prisma.order.create({
        data: {
          orderNumber,
          orderType: data.orderType as any,
          subtotal,
          taxAmount,
          discountAmount,
          totalAmount,
          notes: data.notes,
          customerId: data.customerId,
          userId: req.user!.id,
          branchId: req.user!.branchId,
          tableId: data.tableId,
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.unitPrice * item.quantity - (item.discount || 0),
              discount: item.discount || 0,
              notes: item.notes,
              modifiers: item.modifiers,
            })),
          },
          payments: data.payments
            ? { create: data.payments.map((p) => ({ ...p, status: 'COMPLETED' as any })) }
            : undefined,
        },
        include: {
          items: { include: { product: { select: { name: true } } } },
          payments: true,
        },
      });

      // Update table status if dine-in
      if (data.tableId && data.orderType === 'DINE_IN') {
        await prisma.table.update({
          where: { id: data.tableId },
          data: { status: 'OCCUPIED' },
        });
      }

      // Auto-deduct inventory
      for (const item of data.items) {
        const inventory = await prisma.inventory.findFirst({
          where: { productId: item.productId, branchId: req.user!.branchId },
        });
        if (inventory) {
          await prisma.inventory.update({
            where: { id: inventory.id },
            data: { quantity: { decrement: item.quantity } },
          });
          await prisma.stockMovement.create({
            data: {
              inventoryId: inventory.id,
              type: 'SALE',
              quantity: item.quantity,
              reason: `Order ${orderNumber}`,
              reference: order.id,
            },
          });
        }
      }

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user!.id,
          action: 'CREATE_ORDER',
          entity: 'Order',
          entityId: order.id,
          details: JSON.stringify({ orderNumber, totalAmount, items: data.items.length }),
        },
      });

      // Emit WebSocket event for multi-terminal sync
      const io1 = getIO();
      if (io1) {
        io1.to(`branch:${req.user!.branchId}`).emit('order-created', {
          order,
          branchId: req.user!.branchId,
        });
      }

      res.status(201).json({ success: true, data: order });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  };

  updateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      const order = await prisma.order.update({
        where: { id: req.params.id },
        data: { status },
        include: { table: true },
      });

      // Free table when order is completed
      if (status === 'COMPLETED' && order.tableId) {
        await prisma.table.update({
          where: { id: order.tableId },
          data: { status: 'AVAILABLE' },
        });
      }

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user!.id,
          action: 'UPDATE_ORDER_STATUS',
          entity: 'Order',
          entityId: order.id,
          details: JSON.stringify({ status, orderNumber: order.orderNumber }),
        },
      });

      // Emit WebSocket event
      const io2 = getIO();
      if (io2) {
        io2.to(`branch:${req.user!.branchId}`).emit('order-updated', {
          order,
          branchId: req.user!.branchId,
        });
        if (['CONFIRMED', 'PREPARING', 'READY'].includes(status)) {
          io2.to(`branch:${req.user!.branchId}`).emit('kitchen-updated', { order });
        }
      }

      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  };

  voidOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { reason } = req.body;
      if (!reason) throw new AppError('Void reason is required', 400);

      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: { items: true },
      });
      if (!order) throw new AppError('Order not found', 404);
      if (order.status === 'VOIDED' || order.status === 'REFUNDED') {
        throw new AppError('Order is already voided/refunded', 400);
      }

      // Void the order
      const voidedOrder = await prisma.order.update({
        where: { id: req.params.id },
        data: { status: 'VOIDED' },
        include: { items: true, payments: true },
      });

      // Restore inventory for voided items
      for (const item of order.items) {
        const inventory = await prisma.inventory.findFirst({
          where: { productId: item.productId, branchId: order.branchId },
        });
        if (inventory) {
          await prisma.inventory.update({
            where: { id: inventory.id },
            data: { quantity: { increment: item.quantity } },
          });
          await prisma.stockMovement.create({
            data: {
              inventoryId: inventory.id,
              type: 'RETURN',
              quantity: item.quantity,
              reason: `Void: ${reason}`,
              reference: order.id,
            },
          });
        }
      }

      // Free table if applicable
      if (order.tableId) {
        await prisma.table.update({
          where: { id: order.tableId },
          data: { status: 'AVAILABLE' },
        });
      }

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user!.id,
          action: 'VOID_ORDER',
          entity: 'Order',
          entityId: order.id,
          details: JSON.stringify({ orderNumber: order.orderNumber, reason, amount: order.totalAmount }),
        },
      });

      // Emit WebSocket event
      const io3 = getIO();
      if (io3) {
        io3.to(`branch:${req.user!.branchId}`).emit('order-updated', {
          order: voidedOrder,
          branchId: req.user!.branchId,
        });
      }

      res.json({ success: true, data: voidedOrder, message: `Order ${order.orderNumber} voided` });
    } catch (error) {
      next(error);
    }
  };

  refundOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { reason, amount } = req.body;
      if (!reason) throw new AppError('Refund reason is required', 400);

      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: { items: true, payments: true },
      });
      if (!order) throw new AppError('Order not found', 404);
      if (order.status !== 'COMPLETED') {
        throw new AppError('Only completed orders can be refunded', 400);
      }

      const refundAmount = amount || order.totalAmount;
      const isPartial = refundAmount < order.totalAmount;

      // Update order status
      const refundedOrder = await prisma.order.update({
        where: { id: req.params.id },
        data: { status: isPartial ? 'PARTIALLY_REFUNDED' : 'REFUNDED' },
        include: { items: true, payments: true },
      });

      // Create refund payment record
      await prisma.payment.create({
        data: {
          orderId: order.id,
          method: order.payments[0]?.method || 'CASH',
          amount: -refundAmount,
          status: 'REFUNDED',
          reference: `Refund: ${reason}`,
        },
      });

      // Restore inventory for full refunds
      if (!isPartial) {
        for (const item of order.items) {
          const inventory = await prisma.inventory.findFirst({
            where: { productId: item.productId, branchId: order.branchId },
          });
          if (inventory) {
            await prisma.inventory.update({
              where: { id: inventory.id },
              data: { quantity: { increment: item.quantity } },
            });
            await prisma.stockMovement.create({
              data: {
                inventoryId: inventory.id,
                type: 'RETURN',
                quantity: item.quantity,
                reason: `Refund: ${reason}`,
                reference: order.id,
              },
            });
          }
        }
      }

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user!.id,
          action: 'REFUND_ORDER',
          entity: 'Order',
          entityId: order.id,
          details: JSON.stringify({ orderNumber: order.orderNumber, reason, refundAmount, isPartial }),
        },
      });

      // Emit WebSocket event
      const io4 = getIO();
      if (io4) {
        io4.to(`branch:${req.user!.branchId}`).emit('order-updated', {
          order: refundedOrder,
          branchId: req.user!.branchId,
        });
      }

      res.json({ success: true, data: refundedOrder, message: `Refund of $${refundAmount.toFixed(2)} processed` });
    } catch (error) {
      next(error);
    }
  };

  applyDiscount = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { discountId, discountType, discountValue, reason } = req.body;

      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
      });
      if (!order) throw new AppError('Order not found', 404);

      let discountAmount = 0;

      if (discountId) {
        // Apply a predefined discount
        const discount = await prisma.discount.findUnique({ where: { id: discountId } });
        if (!discount || !discount.isActive) throw new AppError('Discount not found or inactive', 400);
        if (discount.minOrder && order.subtotal < discount.minOrder) {
          throw new AppError(`Minimum order amount is $${discount.minOrder}`, 400);
        }
        discountAmount = discount.type === 'PERCENTAGE'
          ? order.subtotal * (discount.value / 100)
          : discount.value;
        if (discount.maxDiscount && discountAmount > discount.maxDiscount) {
          discountAmount = discount.maxDiscount;
        }
      } else if (discountType && discountValue) {
        // Manual discount
        discountAmount = discountType === 'PERCENTAGE'
          ? order.subtotal * (discountValue / 100)
          : discountValue;
      } else {
        throw new AppError('Provide discountId or discountType + discountValue', 400);
      }

      const updatedOrder = await prisma.order.update({
        where: { id: req.params.id },
        data: {
          discountAmount,
          totalAmount: order.subtotal + order.taxAmount - discountAmount,
        },
        include: { items: { include: { product: { select: { name: true } } } }, payments: true },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user!.id,
          action: 'APPLY_DISCOUNT',
          entity: 'Order',
          entityId: order.id,
          details: JSON.stringify({ orderNumber: order.orderNumber, discountAmount, reason }),
        },
      });

      res.json({ success: true, data: updatedOrder });
    } catch (error) {
      next(error);
    }
  };

  getKitchenQueue = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const orders = await prisma.order.findMany({
        where: {
          branchId: req.user!.branchId,
          status: { in: ['CONFIRMED', 'PREPARING'] },
        },
        include: {
          items: { include: { product: { select: { name: true } } } },
          table: { select: { name: true } },
        },
        orderBy: { createdAt: 'asc' },
      });
      res.json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  };

  // Split bill: create separate orders from selected items
  splitBill = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { splits } = req.body;
      // splits: Array of { itemIds: string[], paymentMethod: string }
      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: { items: true },
      });
      if (!order) throw new AppError('Order not found', 404);

      const newOrders = [];
      for (const split of splits) {
        const items = order.items.filter(i => split.itemIds.includes(i.id));
        if (!items.length) continue;
        const subtotal = items.reduce((s, i) => s + i.totalPrice, 0);
        const taxRate = order.taxAmount / (order.subtotal || 1);
        const taxAmount = subtotal * taxRate;
        const totalAmount = subtotal + taxAmount;

        const newOrder = await prisma.order.create({
          data: {
            orderNumber: `${order.orderNumber}-S${newOrders.length + 1}`,
            status: 'COMPLETED',
            orderType: order.orderType,
            subtotal,
            taxAmount,
            totalAmount,
            userId: req.user!.id,
            branchId: order.branchId,
            tableId: order.tableId,
            customerId: order.customerId,
            items: {
              create: items.map(i => ({
                productId: i.productId,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                totalPrice: i.totalPrice,
                discount: i.discount,
                notes: i.notes,
              })),
            },
            payments: {
              create: [{
                method: split.paymentMethod || 'CASH',
                amount: totalAmount,
                status: 'COMPLETED',
              }],
            },
          },
          include: { items: true, payments: true },
        });
        newOrders.push(newOrder);
      }

      // Mark original order as completed
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'COMPLETED', notes: `Split into ${newOrders.length} orders` },
      });

      res.json({ success: true, data: newOrders });
    } catch (error) { next(error); }
  };
}
