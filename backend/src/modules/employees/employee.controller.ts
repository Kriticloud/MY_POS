import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

// In-memory clock-in state (in production, this would be a DB table)
const clockState: Record<string, { clockedIn: boolean; clockedInAt: Date | null }> = {};

export class EmployeeController {
  getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.user.findMany({
        where: { branchId: req.user!.branchId, isActive: true },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          role: true,
          createdAt: true,
        },
        orderBy: { firstName: 'asc' },
      });

      // Get today's order stats per user
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayOrders = await prisma.order.findMany({
        where: {
          branchId: req.user!.branchId,
          createdAt: { gte: today, lt: tomorrow },
        },
        select: { userId: true, totalAmount: true },
      });

      const ordersByUser: Record<string, { count: number; total: number }> = {};
      todayOrders.forEach((o) => {
        if (!o.userId) return;
        if (!ordersByUser[o.userId]) ordersByUser[o.userId] = { count: 0, total: 0 };
        ordersByUser[o.userId].count++;
        ordersByUser[o.userId].total += o.totalAmount;
      });

      const employees = users.map((u) => ({
        ...u,
        clockedIn: clockState[u.id]?.clockedIn || false,
        clockedInAt: clockState[u.id]?.clockedInAt || null,
        ordersToday: ordersByUser[u.id]?.count || 0,
        totalSalesToday: ordersByUser[u.id]?.total || 0,
      }));

      res.json({ success: true, data: employees });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          role: true,
          createdAt: true,
        },
      });
      if (!user) throw new AppError('Employee not found', 404);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayOrders = await prisma.order.findMany({
        where: {
          userId: user.id,
          createdAt: { gte: today, lt: tomorrow },
        },
        select: { totalAmount: true },
      });

      res.json({
        success: true,
        data: {
          ...user,
          clockedIn: clockState[user.id]?.clockedIn || false,
          clockedInAt: clockState[user.id]?.clockedInAt || null,
          ordersToday: todayOrders.length,
          totalSalesToday: todayOrders.reduce((s, o) => s + o.totalAmount, 0),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  clockIn = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: { id: true, firstName: true, lastName: true },
      });
      if (!user) throw new AppError('Employee not found', 404);

      clockState[user.id] = { clockedIn: true, clockedInAt: new Date() };

      res.json({
        success: true,
        data: { id: user.id, clockedIn: true, clockedInAt: clockState[user.id].clockedInAt },
        message: `${user.firstName} ${user.lastName} clocked in`,
      });
    } catch (error) {
      next(error);
    }
  };

  clockOut = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: { id: true, firstName: true, lastName: true },
      });
      if (!user) throw new AppError('Employee not found', 404);

      const wasIn = clockState[user.id]?.clockedInAt;
      clockState[user.id] = { clockedIn: false, clockedInAt: null };

      const hoursWorked = wasIn
        ? ((Date.now() - wasIn.getTime()) / 3600000).toFixed(1)
        : '0';

      res.json({
        success: true,
        data: { id: user.id, clockedIn: false, clockedInAt: null, hoursWorked },
        message: `${user.firstName} ${user.lastName} clocked out (${hoursWorked}h)`,
      });
    } catch (error) {
      next(error);
    }
  };
}
