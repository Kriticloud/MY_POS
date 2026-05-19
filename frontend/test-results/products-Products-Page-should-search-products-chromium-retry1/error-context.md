# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: products.spec.ts >> Products Page >> should search products
- Location: e2e\products.spec.ts:25:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Classic Burger')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Classic Burger')

```

```yaml
- complementary:
  - img
  - text: MyPOS Restaurant
  - navigation:
    - link "Dashboard":
      - /url: /dashboard
      - img
      - text: Dashboard
    - link "POS":
      - /url: /pos
      - img
      - text: POS
    - link "Appointments":
      - /url: /orders
      - img
      - text: Appointments
    - link "Stations":
      - /url: /tables
      - img
      - text: Stations
    - link "Services":
      - /url: /products
      - img
      - text: Services
    - link "Customers":
      - /url: /customers
      - img
      - text: Customers
    - link "Reports":
      - /url: /reports
      - img
      - text: Reports
    - link "Employees":
      - /url: /employees
      - img
      - text: Employees
    - link "Inventory":
      - /url: /inventory
      - img
      - text: Inventory
    - link "Settings":
      - /url: /settings
      - img
      - text: Settings
  - text: AU
  - paragraph: Admin User
  - paragraph: ADMIN
  - button:
    - img
- main:
  - heading "Products" [level=1]
  - paragraph: Manage your product catalog
  - button "Add Product":
    - img
    - text: Add Product
  - img
  - textbox "Search by name, SKU, or barcode...": burger
  - table:
    - rowgroup:
      - row "Product SKU Category Price Cost Actions":
        - columnheader "Product"
        - columnheader "SKU"
        - columnheader "Category"
        - columnheader "Price"
        - columnheader "Cost"
        - columnheader "Actions"
    - rowgroup:
      - row "No products found":
        - cell "No products found"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Products Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/login');
  6  |     await page.getByRole('textbox').first().fill('admin@mypos.com');
  7  |     await page.getByRole('textbox').nth(1).fill('admin123');
  8  |     await page.getByRole('button', { name: 'Sign In' }).click();
  9  |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  10 |     await page.goto('/products');
  11 |   });
  12 | 
  13 |   test('should display products page with table', async ({ page }) => {
  14 |     await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  15 |     await expect(page.getByText('Manage your product catalog')).toBeVisible();
  16 |     await expect(page.getByRole('button', { name: 'Add Product' })).toBeVisible();
  17 |   });
  18 | 
  19 |   test('should display product list', async ({ page }) => {
  20 |     await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  21 |     await expect(page.getByText('Classic Burger')).toBeVisible();
  22 |     await expect(page.getByText('Mango Smoothie')).toBeVisible();
  23 |   });
  24 | 
  25 |   test('should search products', async ({ page }) => {
  26 |     await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  27 |     await page.getByPlaceholder('Search by name, SKU, or barcode...').fill('burger');
> 28 |     await expect(page.getByText('Classic Burger')).toBeVisible();
     |                                                    ^ Error: expect(locator).toBeVisible() failed
  29 |     await expect(page.getByText('Espresso')).not.toBeVisible();
  30 |   });
  31 | 
  32 |   test('should open add product modal', async ({ page }) => {
  33 |     await page.getByRole('button', { name: 'Add Product' }).click();
  34 |     await expect(page.getByText('Add Product')).toBeVisible();
  35 |     await expect(page.getByText('Name *')).toBeVisible();
  36 |     await expect(page.getByText('Price *')).toBeVisible();
  37 |   });
  38 | });
  39 | 
```