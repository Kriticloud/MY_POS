import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import logger from '../../lib/logger';

const router = Router();

// In-memory webhook subscriptions (in production, persist to DB)
interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  createdAt: string;
}

const subscriptions: WebhookSubscription[] = [];
let nextId = 1;

// Available events
const WEBHOOK_EVENTS = [
  'order.created',
  'order.completed',
  'order.cancelled',
  'order.refunded',
  'payment.received',
  'inventory.low_stock',
  'inventory.updated',
  'customer.created',
  'product.created',
  'product.updated',
];

router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'ADMIN'));

// GET available events
router.get('/events', (_req: Request, res: Response) => {
  res.json(WEBHOOK_EVENTS);
});

// GET all subscriptions
router.get('/', (_req: Request, res: Response) => {
  res.json(subscriptions.map(s => ({ ...s, secret: '***' })));
});

// POST create subscription
router.post('/', (req: Request, res: Response) => {
  const { url, events, secret } = req.body;
  if (!url || !events?.length) {
    return res.status(400).json({ error: 'url and events are required' });
  }
  const sub: WebhookSubscription = {
    id: String(nextId++),
    url,
    events,
    secret: secret || require('crypto').randomBytes(32).toString('hex'),
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  subscriptions.push(sub);
  res.status(201).json({ ...sub });
});

// DELETE subscription
router.delete('/:id', (req: Request, res: Response) => {
  const idx = subscriptions.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  subscriptions.splice(idx, 1);
  res.json({ success: true });
});

// PUT toggle active
router.put('/:id/toggle', (req: Request, res: Response) => {
  const sub = subscriptions.find(s => s.id === req.params.id);
  if (!sub) return res.status(404).json({ error: 'Not found' });
  sub.isActive = !sub.isActive;
  res.json(sub);
});

// Fire webhook (called internally by other modules)
export async function fireWebhook(event: string, payload: any) {
  const activeSubs = subscriptions.filter(s => s.isActive && s.events.includes(event));
  for (const sub of activeSubs) {
    try {
      const crypto = require('crypto');
      const body = JSON.stringify({ event, data: payload, timestamp: new Date().toISOString() });
      const signature = crypto.createHmac('sha256', sub.secret).update(body).digest('hex');
      await fetch(sub.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': event,
        },
        body,
      });
      logger.info(`Webhook delivered: ${event} -> ${sub.url}`);
    } catch (e: any) {
      logger.error(`Webhook failed: ${event} -> ${sub.url}: ${e.message}`);
    }
  }
}

export { router as webhookRouter };
