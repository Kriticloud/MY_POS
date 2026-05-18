import { Router } from 'express';
import { ProductController } from './product.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new ProductController();

router.use(authenticate);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.get('/barcode/:barcode', controller.getByBarcode);

export { router as productRouter };
