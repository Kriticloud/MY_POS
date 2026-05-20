import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';

const router = Router();
router.use(authenticate);

// Get all suppliers
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: suppliers });
  } catch (error) { next(error); }
});

// Create supplier
router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, address, company } = req.body;
    const supplier = await prisma.supplier.create({
      data: { name, email, phone, address, company },
    });
    res.status(201).json({ success: true, data: supplier });
  } catch (error) { next(error); }
});

// Update supplier
router.put('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const supplier = await prisma.supplier.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: supplier });
  } catch (error) { next(error); }
});

// Delete supplier
router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.supplier.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Supplier deleted' });
  } catch (error) { next(error); }
});

// Get purchase orders
router.get('/purchase-orders', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.purchaseOrder.findMany({
      include: {
        supplier: { select: { name: true } },
        user: { select: { firstName: true, lastName: true } },
        items: { include: { product: { select: { name: true, sku: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ success: true, data: orders });
  } catch (error) { next(error); }
});

// Create purchase order
router.post('/purchase-orders', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { supplierId, items, notes } = req.body;
    const totalAmount = (items || []).reduce((s: number, i: any) => s + (i.quantity * i.unitCost), 0);
    const orderNumber = `PO-${Date.now().toString(36).toUpperCase()}`;
    const po = await prisma.purchaseOrder.create({
      data: {
        orderNumber,
        supplierId,
        userId: req.user!.id,
        totalAmount,
        notes,
        items: {
          create: (items || []).map((i: any) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitCost: i.unitCost,
            totalCost: i.quantity * i.unitCost,
          })),
        },
      },
      include: { items: true, supplier: true },
    });
    res.status(201).json({ success: true, data: po });
  } catch (error) { next(error); }
});

// Receive purchase order (marks as received + updates inventory)
router.put('/purchase-orders/:id/receive', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id: req.params.id },
      include: { items: true },
    });
    if (!po) return res.status(404).json({ success: false, message: 'PO not found' });

    // Update inventory for each item
    for (const item of po.items) {
      const inv = await prisma.inventory.findFirst({ where: { productId: item.productId } });
      if (inv) {
        await prisma.inventory.update({
          where: { id: inv.id },
          data: { quantity: { increment: item.quantity } },
        });
        await prisma.stockMovement.create({
          data: {
            inventoryId: inv.id,
            type: 'PURCHASE',
            quantity: item.quantity,
            reason: `PO ${po.orderNumber}`,
            reference: po.id,
          },
        });
      }
    }

    const updated = await prisma.purchaseOrder.update({
      where: { id: req.params.id },
      data: { status: 'RECEIVED', receivedAt: new Date() },
    });
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
});

export { router as supplierRouter };
