import { Router } from 'express';
import { EmployeeController } from './employee.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new EmployeeController();

router.use(authenticate);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/:id/clock-in', controller.clockIn);
router.post('/:id/clock-out', controller.clockOut);

export { router as employeeRouter };
