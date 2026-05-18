import { Router } from 'express';
import { OrderController } from './order.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new OrderController();

router.use(authenticate);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id/status', controller.updateStatus);
router.get('/kitchen/queue', controller.getKitchenQueue);

export { router as orderRouter };
