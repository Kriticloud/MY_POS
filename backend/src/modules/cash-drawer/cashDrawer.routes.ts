import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';

const router = Router();
router.use(authenticate);

// Get all cash drawer sessions for current branch
router.get('/sessions', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sessions = await prisma.cashDrawerSession.findMany({
      where: { branchId: req.user!.branchId || undefined },
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { openedAt: 'desc' },
      take: 50,
    });
    res.json({ success: true, data: sessions });
  } catch (error) { next(error); }
});

// Get current open session
router.get('/current', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const session = await prisma.cashDrawerSession.findFirst({
      where: { branchId: req.user!.branchId || undefined, closedAt: null },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
    res.json({ success: true, data: session });
  } catch (error) { next(error); }
});

// Open drawer (start shift)
router.post('/open', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { openingBalance, notes } = req.body;
    // Check if there's already an open session
    const existing = await prisma.cashDrawerSession.findFirst({
      where: { branchId: req.user!.branchId || undefined, closedAt: null },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A drawer session is already open' });
    }
    const session = await prisma.cashDrawerSession.create({
      data: {
        userId: req.user!.id,
        branchId: req.user!.branchId || null,
        openingBalance: openingBalance || 0,
        notes,
      },
    });
    res.status(201).json({ success: true, data: session });
  } catch (error) { next(error); }
});

// Close drawer (end shift)
router.post('/close', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { closingBalance, notes } = req.body;
    const session = await prisma.cashDrawerSession.findFirst({
      where: { branchId: req.user!.branchId || undefined, closedAt: null },
    });
    if (!session) {
      return res.status(400).json({ success: false, message: 'No open drawer session' });
    }
    // Calculate expected balance
    const cashPayments = await prisma.payment.aggregate({
      where: {
        method: 'CASH',
        status: 'COMPLETED',
        createdAt: { gte: session.openedAt },
        order: { branchId: req.user!.branchId || undefined },
      },
      _sum: { amount: true },
    });
    const expectedBalance = session.openingBalance + (cashPayments._sum.amount || 0);
    const difference = (closingBalance || 0) - expectedBalance;

    const updated = await prisma.cashDrawerSession.update({
      where: { id: session.id },
      data: {
        closingBalance: closingBalance || 0,
        expectedBalance,
        difference,
        closedAt: new Date(),
        notes: notes || session.notes,
      },
    });
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
});

// Add cash in/out transaction
router.post('/transaction', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { type, amount, reason } = req.body;
    const session = await prisma.cashDrawerSession.findFirst({
      where: { branchId: req.user!.branchId || undefined, closedAt: null },
    });
    if (!session) {
      return res.status(400).json({ success: false, message: 'No open drawer session' });
    }
    const tx = await prisma.cashTransaction.create({
      data: {
        sessionId: session.id,
        type, // CASH_IN, CASH_OUT, PAID_IN, PAID_OUT
        amount,
        reason,
        userId: req.user!.id,
      },
    });
    res.status(201).json({ success: true, data: tx });
  } catch (error) { next(error); }
});

// Get transactions for a session
router.get('/sessions/:id/transactions', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const transactions = await prisma.cashTransaction.findMany({
      where: { sessionId: req.params.id },
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: transactions });
  } catch (error) { next(error); }
});

export { router as cashDrawerRouter };
