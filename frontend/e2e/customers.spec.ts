import { test, expect } from '@playwright/test';

test.describe('Customers Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('textbox').first().fill('admin@mypos.com');
    await page.getByRole('textbox').nth(1).fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await page.goto('/customers');
  });

  test('should display customers page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Customer' })).toBeVisible();
  });

  test('should display customer list', async ({ page }) => {
    await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Jane Smith')).toBeVisible();
  });

  test('should search customers', async ({ page }) => {
    await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
    await page.getByPlaceholder('Search customers...').fill('Jane');
    await expect(page.getByText('Jane Smith')).toBeVisible();
    await expect(page.getByText('John Doe')).not.toBeVisible();
  });

  test('should open add customer modal', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Customer' }).click();
    await expect(page.getByRole('heading', { name: 'Add Customer' })).toBeVisible();
  });
});
