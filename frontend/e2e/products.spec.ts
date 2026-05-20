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
    await page.getByPlaceholder('admin@mypos.com').fill('admin@mypos.com');
    await page.getByPlaceholder('••••••••').fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await page.goto('/products');
  });

  test.afterEach(async ({ page }) => {
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test.describe('Page Layout', () => {
    test('should display page heading and subtitle', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
      await expect(page.getByText('Manage your product catalog')).toBeVisible();
    });

    test('should display add product button', async ({ page }) => {
      await expect(page.getByRole('button', { name: /Add Product/ })).toBeVisible();
    });

    test('should display search input', async ({ page }) => {
      await expect(page.getByPlaceholder('Search by name, SKU, or barcode...')).toBeVisible();
    });
  });

  test.describe('Product Table', () => {
    test('should display product list with seeded data', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await expect(page.getByText('Classic Burger')).toBeVisible();
      await expect(page.getByText('Cappuccino')).toBeVisible();
    });

    test('should display product prices', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await expect(page.getByText(/\$\d+/).first()).toBeVisible();
    });

    test('should show edit and delete action buttons per row', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      // Each row should have action buttons (edit/delete icons)
      const firstRow = page.getByRole('row').filter({ hasText: 'Espresso' });
      await expect(firstRow.getByRole('button').first()).toBeVisible();
    });
  });

  test.describe('Search', () => {
    test('should filter products by name', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await page.getByPlaceholder('Search by name, SKU, or barcode...').fill('burger');
      await expect(page.getByText('Classic Burger')).toBeVisible();
      await expect(page.getByText('Espresso')).not.toBeVisible();
    });

    test('should show all products when search is cleared', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await page.getByPlaceholder('Search by name, SKU, or barcode...').fill('burger');
      await expect(page.getByText('Espresso')).not.toBeVisible();
      await page.getByPlaceholder('Search by name, SKU, or barcode...').clear();
      await expect(page.getByText('Espresso')).toBeVisible();
      await expect(page.getByText('Classic Burger')).toBeVisible();
    });

    test('should show no results for non-matching search', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await page.getByPlaceholder('Search by name, SKU, or barcode...').fill('xyznonexistent');
      await expect(page.getByText('Espresso')).not.toBeVisible();
      await expect(page.getByText('Classic Burger')).not.toBeVisible();
    });
  });

  test.describe('Add Product Modal', () => {
    test('should open modal with all form fields', async ({ page }) => {
      await page.getByRole('button', { name: /Add Product/ }).click();
      await expect(page.getByText('New Product')).toBeVisible();
      await expect(page.getByText('Name')).toBeVisible();
      await expect(page.getByText('Price')).toBeVisible();
    });

    test('should display category dropdown in modal', async ({ page }) => {
      await page.getByRole('button', { name: /Add Product/ }).click();
      await expect(page.getByText('New Product')).toBeVisible();
      await expect(page.getByText('Category')).toBeVisible();
    });

    test('should close modal via X button', async ({ page }) => {
      await page.getByRole('button', { name: /Add Product/ }).click();
      await expect(page.getByText('New Product')).toBeVisible();
      const modal = page.locator('.fixed.inset-0');
      await modal.locator('button').filter({ has: page.locator('svg') }).first().click();
      await expect(page.getByText('New Product')).not.toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Edit Product', () => {
    test('should open edit modal when clicking edit on a product', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      const editButton = page.getByRole('row').filter({ hasText: 'Espresso' }).getByRole('button').first();
      await editButton.click();
      await expect(page.getByText('Edit Product')).toBeVisible({ timeout: 5000 });
    });
  });
});
