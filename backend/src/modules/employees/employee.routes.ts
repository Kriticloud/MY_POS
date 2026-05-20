import { Router } from 'express';
import { EmployeeController } from './employee.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();
const controller = new EmployeeController();

router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'));
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/:id/clock-in', controller.clockIn);
router.post('/:id/clock-out', controller.clockOut);

export { router as employeeRouter };
