import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';

export class InventoryController {
  getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const inventory = await prisma.inventory.findMany({
        where: { branchId: req.user!.branchId },
        include: { product: { select: { name: true, sku: true, barcode: true } } },
        orderBy: { product: { name: 'asc' } },
      });
      res.json({ success: true, data: inventory });
    } catch (error) {
      next(error);
    }
  };

  getLowStock = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const alerts = await prisma.inventory.findMany({
        where: {
          branchId: req.user!.branchId,
          quantity: { lte: prisma.inventory.fields.minStock as any },
        },
        include: { product: { select: { name: true, sku: true } } },
      });
      // Workaround: filter in application
      const allInventory = await prisma.inventory.findMany({
        where: { branchId: req.user!.branchId },
        include: { product: { select: { name: true, sku: true, barcode: true } } },
      });
      const lowStock = allInventory.filter((i) => i.quantity <= i.minStock);
      res.json({ success: true, data: lowStock });
    } catch (error) {
      next(error);
    }
  };

  addMovement = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { inventoryId, type, quantity, reason, reference } = req.body;

      const movement = await prisma.stockMovement.create({
        data: { inventoryId, type, quantity, reason, reference },
      });

      // Update inventory quantity
      const multiplier = type === 'IN' || type === 'RETURN' ? 1 : -1;
      await prisma.inventory.update({
        where: { id: inventoryId },
        data: { quantity: { increment: quantity * multiplier } },
      });

      res.status(201).json({ success: true, data: movement });
    } catch (error) {
      next(error);
    }
  };
}
