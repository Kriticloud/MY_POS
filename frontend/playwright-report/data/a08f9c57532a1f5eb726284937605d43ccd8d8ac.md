# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: kitchen.spec.ts >> Kitchen Page >> should display kitchen display page
- Location: e2e\kitchen.spec.ts:21:3

# Error details

```
Error: apiResponse.json: Response has been disposed
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img [ref=e8]
        - generic [ref=e12]: MyPOS Restaurant
      - navigation [ref=e13]:
        - link "Dashboard" [ref=e14] [cursor=pointer]:
          - /url: /dashboard
          - img [ref=e15]
          - text: Dashboard
        - link "POS" [ref=e20] [cursor=pointer]:
          - /url: /pos
          - img [ref=e21]
          - text: POS
        - link "Orders" [ref=e25] [cursor=pointer]:
          - /url: /orders
          - img [ref=e26]
          - text: Orders
        - link "Tables" [ref=e29] [cursor=pointer]:
          - /url: /tables
          - img [ref=e30]
          - text: Tables
        - link "Kitchen" [ref=e35] [cursor=pointer]:
          - /url: /kitchen
          - img [ref=e36]
          - text: Kitchen
        - link "Products" [ref=e38] [cursor=pointer]:
          - /url: /products
          - img [ref=e39]
          - text: Products
        - link "Customers" [ref=e43] [cursor=pointer]:
          - /url: /customers
          - img [ref=e44]
          - text: Customers
        - link "Reports" [ref=e49] [cursor=pointer]:
          - /url: /reports
          - img [ref=e50]
          - text: Reports
        - link "Employees" [ref=e52] [cursor=pointer]:
          - /url: /employees
          - img [ref=e53]
          - text: Employees
        - link "Inventory" [ref=e65] [cursor=pointer]:
          - /url: /inventory
          - img [ref=e66]
          - text: Inventory
        - link "Settings" [ref=e69] [cursor=pointer]:
          - /url: /settings
          - img [ref=e70]
          - text: Settings
      - generic [ref=e74]:
        - generic [ref=e76]: AU
        - generic [ref=e77]:
          - paragraph [ref=e78]: Admin User
          - paragraph [ref=e79]: ADMIN
        - button [ref=e80] [cursor=pointer]:
          - img [ref=e81]
  - main [ref=e84]:
    - generic [ref=e86]:
      - generic [ref=e87]:
        - generic [ref=e88]:
          - heading "Kitchen Display" [level=1] [ref=e89]
          - paragraph [ref=e90]: Active orders in the kitchen
        - generic [ref=e91]: Live
      - generic [ref=e93]:
        - generic [ref=e94]:
          - generic [ref=e95]:
            - generic [ref=e96]:
              - generic [ref=e97]: ORD-002
              - generic [ref=e98]: Table 8
            - generic [ref=e99]:
              - img [ref=e100]
              - text: 2h 30m
          - generic [ref=e103]:
            - generic [ref=e104]:
              - generic [ref=e105]: 1x
              - paragraph [ref=e107]: Chicken Sandwich
            - generic [ref=e108]:
              - generic [ref=e109]: 2x
              - paragraph [ref=e111]: Latte
          - button "Start Preparing" [ref=e113] [cursor=pointer]:
            - img [ref=e114]
            - text: Start Preparing
        - generic [ref=e116]:
          - generic [ref=e117]:
            - generic [ref=e119]: ORD-003
            - generic [ref=e120]:
              - img [ref=e121]
              - text: 2h 15m
          - generic [ref=e125]:
            - generic [ref=e126]: 1x
            - paragraph [ref=e128]: Burger Combo
          - button "Mark Ready" [ref=e130] [cursor=pointer]:
            - img [ref=e131]
            - text: Mark Ready
        - generic [ref=e134]:
          - generic [ref=e135]:
            - generic [ref=e136]:
              - generic [ref=e137]: ORD-009
              - generic [ref=e138]: Table 5
            - generic [ref=e139]:
              - img [ref=e140]
              - text: 1h 46m
          - generic [ref=e143]:
            - generic [ref=e144]:
              - generic [ref=e145]: 1x
              - paragraph [ref=e147]: Margherita Pizza
            - generic [ref=e148]:
              - generic [ref=e149]: 2x
              - paragraph [ref=e151]: Chocolate Cake
            - paragraph [ref=e152]: "Order note: Birthday celebration"
          - button "Start Preparing" [ref=e154] [cursor=pointer]:
            - img [ref=e155]
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
> 7  |       const json = await response.json();
     |                                   ^ Error: apiResponse.json: Response has been disposed
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
  18 |     await page.goto('/kitchen');
  19 |   });
  20 | 
  21 |   test('should display kitchen display page', async ({ page }) => {
  22 |     await expect(page.getByRole('heading', { name: 'Kitchen Display' })).toBeVisible();
  23 |     await expect(page.getByText('Live')).toBeVisible();
  24 |   });
  25 | 
  26 |   test('should show active orders', async ({ page }) => {
  27 |     // Kitchen shows CONFIRMED and PREPARING orders
  28 |     await expect(page.getByText('ORD-').first()).toBeVisible({ timeout: 15000 });
  29 |   });
  30 | 
  31 |   test('should show action buttons for orders', async ({ page }) => {
  32 |     await expect(page.getByText('ORD-').first()).toBeVisible({ timeout: 15000 });
  33 |     // Should have at least one action button
  34 |     const actionButtons = page.getByRole('button', { name: /Start Preparing|Mark Ready/ });
  35 |     await expect(actionButtons.first()).toBeVisible();
  36 |   });
  37 | });
  38 | 
```