# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: products.spec.ts >> Products Page >> should display products page with table
- Location: e2e\products.spec.ts:21:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Products' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Products' })

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Products Page', () => {
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
  18 |     await page.goto('/products');
  19 |   });
  20 | 
  21 |   test('should display products page with table', async ({ page }) => {
> 22 |     await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
     |                                                                   ^ Error: expect(locator).toBeVisible() failed
  23 |     await expect(page.getByText('Manage your product catalog')).toBeVisible();
  24 |     await expect(page.getByRole('button', { name: 'Add Product' })).toBeVisible();
  25 |   });
  26 | 
  27 |   test('should display product list', async ({ page }) => {
  28 |     await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  29 |     await expect(page.getByText('Classic Burger')).toBeVisible();
  30 |     await expect(page.getByText('Cappuccino')).toBeVisible();
  31 |   });
  32 | 
  33 |   test('should search products', async ({ page }) => {
  34 |     await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  35 |     await page.getByPlaceholder('Search by name, SKU, or barcode...').fill('burger');
  36 |     await expect(page.getByText('Classic Burger')).toBeVisible();
  37 |     await expect(page.getByText('Espresso')).not.toBeVisible();
  38 |   });
  39 | 
  40 |   test('should open add product modal', async ({ page }) => {
  41 |     await page.getByRole('button', { name: 'Add Product' }).click();
  42 |     await expect(page.getByText('Add Product')).toBeVisible();
  43 |     await expect(page.getByText('Name *')).toBeVisible();
  44 |     await expect(page.getByText('Price *')).toBeVisible();
  45 |   });
  46 | });
  47 | 
```