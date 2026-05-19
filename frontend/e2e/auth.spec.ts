import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome to MyPOS' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByPlaceholder('admin@mypos.com')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.getByRole('textbox').first().fill('admin@mypos.com');
    await page.getByRole('textbox').nth(1).fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });
  });

  test('should reject invalid credentials', async ({ page }) => {
    await page.getByRole('textbox').first().fill('wrong@email.com');
    await page.getByRole('textbox').nth(1).fill('wrongpass');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Should stay on login page
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});
