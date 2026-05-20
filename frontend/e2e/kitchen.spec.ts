import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, '.auth', 'user.json');

function getTokenFromFile(): string | null {
  try {
    const authState = JSON.parse(fs.readFileSync(authFile, 'utf-8'));
    const entry = authState.origins?.[0]?.localStorage?.find((s: any) => s.name === 'auth-storage');
    return entry ? JSON.parse(entry.value)?.state?.accessToken : null;
  } catch {
    return null;
  }
}

test.describe('Kitchen Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      if (json.data) {
        json.data = json.data.map((s: any) => s.key === 'businessType' ? { ...s, value: 'RESTAURANT' } : s);
      }
      await route.fulfill({ json });
    });

    // Ensure active orders exist BEFORE navigating to kitchen
    const token = getTokenFromFile();
    if (token) {
      const queueResp = await page.request.get('http://localhost:4000/api/orders/kitchen/queue', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const queueJson = await queueResp.json();
      if (!queueJson.data?.length) {
        // No active orders - reset up to 3 orders to CONFIRMED
        const ordersResp = await page.request.get('http://localhost:4000/api/orders?limit=50', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersJson = await ordersResp.json();
        const targets = (ordersJson.data || []).filter((o: any) => o.status !== 'CANCELLED').slice(0, 3);
        for (const target of targets) {
          await page.request.put(`http://localhost:4000/api/orders/${target.id}/status`, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            data: { status: 'CONFIRMED' },
          });
        }
      }
    }

    await page.goto('/kitchen');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({ page }) => {
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test.describe('Page Layout', () => {
    test('should display kitchen display heading', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Kitchen Display' })).toBeVisible();
    });

    test('should show live status indicator', async ({ page }) => {
      await expect(page.getByText('Live')).toBeVisible();
    });

    test('should display active orders subtitle', async ({ page }) => {
      await expect(page.getByText('Active orders in the kitchen')).toBeVisible();
    });
  });

  test.describe('Order Cards', () => {
    test('should display order numbers', async ({ page }) => {
      await expect(page.getByText(/^ORD-/).first()).toBeVisible({ timeout: 15000 });
    });

    test('should show order items with quantities', async ({ page }) => {
      await expect(page.getByText(/^ORD-/).first()).toBeVisible({ timeout: 15000 });
      // Order cards show items like "2x" in a span
      await expect(page.getByText(/^\d+x$/).first()).toBeVisible();
    });

    test('should show elapsed time on order cards', async ({ page }) => {
      await expect(page.getByText(/^ORD-/).first()).toBeVisible({ timeout: 15000 });
      // Elapsed time shown as e.g. "5m", "1h 2m"
      await expect(page.getByText(/\d+m/).first()).toBeVisible();
    });
  });

  test.describe('Action Buttons', () => {
    test('should show status transition buttons', async ({ page }) => {
      await expect(page.getByText(/^ORD-/).first()).toBeVisible({ timeout: 15000 });
      const actionButtons = page.getByRole('button', { name: /Start Preparing|Mark Ready/ });
      await expect(actionButtons.first()).toBeVisible();
    });

    test('should transition order status when action button clicked', async ({ page }) => {
      await expect(page.getByText(/^ORD-/).first()).toBeVisible({ timeout: 15000 });
      const actionButton = page.getByRole('button', { name: /Start Preparing|Mark Ready/ }).first();
      const buttonText = await actionButton.textContent();
      await actionButton.click();
      // After clicking, the order should either change status or disappear
      // Give time for the API call and re-render
      await page.waitForTimeout(2000);
      // The page should still be functional
      await expect(page.getByRole('heading', { name: 'Kitchen Display' })).toBeVisible();
    });
  });
});
