# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pos.spec.ts >> POS Page >> should display category filters
- Location: e2e\pos.spec.ts:28:3

# Error details

```
Error: "route.fetch: Target page, context or browser has been closed
Call log:
  - → GET http://localhost:5173/api/settings
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.96 Safari/537.36
    - accept: application/json, text/plain, */*
    - accept-encoding: gzip,deflate,br
    - accept-language: en-US
    - authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmZTMxMDNkOC0wNDY3LTRlODYtOTcxOS03NTg4YTg0ZjkzNzAiLCJlbWFpbCI6ImFkbWluQG15cG9zLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3OTI2NjgxNywiZXhwIjoxNzc5MjcwNDE3fQ.eJD2nvRok7qWiWE83OVWEjleYm4RCo96rgNObX2Ce2s
    - referer: http://localhost:5173/pos
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
        - generic [ref=e88]:
          - generic [ref=e89]:
            - img [ref=e90]
            - textbox "Search products..." [ref=e93]
          - button [ref=e94] [cursor=pointer]:
            - img [ref=e95]
        - generic [ref=e100]:
          - button "🍽️ All" [ref=e101] [cursor=pointer]:
            - generic [ref=e102]: 🍽️
            - text: All
          - button "☕ Beverages" [ref=e103] [cursor=pointer]:
            - generic [ref=e104]: ☕
            - text: Beverages
          - button "🍔 Food" [ref=e105] [cursor=pointer]:
            - generic [ref=e106]: 🍔
            - text: Food
          - button "🍰 Desserts" [ref=e107] [cursor=pointer]:
            - generic [ref=e108]: 🍰
            - text: Desserts
          - button "🍟 Snacks" [ref=e109] [cursor=pointer]:
            - generic [ref=e110]: 🍟
            - text: Snacks
          - button "🎁 Combos" [ref=e111] [cursor=pointer]:
            - generic [ref=e112]: 🎁
            - text: Combos
          - button "🥞 Breakfast" [ref=e113] [cursor=pointer]:
            - generic [ref=e114]: 🥞
            - text: Breakfast
        - generic [ref=e115]:
          - button "📦 Burger Combo $14.99" [ref=e116] [cursor=pointer]:
            - generic [ref=e117]: 📦
            - paragraph [ref=e118]: Burger Combo
            - paragraph [ref=e120]: $14.99
          - button "📦 Cappuccino $4.50" [ref=e121] [cursor=pointer]:
            - generic [ref=e122]: 📦
            - paragraph [ref=e123]: Cappuccino
            - paragraph [ref=e125]: $4.50
          - button "📦 Chicken Sandwich $8.49" [ref=e126] [cursor=pointer]:
            - generic [ref=e127]: 📦
            - paragraph [ref=e128]: Chicken Sandwich
            - paragraph [ref=e130]: $8.49
          - button "📦 Chocolate Cake $6.99" [ref=e131] [cursor=pointer]:
            - generic [ref=e132]: 📦
            - paragraph [ref=e133]: Chocolate Cake
            - paragraph [ref=e135]: $6.99
          - button "📦 Classic Burger $9.99" [ref=e136] [cursor=pointer]:
            - generic [ref=e137]: 📦
            - paragraph [ref=e138]: Classic Burger
            - paragraph [ref=e140]: $9.99
          - button "📦 Espresso $3.50" [ref=e141] [cursor=pointer]:
            - generic [ref=e142]: 📦
            - paragraph [ref=e143]: Espresso
            - paragraph [ref=e145]: $3.50
          - button "📦 French Fries $3.99" [ref=e146] [cursor=pointer]:
            - generic [ref=e147]: 📦
            - paragraph [ref=e148]: French Fries
            - paragraph [ref=e150]: $3.99
          - button "📦 Latte $4.99" [ref=e151] [cursor=pointer]:
            - generic [ref=e152]: 📦
            - paragraph [ref=e153]: Latte
            - paragraph [ref=e155]: $4.99
          - button "📦 Margherita Pizza $12.99" [ref=e156] [cursor=pointer]:
            - generic [ref=e157]: 📦
            - paragraph [ref=e158]: Margherita Pizza
            - paragraph [ref=e160]: $12.99
          - button "📦 Pancake Stack $7.99" [ref=e161] [cursor=pointer]:
            - generic [ref=e162]: 📦
            - paragraph [ref=e163]: Pancake Stack
            - paragraph [ref=e165]: $7.99
      - generic [ref=e166]:
        - generic [ref=e167]:
          - heading "Cart (0)" [level=2] [ref=e169]:
            - img [ref=e170]
            - text: Cart (0)
          - generic [ref=e173]:
            - button "DINE IN" [ref=e174] [cursor=pointer]
            - button "TAKEAWAY" [ref=e175] [cursor=pointer]
            - button "DELIVERY" [ref=e176] [cursor=pointer]
            - button "ONLINE" [ref=e177] [cursor=pointer]
          - button "Select Customer" [ref=e178] [cursor=pointer]:
            - img [ref=e179]
            - generic [ref=e182]: Select Customer
        - generic [ref=e184]: Cart is empty
        - generic [ref=e185]:
          - button "Discount" [ref=e186] [cursor=pointer]:
            - img [ref=e187]
            - text: Discount
          - generic [ref=e191]:
            - generic [ref=e192]: Subtotal
            - generic [ref=e193]: $0.00
          - generic [ref=e194]:
            - generic [ref=e195]: Tax (8.5%)
            - generic [ref=e196]: $0.00
          - generic [ref=e197]:
            - generic [ref=e198]: Total
            - generic [ref=e199]: $0.00
          - button "Charge $0.00" [disabled] [ref=e200]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('POS Page', () => {
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
  18 |     await page.goto('/pos');
  19 |   });
  20 | 
  21 |   test('should display products grid', async ({ page }) => {
  22 |     await expect(page.getByPlaceholder('Search products...')).toBeVisible();
  23 |     // Wait for products to load
  24 |     await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  25 |     await expect(page.getByText('Classic Burger')).toBeVisible();
  26 |   });
  27 | 
  28 |   test('should display category filters', async ({ page }) => {
  29 |     await expect(page.getByRole('button', { name: /All/ })).toBeVisible({ timeout: 15000 });
  30 |     await expect(page.getByRole('button', { name: /Beverages/ })).toBeVisible({ timeout: 15000 });
  31 |     await expect(page.getByRole('button', { name: /Food/ })).toBeVisible({ timeout: 15000 });
  32 |   });
  33 | 
  34 |   test('should filter products by category', async ({ page }) => {
  35 |     await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  36 |     await page.getByRole('button', { name: /Food/ }).click();
  37 |     // Food items should be visible
  38 |     await expect(page.getByText('Classic Burger')).toBeVisible();
  39 |     // Beverages should be hidden
  40 |     await expect(page.getByText('Espresso')).not.toBeVisible();
  41 |   });
  42 | 
  43 |   test('should add product to cart', async ({ page }) => {
  44 |     await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  45 |     // Click on Espresso product card
  46 |     await page.getByText('Espresso').first().click();
  47 |     // Cart should update
  48 |     await expect(page.getByText('Cart (1)')).toBeVisible();
  49 |     await expect(page.getByText('$3.50').first()).toBeVisible();
  50 |   });
  51 | 
  52 |   test('should show order type toggle', async ({ page }) => {
  53 |     await expect(page.getByRole('button', { name: 'DINE IN' })).toBeVisible();
  54 |     await expect(page.getByRole('button', { name: 'TAKEAWAY' })).toBeVisible();
  55 |     await expect(page.getByRole('button', { name: 'DELIVERY' })).toBeVisible();
  56 |   });
  57 | 
  58 |   test('should search products', async ({ page }) => {
  59 |     await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  60 |     await page.getByPlaceholder('Search products...').fill('burger');
  61 |     await expect(page.getByText('Classic Burger')).toBeVisible();
  62 |     await expect(page.getByText('Espresso')).not.toBeVisible();
  63 |   });
  64 | });
  65 | 
```