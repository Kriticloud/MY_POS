import { test, expect } from '@playwright/test';

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('admin@mypos.com').fill('admin@mypos.com');
    await page.getByPlaceholder('••••••••').fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await page.goto('/settings');
  });

  test.describe('Page Layout', () => {
    test('should display settings heading', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    });

    test('should display settings section tabs', async ({ page }) => {
      await expect(page.getByText('Business')).toBeVisible();
      await expect(page.getByText('Printing')).toBeVisible();
      await expect(page.getByText('Localization')).toBeVisible();
      await expect(page.getByText('Appearance')).toBeVisible();
      await expect(page.getByText('Notifications')).toBeVisible();
      await expect(page.getByText('Security')).toBeVisible();
    });
  });

  test.describe('Business Settings', () => {
    test('should display business name input', async ({ page }) => {
      await expect(page.getByText('Business Name')).toBeVisible();
    });

    test('should display business type selector', async ({ page }) => {
      await expect(page.getByText('Business Type')).toBeVisible();
    });

    test('should display currency selector', async ({ page }) => {
      await expect(page.getByText('Currency')).toBeVisible();
    });

    test('should display tax rate input', async ({ page }) => {
      await expect(page.getByText(/Tax Rate/i)).toBeVisible();
    });

    test('should have Save Changes button', async ({ page }) => {
      await expect(page.getByRole('button', { name: /Save Changes/i })).toBeVisible();
    });
  });

  test.describe('Section Navigation', () => {
    test('should switch to Printing section', async ({ page }) => {
      await page.getByText('Printing').click();
      await expect(page.getByText(/Paper Size|Printer Type/i).first()).toBeVisible();
    });

    test('should switch to Appearance section', async ({ page }) => {
      await page.getByText('Appearance').click();
      await expect(page.getByText(/Theme/i)).toBeVisible();
    });

    test('should switch to Notifications section', async ({ page }) => {
      await page.getByText('Notifications').click();
      await expect(page.getByText(/New Order Alerts|Kitchen Ready/i).first()).toBeVisible();
    });

    test('should switch to Security section', async ({ page }) => {
      await page.getByText('Security').click();
      await expect(page.getByText(/Two-Factor|Session Timeout|Login Attempts/i).first()).toBeVisible();
    });

    test('should switch to Localization section', async ({ page }) => {
      await page.getByText('Localization').click();
      await expect(page.getByText(/Language|Timezone/i).first()).toBeVisible();
    });
  });
});
