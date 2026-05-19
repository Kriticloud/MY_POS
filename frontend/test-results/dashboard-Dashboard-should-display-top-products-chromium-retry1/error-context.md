# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> Dashboard >> should display top products
- Location: e2e\dashboard.spec.ts:27:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Classic Burger')
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
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
  - heading "Dashboard" [level=1]
  - paragraph: Welcome back! Here's what's happening today.
  - img
  - img
  - text: +12.5%
  - paragraph: $0.00
  - paragraph: Total Revenue
  - img
  - img
  - text: +8.2%
  - paragraph: "0"
  - paragraph: Today's Orders
  - img
  - img
  - text: +5.7%
  - paragraph: $0.00
  - paragraph: Avg Order Value
  - img
  - img
  - text: +4.1%
  - paragraph: "0"
  - paragraph: Total Orders
  - heading "Recent Orders" [level=2]
  - button "View All"
  - table:
    - rowgroup:
      - row "Order Customer Items Total Status Date":
        - columnheader "Order"
        - columnheader "Customer"
        - columnheader "Items"
        - columnheader "Total"
        - columnheader "Status"
        - columnheader "Date"
    - rowgroup:
      - row "No orders yet":
        - cell "No orders yet"
  - heading "Top Products" [level=2]
  - paragraph: No data yet
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Dashboard', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Login first
  6  |     await page.goto('/login');
  7  |     await page.getByRole('textbox').first().fill('admin@mypos.com');
  8  |     await page.getByRole('textbox').nth(1).fill('admin123');
  9  |     await page.getByRole('button', { name: 'Sign In' }).click();
  10 |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  11 |   });
  12 | 
  13 |   test('should display dashboard with stats', async ({ page }) => {
  14 |     await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  15 |     await expect(page.getByText('Total Revenue')).toBeVisible({ timeout: 15000 });
  16 |     await expect(page.getByText("Today's Orders")).toBeVisible();
  17 |     await expect(page.getByText('Avg Order Value')).toBeVisible();
  18 |   });
  19 | 
  20 |   test('should display recent orders table', async ({ page }) => {
  21 |     await expect(page.getByRole('heading', { name: 'Recent Orders' })).toBeVisible({ timeout: 15000 });
  22 |     await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
  23 |     // Check table has order data
  24 |     await expect(page.getByText('ORD-').first()).toBeVisible();
  25 |   });
  26 | 
  27 |   test('should display top products', async ({ page }) => {
  28 |     await expect(page.getByRole('heading', { name: 'Top Products' })).toBeVisible({ timeout: 15000 });
> 29 |     await expect(page.getByText('Classic Burger')).toBeVisible({ timeout: 15000 });
     |                                                    ^ Error: expect(locator).toBeVisible() failed
  30 |   });
  31 | 
  32 |   test('should navigate to orders via View All', async ({ page }) => {
  33 |     await page.getByRole('button', { name: 'View All' }).click();
  34 |     await expect(page).toHaveURL(/\/orders/);
  35 |   });
  36 | });
  37 | 
```