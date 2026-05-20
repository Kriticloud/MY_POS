import { test, expect } from '@playwright/test';

test.describe('Tables Page', () => {
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
    await page.goto('/tables');
  });

  test.afterEach(async ({ page }) => {
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test.describe('Page Layout', () => {
    test('should display tables heading and subtitle', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Tables' })).toBeVisible();
      await expect(page.getByText('Manage table assignments and status')).toBeVisible();
    });

    test('should display status legend', async ({ page }) => {
      await expect(page.getByText('AVAILABLE')).toBeVisible({ timeout: 15000 });
      await expect(page.getByText('OCCUPIED')).toBeVisible();
      await expect(page.getByText('RESERVED')).toBeVisible();
    });
  });

  test.describe('Table Cards', () => {
    test('should display table cards with names', async ({ page }) => {
      // Wait for tables to load
      await expect(page.getByText(/Table \d+|T\d+/).first()).toBeVisible({ timeout: 15000 });
    });

    test('should show seat capacity on table cards', async ({ page }) => {
      await expect(page.getByText(/\d+ seats/).first()).toBeVisible({ timeout: 15000 });
    });

    test('should show status badges on table cards', async ({ page }) => {
      await expect(page.getByText(/AVAILABLE|OCCUPIED|RESERVED|CLEANING/).first()).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('Table Detail Modal', () => {
    test('should open table detail modal when clicking a table card', async ({ page }) => {
      await expect(page.getByText(/Table \d+|T\d+/).first()).toBeVisible({ timeout: 15000 });
      // Click first table card
      await page.getByText(/Table \d+|T\d+/).first().click();
      // Modal should show table details
      await expect(page.getByText(/seats|Capacity/i).first()).toBeVisible({ timeout: 5000 });
    });

    test('should show status change buttons in modal', async ({ page }) => {
      await expect(page.getByText(/Table \d+|T\d+/).first()).toBeVisible({ timeout: 15000 });
      await page.getByText(/Table \d+|T\d+/).first().click();
      // Should see status change options
      await expect(page.getByRole('button', { name: /AVAILABLE|OCCUPIED|RESERVED|CLEANING/ }).first()).toBeVisible({ timeout: 5000 });
    });
  });
});
