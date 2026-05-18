import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  discount: z.number().optional(),
  notes: z.string().optional(),
  modifiers: z.any().optional(),
});

const createOrderSchema = z.object({
  orderType: z.enum(['DINE_IN', 'TAKEAWAY', 'DELIVERY', 'ONLINE']),
  items: z.array(orderItemSchema).min(1),
  customerId: z.string().optional(),
  tableId: z.string().optional(),
  notes: z.string().optional(),
  discountAmount: z.number().optional(),
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

      res.json({ success: true, data: order });
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
}
