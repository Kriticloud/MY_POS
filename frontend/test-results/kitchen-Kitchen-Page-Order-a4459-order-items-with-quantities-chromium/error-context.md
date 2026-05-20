# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: kitchen.spec.ts >> Kitchen Page >> Order Cards >> should show order items with quantities
- Location: e2e\kitchen.spec.ts:44:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/\d+x\s/).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/\d+x\s/).first()

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
  - text: Live ORD-002 Table 8
  - img
  - img
  - text: 23h 10m 1x
  - paragraph: Chicken Sandwich
  - text: 2x
  - paragraph: Latte
  - button "Start Preparing":
    - img
    - text: Start Preparing
  - text: ORD-003
  - img
  - img
  - text: 22h 55m 1x
  - paragraph: Burger Combo
  - button "Mark Ready":
    - img
    - text: Mark Ready
  - text: ORD-009 Table 5
  - img
  - img
  - text: 22h 26m 1x
  - paragraph: Margherita Pizza
  - text: 2x
  - paragraph: Chocolate Cake
  - paragraph: "Order note: Birthday celebration"
  - button "Start Preparing":
    - img
    - text: Start Preparing
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Kitchen Page', () => {
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
  14 |     await page.getByPlaceholder('admin@mypos.com').fill('admin@mypos.com');
  15 |     await page.getByPlaceholder('••••••••').fill('admin123');
  16 |     await page.getByRole('button', { name: 'Sign In' }).click();
  17 |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  18 |     await page.goto('/kitchen');
  19 |   });
  20 | 
  21 |   test.afterEach(async ({ page }) => {
  22 |     await page.unrouteAll({ behavior: 'ignoreErrors' });
  23 |   });
  24 | 
  25 |   test.describe('Page Layout', () => {
  26 |     test('should display kitchen display heading', async ({ page }) => {
  27 |       await expect(page.getByRole('heading', { name: 'Kitchen Display' })).toBeVisible();
  28 |     });
  29 | 
  30 |     test('should show live status indicator', async ({ page }) => {
  31 |       await expect(page.getByText('Live')).toBeVisible();
  32 |     });
  33 | 
  34 |     test('should display active orders subtitle', async ({ page }) => {
  35 |       await expect(page.getByText('Active orders in the kitchen')).toBeVisible();
  36 |     });
  37 |   });
  38 | 
  39 |   test.describe('Order Cards', () => {
  40 |     test('should display order numbers', async ({ page }) => {
  41 |       await expect(page.getByText(/^ORD-/).first()).toBeVisible({ timeout: 15000 });
  42 |     });
  43 | 
  44 |     test('should show order items with quantities', async ({ page }) => {
  45 |       await expect(page.getByText(/^ORD-/).first()).toBeVisible({ timeout: 15000 });
  46 |       // Order cards show items like "2x Classic Burger"
> 47 |       await expect(page.getByText(/\d+x\s/).first()).toBeVisible();
     |                                                      ^ Error: expect(locator).toBeVisible() failed
  48 |     });
  49 | 
  50 |     test('should show elapsed time on order cards', async ({ page }) => {
  51 |       await expect(page.getByText(/^ORD-/).first()).toBeVisible({ timeout: 15000 });
  52 |       // Elapsed time shown as e.g. "5m", "1h 2m"
  53 |       await expect(page.getByText(/\d+m/).first()).toBeVisible();
  54 |     });
  55 |   });
  56 | 
  57 |   test.describe('Action Buttons', () => {
  58 |     test('should show status transition buttons', async ({ page }) => {
  59 |       await expect(page.getByText(/^ORD-/).first()).toBeVisible({ timeout: 15000 });
  60 |       const actionButtons = page.getByRole('button', { name: /Start Preparing|Mark Ready/ });
  61 |       await expect(actionButtons.first()).toBeVisible();
  62 |     });
  63 | 
  64 |     test('should transition order status when action button clicked', async ({ page }) => {
  65 |       await expect(page.getByText(/^ORD-/).first()).toBeVisible({ timeout: 15000 });
  66 |       const actionButton = page.getByRole('button', { name: /Start Preparing|Mark Ready/ }).first();
  67 |       const buttonText = await actionButton.textContent();
  68 |       await actionButton.click();
  69 |       // After clicking, the order should either change status or disappear
  70 |       // Give time for the API call and re-render
  71 |       await page.waitForTimeout(2000);
  72 |       // The page should still be functional
  73 |       await expect(page.getByRole('heading', { name: 'Kitchen Display' })).toBeVisible();
  74 |     });
  75 |   });
  76 | });
  77 | 
```