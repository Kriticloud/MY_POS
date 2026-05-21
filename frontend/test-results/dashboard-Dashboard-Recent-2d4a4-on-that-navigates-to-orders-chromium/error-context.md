# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> Dashboard >> Recent Orders Table >> should have View All button that navigates to orders
- Location: e2e\dashboard.spec.ts:68:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect.toHaveURL: Target page, context or browser has been closed
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to main content" [ref=e4] [cursor=pointer]:
    - /url: "#main-content"
  - complementary [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]:
        - img [ref=e9]
        - generic [ref=e13]: MyPOS Restaurant
      - navigation "Main navigation" [ref=e14]:
        - link "Dashboard" [ref=e15] [cursor=pointer]:
          - /url: /dashboard
          - img [ref=e16]
          - text: Dashboard
        - link "POS" [ref=e21] [cursor=pointer]:
          - /url: /pos
          - img [ref=e22]
          - text: POS
        - link "Orders" [ref=e26] [cursor=pointer]:
          - /url: /orders
          - img [ref=e27]
          - text: Orders
        - link "Tables" [ref=e30] [cursor=pointer]:
          - /url: /tables
          - img [ref=e31]
          - text: Tables
        - link "Kitchen" [ref=e36] [cursor=pointer]:
          - /url: /kitchen
          - img [ref=e37]
          - text: Kitchen
        - link "Products" [ref=e39] [cursor=pointer]:
          - /url: /products
          - img [ref=e40]
          - text: Products
        - link "Customers" [ref=e44] [cursor=pointer]:
          - /url: /customers
          - img [ref=e45]
          - text: Customers
        - link "Appointments" [ref=e50] [cursor=pointer]:
          - /url: /appointments
          - img [ref=e51]
          - text: Appointments
        - link "Reports" [ref=e53] [cursor=pointer]:
          - /url: /reports
          - img [ref=e54]
          - text: Reports
        - link "Employees" [ref=e56] [cursor=pointer]:
          - /url: /employees
          - img [ref=e57]
          - text: Employees
        - link "Inventory" [ref=e69] [cursor=pointer]:
          - /url: /inventory
          - img [ref=e70]
          - text: Inventory
        - link "Suppliers" [ref=e73] [cursor=pointer]:
          - /url: /suppliers
          - img [ref=e74]
          - text: Suppliers
        - link "Cash Drawer" [ref=e79] [cursor=pointer]:
          - /url: /cash-drawer
          - img [ref=e80]
          - text: Cash Drawer
        - link "Memberships" [ref=e82] [cursor=pointer]:
          - /url: /memberships
          - img [ref=e83]
          - text: Memberships
        - link "Discount" [ref=e85] [cursor=pointer]:
          - /url: /discounts
          - img [ref=e86]
          - text: Discount
        - link "Gift Cards" [ref=e89] [cursor=pointer]:
          - /url: /gift-cards
          - img [ref=e90]
          - text: Gift Cards
        - link "Branches" [ref=e94] [cursor=pointer]:
          - /url: /branches
          - img [ref=e95]
          - text: Branches
        - link "Audit Log" [ref=e99] [cursor=pointer]:
          - /url: /audit-log
          - img [ref=e100]
          - text: Audit Log
        - link "Settings" [ref=e103] [cursor=pointer]:
          - /url: /settings
          - img [ref=e104]
          - text: Settings
      - generic [ref=e108]:
        - link "Admin User Admin User ADMIN" [ref=e109] [cursor=pointer]:
          - /url: /profile
          - img "Admin User" [ref=e111]
          - generic [ref=e112]:
            - paragraph [ref=e113]: Admin User
            - paragraph [ref=e114]: ADMIN
        - button [ref=e115] [cursor=pointer]:
          - img [ref=e116]
  - main [ref=e119]:
    - generic [ref=e120]:
      - button "Search or jump to... K" [ref=e121] [cursor=pointer]:
        - img [ref=e122]
        - generic [ref=e125]: Search or jump to...
        - generic [ref=e126]:
          - img [ref=e127]
          - text: K
      - button "Switch to dark mode" [ref=e129] [cursor=pointer]:
        - img [ref=e130]
      - button "2" [ref=e133] [cursor=pointer]:
        - img [ref=e134]
        - generic [ref=e137]: "2"
    - generic [ref=e139]:
      - generic [ref=e140]:
        - generic [ref=e141]:
          - generic [ref=e142]:
            - img [ref=e143]
            - heading "Good afternoon, Admin!" [level=1] [ref=e149]
          - paragraph [ref=e150]: Here's what's happening with your business today.
        - generic [ref=e151]:
          - img [ref=e152]
          - generic [ref=e155]:
            - paragraph [ref=e156]: 01:05 PM
            - paragraph [ref=e157]: Thursday, May 21
      - generic [ref=e158]:
        - button "New Order Start taking an order" [ref=e159] [cursor=pointer]:
          - img [ref=e162]
          - paragraph [ref=e166]: New Order
          - paragraph [ref=e167]: Start taking an order
          - img [ref=e168]
        - button "View Orders Check active orders" [ref=e170] [cursor=pointer]:
          - img [ref=e173]
          - paragraph [ref=e176]: View Orders
          - paragraph [ref=e177]: Check active orders
          - img [ref=e178]
        - button "Add Customer Register new customer" [ref=e180] [cursor=pointer]:
          - img [ref=e183]
          - paragraph [ref=e188]: Add Customer
          - paragraph [ref=e189]: Register new customer
          - img [ref=e190]
        - button "Add Product Add to catalog" [ref=e192] [cursor=pointer]:
          - img [ref=e195]
          - paragraph [ref=e199]: Add Product
          - paragraph [ref=e200]: Add to catalog
          - img [ref=e201]
      - generic [ref=e203]:
        - generic [ref=e204]:
          - generic [ref=e205]:
            - img [ref=e207]
            - generic [ref=e209]:
              - img [ref=e210]
              - text: 9 orders
          - paragraph [ref=e213]: $195.10
          - paragraph [ref=e214]: Revenue
        - generic [ref=e215]:
          - generic [ref=e216]:
            - img [ref=e218]
            - generic [ref=e221]:
              - img [ref=e222]
              - text: No data
          - paragraph [ref=e225]: "7"
          - paragraph [ref=e226]: Today Orders
        - generic [ref=e227]:
          - generic [ref=e228]:
            - img [ref=e230]
            - generic [ref=e233]:
              - img [ref=e234]
              - text: Per order
          - paragraph [ref=e237]: $21.68
          - paragraph [ref=e238]: Total Order
        - generic [ref=e239]:
          - generic [ref=e240]:
            - img [ref=e242]
            - generic [ref=e247]:
              - img [ref=e248]
              - text: All time
          - paragraph [ref=e251]: "9"
          - paragraph [ref=e252]: Total Orders
      - generic [ref=e253]:
        - generic [ref=e254]:
          - heading "Revenue by Day" [level=2] [ref=e255]
          - paragraph [ref=e256]: No revenue data yet
        - generic [ref=e257]:
          - heading "Payment Methods" [level=2] [ref=e258]
          - paragraph [ref=e259]: No payment data yet
      - generic [ref=e260]:
        - generic [ref=e262]:
          - heading "Recent Orders" [level=2] [ref=e263]
          - button "View All" [active] [ref=e264] [cursor=pointer]
        - heading "Top Products" [level=2] [ref=e270]
      - generic [ref=e273]:
        - generic [ref=e274]:
          - heading "Recent Activity" [level=2] [ref=e275]:
            - img [ref=e276]
            - text: Recent Activity
          - generic [ref=e279]: Live
        - generic [ref=e281]:
          - generic [ref=e282]:
            - img [ref=e284]
            - paragraph [ref=e288]: "New order #ORD-045 placed"
            - generic [ref=e289]: 2 min ago
          - generic [ref=e290]:
            - img [ref=e292]
            - paragraph [ref=e295]: Payment of $32.50 received
            - generic [ref=e296]: 5 min ago
          - generic [ref=e297]:
            - img [ref=e299]
            - paragraph [ref=e303]: "New customer registered: Mike Lee"
            - generic [ref=e304]: 12 min ago
          - generic [ref=e305]:
            - img [ref=e307]
            - paragraph [ref=e311]: "Order #ORD-044 completed"
            - generic [ref=e312]: 18 min ago
          - generic [ref=e313]:
            - img [ref=e315]
            - paragraph [ref=e320]: "Stock updated: Cappuccino +20"
            - generic [ref=e321]: 25 min ago
          - generic [ref=e322]:
            - img [ref=e324]
            - paragraph [ref=e327]: Refund of $12.00 processed
            - generic [ref=e328]: 30 min ago
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Dashboard', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.route('**/api/settings', async (route) => {
  6  |       const response = await route.fetch();
  7  |       const json = await response.json();
  8  |       if (json.data) {
  9  |         json.data = json.data.map((s: any) => {
  10 |           if (s.key === 'businessType') return { ...s, value: 'RESTAURANT' };
  11 |           if (s.key === 'currency') return { ...s, value: 'USD' };
  12 |           return s;
  13 |         });
  14 |       }
  15 |       await route.fulfill({ json });
  16 |     });
  17 |     await page.addInitScript(() => {
  18 |       localStorage.removeItem('mypos-settings');
  19 |       localStorage.removeItem('i18n-storage');
  20 |     });
  21 |     await page.goto('/dashboard');
  22 |   });
  23 | 
  24 |   test.afterEach(async ({ page }) => {
  25 |     await page.unrouteAll({ behavior: 'ignoreErrors' });
  26 |   });
  27 | 
  28 |   test.describe('Page Header', () => {
  29 |     test('should display greeting and welcome message', async ({ page }) => {
  30 |       // Dashboard shows a greeting like "Good morning, Admin!"
  31 |       await expect(page.getByText(/Good (morning|afternoon|evening|night)/)).toBeVisible({ timeout: 15000 });
  32 |       await expect(page.getByText(/Here's what's happening/)).toBeVisible();
  33 |     });
  34 |   });
  35 | 
  36 |   test.describe('Stats Cards', () => {
  37 |     test('should display stat cards', async ({ page }) => {
  38 |       await expect(page.getByText('Revenue', { exact: true })).toBeVisible({ timeout: 15000 });
  39 |       await expect(page.getByText(/Today.*Orders/)).toBeVisible();
  40 |       await expect(page.getByText(/Total.*Order/).first()).toBeVisible();
  41 |     });
  42 | 
  43 |     test('should display revenue with dollar sign', async ({ page }) => {
  44 |       await expect(page.getByText('Revenue', { exact: true })).toBeVisible({ timeout: 15000 });
  45 |       // Revenue card should contain a dollar amount
  46 |       await expect(page.getByText(/\$[\d,.]+/).first()).toBeVisible();
  47 |     });
  48 |   });
  49 | 
  50 |   test.describe('Recent Orders Table', () => {
  51 |     test('should display recent orders section with table', async ({ page }) => {
  52 |       await expect(page.getByRole('heading', { name: /Recent Orders/ })).toBeVisible({ timeout: 15000 });
  53 |       await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
  54 |     });
  55 | 
  56 |     test('should show order data with order numbers', async ({ page }) => {
  57 |       await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
  58 |       await expect(page.getByText(/^ORD-/).first()).toBeVisible();
  59 |     });
  60 | 
  61 |     test('should display order status badges', async ({ page }) => {
  62 |       await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
  63 |       // At least one status badge should be present
  64 |       const statusBadge = page.getByText(/COMPLETED|CONFIRMED|PREPARING|READY|PENDING|SERVED/).first();
  65 |       await expect(statusBadge).toBeVisible();
  66 |     });
  67 | 
  68 |     test('should have View All button that navigates to orders', async ({ page }) => {
  69 |       await page.getByRole('button', { name: 'View All' }).click();
> 70 |       await expect(page).toHaveURL(/\/orders/);
     |                          ^ Error: expect.toHaveURL: Target page, context or browser has been closed
  71 |     });
  72 |   });
  73 | 
  74 |   test.describe('Top Products', () => {
  75 |     test('should display top products section', async ({ page }) => {
  76 |       await expect(page.getByRole('heading', { name: /Top Products/ })).toBeVisible({ timeout: 15000 });
  77 |     });
  78 | 
  79 |     test('should show product names with ranking', async ({ page }) => {
  80 |       // Check that at least one product name appears in the top products list
  81 |       await expect(page.getByText(/Espresso|Classic Burger|Cappuccino|Antacid|Burger Combo/).first()).toBeVisible({ timeout: 15000 });
  82 |     });
  83 |   });
  84 | });
  85 | 
```