import { Router } from 'express';
import { OrderController } from './order.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new OrderController();

router.use(authenticate);
router.get('/', controller.getAll);
router.get('/kitchen/queue', controller.getKitchenQueue);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id/status', controller.updateStatus);
router.put('/:id/void', controller.voidOrder);
router.put('/:id/refund', controller.refundOrder);
router.put('/:id/discount', controller.applyDiscount);

export { router as orderRouter };
