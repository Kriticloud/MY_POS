import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      if (json.data) {
        json.data = json.data.map((s: any) => s.key === 'businessType' ? { ...s, value: 'RESTAURANT' } : s);
      }
      await route.fulfill({ json });
    });
    await page.goto('/login');
    await page.getByRole('textbox').first().fill('admin@mypos.com');
    await page.getByRole('textbox').nth(1).fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  });

  test.afterEach(async ({ page }) => {
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('should display dashboard with stats', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Total Revenue')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Today's Orders")).toBeVisible();
    await expect(page.getByText('Avg Order Value')).toBeVisible();
  });

  test('should display recent orders table', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Recent Orders' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
    // Check table has order data
    await expect(page.getByText('ORD-').first()).toBeVisible();
  });

  test('should display top products', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Top Products' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Classic Burger')).toBeVisible({ timeout: 15000 });
  });

  test('should navigate to orders via View All', async ({ page }) => {
    await page.getByRole('button', { name: 'View All' }).click();
    await expect(page).toHaveURL(/\/orders/);
  });
});
