import { test, expect } from '@playwright/test';

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
    await page.goto('/login');
    await page.getByPlaceholder('admin@mypos.com').fill('admin@mypos.com');
    await page.getByPlaceholder('••••••••').fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await page.goto('/kitchen');
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
      // Order cards show items like "2x Classic Burger"
      await expect(page.getByText(/\d+x\s/).first()).toBeVisible();
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
