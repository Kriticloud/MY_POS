import { Router, Response, NextFunction } from 'express';
import { authenticate, authorize, AuthRequest } from '../../middleware/auth';
import { sendSms, getSmsConfig, sendOrderConfirmationSms, sendOrderReadySms, sendPromotionalSms } from './sms.service';
import { prisma } from '../../lib/prisma';

const router = Router();
router.use(authenticate);

// GET /api/sms/status — check if SMS is enabled and configured
router.get('/status', async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const config = await getSmsConfig();
    res.json({
      success: true,
      data: {
        enabled: config.enabled,
        configured: !!(config.accountSid && config.authToken && config.fromNumber),
        fromNumber: config.fromNumber ? config.fromNumber.replace(/.(?=.{4})/g, '*') : '', // mask number
      },
    });
  } catch (error) { next(error); }
});

// POST /api/sms/send — send a custom SMS
router.post('/send', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { to, message } = req.body;
    if (!to || !message) {
      return res.status(400).json({ success: false, error: 'Phone number and message are required' });
    }
    const result = await sendSms(to, message);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    res.json({ success: true, data: { sid: result.sid } });
  } catch (error) { next(error); }
});

// POST /api/sms/test — send a test SMS to verify configuration
router.post('/test', authorize('SUPER_ADMIN', 'ADMIN'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { to } = req.body;
    if (!to) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }
    const businessName = (await prisma.setting.findUnique({ where: { key: 'businessName' } }))?.value || 'MyPOS';
    const result = await sendSms(to, `${businessName}: This is a test SMS from your POS system. SMS notifications are working correctly! ✓`);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    res.json({ success: true, data: { sid: result.sid, message: 'Test SMS sent successfully' } });
  } catch (error) { next(error); }
});

// POST /api/sms/order-confirmation — send order confirmation SMS
router.post('/order-confirmation', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { phone, orderNumber, total } = req.body;
    if (!phone || !orderNumber || !total) {
      return res.status(400).json({ success: false, error: 'Phone, order number, and total are required' });
    }
    const businessName = (await prisma.setting.findUnique({ where: { key: 'businessName' } }))?.value || 'MyPOS';
    const result = await sendOrderConfirmationSms(phone, orderNumber, total, businessName);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    res.json({ success: true, data: { sid: result.sid } });
  } catch (error) { next(error); }
});

// POST /api/sms/order-ready — send order ready SMS
router.post('/order-ready', authorize('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { phone, orderNumber } = req.body;
    if (!phone || !orderNumber) {
      return res.status(400).json({ success: false, error: 'Phone and order number are required' });
    }
    const businessName = (await prisma.setting.findUnique({ where: { key: 'businessName' } }))?.value || 'MyPOS';
    const result = await sendOrderReadySms(phone, orderNumber, businessName);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    res.json({ success: true, data: { sid: result.sid } });
  } catch (error) { next(error); }
});

// POST /api/sms/promotional — send promotional SMS to customers
router.post('/promotional', authorize('SUPER_ADMIN', 'ADMIN'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { message, customerIds } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const where: any = { phone: { not: null } };
    if (customerIds?.length) {
      where.id = { in: customerIds };
    }
    const customers = await prisma.customer.findMany({ where, select: { id: true, phone: true, firstName: true } });

    let sent = 0;
    let failed = 0;
    for (const customer of customers) {
      if (!customer.phone) continue;
      const result = await sendPromotionalSms(customer.phone, message);
      if (result.success) sent++;
      else failed++;
    }

    res.json({ success: true, data: { sent, failed, total: customers.length } });
  } catch (error) { next(error); }
});

export { router as smsRouter };
