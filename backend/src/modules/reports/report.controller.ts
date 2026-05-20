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

  taxReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(String(startDate)) : new Date(new Date().setDate(new Date().getDate() - 30));
      const end = endDate ? new Date(String(endDate)) : new Date();

      const orders = await prisma.order.findMany({
        where: { status: 'COMPLETED', createdAt: { gte: start, lte: end } },
        include: { items: { include: { product: { select: { name: true, taxRate: true } } } } },
      });

      // Group by tax rate
      const taxBreakdown: Record<number, { rate: number; taxableAmount: number; taxCollected: number; orderCount: number }> = {};
      for (const order of orders) {
        for (const item of order.items) {
          const rate = item.product?.taxRate || 0;
          if (!taxBreakdown[rate]) taxBreakdown[rate] = { rate, taxableAmount: 0, taxCollected: 0, orderCount: 0 };
          const itemTotal = item.totalPrice;
          const taxAmount = itemTotal * (rate / (100 + rate)); // Extract tax from inclusive price
          taxBreakdown[rate].taxableAmount += itemTotal - taxAmount;
          taxBreakdown[rate].taxCollected += taxAmount;
          taxBreakdown[rate].orderCount++;
        }
      }

      const totalTaxCollected = Object.values(taxBreakdown).reduce((s, t) => s + t.taxCollected, 0);
      const totalTaxableAmount = Object.values(taxBreakdown).reduce((s, t) => s + t.taxableAmount, 0);

      res.json({
        success: true,
        data: { breakdown: Object.values(taxBreakdown), totalTaxCollected, totalTaxableAmount, period: { start, end }, orderCount: orders.length },
      });
    } catch (error) { next(error); }
  };

  profitAndLoss = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(String(startDate)) : new Date(new Date().setDate(new Date().getDate() - 30));
      const end = endDate ? new Date(String(endDate)) : new Date();

      const orders = await prisma.order.findMany({
        where: { status: 'COMPLETED', createdAt: { gte: start, lte: end } },
        include: { items: { include: { product: { select: { costPrice: true, price: true } } } } },
      });

      let totalRevenue = 0;
      let totalCOGS = 0;
      let totalDiscount = 0;
      let totalTax = 0;

      for (const order of orders) {
        totalRevenue += order.totalAmount;
        totalDiscount += order.discountAmount;
        totalTax += order.taxAmount;
        for (const item of order.items) {
          const cost = item.product?.costPrice || (item.product?.price || 0) * 0.6;
          totalCOGS += cost * item.quantity;
        }
      }

      const grossProfit = totalRevenue - totalCOGS;
      const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
      const netProfit = grossProfit - totalDiscount;
      const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      res.json({
        success: true,
        data: {
          revenue: totalRevenue,
          costOfGoods: totalCOGS,
          grossProfit,
          grossMargin,
          discounts: totalDiscount,
          taxCollected: totalTax,
          netProfit,
          netMargin,
          orderCount: orders.length,
          period: { start, end },
        },
      });
    } catch (error) { next(error); }
  };
}
