import { Router } from 'express';
import { CustomerController } from './customer.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new CustomerController();

router.use(authenticate);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export { router as customerRouter };
