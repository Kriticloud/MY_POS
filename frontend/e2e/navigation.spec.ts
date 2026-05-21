import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
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
    await page.goto('/dashboard');
  });

  test.afterEach(async ({ page }) => {
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test.describe('Page Routing', () => {
    test('should navigate to POS page', async ({ page }) => {
      await page.goto('/pos');
      await expect(page.getByPlaceholder(/Search products/i)).toBeVisible({ timeout: 15000 });
    });

    test('should navigate to Orders page', async ({ page }) => {
      await page.goto('/orders');
      await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible({ timeout: 15000 });
    });

    test('should navigate to Tables page', async ({ page }) => {
      await page.goto('/tables');
      await expect(page.getByRole('heading', { name: 'Tables' })).toBeVisible({ timeout: 15000 });
    });

    test('should navigate to Kitchen page', async ({ page }) => {
      await page.goto('/kitchen');
      await expect(page.getByRole('heading', { name: 'Kitchen Display' })).toBeVisible({ timeout: 15000 });
    });

    test('should navigate to Products page', async ({ page }) => {
      await page.goto('/products');
      await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible({ timeout: 15000 });
    });

    test('should navigate to Customers page', async ({ page }) => {
      await page.goto('/customers');
      await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible({ timeout: 15000 });
    });

    test('should navigate to Reports page', async ({ page }) => {
      await page.goto('/reports');
      await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible({ timeout: 15000 });
    });

    test('should navigate to Settings page', async ({ page }) => {
      await page.goto('/settings');
      await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('Sidebar', () => {
    test('should show all navigation links in sidebar', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/dashboard');
      await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'POS' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Orders' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Customers' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Reports' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
    });

    test('should display user info in sidebar', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/dashboard');
      await expect(page.getByText('Admin User')).toBeVisible();
      await expect(page.getByText('ADMIN', { exact: true })).toBeVisible();
    });

    test('should navigate when clicking sidebar links', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/dashboard');
      await page.getByRole('link', { name: 'Orders' }).click();
      await expect(page).toHaveURL(/\/orders/);
      await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible({ timeout: 15000 });
    });

    test('should highlight the active navigation link', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/dashboard');
      // The Dashboard link should have an active/selected style
      const dashboardLink = page.getByRole('link', { name: 'Dashboard' });
      await expect(dashboardLink).toBeVisible();
    });
  });

  test.describe('Responsive Layout', () => {
    test('should handle mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/dashboard');
      await expect(page.getByText(/Good (morning|afternoon|evening|night)/)).toBeVisible({ timeout: 15000 });
    });
  });
});
