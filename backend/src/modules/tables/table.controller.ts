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

  // Transfer orders from one table to another
  transfer = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { targetTableId } = req.body;
      const sourceTableId = req.params.id;
      // Move all active orders from source to target
      await prisma.order.updateMany({
        where: { tableId: sourceTableId, status: { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'SERVED'] } },
        data: { tableId: targetTableId },
      });
      // Update table statuses
      await prisma.table.update({ where: { id: sourceTableId }, data: { status: 'AVAILABLE' } });
      await prisma.table.update({ where: { id: targetTableId }, data: { status: 'OCCUPIED' } });
      res.json({ success: true, message: 'Orders transferred successfully' });
    } catch (error) {
      next(error);
    }
  };

  // Merge two tables (combine orders under one table)
  merge = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { sourceTableId } = req.body;
      const targetTableId = req.params.id;
      // Move all active orders from source to target
      await prisma.order.updateMany({
        where: { tableId: sourceTableId, status: { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'SERVED'] } },
        data: { tableId: targetTableId },
      });
      await prisma.table.update({ where: { id: sourceTableId }, data: { status: 'AVAILABLE' } });
      await prisma.table.update({ where: { id: targetTableId }, data: { status: 'OCCUPIED' } });
      res.json({ success: true, message: 'Tables merged successfully' });
    } catch (error) {
      next(error);
    }
  };
}
