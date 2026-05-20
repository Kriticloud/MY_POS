import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { sendEmail } from '../email/email.service';
import { sendSms, getSmsConfig } from '../sms/sms.service';
import { prisma } from '../../lib/prisma';

const router = Router();
router.use(authenticate);

// POST /api/receipt/send-email — send receipt HTML via email
router.post('/send-email', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { to, receiptHtml, orderNumber, businessName } = req.body;
    if (!to || !receiptHtml || !orderNumber) {
      return res.status(400).json({ success: false, error: 'Email, receipt HTML, and order number are required' });
    }
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return res.status(400).json({ success: false, error: 'Invalid email address' });
    }

    const emailHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#2563eb;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="margin:0">${businessName || 'MyPOS'}</h1>
          <p style="margin:4px 0 0;opacity:0.9;font-size:14px">Order Receipt #${orderNumber}</p>
        </div>
        <div style="padding:20px;background:#ffffff;border:1px solid #e5e7eb">
          ${receiptHtml}
        </div>
        <div style="padding:16px;text-align:center;color:#6b7280;font-size:12px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 8px 8px;background:#f9fafb">
          <p>Thank you for your business!</p>
        </div>
      </div>`;

    await sendEmail({
      to,
      subject: `Receipt for Order #${orderNumber} — ${businessName || 'MyPOS'}`,
      html: emailHtml,
    });

    res.json({ success: true, data: { message: 'Receipt email sent' } });
  } catch (error: any) {
    const msg = error?.message || 'Failed to send email';
    res.status(400).json({ success: false, error: msg });
  }
});

// POST /api/receipt/send-sms — send order receipt SMS using selected template
router.post('/send-sms', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { to, orderNumber, customerName, total, businessName } = req.body;
    if (!to || !orderNumber) {
      return res.status(400).json({ success: false, error: 'Phone number and order number are required' });
    }

    // Get the selected SMS template from settings
    const templateSetting = await prisma.setting.findUnique({ where: { key: 'smsReceiptTemplate' } });
    const templateId = templateSetting?.value || '1';

    // Get custom templates if any
    const customTemplates = await prisma.setting.findMany({
      where: { key: { startsWith: 'smsTemplate_' } },
    });
    const customMap: Record<string, string> = {};
    customTemplates.forEach(t => { customMap[t.key] = t.value; });

    const biz = businessName || 'MyPOS';
    const name = customerName || 'Valued Customer';
    const orderTotal = total || '';

    // 4 built-in templates + check for custom override
    const templates: Record<string, string> = {
      '1': `Hi ${name}, your order #${orderNumber} at ${biz} is confirmed! Total: ${orderTotal}. Thank you for choosing us!`,
      '2': `${biz} — Order #${orderNumber} placed successfully. Amount: ${orderTotal}. We appreciate your business, ${name}!`,
      '3': `Thank you ${name}! 🎉 Your ${biz} order #${orderNumber} (${orderTotal}) has been received. See you again soon!`,
      '4': `${biz} Receipt: Order #${orderNumber} | Total: ${orderTotal} | Customer: ${name}. Thank you for your purchase!`,
    };

    // Allow custom template overrides from settings
    for (const [key, val] of Object.entries(customMap)) {
      const id = key.replace('smsTemplate_', '');
      templates[id] = val
        .replace(/\{orderNumber\}/g, orderNumber)
        .replace(/\{customerName\}/g, name)
        .replace(/\{total\}/g, orderTotal)
        .replace(/\{businessName\}/g, biz);
    }

    const message = templates[templateId] || templates['1'];
    const result = await sendSms(to, message);

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    res.json({ success: true, data: { sid: result.sid } });
  } catch (error) { next(error); }
});

// POST /api/receipt/test-email — send a test email
router.post('/test-email', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { to } = req.body;
    if (!to) {
      return res.status(400).json({ success: false, error: 'Email address is required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return res.status(400).json({ success: false, error: 'Invalid email address' });
    }

    const businessName = (await prisma.setting.findUnique({ where: { key: 'businessName' } }))?.value || 'MyPOS';

    await sendEmail({
      to,
      subject: `Test Email from ${businessName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#2563eb;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0">
            <h1 style="margin:0">${businessName}</h1>
          </div>
          <div style="padding:30px;background:#ffffff;border:1px solid #e5e7eb;text-align:center">
            <div style="font-size:48px;margin-bottom:16px">✅</div>
            <h2 style="color:#059669;margin:0 0 8px">Email is working!</h2>
            <p style="color:#6b7280;font-size:14px">This is a test email from your ${businessName} POS system. Email notifications are configured correctly.</p>
          </div>
          <div style="padding:16px;text-align:center;color:#6b7280;font-size:12px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 8px 8px;background:#f9fafb">
            <p>Sent from ${businessName} POS</p>
          </div>
        </div>`,
    });

    res.json({ success: true, data: { message: 'Test email sent successfully' } });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to send test email' });
  }
});

export { router as receiptRouter };
