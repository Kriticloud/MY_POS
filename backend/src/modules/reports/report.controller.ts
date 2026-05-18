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
}
