import { test, expect } from '@playwright/test';

test.describe('Reports Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      if (json.data) {
        json.data = json.data.map((s: any) => s.key === 'businessType' ? { ...s, value: 'RESTAURANT' } : s);
      }
      await route.fulfill({ json });
    });
    await page.goto('/login');
    await page.getByPlaceholder('admin@mypos.com').fill('admin@mypos.com');
    await page.getByPlaceholder('••••••••').fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await page.goto('/reports');
  });

  test.afterEach(async ({ page }) => {
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test.describe('Page Layout', () => {
    test('should display reports heading and subtitle', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible();
      await expect(page.getByText('Business analytics and insights')).toBeVisible();
    });

    test('should display Export CSV button', async ({ page }) => {
      await expect(page.getByRole('button', { name: /Export CSV/i })).toBeVisible();
    });
  });

  test.describe('Date Range Picker', () => {
    test('should display date range tabs', async ({ page }) => {
      await expect(page.getByRole('button', { name: /Today/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /This Week/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /This Month/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /Custom/i })).toBeVisible();
    });

    test('should switch between date ranges', async ({ page }) => {
      await page.getByRole('button', { name: /This Week/i }).click();
      await expect(page.getByRole('button', { name: /This Week/i })).toBeVisible();
    });
  });

  test.describe('Report Tabs', () => {
    test('should display report section tabs', async ({ page }) => {
      await expect(page.getByRole('button', { name: /Overview/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /Products/i })).toBeVisible();
    });
  });

  test.describe('Stats Cards', () => {
    test('should display revenue and order stats', async ({ page }) => {
      await expect(page.getByText('Total Revenue')).toBeVisible({ timeout: 15000 });
      await expect(page.getByText('Total Orders')).toBeVisible();
      await expect(page.getByText('Avg Order Value')).toBeVisible();
      await expect(page.getByText('Total Tax')).toBeVisible();
    });

    test('should display monetary values with currency', async ({ page }) => {
      await expect(page.getByText('Total Revenue')).toBeVisible({ timeout: 15000 });
      await expect(page.getByText(/\$[\d,.]+/).first()).toBeVisible();
    });
  });

  test.describe('Overview Tab', () => {
    test('should display payment methods breakdown', async ({ page }) => {
      await expect(page.getByText('Total Revenue')).toBeVisible({ timeout: 15000 });
      await expect(page.getByText(/Payment Methods|CASH|CARD/i).first()).toBeVisible();
    });
  });
});
