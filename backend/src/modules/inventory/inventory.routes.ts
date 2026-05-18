import { Router } from 'express';
import { InventoryController } from './inventory.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new InventoryController();

router.use(authenticate);
router.get('/', controller.getAll);
router.get('/alerts', controller.getLowStock);
router.post('/movement', controller.addMovement);

export { router as inventoryRouter };
