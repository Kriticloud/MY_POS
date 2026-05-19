# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: orders.spec.ts >> Orders Page >> should filter orders by status
- Location: e2e\orders.spec.ts:33:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('cell', { name: 'COMPLETED' }).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('cell', { name: 'COMPLETED' }).first()

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
  - heading "Orders" [level=1]
  - paragraph: Manage and track all orders
  - img
  - textbox "Search orders..."
  - button "ALL"
  - button "PENDING"
  - button "CONFIRMED"
  - button "PREPARING"
  - button "READY"
  - button "SERVED"
  - button "COMPLETED"
  - button "CANCELLED"
  - table:
    - rowgroup:
      - row "Order Customer Type Items Total Status Date Actions":
        - columnheader "Order"
        - columnheader "Customer"
        - columnheader "Type"
        - columnheader "Items"
        - columnheader "Total"
        - columnheader "Status"
        - columnheader "Date"
        - columnheader "Actions"
    - rowgroup:
      - row "No orders found":
        - cell "No orders found"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Orders Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/login');
  6  |     await page.getByRole('textbox').first().fill('admin@mypos.com');
  7  |     await page.getByRole('textbox').nth(1).fill('admin123');
  8  |     await page.getByRole('button', { name: 'Sign In' }).click();
  9  |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  10 |     await page.goto('/orders');
  11 |   });
  12 | 
  13 |   test('should display orders page', async ({ page }) => {
  14 |     await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
  15 |     await expect(page.getByText('Manage and track all orders')).toBeVisible();
  16 |   });
  17 | 
  18 |   test('should display status filter tabs', async ({ page }) => {
  19 |     const filterSection = page.locator('[class*="gap"]').filter({ has: page.getByRole('button', { name: 'ALL' }) }).first();
  20 |     await expect(filterSection.getByRole('button', { name: 'ALL' })).toBeVisible();
  21 |     await expect(filterSection.getByRole('button', { name: 'PENDING' })).toBeVisible();
  22 |     await expect(filterSection.getByRole('button', { name: 'CONFIRMED' })).toBeVisible();
  23 |     await expect(filterSection.getByRole('button', { name: 'PREPARING' })).toBeVisible();
  24 |     await expect(filterSection.getByRole('button', { name: 'READY' })).toBeVisible();
  25 |     await expect(filterSection.getByRole('button', { name: 'COMPLETED' })).toBeVisible();
  26 |   });
  27 | 
  28 |   test('should show orders in table', async ({ page }) => {
  29 |     await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
  30 |     await expect(page.getByText('ORD-001')).toBeVisible({ timeout: 15000 });
  31 |   });
  32 | 
  33 |   test('should filter orders by status', async ({ page }) => {
  34 |     await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
  35 |     await page.getByRole('button', { name: 'COMPLETED' }).first().click();
  36 |     // Completed orders should show in the table
> 37 |     await expect(page.getByRole('cell', { name: 'COMPLETED' }).first()).toBeVisible();
     |                                                                         ^ Error: expect(locator).toBeVisible() failed
  38 |   });
  39 | 
  40 |   test('should search orders', async ({ page }) => {
  41 |     await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
  42 |     await page.getByPlaceholder('Search orders...').fill('John');
  43 |     await expect(page.getByText('John Doe').first()).toBeVisible();
  44 |   });
  45 | });
  46 | 
```