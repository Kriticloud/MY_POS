import { prisma } from '../../lib/prisma';

interface SmsConfig {
  enabled: boolean;
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

async function getSmsConfig(): Promise<SmsConfig> {
  const keys = ['smsEnabled', 'twilioAccountSid', 'twilioAuthToken', 'twilioPhoneNumber'];
  const settings = await prisma.setting.findMany({ where: { key: { in: keys } } });
  const map: Record<string, string> = {};
  settings.forEach(s => { map[s.key] = s.value; });

  return {
    enabled: map.smsEnabled === 'true',
    accountSid: map.twilioAccountSid || '',
    authToken: map.twilioAuthToken || '',
    fromNumber: map.twilioPhoneNumber || '',
  };
}

export async function sendSms(to: string, body: string): Promise<{ success: boolean; sid?: string; error?: string }> {
  const config = await getSmsConfig();

  if (!config.enabled) {
    return { success: false, error: 'SMS service is disabled' };
  }

  if (!config.accountSid || !config.authToken || !config.fromNumber) {
    return { success: false, error: 'Twilio credentials not configured' };
  }

  // Sanitize phone number — only allow digits, +, spaces, dashes
  const sanitizedTo = to.replace(/[^\d+\-\s()]/g, '');
  if (!sanitizedTo || sanitizedTo.length < 10) {
    return { success: false, error: 'Invalid phone number' };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(config.accountSid)}/Messages.json`;

    const params = new URLSearchParams();
    params.append('To', sanitizedTo);
    params.append('From', config.fromNumber);
    params.append('Body', body.substring(0, 1600)); // Twilio max SMS body

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${config.accountSid}:${config.authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.message || 'Failed to send SMS' };
    }

    return { success: true, sid: result.sid };
  } catch (err: any) {
    return { success: false, error: err.message || 'SMS sending failed' };
  }
}

export async function sendOrderConfirmationSms(phone: string, orderNumber: string, total: string, businessName: string) {
  return sendSms(phone, `${businessName}: Your order #${orderNumber} has been confirmed. Total: ${total}. Thank you!`);
}

export async function sendOrderReadySms(phone: string, orderNumber: string, businessName: string) {
  return sendSms(phone, `${businessName}: Your order #${orderNumber} is ready for pickup! Thank you for your patience.`);
}

export async function sendLoyaltyRewardSms(phone: string, points: number, businessName: string) {
  return sendSms(phone, `${businessName}: Congratulations! You've earned ${points} loyalty points. Keep collecting for amazing rewards!`);
}

export async function sendPromotionalSms(phone: string, message: string) {
  return sendSms(phone, message);
}

export { getSmsConfig };
