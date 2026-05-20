import { Router } from 'express';
import { ReportController } from './report.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();
const controller = new ReportController();

router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTANT'));
router.get('/sales', controller.salesReport);
router.get('/daily', controller.dailySummary);
router.get('/top-products', controller.topProducts);
router.get('/staff-performance', controller.staffPerformance);
router.get('/margins', controller.margins);

export { router as reportRouter };
