# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: customers.spec.ts >> Customers Page >> should search customers
- Location: e2e\customers.spec.ts:23:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Jane Smith')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Jane Smith')

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
    - link "Orders":
      - /url: /orders
      - img
      - text: Orders
    - link "Tables":
      - /url: /tables
      - img
      - text: Tables
    - link "Kitchen":
      - /url: /kitchen
      - img
      - text: Kitchen
    - link "Products":
      - /url: /products
      - img
      - text: Products
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
  - heading "Customers" [level=1]
  - paragraph: Manage customers & loyalty programs
  - button "Add Customer":
    - img
    - text: Add Customer
  - img
  - textbox "Search customers...": Jane
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Customers Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/login');
  6  |     await page.getByRole('textbox').first().fill('admin@mypos.com');
  7  |     await page.getByRole('textbox').nth(1).fill('admin123');
  8  |     await page.getByRole('button', { name: 'Sign In' }).click();
  9  |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  10 |     await page.goto('/customers');
  11 |   });
  12 | 
  13 |   test('should display customers page', async ({ page }) => {
  14 |     await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible();
  15 |     await expect(page.getByRole('button', { name: 'Add Customer' })).toBeVisible();
  16 |   });
  17 | 
  18 |   test('should display customer list', async ({ page }) => {
  19 |     await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
  20 |     await expect(page.getByText('Jane Smith')).toBeVisible();
  21 |   });
  22 | 
  23 |   test('should search customers', async ({ page }) => {
  24 |     await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
  25 |     await page.getByPlaceholder('Search customers...').fill('Jane');
> 26 |     await expect(page.getByText('Jane Smith')).toBeVisible();
     |                                                ^ Error: expect(locator).toBeVisible() failed
  27 |     await expect(page.getByText('John Doe')).not.toBeVisible();
  28 |   });
  29 | 
  30 |   test('should open add customer modal', async ({ page }) => {
  31 |     await page.getByRole('button', { name: 'Add Customer' }).click();
  32 |     await expect(page.getByText('Add Customer')).toBeVisible();
  33 |   });
  34 | });
  35 | 
```