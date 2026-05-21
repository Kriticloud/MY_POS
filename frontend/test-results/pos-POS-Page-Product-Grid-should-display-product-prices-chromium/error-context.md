# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pos.spec.ts >> POS Page >> Product Grid >> should display product prices
- Location: e2e\pos.spec.ts:30:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('$3.50').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('$3.50').first()

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
  - textbox "Search products..."
  - button:
    - img
  - button "Customer Display":
    - img
  - button "🍽️ All"
  - button "☕ Beverages"
  - button "🍔 Food"
  - button "🍰 Desserts"
  - button "🍟 Snacks"
  - button "🎁 Combos"
  - button "🥞 Breakfast"
  - button "Burger Combo Burger Combo ₹1,451.40":
    - button:
      - img
    - img "Burger Combo"
    - paragraph: Burger Combo
    - paragraph: ₹1,451.40
  - button "Cappuccino Cappuccino ₹435.71":
    - button:
      - img
    - img "Cappuccino"
    - paragraph: Cappuccino
    - paragraph: ₹435.71
  - button "Chicken Sandwich Chicken Sandwich ₹822.04":
    - button:
      - img
    - img "Chicken Sandwich"
    - paragraph: Chicken Sandwich
    - paragraph: ₹822.04
  - button "Chocolate Cake Chocolate Cake ₹676.80":
    - button:
      - img
    - img "Chocolate Cake"
    - paragraph: Chocolate Cake
    - paragraph: ₹676.80
  - button "Classic Burger Classic Burger ₹967.28":
    - button:
      - img
    - img "Classic Burger"
    - paragraph: Classic Burger
    - paragraph: ₹967.28
  - button "Espresso Espresso ₹338.89":
    - button:
      - img
    - img "Espresso"
    - paragraph: Espresso
    - paragraph: ₹338.89
  - button "French Fries French Fries ₹386.33":
    - button:
      - img
    - img "French Fries"
    - paragraph: French Fries
    - paragraph: ₹386.33
  - button "Latte Latte ₹483.15":
    - button:
      - img
    - img "Latte"
    - paragraph: Latte
    - paragraph: ₹483.15
  - button "Margherita Pizza Margherita Pizza ₹1,257.75":
    - button:
      - img
    - img "Margherita Pizza"
    - paragraph: Margherita Pizza
    - paragraph: ₹1,257.75
  - button "Pancake Stack Pancake Stack ₹773.63":
    - button:
      - img
    - img "Pancake Stack"
    - paragraph: Pancake Stack
    - paragraph: ₹773.63
  - heading "Cart (0)" [level=2]:
    - img
    - text: Cart (0)
  - button "DINE IN"
  - button "TAKEAWAY"
  - button "DELIVERY"
  - button "ONLINE"
  - button "Select Customer":
    - img
    - text: Select Customer
  - text: Cart is empty
  - button "Discount":
    - img
    - text: Discount
  - button "Hold" [disabled]:
    - img
    - text: Hold
  - text: Subtotal ₹0.00 Tax (8.5%) ₹0.00 Total ₹0.00
  - button "Charge ₹0.00" [disabled]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('POS Page', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.route('**/api/settings', async (route) => {
  6   |       const response = await route.fetch();
  7   |       const json = await response.json();
  8   |       if (json.data) {
  9   |         json.data = json.data.map((s: any) => s.key === 'businessType' ? { ...s, value: 'RESTAURANT' } : s);
  10  |       }
  11  |       await route.fulfill({ json });
  12  |     });
  13  |     await page.goto('/pos');
  14  |   });
  15  | 
  16  |   test.afterEach(async ({ page }) => {
  17  |     await page.unrouteAll({ behavior: 'ignoreErrors' });
  18  |   });
  19  | 
  20  |   test.describe('Product Grid', () => {
  21  |     test('should display product search input', async ({ page }) => {
  22  |       await expect(page.getByPlaceholder(/Search products/i)).toBeVisible();
  23  |     });
  24  | 
  25  |     test('should display products after loading', async ({ page }) => {
  26  |       await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  27  |       await expect(page.getByText('Classic Burger')).toBeVisible();
  28  |     });
  29  | 
  30  |     test('should display product prices', async ({ page }) => {
  31  |       await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
> 32  |       await expect(page.getByText('$3.50').first()).toBeVisible();
      |                                                     ^ Error: expect(locator).toBeVisible() failed
  33  |     });
  34  |   });
  35  | 
  36  |   test.describe('Category Filters', () => {
  37  |     test('should display category filter buttons', async ({ page }) => {
  38  |       await expect(page.getByRole('button', { name: /All/ })).toBeVisible({ timeout: 15000 });
  39  |       await expect(page.getByRole('button', { name: /Beverages/ })).toBeVisible({ timeout: 15000 });
  40  |       await expect(page.getByRole('button', { name: /Food/ })).toBeVisible({ timeout: 15000 });
  41  |     });
  42  | 
  43  |     test('should filter products by Food category', async ({ page }) => {
  44  |       await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  45  |       await page.getByRole('button', { name: /Food/ }).click();
  46  |       await expect(page.getByText('Classic Burger')).toBeVisible();
  47  |       await expect(page.getByText('Espresso')).not.toBeVisible();
  48  |     });
  49  | 
  50  |     test('should filter products by Beverages category', async ({ page }) => {
  51  |       await expect(page.getByText('Classic Burger')).toBeVisible({ timeout: 15000 });
  52  |       await page.getByRole('button', { name: /Beverages/ }).click();
  53  |       await expect(page.getByText('Espresso')).toBeVisible();
  54  |       await expect(page.getByText('Classic Burger')).not.toBeVisible();
  55  |     });
  56  | 
  57  |     test('should show all products when All category is selected', async ({ page }) => {
  58  |       await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  59  |       await page.getByRole('button', { name: /Food/ }).click();
  60  |       await expect(page.getByText('Espresso')).not.toBeVisible();
  61  |       await page.getByRole('button', { name: /All/ }).click();
  62  |       await expect(page.getByText('Espresso')).toBeVisible();
  63  |       await expect(page.getByText('Classic Burger')).toBeVisible();
  64  |     });
  65  |   });
  66  | 
  67  |   test.describe('Search', () => {
  68  |     test('should filter products by search term', async ({ page }) => {
  69  |       await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  70  |       await page.getByPlaceholder(/Search products/i).fill('burger');
  71  |       await expect(page.getByText('Classic Burger')).toBeVisible();
  72  |       await expect(page.getByText('Espresso')).not.toBeVisible();
  73  |     });
  74  | 
  75  |     test('should show all products when search is cleared', async ({ page }) => {
  76  |       await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  77  |       await page.getByPlaceholder(/Search products/i).fill('burger');
  78  |       await expect(page.getByText('Espresso')).not.toBeVisible();
  79  |       await page.getByPlaceholder(/Search products/i).clear();
  80  |       await expect(page.getByText('Espresso')).toBeVisible();
  81  |     });
  82  |   });
  83  | 
  84  |   test.describe('Cart', () => {
  85  |     test('should add product to cart on click', async ({ page }) => {
  86  |       await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  87  |       await page.getByText('Espresso').first().click();
  88  |       await expect(page.getByText('Cart (1)')).toBeVisible();
  89  |     });
  90  | 
  91  |     test('should show correct price in cart', async ({ page }) => {
  92  |       await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  93  |       await page.getByText('Espresso').first().click();
  94  |       await expect(page.getByText('Cart (1)')).toBeVisible();
  95  |       await expect(page.getByText('$3.50').first()).toBeVisible();
  96  |     });
  97  | 
  98  |     test('should increment quantity when adding same product', async ({ page }) => {
  99  |       const productGrid = page.locator('.grid.grid-cols-2');
  100 |       await expect(productGrid.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  101 |       await productGrid.getByText('Espresso').first().click();
  102 |       await expect(page.getByText('Cart (1)')).toBeVisible();
  103 |       await productGrid.getByText('Espresso').first().click();
  104 |       // Cart still shows (1) unique item, but quantity should be 2
  105 |       await expect(page.getByText('$7.00').first()).toBeVisible();
  106 |     });
  107 | 
  108 |     test('should add multiple different products to cart', async ({ page }) => {
  109 |       await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  110 |       await page.getByText('Espresso').first().click();
  111 |       await page.getByText('Classic Burger').first().click();
  112 |       await expect(page.getByText('Cart (2)')).toBeVisible();
  113 |     });
  114 | 
  115 |     test('should clear cart when Clear button is clicked', async ({ page }) => {
  116 |       await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  117 |       await page.getByText('Espresso').first().click();
  118 |       await expect(page.getByText('Cart (1)')).toBeVisible();
  119 |       await page.getByRole('button', { name: /Clear/i }).click();
  120 |       await expect(page.getByText('Cart (0)')).toBeVisible();
  121 |     });
  122 | 
  123 |     test('should show subtotal, tax, and total', async ({ page }) => {
  124 |       await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  125 |       await page.getByText('Espresso').first().click();
  126 |       await expect(page.getByText(/Subtotal/)).toBeVisible();
  127 |       await expect(page.getByText(/Tax/)).toBeVisible();
  128 |       await expect(page.getByText(/Total/)).toBeVisible();
  129 |     });
  130 | 
  131 |     test('should show Charge button with total amount', async ({ page }) => {
  132 |       await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
```