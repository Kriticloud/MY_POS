# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: orders.spec.ts >> Orders Page >> should show orders in table
- Location: e2e\orders.spec.ts:36:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('ORD-001')
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByText('ORD-001')

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
      - row "ORD-MPDSOGMW-ED7D Walk-in WALK IN 1 $16.28 PENDING May 20, 2026, 01:53 PM CONFIRMED Cancel":
        - cell "ORD-MPDSOGMW-ED7D"
        - cell "Walk-in"
        - cell "WALK IN"
        - cell "1"
        - cell "$16.28"
        - cell "PENDING"
        - cell "May 20, 2026, 01:53 PM"
        - cell "CONFIRMED Cancel":
          - button:
            - img
          - button "CONFIRMED"
          - button "Cancel"
      - row "ORD-MPDS50R5-9FDE Walk-in DINE IN 1 $16.26 PENDING May 20, 2026, 01:38 PM CONFIRMED Cancel":
        - cell "ORD-MPDS50R5-9FDE"
        - cell "Walk-in"
        - cell "DINE IN"
        - cell "1"
        - cell "$16.26"
        - cell "PENDING"
        - cell "May 20, 2026, 01:38 PM"
        - cell "CONFIRMED Cancel":
          - button:
            - img
          - button "CONFIRMED"
          - button "Cancel"
      - row "ORD-MPDS50M9-D188 Walk-in IN STORE 1 $2.16 PENDING May 20, 2026, 01:38 PM CONFIRMED Cancel":
        - cell "ORD-MPDS50M9-D188"
        - cell "Walk-in"
        - cell "IN STORE"
        - cell "1"
        - cell "$2.16"
        - cell "PENDING"
        - cell "May 20, 2026, 01:38 PM"
        - cell "CONFIRMED Cancel":
          - button:
            - img
          - button "CONFIRMED"
          - button "Cancel"
      - row "ORD-MPDS50KE-530E Walk-in DINE IN 1 $4.34 PENDING May 20, 2026, 01:38 PM CONFIRMED Cancel":
        - cell "ORD-MPDS50KE-530E"
        - cell "Walk-in"
        - cell "DINE IN"
        - cell "1"
        - cell "$4.34"
        - cell "PENDING"
        - cell "May 20, 2026, 01:38 PM"
        - cell "CONFIRMED Cancel":
          - button:
            - img
          - button "CONFIRMED"
          - button "Cancel"
      - row "ORD-MPDS50IL-580F Walk-in IN STORE 1 $59.66 PENDING May 20, 2026, 01:38 PM CONFIRMED Cancel":
        - cell "ORD-MPDS50IL-580F"
        - cell "Walk-in"
        - cell "IN STORE"
        - cell "1"
        - cell "$59.66"
        - cell "PENDING"
        - cell "May 20, 2026, 01:38 PM"
        - cell "CONFIRMED Cancel":
          - button:
            - img
          - button "CONFIRMED"
          - button "Cancel"
      - row "ORD-MPDS50G7-C356 Walk-in WALK IN 1 $86.80 PENDING May 20, 2026, 01:38 PM CONFIRMED Cancel":
        - cell "ORD-MPDS50G7-C356"
        - cell "Walk-in"
        - cell "WALK IN"
        - cell "1"
        - cell "$86.80"
        - cell "PENDING"
        - cell "May 20, 2026, 01:38 PM"
        - cell "CONFIRMED Cancel":
          - button:
            - img
          - button "CONFIRMED"
          - button "Cancel"
      - row "ORD-MPDS4P9O-F879 Walk-in IN STORE 1 $5.41 PENDING May 20, 2026, 01:37 PM CONFIRMED Cancel":
        - cell "ORD-MPDS4P9O-F879"
        - cell "Walk-in"
        - cell "IN STORE"
        - cell "1"
        - cell "$5.41"
        - cell "PENDING"
        - cell "May 20, 2026, 01:37 PM"
        - cell "CONFIRMED Cancel":
          - button:
            - img
          - button "CONFIRMED"
          - button "Cancel"
      - row "ORD-MPCLF59W-A57D Walk-in IN STORE 3 $25.46 COMPLETED May 19, 2026, 05:42 PM":
        - cell "ORD-MPCLF59W-A57D"
        - cell "Walk-in"
        - cell "IN STORE"
        - cell "3"
        - cell "$25.46"
        - cell "COMPLETED"
        - cell "May 19, 2026, 05:42 PM"
        - cell:
          - button:
            - img
      - row "ORD-MPCL3FTT-E035 Walk-in WALK IN 1 $16.28 PENDING May 19, 2026, 05:33 PM CONFIRMED Cancel":
        - cell "ORD-MPCL3FTT-E035"
        - cell "Walk-in"
        - cell "WALK IN"
        - cell "1"
        - cell "$16.28"
        - cell "PENDING"
        - cell "May 19, 2026, 05:33 PM"
        - cell "CONFIRMED Cancel":
          - button:
            - img
          - button "CONFIRMED"
          - button "Cancel"
      - row "ORD-MPCL1FCV-BF7E Walk-in IN STORE 1 $9.75 PENDING May 19, 2026, 05:31 PM CONFIRMED Cancel":
        - cell "ORD-MPCL1FCV-BF7E"
        - cell "Walk-in"
        - cell "IN STORE"
        - cell "1"
        - cell "$9.75"
        - cell "PENDING"
        - cell "May 19, 2026, 05:31 PM"
        - cell "CONFIRMED Cancel":
          - button:
            - img
          - button "CONFIRMED"
          - button "Cancel"
      - row "ORD-MPCL0T0Z-B2C1 Walk-in IN STORE 1 $5.41 PENDING May 19, 2026, 05:31 PM CONFIRMED Cancel":
        - cell "ORD-MPCL0T0Z-B2C1"
        - cell "Walk-in"
        - cell "IN STORE"
        - cell "1"
        - cell "$5.41"
        - cell "PENDING"
        - cell "May 19, 2026, 05:31 PM"
        - cell "CONFIRMED Cancel":
          - button:
            - img
          - button "CONFIRMED"
          - button "Cancel"
      - row "ORD-MPCKXZ66-812E Walk-in IN STORE 1 $5.41 PENDING May 19, 2026, 05:29 PM CONFIRMED Cancel":
        - cell "ORD-MPCKXZ66-812E"
        - cell "Walk-in"
        - cell "IN STORE"
        - cell "1"
        - cell "$5.41"
        - cell "PENDING"
        - cell "May 19, 2026, 05:29 PM"
        - cell "CONFIRMED Cancel":
          - button:
            - img
          - button "CONFIRMED"
          - button "Cancel"
      - row "ORD-MPCKU9T2-4A85 Walk-in PICKUP 1 $59.66 PENDING May 19, 2026, 05:26 PM CONFIRMED Cancel":
        - cell "ORD-MPCKU9T2-4A85"
        - cell "Walk-in"
        - cell "PICKUP"
        - cell "1"
        - cell "$59.66"
        - cell "PENDING"
        - cell "May 19, 2026, 05:26 PM"
        - cell "CONFIRMED Cancel":
          - button:
            - img
          - button "CONFIRMED"
          - button "Cancel"
      - row "ORD-MPCKU9SA-0AE9 Walk-in APPOINTMENT 1 $27.13 PENDING May 19, 2026, 05:26 PM CONFIRMED Cancel":
        - cell "ORD-MPCKU9SA-0AE9"
        - cell "Walk-in"
        - cell "APPOINTMENT"
        - cell "1"
        - cell "$27.13"
        - cell "PENDING"
        - cell "May 19, 2026, 05:26 PM"
        - cell "CONFIRMED Cancel":
          - button:
            - img
          - button "CONFIRMED"
          - button "Cancel"
      - row "ORD-MPCKU9RA-BAD6 Walk-in IN STORE 1 $59.66 PENDING May 19, 2026, 05:26 PM CONFIRMED Cancel":
        - cell "ORD-MPCKU9RA-BAD6"
        - cell "Walk-in"
        - cell "IN STORE"
        - cell "1"
        - cell "$59.66"
        - cell "PENDING"
        - cell "May 19, 2026, 05:26 PM"
        - cell "CONFIRMED Cancel":
          - button:
            - img
          - button "CONFIRMED"
          - button "Cancel"
      - row "ORD-MPCKU21S-5571 Walk-in WALK IN 1 $86.80 PENDING May 19, 2026, 05:25 PM CONFIRMED Cancel":
        - cell "ORD-MPCKU21S-5571"
        - cell "Walk-in"
        - cell "WALK IN"
        - cell "1"
        - cell "$86.80"
        - cell "PENDING"
        - cell "May 19, 2026, 05:25 PM"
        - cell "CONFIRMED Cancel":
          - button:
            - img
          - button "CONFIRMED"
          - button "Cancel"
      - row "ORD-009 John Doe DINE IN 2 $29.26 CONFIRMED May 19, 2026, 04:42 PM PREPARING Cancel":
        - cell "ORD-009"
        - cell "John Doe"
        - cell "DINE IN"
        - cell "2"
        - cell "$29.26"
        - cell "CONFIRMED"
        - cell "May 19, 2026, 04:42 PM"
        - cell "PREPARING Cancel":
          - button:
            - img
          - button "PREPARING"
          - button "Cancel"
      - row "ORD-004 Sarah Williams DINE IN 3 $26.01 READY May 19, 2026, 04:28 PM SERVED Cancel":
        - cell "ORD-004"
        - cell "Sarah Williams"
        - cell "DINE IN"
        - cell "3"
        - cell "$26.01"
        - cell "READY"
        - cell "May 19, 2026, 04:28 PM"
        - cell "SERVED Cancel":
          - button:
            - img
          - button "SERVED"
          - button "Cancel"
      - row "ORD-003 Mike Johnson TAKEAWAY 1 $16.26 PREPARING May 19, 2026, 04:13 PM READY Cancel":
        - cell "ORD-003"
        - cell "Mike Johnson"
        - cell "TAKEAWAY"
        - cell "1"
        - cell "$16.26"
        - cell "PREPARING"
        - cell "May 19, 2026, 04:13 PM"
        - cell "READY Cancel":
          - button:
            - img
          - button "READY"
          - button "Cancel"
      - row "ORD-002 Jane Smith DINE IN 2 $20.04 CONFIRMED May 19, 2026, 03:59 PM PREPARING Cancel":
        - cell "ORD-002"
        - cell "Jane Smith"
        - cell "DINE IN"
        - cell "2"
        - cell "$20.04"
        - cell "CONFIRMED"
        - cell "May 19, 2026, 03:59 PM"
        - cell "PREPARING Cancel":
          - button:
            - img
          - button "PREPARING"
          - button "Cancel"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Orders Page', () => {
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
  14 |     await page.getByRole('textbox').first().fill('admin@mypos.com');
  15 |     await page.getByRole('textbox').nth(1).fill('admin123');
  16 |     await page.getByRole('button', { name: 'Sign In' }).click();
  17 |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  18 |     await page.goto('/orders');
  19 |   });
  20 | 
  21 |   test('should display orders page', async ({ page }) => {
  22 |     await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
  23 |     await expect(page.getByText('Manage and track all orders')).toBeVisible();
  24 |   });
  25 | 
  26 |   test('should display status filter tabs', async ({ page }) => {
  27 |     const filterSection = page.locator('[class*="gap"]').filter({ has: page.getByRole('button', { name: 'ALL' }) }).first();
  28 |     await expect(filterSection.getByRole('button', { name: 'ALL' })).toBeVisible();
  29 |     await expect(filterSection.getByRole('button', { name: 'PENDING' })).toBeVisible();
  30 |     await expect(filterSection.getByRole('button', { name: 'CONFIRMED' })).toBeVisible();
  31 |     await expect(filterSection.getByRole('button', { name: 'PREPARING' })).toBeVisible();
  32 |     await expect(filterSection.getByRole('button', { name: 'READY' })).toBeVisible();
  33 |     await expect(filterSection.getByRole('button', { name: 'COMPLETED' })).toBeVisible();
  34 |   });
  35 | 
  36 |   test('should show orders in table', async ({ page }) => {
  37 |     await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
> 38 |     await expect(page.getByText('ORD-001')).toBeVisible({ timeout: 15000 });
     |                                             ^ Error: expect(locator).toBeVisible() failed
  39 |   });
  40 | 
  41 |   test('should filter orders by status', async ({ page }) => {
  42 |     await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
  43 |     await page.getByRole('button', { name: 'COMPLETED' }).first().click();
  44 |     // Completed orders should show in the table
  45 |     await expect(page.getByRole('cell', { name: 'COMPLETED' }).first()).toBeVisible();
  46 |   });
  47 | 
  48 |   test('should search orders', async ({ page }) => {
  49 |     await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
  50 |     await page.getByPlaceholder('Search orders...').fill('John');
  51 |     await expect(page.getByText('John Doe').first()).toBeVisible();
  52 |   });
  53 | });
  54 | 
```