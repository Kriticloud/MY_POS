# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> Dashboard >> Top Products >> should show product names with ranking
- Location: e2e\dashboard.spec.ts:71:5

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
- link "Skip to main content":
  - /url: "#main-content"
- complementary:
  - img
  - text: MyPOS Restaurant
  - navigation "Main navigation":
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
    - link "Appointments":
      - /url: /appointments
      - img
      - text: Appointments
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
    - link "Suppliers":
      - /url: /suppliers
      - img
      - text: Suppliers
    - link "Cash Drawer":
      - /url: /cash-drawer
      - img
      - text: Cash Drawer
    - link "Memberships":
      - /url: /memberships
      - img
      - text: Memberships
    - link "Discount":
      - /url: /discounts
      - img
      - text: Discount
    - link "Gift Cards":
      - /url: /gift-cards
      - img
      - text: Gift Cards
    - link "Branches":
      - /url: /branches
      - img
      - text: Branches
    - link "Audit Log":
      - /url: /audit-log
      - img
      - text: Audit Log
    - link "Settings":
      - /url: /settings
      - img
      - text: Settings
  - link "Admin User Admin User ADMIN":
    - /url: /profile
    - img "Admin User"
    - paragraph: Admin User
    - paragraph: ADMIN
  - button:
    - img
- main:
  - button "Search or jump to... K":
    - img
    - text: Search or jump to...
    - img
    - text: K
  - button "Switch to dark mode":
    - img
  - button "2":
    - img
    - text: "2"
  - img
  - heading "Good afternoon, Admin!" [level=1]
  - paragraph: Here's what's happening with your business today.
  - img
  - paragraph: 12:41 PM
  - paragraph: Thursday, May 21
  - button "New Order Start taking an order":
    - img
    - paragraph: New Order
    - paragraph: Start taking an order
    - img
  - button "View Orders Check active orders":
    - img
    - paragraph: View Orders
    - paragraph: Check active orders
    - img
  - button "Add Customer Register new customer":
    - img
    - paragraph: Add Customer
    - paragraph: Register new customer
    - img
  - button "Add Product Add to catalog":
    - img
    - paragraph: Add Product
    - paragraph: Add to catalog
    - img
  - img
  - img
  - text: 9 orders
  - paragraph: ₹18,890.83
  - paragraph: Revenue
  - img
  - img
  - text: No data
  - paragraph: "7"
  - paragraph: Today Orders
  - img
  - img
  - text: Per order
  - paragraph: ₹2,098.98
  - paragraph: Total Order
  - img
  - img
  - text: All time
  - paragraph: "9"
  - paragraph: Total Orders
  - heading "Revenue by Day" [level=2]
  - text: ₹0.00 Mon ₹0.00 Tue ₹40,658.91 Wed ₹24,141.51 Thu ₹0.00 Fri ₹0.00 Sat ₹0.00 Sun
  - heading "Payment Methods" [level=2]
  - img
  - text: 1 Methods CASH ₹64,800.14
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
      - row "ORD-MPEGZ8TL-324E Walk-in 1 ₹1,574.77 CONFIRMED May 21, 2026, 01:13 AM":
        - cell "ORD-MPEGZ8TL-324E"
        - cell "Walk-in"
        - cell "1"
        - cell "₹1,574.77"
        - cell "CONFIRMED"
        - cell "May 21, 2026, 01:13 AM"
      - row "ORD-MPEGVU7R-D25A Walk-in 1 ₹1,363.61 CONFIRMED May 21, 2026, 01:10 AM":
        - cell "ORD-MPEGVU7R-D25A"
        - cell "Walk-in"
        - cell "1"
        - cell "₹1,363.61"
        - cell "CONFIRMED"
        - cell "May 21, 2026, 01:10 AM"
      - row "ORD-MPEGHP1B-3EC2 Walk-in 2 ₹1,573.72 READY May 21, 2026, 12:59 AM":
        - cell "ORD-MPEGHP1B-3EC2"
        - cell "Walk-in"
        - cell "2"
        - cell "₹1,573.72"
        - cell "READY"
        - cell "May 21, 2026, 12:59 AM"
      - row "ORD-MPEGD8XZ-67D5 Walk-in 3 ₹4,356.61 PENDING May 21, 2026, 12:56 AM":
        - cell "ORD-MPEGD8XZ-67D5"
        - cell "Walk-in"
        - cell "3"
        - cell "₹4,356.61"
        - cell "PENDING"
        - cell "May 21, 2026, 12:56 AM"
      - row "ORD-MPEFFZJB-1E3D Walk-in 2 ₹2,780.79 PENDING May 21, 2026, 12:30 AM":
        - cell "ORD-MPEFFZJB-1E3D"
        - cell "Walk-in"
        - cell "2"
        - cell "₹2,780.79"
        - cell "PENDING"
        - cell "May 21, 2026, 12:30 AM"
      - row "ORD-MPEFE6WR-7260 Walk-in 4 ₹10,918.31 PENDING May 21, 2026, 12:29 AM":
        - cell "ORD-MPEFE6WR-7260"
        - cell "Walk-in"
        - cell "4"
        - cell "₹10,918.31"
        - cell "PENDING"
        - cell "May 21, 2026, 12:29 AM"
      - row "ORD-MPEFCJ49-DC00 Walk-in 2 ₹1,573.72 PENDING May 21, 2026, 12:27 AM":
        - cell "ORD-MPEFCJ49-DC00"
        - cell "Walk-in"
        - cell "2"
        - cell "₹1,573.72"
        - cell "PENDING"
        - cell "May 21, 2026, 12:27 AM"
      - row "ORD-MPE8E0KP-93FA Walk-in 1 ₹1,049.49 COMPLETED May 20, 2026, 09:13 PM":
        - cell "ORD-MPE8E0KP-93FA"
        - cell "Walk-in"
        - cell "1"
        - cell "₹1,049.49"
        - cell "COMPLETED"
        - cell "May 20, 2026, 09:13 PM"
  - heading "Top Products" [level=2]
  - text: "1"
  - paragraph: Antacid Tablets (60)
  - paragraph: 33 sold
  - paragraph: ₹628.39
  - text: "2"
  - paragraph: Espresso
  - paragraph: 12 sold
  - paragraph: ₹338.89
  - text: "3"
  - paragraph: Allergy Relief (30)
  - paragraph: 8 sold
  - paragraph: ₹967.28
  - text: "4"
  - paragraph: Cappuccino
  - paragraph: 7 sold
  - paragraph: ₹435.71
  - text: "5"
  - paragraph: Adhesive Bandages (50)
  - paragraph: 7 sold
  - paragraph: ₹483.15
  - heading "Recent Activity" [level=2]:
    - img
    - text: Recent Activity
  - text: Live
  - img
  - paragraph: "New order #ORD-045 placed"
  - text: 2 min ago
  - img
  - paragraph: Payment of $32.50 received
  - text: 5 min ago
  - img
  - paragraph: "New customer registered: Mike Lee"
  - text: 12 min ago
  - img
  - paragraph: "Order #ORD-044 completed"
  - text: 18 min ago
  - img
  - paragraph: "Stock updated: Cappuccino +20"
  - text: 25 min ago
  - img
  - paragraph: Refund of $12.00 processed
  - text: 30 min ago
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
  9  |         json.data = json.data.map((s: any) => s.key === 'businessType' ? { ...s, value: 'RESTAURANT' } : s);
  10 |       }
  11 |       await route.fulfill({ json });
  12 |     });
  13 |     await page.goto('/dashboard');
  14 |   });
  15 | 
  16 |   test.afterEach(async ({ page }) => {
  17 |     await page.unrouteAll({ behavior: 'ignoreErrors' });
  18 |   });
  19 | 
  20 |   test.describe('Page Header', () => {
  21 |     test('should display greeting and welcome message', async ({ page }) => {
  22 |       // Dashboard shows a greeting like "Good morning, Admin!"
  23 |       await expect(page.getByText(/Good (morning|afternoon|evening|night)/)).toBeVisible({ timeout: 15000 });
  24 |       await expect(page.getByText(/Here's what's happening/)).toBeVisible();
  25 |     });
  26 |   });
  27 | 
  28 |   test.describe('Stats Cards', () => {
  29 |     test('should display stat cards', async ({ page }) => {
  30 |       await expect(page.getByText('Revenue')).toBeVisible({ timeout: 15000 });
  31 |       await expect(page.getByText(/Today.*Orders/)).toBeVisible();
  32 |       await expect(page.getByText(/Total.*Order/)).toBeVisible();
  33 |     });
  34 | 
  35 |     test('should display revenue with dollar sign', async ({ page }) => {
  36 |       await expect(page.getByText('Revenue')).toBeVisible({ timeout: 15000 });
  37 |       // Revenue card should contain a dollar amount
  38 |       await expect(page.getByText(/\$[\d,.]+/).first()).toBeVisible();
  39 |     });
  40 |   });
  41 | 
  42 |   test.describe('Recent Orders Table', () => {
  43 |     test('should display recent orders section with table', async ({ page }) => {
  44 |       await expect(page.getByRole('heading', { name: /Recent Orders/ })).toBeVisible({ timeout: 15000 });
  45 |       await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
  46 |     });
  47 | 
  48 |     test('should show order data with order numbers', async ({ page }) => {
  49 |       await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
  50 |       await expect(page.getByText(/^ORD-/).first()).toBeVisible();
  51 |     });
  52 | 
  53 |     test('should display order status badges', async ({ page }) => {
  54 |       await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
  55 |       // At least one status badge should be present
  56 |       const statusBadge = page.getByText(/COMPLETED|CONFIRMED|PREPARING|READY|PENDING|SERVED/).first();
  57 |       await expect(statusBadge).toBeVisible();
  58 |     });
  59 | 
  60 |     test('should have View All button that navigates to orders', async ({ page }) => {
  61 |       await page.getByRole('button', { name: 'View All' }).click();
  62 |       await expect(page).toHaveURL(/\/orders/);
  63 |     });
  64 |   });
  65 | 
  66 |   test.describe('Top Products', () => {
  67 |     test('should display top products section', async ({ page }) => {
  68 |       await expect(page.getByRole('heading', { name: /Top Products/ })).toBeVisible({ timeout: 15000 });
  69 |     });
  70 | 
  71 |     test('should show product names with ranking', async ({ page }) => {
> 72 |       await expect(page.getByText('Classic Burger')).toBeVisible({ timeout: 15000 });
     |                                                      ^ Error: expect(locator).toBeVisible() failed
  73 |     });
  74 |   });
  75 | });
  76 | 
```