import { test, expect } from '@playwright/test';

test.describe('Kitchen Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox').first().fill('admin@mypos.com');
    await page.getByRole('textbox').nth(1).fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await page.goto('/kitchen');
  });

  test('should display kitchen display page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Kitchen Display' })).toBeVisible();
    await expect(page.getByText('Live')).toBeVisible();
  });

  test('should show active orders', async ({ page }) => {
    // Kitchen shows CONFIRMED and PREPARING orders
    await expect(page.getByText('ORD-').first()).toBeVisible({ timeout: 15000 });
  });

  test('should show action buttons for orders', async ({ page }) => {
    await expect(page.getByText('ORD-').first()).toBeVisible({ timeout: 15000 });
    // Should have at least one action button
    const actionButtons = page.getByRole('button', { name: /Start Preparing|Mark Ready/ });
    await expect(actionButtons.first()).toBeVisible();
  });
});
