import { Router, Request, Response } from 'express';
import { authenticate } from '../../middleware/auth';
import logger from '../../lib/logger';

const router = Router();
router.use(authenticate);

// Payment intent creation (Stripe-compatible)
router.post('/create-intent', async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'usd', orderId, method } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // If Stripe is configured, use it
    if (process.env.STRIPE_SECRET_KEY) {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe uses cents
        currency,
        metadata: { orderId: orderId || '' },
      });
      return res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      });
    }

    // Fallback: simulate payment processing for dev/demo
    const mockId = `pi_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    logger.info(`Payment intent created (mock): ${mockId} for $${amount}`);
    res.json({
      clientSecret: `${mockId}_secret_mock`,
      paymentIntentId: mockId,
      status: 'requires_payment_method',
      mock: true,
    });
  } catch (error: any) {
    logger.error(`Payment intent error: ${error.message}`);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Confirm payment
router.post('/confirm', async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.body;

    if (process.env.STRIPE_SECRET_KEY) {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return res.json({ status: intent.status, amount: intent.amount / 100 });
    }

    // Mock confirmation
    res.json({ status: 'succeeded', amount: 0, mock: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Payment confirmation failed' });
  }
});

// Refund payment
router.post('/refund', async (req: Request, res: Response) => {
  try {
    const { paymentIntentId, amount } = req.body;

    if (process.env.STRIPE_SECRET_KEY) {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        ...(amount && { amount: Math.round(amount * 100) }),
      });
      return res.json({ refundId: refund.id, status: refund.status });
    }

    // Mock refund
    const refundId = `re_${Date.now()}`;
    logger.info(`Refund processed (mock): ${refundId}`);
    res.json({ refundId, status: 'succeeded', mock: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Refund failed' });
  }
});

// Webhook endpoint (no auth - Stripe sends directly)
router.post('/webhook', (req: Request, res: Response) => {
  // In production, verify signature with STRIPE_WEBHOOK_SECRET
  const event = req.body;
  logger.info(`Payment webhook: ${event.type}`);
  res.json({ received: true });
});

export { router as paymentRouter };
