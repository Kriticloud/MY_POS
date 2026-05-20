# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Navigation >> should navigate to all pages
- Location: e2e\navigation.spec.ts:20:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/pos", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Navigation', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.route('**/api/settings', async (route) => {
  6  |       const response = await route.fetch();
  7  |       const json = await response.json();
  8  |       if (json.data) {
  9  |         json.data = json.data.map((s: any) => s.key === 'businessType' ? { ...s, value: 'RESTAURANT' } : s);
  10 |       }
  11 |       await route.fulfill({ json });
  12 |     });
  13 |     await page.goto('/login');
  14 |     await page.getByRole('textbox').first().fill('admin@mypos.com');
  15 |     await page.getByRole('textbox').nth(1).fill('admin123');
  16 |     await page.getByRole('button', { name: 'Sign In' }).click();
  17 |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  18 |   });
  19 | 
  20 |   test('should navigate to all pages', async ({ page }) => {
  21 |     // Navigate via URL since sidebar may be offscreen in test viewport
> 22 |     await page.goto('/pos');
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  23 |     await expect(page.getByPlaceholder('Search products...')).toBeVisible();
  24 | 
  25 |     await page.goto('/orders');
  26 |     await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
  27 | 
  28 |     await page.goto('/tables');
  29 |     await expect(page.getByRole('heading', { name: 'Tables' })).toBeVisible();
  30 | 
  31 |     await page.goto('/kitchen');
  32 |     await expect(page.getByRole('heading', { name: 'Kitchen Display' })).toBeVisible();
  33 | 
  34 |     await page.goto('/products');
  35 |     await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  36 | 
  37 |     await page.goto('/customers');
  38 |     await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible();
  39 | 
  40 |     await page.goto('/reports');
  41 |     await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible();
  42 | 
  43 |     await page.goto('/settings');
  44 |     await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  45 |   });
  46 | 
  47 |   test('should show sidebar navigation links', async ({ page }) => {
  48 |     // Use a wider viewport to ensure sidebar is visible
  49 |     await page.setViewportSize({ width: 1280, height: 720 });
  50 |     await page.goto('/dashboard');
  51 |     await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  52 |     await expect(page.getByRole('link', { name: 'POS' })).toBeVisible();
  53 |     await expect(page.getByRole('link', { name: 'Orders' })).toBeVisible();
  54 |     await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
  55 |     await expect(page.getByRole('link', { name: 'Customers' })).toBeVisible();
  56 |   });
  57 | 
  58 |   test('should display user info in sidebar', async ({ page }) => {
  59 |     await page.setViewportSize({ width: 1280, height: 720 });
  60 |     await page.goto('/dashboard');
  61 |     await expect(page.getByText('Admin User')).toBeVisible();
  62 |     await expect(page.getByText('ADMIN', { exact: true })).toBeVisible();
  63 |   });
  64 | });
  65 | 
```