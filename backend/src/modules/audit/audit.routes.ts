import { Router, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { authenticate } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';

const router = Router();
router.use(authenticate);

// Get audit log
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { limit = '50', entity, action } = req.query;
    const where: any = {};
    if (entity) where.entity = String(entity);
    if (action) where.action = String(action);

    const logs = await prisma.activityLog.findMany({
      where,
      include: { user: { select: { firstName: true, lastName: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
    });

    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
});

export { router as auditLogRouter };
