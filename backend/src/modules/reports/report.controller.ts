import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';

export class ReportController {
  salesReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(String(startDate)) : new Date(new Date().setDate(new Date().getDate() - 30));
      const end = endDate ? new Date(String(endDate)) : new Date();

      const orders = await prisma.order.findMany({
        where: {
          branchId: req.user!.branchId,
          status: 'COMPLETED',
          createdAt: { gte: start, lte: end },
        },
        select: { totalAmount: true, taxAmount: true, discountAmount: true, createdAt: true },
      });

      const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
      const totalTax = orders.reduce((sum, o) => sum + o.taxAmount, 0);
      const totalDiscount = orders.reduce((sum, o) => sum + o.discountAmount, 0);
      const orderCount = orders.length;
      const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

      res.json({
        success: true,
        data: { totalRevenue, totalTax, totalDiscount, orderCount, averageOrderValue, period: { start, end } },
      });
    } catch (error) {
      next(error);
    }
  };

  dailySummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [orders, completedOrders] = await Promise.all([
        prisma.order.count({
          where: { branchId: req.user!.branchId, createdAt: { gte: today, lt: tomorrow } },
        }),
        prisma.order.findMany({
          where: {
            branchId: req.user!.branchId,
            status: 'COMPLETED',
            createdAt: { gte: today, lt: tomorrow },
          },
          select: { totalAmount: true },
        }),
      ]);

      const revenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      res.json({
        success: true,
        data: { date: today, totalOrders: orders, completedOrders: completedOrders.length, revenue },
      });
    } catch (error) {
      next(error);
    }
  };

  topProducts = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { limit = '10' } = req.query;
      const topItems = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true, totalPrice: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: Number(limit),
      });

      const productIds = topItems.map((item) => item.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, price: true },
      });

      const result = topItems.map((item) => ({
        product: products.find((p) => p.id === item.productId),
        totalQuantity: item._sum.quantity,
        totalRevenue: item._sum.totalPrice,
      }));

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  staffPerformance = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.user.findMany({
        where: { branchId: req.user!.branchId, isActive: true },
        select: { id: true, firstName: true, lastName: true },
      });

      const orders = await prisma.order.findMany({
        where: { branchId: req.user!.branchId },
        select: { userId: true, totalAmount: true },
      });

      const ordersByUser: Record<string, { count: number; total: number }> = {};
      orders.forEach((o) => {
        if (!o.userId) return;
        if (!ordersByUser[o.userId]) ordersByUser[o.userId] = { count: 0, total: 0 };
        ordersByUser[o.userId].count++;
        ordersByUser[o.userId].total += o.totalAmount;
      });

      const result = users.map((u) => {
        const stats = ordersByUser[u.id] || { count: 0, total: 0 };
        const hours = 8; // Default shift hours
        return {
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          orders: stats.count,
          revenue: stats.total,
          avgOrder: stats.count > 0 ? stats.total / stats.count : 0,
          hours,
          revenuePerHour: stats.total / hours,
        };
      });

      result.sort((a, b) => b.revenue - a.revenue);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  margins = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const orderItems = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true, totalPrice: true },
        orderBy: { _sum: { totalPrice: 'desc' } },
      });

      const productIds = orderItems.map((item) => item.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, price: true, costPrice: true },
      });

      const result = orderItems.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        const revenue = item._sum.totalPrice || 0;
        const quantity = item._sum.quantity || 0;
        const costPrice = product?.costPrice || (product?.price || 0) * 0.6;
        const cost = costPrice * quantity;
        const profit = revenue - cost;
        const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

        return {
          productId: item.productId,
          name: product?.name || 'Unknown',
          quantity,
          revenue,
          cost,
          profit,
          margin,
        };
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
