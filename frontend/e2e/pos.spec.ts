import { test, expect } from '@playwright/test';

test.describe('POS Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox').first().fill('admin@mypos.com');
    await page.getByRole('textbox').nth(1).fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await page.goto('/pos');
  });

  test('should display products grid', async ({ page }) => {
    await expect(page.getByPlaceholder('Search products...')).toBeVisible();
    // Wait for products to load
    await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Classic Burger')).toBeVisible();
  });

  test('should display category filters', async ({ page }) => {
    await expect(page.getByRole('button', { name: /All/ })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /Beverages/ })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /Food/ })).toBeVisible({ timeout: 15000 });
  });

  test('should filter products by category', async ({ page }) => {
    await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: /Food/ }).click();
    // Food items should be visible
    await expect(page.getByText('Classic Burger')).toBeVisible();
    // Beverages should be hidden
    await expect(page.getByText('Espresso')).not.toBeVisible();
  });

  test('should add product to cart', async ({ page }) => {
    await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
    // Click on Espresso product card
    await page.getByText('Espresso').first().click();
    // Cart should update
    await expect(page.getByText('Cart (1)')).toBeVisible();
    await expect(page.getByText('$3.50').first()).toBeVisible();
  });

  test('should show order type toggle', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'DINE IN' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'TAKEAWAY' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'DELIVERY' })).toBeVisible();
  });

  test('should search products', async ({ page }) => {
    await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
    await page.getByPlaceholder('Search products...').fill('burger');
    await expect(page.getByText('Classic Burger')).toBeVisible();
    await expect(page.getByText('Espresso')).not.toBeVisible();
  });
});
