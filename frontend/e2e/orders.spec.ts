import { test, expect } from '@playwright/test';

test.describe('Orders Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/settings', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      if (json.data) {
        json.data = json.data.map((s: any) => {
          if (s.key === 'businessType') return { ...s, value: 'RESTAURANT' };
          if (s.key === 'currency') return { ...s, value: 'USD' };
          return s;
        });
      }
      await route.fulfill({ json });
    });
    await page.addInitScript(() => {
      localStorage.removeItem('mypos-settings');
      localStorage.removeItem('i18n-storage');
    });
    await page.goto('/orders');
  });

  test.afterEach(async ({ page }) => {
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test.describe('Page Layout', () => {
    test('should display page heading and subtitle', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
      await expect(page.getByText('Manage and track all orders')).toBeVisible();
    });

    test('should display search input', async ({ page }) => {
      await expect(page.getByPlaceholder(/Search orders/i)).toBeVisible();
    });
  });

  test.describe('Status Filter Tabs', () => {
    test('should display all status filter buttons', async ({ page }) => {
      const filterSection = page.locator('[class*="gap"]').filter({ has: page.getByRole('button', { name: 'ALL' }) }).first();
      await expect(filterSection.getByRole('button', { name: 'ALL' })).toBeVisible();
      await expect(filterSection.getByRole('button', { name: 'PENDING' })).toBeVisible();
      await expect(filterSection.getByRole('button', { name: 'CONFIRMED' })).toBeVisible();
      await expect(filterSection.getByRole('button', { name: 'PREPARING' })).toBeVisible();
      await expect(filterSection.getByRole('button', { name: 'READY' })).toBeVisible();
      await expect(filterSection.getByRole('button', { name: 'COMPLETED' })).toBeVisible();
    });

    test('should filter orders when clicking COMPLETED tab', async ({ page }) => {
      await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
      await page.getByRole('button', { name: 'COMPLETED' }).first().click();
      await expect(page.getByRole('cell', { name: 'COMPLETED' }).first()).toBeVisible();
    });

    test('should show all orders when ALL tab is clicked', async ({ page }) => {
      await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
      // Click COMPLETED first to filter
      await page.getByRole('button', { name: 'COMPLETED' }).first().click();
      await expect(page.getByRole('cell', { name: 'COMPLETED' }).first()).toBeVisible();
      // Click ALL to reset
      await page.getByRole('button', { name: 'ALL' }).first().click();
      // Should show orders with various statuses
      await expect(page.getByText(/^ORD-/).first()).toBeVisible();
    });
  });

  test.describe('Orders Table', () => {
    test('should display orders table with data', async ({ page }) => {
      await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
      await expect(page.getByText(/^ORD-/).first()).toBeVisible({ timeout: 15000 });
    });

    test('should show order status badges with colors', async ({ page }) => {
      await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
      const statusCell = page.getByRole('cell', { name: /COMPLETED|CONFIRMED|PREPARING|READY|PENDING|SERVED/ }).first();
      await expect(statusCell).toBeVisible();
    });

    test('should show order totals with currency', async ({ page }) => {
      await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
      await expect(page.getByText(/\$\d+/).first()).toBeVisible();
    });
  });

  test.describe('Search', () => {
    test('should filter orders by search term', async ({ page }) => {
      await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
      const firstOrder = page.getByText(/^ORD-/).first();
      await expect(firstOrder).toBeVisible({ timeout: 10000 });
      const orderNumber = await firstOrder.textContent();
      await page.getByPlaceholder(/Search orders/i).fill(orderNumber!.slice(0, 7));
      await expect(page.getByText(orderNumber!)).toBeVisible({ timeout: 10000 });
    });

    test('should clear search and show all orders', async ({ page }) => {
      await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
      const firstOrder = page.getByText(/^ORD-/).first();
      await expect(firstOrder).toBeVisible({ timeout: 10000 });
      const orderNumber = await firstOrder.textContent();
      await page.getByPlaceholder(/Search orders/i).fill(orderNumber!.slice(0, 7));
      await expect(page.getByText(orderNumber!)).toBeVisible({ timeout: 10000 });
      await page.getByPlaceholder(/Search orders/i).clear();
      // All orders should be visible again
      await expect(page.getByText(/^ORD-/).first()).toBeVisible();
    });
  });

  test.describe('Order Details', () => {
    test('should open order detail modal when clicking view button', async ({ page }) => {
      await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
      await expect(page.getByText(/^ORD-/).first()).toBeVisible({ timeout: 15000 });
      // Click the eye/view icon on the first order row
      const viewButton = page.getByRole('row').nth(1).getByRole('button').first();
      await viewButton.click();
      // Modal should appear with order details
      await expect(page.getByText(/Order ORD-/)).toBeVisible({ timeout: 5000 });
    });
  });
});
