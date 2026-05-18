import { Router } from 'express';
import { SettingController } from './setting.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();
const controller = new SettingController();

router.use(authenticate);
router.get('/', controller.getAll);
router.get('/:key', controller.getByKey);
router.put('/:key', authorize('SUPER_ADMIN', 'ADMIN'), controller.update);

export { router as settingRouter };
