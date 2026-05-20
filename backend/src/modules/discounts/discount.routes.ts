import { Router, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { authenticate, authorize } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

const router = Router();
router.use(authenticate);

// Get all active discounts
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const discounts = await prisma.discount.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: discounts });
  } catch (error) {
    next(error);
  }
});

// Create a discount (admin/manager only)
router.post('/', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, type, value, minOrder, maxDiscount, startDate, endDate } = req.body;
    if (!name || !type || value === undefined) {
      throw new AppError('Name, type, and value are required', 400);
    }
    if (!['PERCENTAGE', 'FIXED'].includes(type)) {
      throw new AppError('Type must be PERCENTAGE or FIXED', 400);
    }

    const discount = await prisma.discount.create({
      data: {
        name,
        type,
        value,
        minOrder: minOrder || null,
        maxDiscount: maxDiscount || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    res.status(201).json({ success: true, data: discount });
  } catch (error) {
    next(error);
  }
});

// Update a discount
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const discount = await prisma.discount.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: discount });
  } catch (error) {
    next(error);
  }
});

// Delete a discount
router.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.discount.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Discount deleted' });
  } catch (error) {
    next(error);
  }
});

export { router as discountRouter };
