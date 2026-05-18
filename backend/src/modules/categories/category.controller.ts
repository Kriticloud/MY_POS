import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

export class CategoryController {
  getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const categories = await prisma.category.findMany({
        where: { branchId: req.user!.branchId, isActive: true },
        include: { _count: { select: { products: true } } },
        orderBy: { sortOrder: 'asc' },
      });
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const category = await prisma.category.findUnique({
        where: { id: req.params.id },
        include: { products: true },
      });
      if (!category) throw new AppError('Category not found', 404);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const category = await prisma.category.create({
        data: { ...req.body, branchId: req.user!.branchId },
      });
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const category = await prisma.category.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await prisma.category.delete({ where: { id: req.params.id } });
      res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
      next(error);
    }
  };
}
