import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

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

      // Get active clock entries (no clockOut = currently clocked in)
      const activeClocks = await prisma.clockEntry.findMany({
        where: { clockOut: null },
        select: { userId: true, clockIn: true },
      });
      const activeClockMap = new Map(activeClocks.map((c) => [c.userId, c.clockIn]));

      const employees = users.map((u) => ({
        ...u,
        clockedIn: activeClockMap.has(u.id),
        clockedInAt: activeClockMap.get(u.id) || null,
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

      const activeClock = await prisma.clockEntry.findFirst({
        where: { userId: user.id, clockOut: null },
      });

      // Get total hours this week
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEntries = await prisma.clockEntry.findMany({
        where: { userId: user.id, clockIn: { gte: weekStart } },
      });
      const totalHoursWeek = weekEntries.reduce((sum, e) => {
        if (e.hoursWorked) return sum + e.hoursWorked;
        if (e.clockOut) return sum + (e.clockOut.getTime() - e.clockIn.getTime()) / 3600000;
        return sum + (Date.now() - e.clockIn.getTime()) / 3600000;
      }, 0);

      res.json({
        success: true,
        data: {
          ...user,
          clockedIn: !!activeClock,
          clockedInAt: activeClock?.clockIn || null,
          ordersToday: todayOrders.length,
          totalSalesToday: todayOrders.reduce((s, o) => s + o.totalAmount, 0),
          hoursThisWeek: +totalHoursWeek.toFixed(1),
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
        select: { id: true, firstName: true, lastName: true, branchId: true },
      });
      if (!user) throw new AppError('Employee not found', 404);

      // Check if already clocked in
      const existing = await prisma.clockEntry.findFirst({
        where: { userId: user.id, clockOut: null },
      });
      if (existing) throw new AppError('Already clocked in', 400);

      const entry = await prisma.clockEntry.create({
        data: {
          userId: user.id,
          branchId: user.branchId,
        },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user!.id,
          action: 'CLOCK_IN',
          entity: 'ClockEntry',
          entityId: entry.id,
          details: JSON.stringify({ employee: `${user.firstName} ${user.lastName}` }),
        },
      });

      res.json({
        success: true,
        data: { id: user.id, clockedIn: true, clockedInAt: entry.clockIn },
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

      const entry = await prisma.clockEntry.findFirst({
        where: { userId: user.id, clockOut: null },
      });
      if (!entry) throw new AppError('Not currently clocked in', 400);

      const clockOut = new Date();
      const hoursWorked = +(
        (clockOut.getTime() - entry.clockIn.getTime()) / 3600000
      ).toFixed(2);

      await prisma.clockEntry.update({
        where: { id: entry.id },
        data: { clockOut, hoursWorked },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: req.user!.id,
          action: 'CLOCK_OUT',
          entity: 'ClockEntry',
          entityId: entry.id,
          details: JSON.stringify({ employee: `${user.firstName} ${user.lastName}`, hoursWorked }),
        },
      });

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
