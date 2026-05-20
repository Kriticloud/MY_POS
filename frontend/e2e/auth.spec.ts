import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test.describe('Login Page UI', () => {
    test('should display all login form elements', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Welcome to MyPOS' })).toBeVisible();
      await expect(page.getByText('Sign in to your account')).toBeVisible();
      await expect(page.getByPlaceholder('admin@mypos.com')).toBeVisible();
      await expect(page.getByPlaceholder('••••••••')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
      await expect(page.getByText('Remember me')).toBeVisible();
    });

    test('should display demo credentials section', async ({ page }) => {
      await expect(page.getByText('admin@mypos.com')).toBeVisible();
      await expect(page.getByText('admin123')).toBeVisible();
      await expect(page.getByText('cashier@mypos.com')).toBeVisible();
      await expect(page.getByText('cashier123')).toBeVisible();
    });
  });

  test.describe('Login Flow', () => {
    test('should login with valid admin credentials and reach dashboard', async ({ page }) => {
      await page.getByPlaceholder('admin@mypos.com').fill('admin@mypos.com');
      await page.getByPlaceholder('••••••••').fill('admin123');
      await page.getByRole('button', { name: 'Sign In' }).click();

      await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });
    });

    test('should login with valid cashier credentials', async ({ page }) => {
      await page.getByPlaceholder('admin@mypos.com').fill('cashier@mypos.com');
      await page.getByPlaceholder('••••••••').fill('cashier123');
      await page.getByRole('button', { name: 'Sign In' }).click();

      await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    });

    test('should reject invalid credentials and stay on login page', async ({ page }) => {
      await page.getByPlaceholder('admin@mypos.com').fill('wrong@email.com');
      await page.getByPlaceholder('••••••••').fill('wrongpassword');
      await page.getByRole('button', { name: 'Sign In' }).click();

      await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
      // Should still see the login form
      await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    });

    test('should not submit with empty fields', async ({ page }) => {
      await page.getByRole('button', { name: 'Sign In' }).click();
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Route Protection', () => {
    test('should redirect unauthenticated users from protected routes to login', async ({ page }) => {
      const protectedRoutes = ['/dashboard', '/pos', '/orders', '/products', '/customers', '/settings'];
      for (const route of protectedRoutes) {
        await page.goto(route);
        await expect(page).toHaveURL(/\/login/);
      }
    });
  });

  test.describe('Session Persistence', () => {
    test('should maintain session after page reload', async ({ page }) => {
      await page.getByPlaceholder('admin@mypos.com').fill('admin@mypos.com');
      await page.getByPlaceholder('••••••••').fill('admin123');
      await page.getByRole('button', { name: 'Sign In' }).click();
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });

      await page.reload();
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });
    });
  });
});
