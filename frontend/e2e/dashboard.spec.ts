import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      if (json.data) {
        json.data = json.data.map((s: any) => s.key === 'businessType' ? { ...s, value: 'RESTAURANT' } : s);
      }
      await route.fulfill({ json });
    });
    await page.goto('/dashboard');
  });

  test.afterEach(async ({ page }) => {
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test.describe('Page Header', () => {
    test('should display greeting and welcome message', async ({ page }) => {
      // Dashboard shows a greeting like "Good morning, Admin!"
      await expect(page.getByText(/Good (morning|afternoon|evening|night)/)).toBeVisible({ timeout: 15000 });
      await expect(page.getByText(/Here's what's happening/)).toBeVisible();
    });
  });

  test.describe('Stats Cards', () => {
    test('should display stat cards', async ({ page }) => {
      await expect(page.getByText('Revenue')).toBeVisible({ timeout: 15000 });
      await expect(page.getByText(/Today.*Orders/)).toBeVisible();
      await expect(page.getByText(/Total.*Order/)).toBeVisible();
    });

    test('should display revenue with dollar sign', async ({ page }) => {
      await expect(page.getByText('Revenue')).toBeVisible({ timeout: 15000 });
      // Revenue card should contain a dollar amount
      await expect(page.getByText(/\$[\d,.]+/).first()).toBeVisible();
    });
  });

  test.describe('Recent Orders Table', () => {
    test('should display recent orders section with table', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /Recent Orders/ })).toBeVisible({ timeout: 15000 });
      await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
    });

    test('should show order data with order numbers', async ({ page }) => {
      await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
      await expect(page.getByText(/^ORD-/).first()).toBeVisible();
    });

    test('should display order status badges', async ({ page }) => {
      await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
      // At least one status badge should be present
      const statusBadge = page.getByText(/COMPLETED|CONFIRMED|PREPARING|READY|PENDING|SERVED/).first();
      await expect(statusBadge).toBeVisible();
    });

    test('should have View All button that navigates to orders', async ({ page }) => {
      await page.getByRole('button', { name: 'View All' }).click();
      await expect(page).toHaveURL(/\/orders/);
    });
  });

  test.describe('Top Products', () => {
    test('should display top products section', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /Top Products/ })).toBeVisible({ timeout: 15000 });
    });

    test('should show product names with ranking', async ({ page }) => {
      await expect(page.getByText('Classic Burger')).toBeVisible({ timeout: 15000 });
    });
  });
});
