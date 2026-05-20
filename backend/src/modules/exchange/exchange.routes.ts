import { Router, Request, Response } from 'express';

const router = Router();

// In-memory cache for exchange rates
let cachedRates: Record<string, number> | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Fallback static rates if API is down
const fallbackRates: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5, AED: 3.67, SAR: 3.75,
  JPY: 154.5, CNY: 7.24, AUD: 1.53, CAD: 1.36, BRL: 4.97, MXN: 17.2,
};

async function fetchRates(): Promise<Record<string, number>> {
  const now = Date.now();
  if (cachedRates && now - cacheTimestamp < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    // Free API, no key needed — uses USD as base
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    if (data.result === 'success' && data.rates) {
      cachedRates = data.rates;
      cacheTimestamp = now;
      console.log('✅ Exchange rates updated from API');
      return cachedRates;
    }
  } catch (err) {
    console.warn('⚠️ Failed to fetch live exchange rates, using fallback', err);
  }

  // Return cached if available, else fallback
  return cachedRates || fallbackRates;
}

// GET /api/exchange-rates
router.get('/', async (_req: Request, res: Response) => {
  const rates = await fetchRates();
  res.json({
    base: 'USD',
    rates,
    cached: Date.now() - cacheTimestamp < 1000, // true if freshly fetched
    updatedAt: new Date(cacheTimestamp).toISOString(),
  });
});

// GET /api/exchange-rates/convert?from=USD&to=INR&amount=10
router.get('/convert', async (req: Request, res: Response) => {
  const { from = 'USD', to = 'INR', amount = '1' } = req.query as Record<string, string>;
  const rates = await fetchRates();
  const fromRate = rates[from] || 1;
  const toRate = rates[to] || 1;
  const converted = (parseFloat(amount) / fromRate) * toRate;
  res.json({ from, to, amount: parseFloat(amount), converted: Math.round(converted * 100) / 100, rate: toRate / fromRate });
});

export { router as exchangeRateRouter };
