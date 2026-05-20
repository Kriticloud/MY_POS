import nodemailer from 'nodemailer';
import logger from '../../lib/logger';

// Create transporter - uses env vars or falls back to ethereal (test) account
let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Create test account for dev
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    logger.info(`Email test account: ${testAccount.user}`);
  }
  return transporter;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const t = await getTransporter();
    const info = await t.sendMail({
      from: process.env.EMAIL_FROM || '"MyPOS" <noreply@mypos.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    logger.info(`Email sent: ${info.messageId}`);
    if (info.messageId && !process.env.SMTP_HOST) {
      logger.info(`Preview: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return info;
  } catch (error) {
    logger.error('Failed to send email:', error);
    throw error;
  }
}

// Pre-built email templates
export function orderConfirmationEmail(orderNumber: string, total: number, items: { name: string; qty: number; price: number }[]) {
  const itemRows = items.map(i => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${i.price.toFixed(2)}</td></tr>`).join('');
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#2563eb;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0">
        <h1 style="margin:0">Order Confirmation</h1>
      </div>
      <div style="padding:20px;background:#f9fafb;border:1px solid #e5e7eb">
        <p>Thank you for your order <strong>#${orderNumber}</strong>!</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr style="background:#f3f4f6"><th style="padding:8px;text-align:left">Item</th><th style="padding:8px;text-align:center">Qty</th><th style="padding:8px;text-align:right">Price</th></tr>
          ${itemRows}
        </table>
        <p style="font-size:18px;font-weight:bold;text-align:right">Total: $${total.toFixed(2)}</p>
      </div>
      <div style="padding:16px;text-align:center;color:#6b7280;font-size:12px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 8px 8px">
        <p>Thank you for your business!</p>
      </div>
    </div>`;
}

export function lowStockAlertEmail(items: { name: string; stock: number; minStock: number }[]) {
  const rows = items.map(i => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center;color:#ef4444;font-weight:bold">${i.stock}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.minStock}</td></tr>`).join('');
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#ef4444;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0">
        <h1 style="margin:0">⚠️ Low Stock Alert</h1>
      </div>
      <div style="padding:20px;background:#f9fafb;border:1px solid #e5e7eb">
        <p>The following products are running low:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr style="background:#f3f4f6"><th style="padding:8px;text-align:left">Product</th><th style="padding:8px;text-align:center">Current Stock</th><th style="padding:8px;text-align:center">Min Stock</th></tr>
          ${rows}
        </table>
        <p>Please reorder these items soon.</p>
      </div>
    </div>`;
}

export function passwordResetEmail(tempPassword: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#2563eb;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0">
        <h1 style="margin:0">Password Reset</h1>
      </div>
      <div style="padding:20px;background:#f9fafb;border:1px solid #e5e7eb">
        <p>Your password has been reset. Your temporary password is:</p>
        <p style="font-size:24px;font-weight:bold;text-align:center;padding:16px;background:#e0e7ff;border-radius:8px;letter-spacing:2px">${tempPassword}</p>
        <p>Please log in and change your password immediately.</p>
      </div>
    </div>`;
}
