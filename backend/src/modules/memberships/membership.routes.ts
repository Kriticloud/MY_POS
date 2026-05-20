import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

const router = Router();

const membershipSchema = z.object({
  name: z.string().min(1),
  discount: z.number().min(0).max(100).default(0),
  pointsMultiplier: z.number().min(0).default(1),
  benefits: z.string().optional(),
  isActive: z.boolean().default(true),
});

// GET all memberships
router.get('/', async (_req: Request, res: Response) => {
  const memberships = await prisma.membership.findMany({
    include: { _count: { select: { customers: true } } },
    orderBy: { discount: 'desc' },
  });
  res.json(memberships);
});

// POST create membership
router.post('/', async (req: Request, res: Response) => {
  const data = membershipSchema.parse(req.body);
  const membership = await prisma.membership.create({ data });
  res.status(201).json(membership);
});

// PUT update membership
router.put('/:id', async (req: Request, res: Response) => {
  const data = membershipSchema.partial().parse(req.body);
  const membership = await prisma.membership.update({ where: { id: req.params.id }, data });
  res.json(membership);
});

// DELETE membership
router.delete('/:id', async (req: Request, res: Response) => {
  await prisma.membership.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// POST assign membership to customer
router.post('/:id/assign', async (req: Request, res: Response) => {
  const { customerId } = z.object({ customerId: z.string() }).parse(req.body);
  const customer = await prisma.customer.update({
    where: { id: customerId },
    data: { membershipId: req.params.id },
    include: { membership: true },
  });
  res.json(customer);
});

// POST remove membership from customer
router.post('/unassign', async (req: Request, res: Response) => {
  const { customerId } = z.object({ customerId: z.string() }).parse(req.body);
  const customer = await prisma.customer.update({
    where: { id: customerId },
    data: { membershipId: null },
  });
  res.json(customer);
});

export { router as membershipRouter };
