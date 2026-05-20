import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';
import crypto from 'crypto';

const router = Router();
router.use(authenticate);

function generateCode(): string {
  return 'GC-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

// GET all gift cards
router.get('/', async (_req: Request, res: Response) => {
  const cards = await prisma.giftCard.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(cards);
});

// GET single gift card by code (for POS lookup)
router.get('/lookup/:code', async (req: Request, res: Response) => {
  const card = await prisma.giftCard.findUnique({ where: { code: req.params.code } });
  if (!card) { res.status(404).json({ error: 'Gift card not found' }); return; }
  if (!card.isActive) { res.status(400).json({ error: 'Gift card is inactive' }); return; }
  if (card.expiresAt && card.expiresAt < new Date()) { res.status(400).json({ error: 'Gift card has expired' }); return; }
  res.json(card);
});

// POST create gift card
router.post('/', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), async (req: Request, res: Response) => {
  const { initialValue, customerId, expiresAt } = req.body;
  if (!initialValue || initialValue <= 0) { res.status(400).json({ error: 'Initial value must be positive' }); return; }
  const card = await prisma.giftCard.create({
    data: {
      code: generateCode(),
      initialValue: parseFloat(initialValue),
      balance: parseFloat(initialValue),
      customerId: customerId || null,
      issuedById: (req as any).user?.id || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });
  res.status(201).json(card);
});

// POST redeem (deduct balance)
router.post('/:code/redeem', async (req: Request, res: Response) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) { res.status(400).json({ error: 'Amount must be positive' }); return; }
  const card = await prisma.giftCard.findUnique({ where: { code: req.params.code } });
  if (!card) { res.status(404).json({ error: 'Gift card not found' }); return; }
  if (!card.isActive) { res.status(400).json({ error: 'Gift card is inactive' }); return; }
  if (card.expiresAt && card.expiresAt < new Date()) { res.status(400).json({ error: 'Gift card has expired' }); return; }
  if (card.balance < amount) { res.status(400).json({ error: `Insufficient balance. Available: ${card.balance}` }); return; }
  const updated = await prisma.giftCard.update({
    where: { code: req.params.code },
    data: { balance: { decrement: parseFloat(amount) } },
  });
  res.json({ success: true, remainingBalance: updated.balance, deducted: amount });
});

// POST top up
router.post('/:code/topup', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), async (req: Request, res: Response) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) { res.status(400).json({ error: 'Amount must be positive' }); return; }
  const updated = await prisma.giftCard.update({
    where: { code: req.params.code },
    data: { balance: { increment: parseFloat(amount) } },
  });
  res.json(updated);
});

// PUT toggle active
router.put('/:id/toggle', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), async (req: Request, res: Response) => {
  const card = await prisma.giftCard.findUnique({ where: { id: req.params.id } });
  if (!card) { res.status(404).json({ error: 'Not found' }); return; }
  const updated = await prisma.giftCard.update({ where: { id: req.params.id }, data: { isActive: !card.isActive } });
  res.json(updated);
});

// DELETE
router.delete('/:id', authorize('SUPER_ADMIN', 'ADMIN'), async (req: Request, res: Response) => {
  await prisma.giftCard.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export { router as giftCardRouter };
