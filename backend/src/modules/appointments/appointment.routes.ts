import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';

const router = Router();
router.use(authenticate);

// Get appointments with filters
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { date, staffId, status } = req.query;
    const where: any = { branchId: req.user!.branchId || undefined };
    if (date) {
      const d = new Date(date as string);
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));
      where.startTime = { gte: start, lte: end };
    }
    if (staffId) where.staffId = staffId;
    if (status) where.status = status;

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        staff: { select: { firstName: true, lastName: true, avatar: true } },
      },
      orderBy: { startTime: 'asc' },
    });
    res.json({ success: true, data: appointments });
  } catch (error) { next(error); }
});

// Create appointment
router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { customerId, staffId, service, startTime, endTime, notes, price } = req.body;
    // Check for conflicts
    const conflict = await prisma.appointment.findFirst({
      where: {
        staffId,
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
        OR: [
          { startTime: { lte: new Date(startTime) }, endTime: { gt: new Date(startTime) } },
          { startTime: { lt: new Date(endTime) }, endTime: { gte: new Date(endTime) } },
        ],
      },
    });
    if (conflict) {
      return res.status(400).json({ success: false, message: 'Staff member has a conflicting appointment' });
    }
    const appointment = await prisma.appointment.create({
      data: {
        customerId, staffId, service,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        notes, price,
        branchId: req.user!.branchId || null,
      },
      include: { staff: { select: { firstName: true, lastName: true } } },
    });
    res.status(201).json({ success: true, data: appointment });
  } catch (error) { next(error); }
});

// Update appointment
router.put('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: req.body,
      include: { staff: { select: { firstName: true, lastName: true } } },
    });
    res.json({ success: true, data: appointment });
  } catch (error) { next(error); }
});

// Update appointment status
router.put('/:id/status', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json({ success: true, data: appointment });
  } catch (error) { next(error); }
});

// Delete appointment
router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.appointment.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (error) { next(error); }
});

export { router as appointmentRouter };
