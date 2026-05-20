import nodemailer from 'nodemailer';
import https from 'https';
import logger from '../../lib/logger';
import { prisma } from '../../lib/prisma';

// ─── Email Configuration (reads from DB settings) ───

interface EmailConfig {
  enabled: boolean;
  provider: 'resend' | 'sendgrid' | 'gmail' | 'smtp';
  resendApiKey: string;
  sendgridApiKey: string;
  senderEmail: string;
  senderName: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
}

async function getEmailConfig(): Promise<EmailConfig> {
  const keys = [
    'emailEnabled', 'emailProvider', 'resendApiKey', 'sendgridApiKey',
    'senderEmail', 'senderName',
    'smtpHost', 'smtpPort', 'smtpUser', 'smtpPass',
  ];
  const settings = await prisma.setting.findMany({ where: { key: { in: keys } } });
  const map: Record<string, string> = {};
  settings.forEach(s => { map[s.key] = s.value; });

  return {
    enabled: map.emailEnabled === 'true',
    provider: (map.emailProvider as 'resend' | 'sendgrid' | 'gmail' | 'smtp') || 'resend',
    resendApiKey: map.resendApiKey || process.env.RESEND_API_KEY || '',
    sendgridApiKey: map.sendgridApiKey || process.env.SENDGRID_API_KEY || '',
    senderEmail: map.senderEmail || process.env.EMAIL_FROM || 'noreply@mypos.com',
    senderName: map.senderName || 'MyPOS',
    smtpHost: map.smtpHost || process.env.SMTP_HOST || '',
    smtpPort: parseInt(map.smtpPort || process.env.SMTP_PORT || '587'),
    smtpUser: map.smtpUser || process.env.SMTP_USER || '',
    smtpPass: map.smtpPass || process.env.SMTP_PASS || '',
  };
}

// ─── HTTPS helper (handles corporate proxy/SSL issues unlike native fetch) ───

function httpsPost(url: string, headers: Record<string, string>, body: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname,
      method: 'POST',
      headers: { ...headers, 'Content-Length': Buffer.byteLength(body) },
      rejectUnauthorized: false, // handle corporate proxy certs
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode || 0, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── Resend API (simplest free email — 100/day, no domain verification needed) ───

async function sendViaResend(config: EmailConfig, to: string, subject: string, html: string) {
  const fromEmail = config.senderEmail || 'onboarding@resend.dev';
  const res = await httpsPost('https://api.resend.com/emails', {
    'Authorization': `Bearer ${config.resendApiKey}`,
    'Content-Type': 'application/json',
  }, JSON.stringify({
    from: `${config.senderName} <${fromEmail}>`,
    to: [to],
    subject,
    html,
  }));

  if (res.status < 200 || res.status >= 300) {
    logger.error(`Resend error (${res.status}): ${res.body}`);
    throw new Error(`Resend error: ${res.status} — ${res.body}`);
  }

  const data = JSON.parse(res.body) as { id: string };
  logger.info(`Email sent via Resend to ${to} (id: ${data.id})`);
  return { messageId: data.id, provider: 'resend' };
}

// ─── SendGrid API ───

async function sendViaSendGrid(config: EmailConfig, to: string, subject: string, html: string) {
  const res = await httpsPost('https://api.sendgrid.com/v3/mail/send', {
    'Authorization': `Bearer ${config.sendgridApiKey}`,
    'Content-Type': 'application/json',
  }, JSON.stringify({
    personalizations: [{ to: [{ email: to }] }],
    from: { email: config.senderEmail, name: config.senderName },
    subject,
    content: [{ type: 'text/html', value: html }],
  }));

  if (res.status < 200 || res.status >= 300) {
    logger.error(`SendGrid error (${res.status}): ${res.body}`);
    throw new Error(`SendGrid error: ${res.status} — ${res.body}`);
  }

  logger.info(`Email sent via SendGrid to ${to}`);
  return { messageId: `sg-${Date.now()}`, provider: 'sendgrid' };
}

// ─── SMTP via Nodemailer ───

let transporter: nodemailer.Transporter | null = null;

async function sendViaSmtp(config: EmailConfig, to: string, subject: string, html: string) {
  // Rebuild transporter if config changed
  if (config.smtpHost) {
    transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpPort === 465,
      auth: { user: config.smtpUser, pass: config.smtpPass },
    });
  } else {
    // Fallback to Ethereal test account (dev only — emails are captured, not delivered)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    logger.info(`Using Ethereal test account: ${testAccount.user}`);
  }

  const info = await transporter.sendMail({
    from: `"${config.senderName}" <${config.senderEmail}>`,
    to,
    subject,
    html,
  });

  logger.info(`Email sent via SMTP: ${info.messageId}`);
  if (!config.smtpHost && info.messageId) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    logger.info(`Ethereal preview: ${previewUrl}`);
    return { messageId: info.messageId, provider: 'smtp-ethereal', previewUrl };
  }
  return { messageId: info.messageId, provider: 'smtp' };
}

// ─── Public API ───

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions) {
  const config = await getEmailConfig();

  if (!config.enabled) {
    throw new Error('Email service is disabled. Enable it in Settings → SMS / Twilio.');
  }

  try {
    if (config.provider === 'resend' && config.resendApiKey) {
      return await sendViaResend(config, options.to, options.subject, options.html);
    }
    if (config.provider === 'sendgrid' && config.sendgridApiKey) {
      return await sendViaSendGrid(config, options.to, options.subject, options.html);
    }
    if (config.provider === 'gmail' && config.smtpUser && config.smtpPass) {
      // Force Gmail SMTP settings
      config.smtpHost = 'smtp.gmail.com';
      config.smtpPort = 587;
      config.senderEmail = config.smtpUser;
      return await sendViaSmtp(config, options.to, options.subject, options.html);
    }
    // Fallback to custom SMTP
    return await sendViaSmtp(config, options.to, options.subject, options.html);
  } catch (error: any) {
    logger.error('Failed to send email:', error.message);
    throw error;
  }
}

export { getEmailConfig };

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
