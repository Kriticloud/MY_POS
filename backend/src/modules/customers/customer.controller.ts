import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

export class CustomerController {
  getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { page = '1', limit = '20', search } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (search) {
        where.OR = [
          { firstName: { contains: String(search), mode: 'insensitive' } },
          { lastName: { contains: String(search), mode: 'insensitive' } },
          { phone: { contains: String(search) } },
          { email: { contains: String(search), mode: 'insensitive' } },
        ];
      }

      const [customers, total] = await Promise.all([
        prisma.customer.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
        prisma.customer.count({ where }),
      ]);

      res.json({
        success: true,
        data: customers,
        pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const customer = await prisma.customer.findUnique({
        where: { id: req.params.id },
        include: { orders: { take: 10, orderBy: { createdAt: 'desc' } } },
      });
      if (!customer) throw new AppError('Customer not found', 404);
      res.json({ success: true, data: customer });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const customer = await prisma.customer.create({ data: req.body });
      res.status(201).json({ success: true, data: customer });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const customer = await prisma.customer.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ success: true, data: customer });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await prisma.customer.delete({ where: { id: req.params.id } });
      res.json({ success: true, message: 'Customer deleted' });
    } catch (error) {
      next(error);
    }
  };
}
