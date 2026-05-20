import { Router } from 'express';
import { OrderController } from './order.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();
const controller = new OrderController();

router.use(authenticate);
router.get('/', controller.getAll);
router.get('/kitchen/queue', controller.getKitchenQueue);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id/status', controller.updateStatus);
router.put('/:id/void', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), controller.voidOrder);
router.put('/:id/refund', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), controller.refundOrder);
router.put('/:id/discount', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), controller.applyDiscount);
router.post('/:id/split', controller.splitBill);

export { router as orderRouter };
