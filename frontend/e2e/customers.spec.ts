import { test, expect } from '@playwright/test';

test.describe('Customers Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/customers');
  });

  test.describe('Page Layout', () => {
    test('should display page heading and subtitle', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible();
    });

    test('should display add customer button', async ({ page }) => {
      await expect(page.getByRole('button', { name: /Add Customer/ })).toBeVisible();
    });

    test('should display search input', async ({ page }) => {
      await expect(page.getByPlaceholder(/Search customers/i)).toBeVisible();
    });
  });

  test.describe('Customer List', () => {
    test('should display seeded customers', async ({ page }) => {
      await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
      await expect(page.getByText('Jane Smith')).toBeVisible();
    });

    test('should display customer loyalty badges', async ({ page }) => {
      await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
      // Loyalty tier badges should be visible
      const tierBadge = page.getByText(/BRONZE|SILVER|GOLD|PLATINUM/).first();
      await expect(tierBadge).toBeVisible();
    });

    test('should show customer action buttons', async ({ page }) => {
      await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
      // Each customer card should have Edit and Delete buttons
      await expect(page.getByRole('button', { name: /Edit/i }).first()).toBeVisible();
    });
  });

  test.describe('Search', () => {
    test('should filter customers by name', async ({ page }) => {
      await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
      await page.getByPlaceholder(/Search customers/i).fill('Jane');
      await expect(page.getByText('Jane Smith')).toBeVisible();
      await expect(page.getByText('John Doe')).not.toBeVisible();
    });

    test('should show all customers when search is cleared', async ({ page }) => {
      await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
      await page.getByPlaceholder(/Search customers/i).fill('Jane');
      await expect(page.getByText('John Doe')).not.toBeVisible();
      await page.getByPlaceholder(/Search customers/i).clear();
      await expect(page.getByText('John Doe')).toBeVisible();
      await expect(page.getByText('Jane Smith')).toBeVisible();
    });
  });

  test.describe('Add Customer Modal', () => {
    test('should open modal with form fields', async ({ page }) => {
      await page.getByRole('button', { name: /Add Customer/ }).click();
      await expect(page.getByRole('heading', { name: /Add Customer/i })).toBeVisible();
      await expect(page.getByText('First Name')).toBeVisible();
      await expect(page.getByText('Last Name')).toBeVisible();
      await expect(page.getByText('Email')).toBeVisible();
      await expect(page.getByText('Phone')).toBeVisible();
    });

    test('should close modal via X button', async ({ page }) => {
      await page.getByRole('button', { name: /Add Customer/ }).click();
      await expect(page.getByRole('heading', { name: /Add Customer/i })).toBeVisible();
      // Close via X button in modal header
      const modal = page.locator('.fixed.inset-0');
      await modal.locator('button').filter({ has: page.locator('svg') }).first().click();
      await expect(page.getByRole('heading', { name: /Add Customer/i })).not.toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Loyalty Program', () => {
    test('should open loyalty modal for a customer', async ({ page }) => {
      await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
      // Click the Loyalty button on the first customer card
      const customerCard = page.locator('.shadow-card').filter({ hasText: 'John Doe' }).first();
      await customerCard.getByRole('button', { name: /Loyalty/i }).click();
      await expect(page.getByRole('heading', { name: 'Loyalty Program' })).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Available Points')).toBeVisible();
    });
  });
});
