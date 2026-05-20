import { test, expect } from '@playwright/test';

test.describe('POS Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      if (json.data) {
        json.data = json.data.map((s: any) => s.key === 'businessType' ? { ...s, value: 'RESTAURANT' } : s);
      }
      await route.fulfill({ json });
    });
    await page.goto('/pos');
  });

  test.afterEach(async ({ page }) => {
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test.describe('Product Grid', () => {
    test('should display product search input', async ({ page }) => {
      await expect(page.getByPlaceholder(/Search products/i)).toBeVisible();
    });

    test('should display products after loading', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await expect(page.getByText('Classic Burger')).toBeVisible();
    });

    test('should display product prices', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await expect(page.getByText('$3.50').first()).toBeVisible();
    });
  });

  test.describe('Category Filters', () => {
    test('should display category filter buttons', async ({ page }) => {
      await expect(page.getByRole('button', { name: /All/ })).toBeVisible({ timeout: 15000 });
      await expect(page.getByRole('button', { name: /Beverages/ })).toBeVisible({ timeout: 15000 });
      await expect(page.getByRole('button', { name: /Food/ })).toBeVisible({ timeout: 15000 });
    });

    test('should filter products by Food category', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await page.getByRole('button', { name: /Food/ }).click();
      await expect(page.getByText('Classic Burger')).toBeVisible();
      await expect(page.getByText('Espresso')).not.toBeVisible();
    });

    test('should filter products by Beverages category', async ({ page }) => {
      await expect(page.getByText('Classic Burger')).toBeVisible({ timeout: 15000 });
      await page.getByRole('button', { name: /Beverages/ }).click();
      await expect(page.getByText('Espresso')).toBeVisible();
      await expect(page.getByText('Classic Burger')).not.toBeVisible();
    });

    test('should show all products when All category is selected', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await page.getByRole('button', { name: /Food/ }).click();
      await expect(page.getByText('Espresso')).not.toBeVisible();
      await page.getByRole('button', { name: /All/ }).click();
      await expect(page.getByText('Espresso')).toBeVisible();
      await expect(page.getByText('Classic Burger')).toBeVisible();
    });
  });

  test.describe('Search', () => {
    test('should filter products by search term', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await page.getByPlaceholder(/Search products/i).fill('burger');
      await expect(page.getByText('Classic Burger')).toBeVisible();
      await expect(page.getByText('Espresso')).not.toBeVisible();
    });

    test('should show all products when search is cleared', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await page.getByPlaceholder(/Search products/i).fill('burger');
      await expect(page.getByText('Espresso')).not.toBeVisible();
      await page.getByPlaceholder(/Search products/i).clear();
      await expect(page.getByText('Espresso')).toBeVisible();
    });
  });

  test.describe('Cart', () => {
    test('should add product to cart on click', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await page.getByText('Espresso').first().click();
      await expect(page.getByText('Cart (1)')).toBeVisible();
    });

    test('should show correct price in cart', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await page.getByText('Espresso').first().click();
      await expect(page.getByText('Cart (1)')).toBeVisible();
      await expect(page.getByText('$3.50').first()).toBeVisible();
    });

    test('should increment quantity when adding same product', async ({ page }) => {
      const productGrid = page.locator('.grid.grid-cols-2');
      await expect(productGrid.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await productGrid.getByText('Espresso').first().click();
      await expect(page.getByText('Cart (1)')).toBeVisible();
      await productGrid.getByText('Espresso').first().click();
      // Cart still shows (1) unique item, but quantity should be 2
      await expect(page.getByText('$7.00').first()).toBeVisible();
    });

    test('should add multiple different products to cart', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await page.getByText('Espresso').first().click();
      await page.getByText('Classic Burger').first().click();
      await expect(page.getByText('Cart (2)')).toBeVisible();
    });

    test('should clear cart when Clear button is clicked', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await page.getByText('Espresso').first().click();
      await expect(page.getByText('Cart (1)')).toBeVisible();
      await page.getByRole('button', { name: /Clear/i }).click();
      await expect(page.getByText('Cart (0)')).toBeVisible();
    });

    test('should show subtotal, tax, and total', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await page.getByText('Espresso').first().click();
      await expect(page.getByText(/Subtotal/)).toBeVisible();
      await expect(page.getByText(/Tax/)).toBeVisible();
      await expect(page.getByText(/Total/)).toBeVisible();
    });

    test('should show Charge button with total amount', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await page.getByText('Espresso').first().click();
      await expect(page.getByRole('button', { name: /Charge \$/ })).toBeVisible();
    });
  });

  test.describe('Order Types', () => {
    test('should display order type toggle buttons', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'DINE IN' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'TAKEAWAY' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'DELIVERY' })).toBeVisible();
    });

    test('should switch between order types', async ({ page }) => {
      await page.getByRole('button', { name: 'TAKEAWAY' }).click();
      // TAKEAWAY button should now be active/highlighted
      await expect(page.getByRole('button', { name: 'TAKEAWAY' })).toBeVisible();
    });
  });

  test.describe('Payment Flow', () => {
    test('should open payment modal when Charge button is clicked', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await page.getByText('Espresso').first().click();
      await expect(page.getByText('Cart (1)')).toBeVisible();
      await page.getByRole('button', { name: /Charge \$/ }).click();
      // Payment modal should appear
      await expect(page.getByText(/Complete Payment/i)).toBeVisible({ timeout: 5000 });
    });

    test('should complete a cash payment', async ({ page }) => {
      await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
      await page.getByText('Espresso').first().click();
      await page.getByRole('button', { name: /Charge \$/ }).click();
      await expect(page.getByText(/Complete Payment/i)).toBeVisible({ timeout: 5000 });
      await page.getByRole('button', { name: /Complete Payment/i }).click();
      // Should show receipt or clear cart after successful payment
      await expect(page.getByRole('heading', { name: 'Cart (0)' }).or(page.getByText('Order Placed'))).toBeVisible({ timeout: 10000 });
    });
  });
});
