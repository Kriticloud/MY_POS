import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

const router = Router();

const taxSchema = z.object({
  name: z.string().min(1),
  rate: z.number().min(0).max(100),
  isActive: z.boolean().default(true),
});

// GET all taxes
router.get('/', async (_req: Request, res: Response) => {
  const taxes = await prisma.tax.findMany({ orderBy: { name: 'asc' } });
  res.json(taxes);
});

// POST create tax
router.post('/', async (req: Request, res: Response) => {
  const data = taxSchema.parse(req.body);
  const tax = await prisma.tax.create({ data });
  res.status(201).json(tax);
});

// PUT update tax
router.put('/:id', async (req: Request, res: Response) => {
  const data = taxSchema.partial().parse(req.body);
  const tax = await prisma.tax.update({ where: { id: req.params.id }, data });
  res.json(tax);
});

// DELETE tax
router.delete('/:id', async (req: Request, res: Response) => {
  await prisma.tax.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export { router as taxRouter };
