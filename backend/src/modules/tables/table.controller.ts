import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';

export class TableController {
  getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tables = await prisma.table.findMany({
        where: { branchId: req.user!.branchId },
        include: {
          orders: {
            where: { status: { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'SERVED'] } },
            select: { id: true, orderNumber: true, totalAmount: true, status: true },
          },
        },
        orderBy: { name: 'asc' },
      });
      res.json({ success: true, data: tables });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      const table = await prisma.table.update({
        where: { id: req.params.id },
        data: { status },
      });
      res.json({ success: true, data: table });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const table = await prisma.table.create({
        data: { ...req.body, branchId: req.user!.branchId },
      });
      res.status(201).json({ success: true, data: table });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const table = await prisma.table.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ success: true, data: table });
    } catch (error) {
      next(error);
    }
  };
}
