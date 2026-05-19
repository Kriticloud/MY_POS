# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: kitchen.spec.ts >> Kitchen Page >> should show active orders
- Location: e2e\kitchen.spec.ts:18:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('ORD-').first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByText('ORD-').first()

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
  - heading "Kitchen Display" [level=1]
  - paragraph: Active orders in the kitchen
  - text: Live
  - img
  - paragraph: No active orders
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Kitchen Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/login');
  6  |     await page.getByRole('textbox').first().fill('admin@mypos.com');
  7  |     await page.getByRole('textbox').nth(1).fill('admin123');
  8  |     await page.getByRole('button', { name: 'Sign In' }).click();
  9  |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  10 |     await page.goto('/kitchen');
  11 |   });
  12 | 
  13 |   test('should display kitchen display page', async ({ page }) => {
  14 |     await expect(page.getByRole('heading', { name: 'Kitchen Display' })).toBeVisible();
  15 |     await expect(page.getByText('Live')).toBeVisible();
  16 |   });
  17 | 
  18 |   test('should show active orders', async ({ page }) => {
  19 |     // Kitchen shows CONFIRMED and PREPARING orders
> 20 |     await expect(page.getByText('ORD-').first()).toBeVisible({ timeout: 15000 });
     |                                                  ^ Error: expect(locator).toBeVisible() failed
  21 |   });
  22 | 
  23 |   test('should show action buttons for orders', async ({ page }) => {
  24 |     await expect(page.getByText('ORD-').first()).toBeVisible({ timeout: 15000 });
  25 |     // Should have at least one action button
  26 |     const actionButtons = page.getByRole('button', { name: /Start Preparing|Mark Ready/ });
  27 |     await expect(actionButtons.first()).toBeVisible();
  28 |   });
  29 | });
  30 | 
```