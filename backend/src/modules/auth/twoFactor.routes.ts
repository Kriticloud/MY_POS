import { Router, Request, Response } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { prisma } from '../../lib/prisma';
import crypto from 'crypto';

const router = Router();
router.use(authenticate);

// Simple TOTP implementation (in production, use 'otpauth' or 'speakeasy' package)
function generateSecret(): string {
  return crypto.randomBytes(20).toString('hex');
}

function generateTOTP(secret: string, timeStep: number = 30): string {
  const epoch = Math.floor(Date.now() / 1000);
  const counter = Math.floor(epoch / timeStep);
  const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'hex'));
  const counterBuf = Buffer.alloc(8);
  counterBuf.writeUInt32BE(counter, 4);
  hmac.update(counterBuf);
  const hash = hmac.digest();
  const offset = hash[hash.length - 1] & 0xf;
  const code = ((hash[offset] & 0x7f) << 24 | hash[offset + 1] << 16 | hash[offset + 2] << 8 | hash[offset + 3]) % 1000000;
  return code.toString().padStart(6, '0');
}

function verifyTOTP(secret: string, token: string): boolean {
  // Check current and adjacent time windows (±1 step)
  for (let i = -1; i <= 1; i++) {
    const epoch = Math.floor(Date.now() / 1000) + (i * 30);
    const counter = Math.floor(epoch / 30);
    const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'hex'));
    const counterBuf = Buffer.alloc(8);
    counterBuf.writeUInt32BE(counter, 4);
    hmac.update(counterBuf);
    const hash = hmac.digest();
    const offset = hash[hash.length - 1] & 0xf;
    const code = ((hash[offset] & 0x7f) << 24 | hash[offset + 1] << 16 | hash[offset + 2] << 8 | hash[offset + 3]) % 1000000;
    if (code.toString().padStart(6, '0') === token) return true;
  }
  return false;
}

// POST /api/2fa/setup - Generate 2FA secret for user
router.post('/setup', async (req: AuthRequest, res: Response) => {
  const secret = generateSecret();
  // Store secret temporarily (in a real app, save encrypted to user record)
  // For now, we'll use a simple approach storing in a field
  const currentCode = generateTOTP(secret);
  
  // In production, generate QR code with otpauth:// URI
  const otpauthUrl = `otpauth://totp/MyPOS:${req.user!.email}?secret=${secret}&issuer=MyPOS`;
  
  res.json({
    secret,
    otpauthUrl,
    currentCode, // For testing - remove in production
    message: 'Save this secret in your authenticator app',
  });
});

// POST /api/2fa/verify - Verify TOTP code
router.post('/verify', async (req: AuthRequest, res: Response) => {
  const { secret, token } = req.body;
  if (!secret || !token) {
    return res.status(400).json({ error: 'Secret and token required' });
  }
  
  const valid = verifyTOTP(secret, token);
  if (valid) {
    res.json({ success: true, message: '2FA verification successful' });
  } else {
    res.status(401).json({ success: false, error: 'Invalid 2FA code' });
  }
});

// POST /api/2fa/validate - Quick validate a code against stored secret
router.post('/validate', async (req: AuthRequest, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token required' });
  
  // In a full implementation, get user's stored 2FA secret from DB
  // For now, accept any 6-digit code as valid in dev mode
  if (process.env.NODE_ENV === 'development' && token === '000000') {
    return res.json({ success: true, message: 'Dev bypass' });
  }
  
  res.status(401).json({ success: false, error: 'Invalid code' });
});

export { router as twoFactorRouter };
