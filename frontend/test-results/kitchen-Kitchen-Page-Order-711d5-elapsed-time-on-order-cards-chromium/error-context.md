# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: kitchen.spec.ts >> Kitchen Page >> Order Cards >> should show elapsed time on order cards
- Location: e2e\kitchen.spec.ts:45:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/^ORD-/).first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByText(/^ORD-/).first()

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
  5  |     await page.route('**/api/settings', async (route) => {
  6  |       const response = await route.fetch();
  7  |       const json = await response.json();
  8  |       if (json.data) {
  9  |         json.data = json.data.map((s: any) => s.key === 'businessType' ? { ...s, value: 'RESTAURANT' } : s);
  10 |       }
  11 |       await route.fulfill({ json });
  12 |     });
  13 |     await page.goto('/kitchen');
  14 |   });
  15 | 
  16 |   test.afterEach(async ({ page }) => {
  17 |     await page.unrouteAll({ behavior: 'ignoreErrors' });
  18 |   });
  19 | 
  20 |   test.describe('Page Layout', () => {
  21 |     test('should display kitchen display heading', async ({ page }) => {
  22 |       await expect(page.getByRole('heading', { name: 'Kitchen Display' })).toBeVisible();
  23 |     });
  24 | 
  25 |     test('should show live status indicator', async ({ page }) => {
  26 |       await expect(page.getByText('Live')).toBeVisible();
  27 |     });
  28 | 
  29 |     test('should display active orders subtitle', async ({ page }) => {
  30 |       await expect(page.getByText('Active orders in the kitchen')).toBeVisible();
  31 |     });
  32 |   });
  33 | 
  34 |   test.describe('Order Cards', () => {
  35 |     test('should display order numbers', async ({ page }) => {
  36 |       await expect(page.getByText(/^ORD-/).first()).toBeVisible({ timeout: 15000 });
  37 |     });
  38 | 
  39 |     test('should show order items with quantities', async ({ page }) => {
  40 |       await expect(page.getByText(/^ORD-/).first()).toBeVisible({ timeout: 15000 });
  41 |       // Order cards show items like "2x" in a span
  42 |       await expect(page.getByText(/^\d+x$/).first()).toBeVisible();
  43 |     });
  44 | 
  45 |     test('should show elapsed time on order cards', async ({ page }) => {
> 46 |       await expect(page.getByText(/^ORD-/).first()).toBeVisible({ timeout: 15000 });
     |                                                     ^ Error: expect(locator).toBeVisible() failed
  47 |       // Elapsed time shown as e.g. "5m", "1h 2m"
  48 |       await expect(page.getByText(/\d+m/).first()).toBeVisible();
  49 |     });
  50 |   });
  51 | 
  52 |   test.describe('Action Buttons', () => {
  53 |     test('should show status transition buttons', async ({ page }) => {
  54 |       await expect(page.getByText(/^ORD-/).first()).toBeVisible({ timeout: 15000 });
  55 |       const actionButtons = page.getByRole('button', { name: /Start Preparing|Mark Ready/ });
  56 |       await expect(actionButtons.first()).toBeVisible();
  57 |     });
  58 | 
  59 |     test('should transition order status when action button clicked', async ({ page }) => {
  60 |       await expect(page.getByText(/^ORD-/).first()).toBeVisible({ timeout: 15000 });
  61 |       const actionButton = page.getByRole('button', { name: /Start Preparing|Mark Ready/ }).first();
  62 |       const buttonText = await actionButton.textContent();
  63 |       await actionButton.click();
  64 |       // After clicking, the order should either change status or disappear
  65 |       // Give time for the API call and re-render
  66 |       await page.waitForTimeout(2000);
  67 |       // The page should still be functional
  68 |       await expect(page.getByRole('heading', { name: 'Kitchen Display' })).toBeVisible();
  69 |     });
  70 |   });
  71 | });
  72 | 
```