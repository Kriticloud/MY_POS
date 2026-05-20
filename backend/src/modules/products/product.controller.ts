import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  price: z.number().positive(),
  costPrice: z.number().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
  isWeighted: z.boolean().optional(),
  unit: z.string().optional(),
  taxRate: z.number().optional(),
  categoryId: z.string().optional(),
  businessType: z.string().optional(),
  modifiers: z.any().optional(),
  variants: z.any().optional(),
});

export class ProductController {
  getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { page = '1', limit = '50', search, categoryId, isActive, businessType } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = { branchId: req.user!.branchId };
      if (businessType) where.businessType = String(businessType);
      if (search) {
        where.OR = [
          { name: { contains: String(search) } },
          { barcode: { contains: String(search) } },
          { sku: { contains: String(search) } },
        ];
      }
      if (categoryId) where.categoryId = String(categoryId);
      if (isActive !== undefined) where.isActive = isActive === 'true';

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: { category: { select: { id: true, name: true, color: true } } },
          skip,
          take: Number(limit),
          orderBy: { name: 'asc' },
        }),
        prisma.product.count({ where }),
      ]);

      res.json({
        success: true,
        data: products,
        pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id: req.params.id },
        include: { category: true, inventory: true },
      });
      if (!product) throw new AppError('Product not found', 404);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  getByBarcode = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const product = await prisma.product.findFirst({
        where: { barcode: req.params.barcode, branchId: req.user!.branchId },
        include: { category: { select: { id: true, name: true } } },
      });
      if (!product) throw new AppError('Product not found', 404);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = productSchema.parse(req.body);
      // Auto-set businessType from settings if not provided
      if (!data.businessType) {
        const setting = await prisma.setting.findFirst({ where: { key: 'businessType' } });
        if (setting) data.businessType = setting.value;
      }
      const product = await prisma.product.create({
        data: { ...data, branchId: req.user!.branchId },
      });
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = productSchema.partial().parse(req.body);
      const product = await prisma.product.update({
        where: { id: req.params.id },
        data,
      });
      res.json({ success: true, data: product });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  };

  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await prisma.product.delete({ where: { id: req.params.id } });
      res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
      next(error);
    }
  };
}
