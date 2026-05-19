import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox').first().fill('admin@mypos.com');
    await page.getByRole('textbox').nth(1).fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  });

  test('should navigate to all pages', async ({ page }) => {
    // Navigate via URL since sidebar may be offscreen in test viewport
    await page.goto('/pos');
    await expect(page.getByPlaceholder('Search products...')).toBeVisible();

    await page.goto('/orders');
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();

    await page.goto('/tables');
    await expect(page.getByRole('heading', { name: 'Tables' })).toBeVisible();

    await page.goto('/kitchen');
    await expect(page.getByRole('heading', { name: 'Kitchen Display' })).toBeVisible();

    await page.goto('/products');
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();

    await page.goto('/customers');
    await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible();

    await page.goto('/reports');
    await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible();

    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  });

  test('should show sidebar navigation links', async ({ page }) => {
    // Use a wider viewport to ensure sidebar is visible
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/dashboard');
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'POS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Orders' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Customers' })).toBeVisible();
  });

  test('should display user info in sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/dashboard');
    await expect(page.getByText('Admin User')).toBeVisible();
    await expect(page.getByText('ADMIN', { exact: true })).toBeVisible();
  });
});
