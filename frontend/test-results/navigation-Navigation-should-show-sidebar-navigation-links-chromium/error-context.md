# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Navigation >> should show sidebar navigation links
- Location: e2e\navigation.spec.ts:47:3

# Error details

```
Error: "route.fetch: Target page, context or browser has been closed
Call log:
  - → GET http://localhost:5173/api/settings
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.96 Safari/537.36
    - accept: application/json, text/plain, */*
    - accept-encoding: gzip,deflate,br
    - accept-language: en-US
    - authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmZTMxMDNkOC0wNDY3LTRlODYtOTcxOS03NTg4YTg0ZjkzNzAiLCJlbWFpbCI6ImFkbWluQG15cG9zLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3OTI2NjYwOSwiZXhwIjoxNzc5MjcwMjA5fQ.Imp5UVzUD9b46MT3ZLCAy4dAVbi7JXws4JHOsXXgNac
    - referer: http://localhost:5173/dashboard
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
      - generic [ref=e87]:
        - heading "Dashboard" [level=1] [ref=e88]
        - paragraph [ref=e89]: Welcome back! Here's what's happening today.
      - generic [ref=e90]:
        - generic [ref=e91]:
          - generic [ref=e92]:
            - img [ref=e94]
            - generic [ref=e96]:
              - img [ref=e97]
              - text: +12.5%
          - paragraph [ref=e100]: $184.26
          - paragraph [ref=e101]: Total Revenue
        - generic [ref=e102]:
          - generic [ref=e103]:
            - img [ref=e105]
            - generic [ref=e108]:
              - img [ref=e109]
              - text: +8.2%
          - paragraph [ref=e112]: "0"
          - paragraph [ref=e113]: Today's Orders
        - generic [ref=e114]:
          - generic [ref=e115]:
            - img [ref=e117]
            - generic [ref=e120]:
              - img [ref=e121]
              - text: +5.7%
          - paragraph [ref=e124]: $23.03
          - paragraph [ref=e125]: Avg Order Value
        - generic [ref=e126]:
          - generic [ref=e127]:
            - img [ref=e129]
            - generic [ref=e134]:
              - img [ref=e135]
              - text: +4.1%
          - paragraph [ref=e138]: "8"
          - paragraph [ref=e139]: Total Orders
      - generic [ref=e140]:
        - generic [ref=e141]:
          - generic [ref=e142]:
            - heading "Recent Orders" [level=2] [ref=e143]
            - button "View All" [ref=e144] [cursor=pointer]
          - table [ref=e146]:
            - rowgroup [ref=e147]:
              - row "Order Customer Items Total Status Date" [ref=e148]:
                - columnheader "Order" [ref=e149]
                - columnheader "Customer" [ref=e150]
                - columnheader "Items" [ref=e151]
                - columnheader "Total" [ref=e152]
                - columnheader "Status" [ref=e153]
                - columnheader "Date" [ref=e154]
            - rowgroup [ref=e155]:
              - row "ORD-MPDSOGMW-ED7D Walk-in 1 $16.28 PENDING May 20, 2026, 01:53 PM" [ref=e156]:
                - cell "ORD-MPDSOGMW-ED7D" [ref=e157]
                - cell "Walk-in" [ref=e158]
                - cell "1" [ref=e159]
                - cell "$16.28" [ref=e160]
                - cell "PENDING" [ref=e161]
                - cell "May 20, 2026, 01:53 PM" [ref=e162]
              - row "ORD-MPDS50R5-9FDE Walk-in 1 $16.26 PENDING May 20, 2026, 01:38 PM" [ref=e163]:
                - cell "ORD-MPDS50R5-9FDE" [ref=e164]
                - cell "Walk-in" [ref=e165]
                - cell "1" [ref=e166]
                - cell "$16.26" [ref=e167]
                - cell "PENDING" [ref=e168]
                - cell "May 20, 2026, 01:38 PM" [ref=e169]
              - row "ORD-MPDS50M9-D188 Walk-in 1 $2.16 PENDING May 20, 2026, 01:38 PM" [ref=e170]:
                - cell "ORD-MPDS50M9-D188" [ref=e171]
                - cell "Walk-in" [ref=e172]
                - cell "1" [ref=e173]
                - cell "$2.16" [ref=e174]
                - cell "PENDING" [ref=e175]
                - cell "May 20, 2026, 01:38 PM" [ref=e176]
              - row "ORD-MPDS50KE-530E Walk-in 1 $4.34 PENDING May 20, 2026, 01:38 PM" [ref=e177]:
                - cell "ORD-MPDS50KE-530E" [ref=e178]
                - cell "Walk-in" [ref=e179]
                - cell "1" [ref=e180]
                - cell "$4.34" [ref=e181]
                - cell "PENDING" [ref=e182]
                - cell "May 20, 2026, 01:38 PM" [ref=e183]
              - row "ORD-MPDS50IL-580F Walk-in 1 $59.66 PENDING May 20, 2026, 01:38 PM" [ref=e184]:
                - cell "ORD-MPDS50IL-580F" [ref=e185]
                - cell "Walk-in" [ref=e186]
                - cell "1" [ref=e187]
                - cell "$59.66" [ref=e188]
                - cell "PENDING" [ref=e189]
                - cell "May 20, 2026, 01:38 PM" [ref=e190]
              - row "ORD-MPDS50G7-C356 Walk-in 1 $86.80 PENDING May 20, 2026, 01:38 PM" [ref=e191]:
                - cell "ORD-MPDS50G7-C356" [ref=e192]
                - cell "Walk-in" [ref=e193]
                - cell "1" [ref=e194]
                - cell "$86.80" [ref=e195]
                - cell "PENDING" [ref=e196]
                - cell "May 20, 2026, 01:38 PM" [ref=e197]
              - row "ORD-MPDS4P9O-F879 Walk-in 1 $5.41 PENDING May 20, 2026, 01:37 PM" [ref=e198]:
                - cell "ORD-MPDS4P9O-F879" [ref=e199]
                - cell "Walk-in" [ref=e200]
                - cell "1" [ref=e201]
                - cell "$5.41" [ref=e202]
                - cell "PENDING" [ref=e203]
                - cell "May 20, 2026, 01:37 PM" [ref=e204]
              - row "ORD-MPCLF59W-A57D Walk-in 3 $25.46 COMPLETED May 19, 2026, 05:42 PM" [ref=e205]:
                - cell "ORD-MPCLF59W-A57D" [ref=e206]
                - cell "Walk-in" [ref=e207]
                - cell "3" [ref=e208]
                - cell "$25.46" [ref=e209]
                - cell "COMPLETED" [ref=e210]
                - cell "May 19, 2026, 05:42 PM" [ref=e211]
        - generic [ref=e212]:
          - heading "Top Products" [level=2] [ref=e214]
          - generic [ref=e215]:
            - generic [ref=e216]:
              - generic [ref=e217]:
                - generic [ref=e218]: "1"
                - generic [ref=e219]:
                  - paragraph [ref=e220]: Latte
                  - paragraph [ref=e221]: 5 sold
              - paragraph [ref=e222]: $4.99
            - generic [ref=e223]:
              - generic [ref=e224]:
                - generic [ref=e225]: "2"
                - generic [ref=e226]:
                  - paragraph [ref=e227]: Espresso
                  - paragraph [ref=e228]: 4 sold
              - paragraph [ref=e229]: $3.50
            - generic [ref=e230]:
              - generic [ref=e231]:
                - generic [ref=e232]: "3"
                - generic [ref=e233]:
                  - paragraph [ref=e234]: Margherita Pizza
                  - paragraph [ref=e235]: 4 sold
              - paragraph [ref=e236]: $12.99
            - generic [ref=e237]:
              - generic [ref=e238]:
                - generic [ref=e239]: "4"
                - generic [ref=e240]:
                  - paragraph [ref=e241]: French Fries
                  - paragraph [ref=e242]: 4 sold
              - paragraph [ref=e243]: $3.99
            - generic [ref=e244]:
              - generic [ref=e245]:
                - generic [ref=e246]: "5"
                - generic [ref=e247]:
                  - paragraph [ref=e248]: Classic Burger
                  - paragraph [ref=e249]: 4 sold
              - paragraph [ref=e250]: $9.99
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Navigation', () => {
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
  18 |   });
  19 | 
  20 |   test('should navigate to all pages', async ({ page }) => {
  21 |     // Navigate via URL since sidebar may be offscreen in test viewport
  22 |     await page.goto('/pos');
  23 |     await expect(page.getByPlaceholder('Search products...')).toBeVisible();
  24 | 
  25 |     await page.goto('/orders');
  26 |     await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
  27 | 
  28 |     await page.goto('/tables');
  29 |     await expect(page.getByRole('heading', { name: 'Tables' })).toBeVisible();
  30 | 
  31 |     await page.goto('/kitchen');
  32 |     await expect(page.getByRole('heading', { name: 'Kitchen Display' })).toBeVisible();
  33 | 
  34 |     await page.goto('/products');
  35 |     await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  36 | 
  37 |     await page.goto('/customers');
  38 |     await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible();
  39 | 
  40 |     await page.goto('/reports');
  41 |     await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible();
  42 | 
  43 |     await page.goto('/settings');
  44 |     await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  45 |   });
  46 | 
  47 |   test('should show sidebar navigation links', async ({ page }) => {
  48 |     // Use a wider viewport to ensure sidebar is visible
  49 |     await page.setViewportSize({ width: 1280, height: 720 });
  50 |     await page.goto('/dashboard');
  51 |     await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  52 |     await expect(page.getByRole('link', { name: 'POS' })).toBeVisible();
  53 |     await expect(page.getByRole('link', { name: 'Orders' })).toBeVisible();
  54 |     await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
  55 |     await expect(page.getByRole('link', { name: 'Customers' })).toBeVisible();
  56 |   });
  57 | 
  58 |   test('should display user info in sidebar', async ({ page }) => {
  59 |     await page.setViewportSize({ width: 1280, height: 720 });
  60 |     await page.goto('/dashboard');
  61 |     await expect(page.getByText('Admin User')).toBeVisible();
  62 |     await expect(page.getByText('ADMIN', { exact: true })).toBeVisible();
  63 |   });
  64 | });
  65 | 
```