import { test, expect } from '@playwright/test';

test.describe('Orders Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox').first().fill('admin@mypos.com');
    await page.getByRole('textbox').nth(1).fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await page.goto('/orders');
  });

  test('should display orders page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
    await expect(page.getByText('Manage and track all orders')).toBeVisible();
  });

  test('should display status filter tabs', async ({ page }) => {
    const filterSection = page.locator('[class*="gap"]').filter({ has: page.getByRole('button', { name: 'ALL' }) }).first();
    await expect(filterSection.getByRole('button', { name: 'ALL' })).toBeVisible();
    await expect(filterSection.getByRole('button', { name: 'PENDING' })).toBeVisible();
    await expect(filterSection.getByRole('button', { name: 'CONFIRMED' })).toBeVisible();
    await expect(filterSection.getByRole('button', { name: 'PREPARING' })).toBeVisible();
    await expect(filterSection.getByRole('button', { name: 'READY' })).toBeVisible();
    await expect(filterSection.getByRole('button', { name: 'COMPLETED' })).toBeVisible();
  });

  test('should show orders in table', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('ORD-001')).toBeVisible({ timeout: 15000 });
  });

  test('should filter orders by status', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: 'COMPLETED' }).first().click();
    // Completed orders should show in the table
    await expect(page.getByRole('cell', { name: 'COMPLETED' }).first()).toBeVisible();
  });

  test('should search orders', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
    await page.getByPlaceholder('Search orders...').fill('John');
    await expect(page.getByText('John Doe').first()).toBeVisible();
  });
});
