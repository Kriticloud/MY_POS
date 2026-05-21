import { Router, Request, Response } from 'express';
import { ReportController } from './report.controller';
import { authenticate, authorize } from '../../middleware/auth';
import { getScheduledReports, getReportHistory, createScheduledReport, updateScheduledReport, deleteScheduledReport, runScheduledReport } from './scheduledReports';

const router = Router();
const controller = new ReportController();

router.use(authenticate);

// Dashboard endpoints — accessible by all authenticated roles
router.get('/daily', controller.dailySummary);
router.get('/top-products', controller.topProducts);

// Detailed reports — restricted to admin/manager roles
router.use(authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTANT'));
router.get('/sales', controller.salesReport);
router.get('/staff-performance', controller.staffPerformance);
router.get('/margins', controller.margins);
router.get('/tax', controller.taxReport);
router.get('/profit-loss', controller.profitAndLoss);

// Scheduled reports
router.get('/scheduled', (_req: Request, res: Response) => { res.json(getScheduledReports()); });
router.get('/scheduled/history', (_req: Request, res: Response) => { res.json(getReportHistory()); });
router.post('/scheduled', (req: Request, res: Response) => { res.status(201).json(createScheduledReport(req.body)); });
router.put('/scheduled/:id', (req: Request, res: Response) => { res.json(updateScheduledReport(req.params.id, req.body)); });
router.delete('/scheduled/:id', (req: Request, res: Response) => { deleteScheduledReport(req.params.id); res.json({ success: true }); });
router.post('/scheduled/:id/run', async (req: Request, res: Response) => { const result = await runScheduledReport(req.params.id); res.json(result); });

export { router as reportRouter };
