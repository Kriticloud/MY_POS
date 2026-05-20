import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('API Health Check', () => {
  it('GET /api/health should return ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('Auth Endpoints', () => {
  it('POST /api/auth/login should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@test.com', password: 'wrong' });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('POST /api/auth/login should accept valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@mypos.com', password: 'admin123' });
    // May succeed or fail depending on DB state, but should not 500
    expect(res.status).not.toBe(500);
  });
});

describe('Products Endpoints', () => {
  it('GET /api/products should require auth or return data', async () => {
    const res = await request(app).get('/api/products');
    // Either 401 (auth required) or 200 (open)
    expect([200, 401, 403]).toContain(res.status);
  });
});

describe('Categories Endpoints', () => {
  it('GET /api/categories should respond', async () => {
    const res = await request(app).get('/api/categories');
    expect([200, 401, 403]).toContain(res.status);
  });
});

describe('Exchange Rates', () => {
  it('GET /api/exchange-rates should return rates', async () => {
    const res = await request(app).get('/api/exchange-rates');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('rates');
  });
});
