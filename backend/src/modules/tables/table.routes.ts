import { Router } from 'express';
import { TableController } from './table.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new TableController();

router.use(authenticate);
router.get('/', controller.getAll);
router.put('/:id/status', controller.updateStatus);
router.post('/', controller.create);
router.put('/:id', controller.update);

export { router as tableRouter };
