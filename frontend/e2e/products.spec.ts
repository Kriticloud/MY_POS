import { test, expect } from '@playwright/test';

test.describe('Products Page', () => {
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
    await page.getByRole('textbox').first().fill('admin@mypos.com');
    await page.getByRole('textbox').nth(1).fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await page.goto('/products');
  });

  test.afterEach(async ({ page }) => {
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('should display products page with table', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
    await expect(page.getByText('Manage your product catalog')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Product' })).toBeVisible();
  });

  test('should display product list', async ({ page }) => {
    await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Classic Burger')).toBeVisible();
    await expect(page.getByText('Cappuccino')).toBeVisible();
  });

  test('should search products', async ({ page }) => {
    await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
    await page.getByPlaceholder('Search by name, SKU, or barcode...').fill('burger');
    await expect(page.getByText('Classic Burger')).toBeVisible();
    await expect(page.getByText('Espresso')).not.toBeVisible();
  });

  test('should open add product modal', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Product' }).click();
    await expect(page.getByText('Add Product')).toBeVisible();
    await expect(page.getByText('Name *')).toBeVisible();
    await expect(page.getByText('Price *')).toBeVisible();
  });
});
