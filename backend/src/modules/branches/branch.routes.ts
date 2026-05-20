import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticate, authorize } from '../../middleware/auth';
import { z } from 'zod';

const router = Router();
router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'));

const branchSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  businessType: z.string().default('GENERAL'),
  isActive: z.boolean().default(true),
});

router.get('/', async (_req: Request, res: Response) => {
  const branches = await prisma.branch.findMany({
    include: { _count: { select: { users: true, products: true, orders: true } } },
    orderBy: { name: 'asc' },
  });
  res.json(branches);
});

router.post('/', async (req: Request, res: Response) => {
  const data = branchSchema.parse(req.body);
  const branch = await prisma.branch.create({ data: { ...data, email: data.email || null } });
  res.status(201).json(branch);
});

router.put('/:id', async (req: Request, res: Response) => {
  const data = branchSchema.partial().parse(req.body);
  const branch = await prisma.branch.update({ where: { id: req.params.id }, data: { ...data, email: data.email || undefined } });
  res.json(branch);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await prisma.branch.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export { router as branchRouter };
