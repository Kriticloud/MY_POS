# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: orders.spec.ts >> Orders Page >> should search orders
- Location: e2e\orders.spec.ts:48:3

# Error details

```
Error: "route.fetch: Target page, context or browser has been closed
Call log:
  - → GET http://localhost:5173/api/settings
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.96 Safari/537.36
    - accept: application/json, text/plain, */*
    - accept-encoding: gzip,deflate,br
    - accept-language: en-US
    - authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmZTMxMDNkOC0wNDY3LTRlODYtOTcxOS03NTg4YTg0ZjkzNzAiLCJlbWFpbCI6ImFkbWluQG15cG9zLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3OTI2Njc3NywiZXhwIjoxNzc5MjcwMzc3fQ.FcmwlH78FA7bKJEQDX_sweg4m20D9gIFUjAZo-KZihY
    - referer: http://localhost:5173/orders
    - sec-ch-ua: "Chromium";v="148", "HeadlessChrome";v="148", "Not/A)Brand";v="99"
    - sec-ch-ua-mobile: ?0
    - sec-ch-ua-platform: "Windows"
" while running route callback.
Consider awaiting `await page.unrouteAll({ behavior: 'ignoreErrors' })`
before the end of the test to ignore remaining routes in flight.
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
      - generic [ref=e88]:
        - heading "Orders" [level=1] [ref=e89]
        - paragraph [ref=e90]: Manage and track all orders
      - generic [ref=e91]:
        - generic [ref=e92]:
          - img [ref=e93]
          - textbox "Search orders..." [active] [ref=e96]: John
        - generic [ref=e97]:
          - button "ALL" [ref=e98] [cursor=pointer]
          - button "PENDING" [ref=e99] [cursor=pointer]
          - button "CONFIRMED" [ref=e100] [cursor=pointer]
          - button "PREPARING" [ref=e101] [cursor=pointer]
          - button "READY" [ref=e102] [cursor=pointer]
          - button "SERVED" [ref=e103] [cursor=pointer]
          - button "COMPLETED" [ref=e104] [cursor=pointer]
          - button "CANCELLED" [ref=e105] [cursor=pointer]
      - table [ref=e108]:
        - rowgroup [ref=e109]:
          - row "Order Customer Type Items Total Status Date Actions" [ref=e110]:
            - columnheader "Order" [ref=e111]
            - columnheader "Customer" [ref=e112]
            - columnheader "Type" [ref=e113]
            - columnheader "Items" [ref=e114]
            - columnheader "Total" [ref=e115]
            - columnheader "Status" [ref=e116]
            - columnheader "Date" [ref=e117]
            - columnheader "Actions" [ref=e118]
        - rowgroup [ref=e119]:
          - row "ORD-009 John Doe DINE IN 2 $29.26 CONFIRMED May 19, 2026, 04:42 PM PREPARING Cancel" [ref=e120]:
            - cell "ORD-009" [ref=e121]
            - cell "John Doe" [ref=e122]
            - cell "DINE IN" [ref=e123]
            - cell "2" [ref=e124]
            - cell "$29.26" [ref=e125]
            - cell "CONFIRMED" [ref=e126]
            - cell "May 19, 2026, 04:42 PM" [ref=e127]
            - cell "PREPARING Cancel" [ref=e128]:
              - generic [ref=e129]:
                - button [ref=e130] [cursor=pointer]:
                  - img [ref=e131]
                - button "PREPARING" [ref=e134] [cursor=pointer]
                - button "Cancel" [ref=e135] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Orders Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.route('**/api/settings', async (route) => {
> 6  |       const response = await route.fetch();
     |                                    ^ Error: "route.fetch: Target page, context or browser has been closed
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
  38 |     await expect(page.getByText('ORD-001')).toBeVisible({ timeout: 15000 });
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