# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Navigation >> should navigate to all pages
- Location: e2e\navigation.spec.ts:20:3

# Error details

```
Error: "route.fetch: Target page, context or browser has been closed
Call log:
  - → GET http://localhost:5173/api/settings
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.96 Safari/537.36
    - accept: application/json, text/plain, */*
    - accept-encoding: gzip,deflate,br
    - accept-language: en-US
    - authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzJhMTlkYi0wMWMwLTRiZjgtOWJmYi0wNzZiMWY1NjQ2YTciLCJlbWFpbCI6ImFkbWluQG15cG9zLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3OTE4NDA3MSwiZXhwIjoxNzc5MTg3NjcxfQ.yCuxoHi13YR7xGk2kYjNH3cvRjyXWYKYt07RrsgAz0Q
    - referer: http://localhost:5173/settings
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
    - generic [ref=e87]:
      - heading "Settings" [level=1] [ref=e88]
      - navigation [ref=e89]:
        - button "Business" [ref=e90] [cursor=pointer]:
          - img [ref=e91]
          - text: Business
        - button "Printing" [ref=e96] [cursor=pointer]:
          - img [ref=e97]
          - text: Printing
        - button "Localization" [ref=e101] [cursor=pointer]:
          - img [ref=e102]
          - text: Localization
        - button "Appearance" [ref=e105] [cursor=pointer]:
          - img [ref=e106]
          - text: Appearance
        - button "Notifications" [ref=e112] [cursor=pointer]:
          - img [ref=e113]
          - text: Notifications
        - button "Security" [ref=e116] [cursor=pointer]:
          - img [ref=e117]
          - text: Security
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