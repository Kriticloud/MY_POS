# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pos.spec.ts >> POS Page >> should show order type toggle
- Location: e2e\pos.spec.ts:44:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'DELIVERY' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: 'DELIVERY' })

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
    - link "Appointments":
      - /url: /orders
      - img
      - text: Appointments
    - link "Stations":
      - /url: /tables
      - img
      - text: Stations
    - link "Services":
      - /url: /products
      - img
      - text: Services
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
  - img
  - textbox "Search products..."
  - button:
    - img
  - button "🍽️ All"
  - button "☕ Beverages"
  - button "✂️ Haircuts"
  - button "🍔 Food"
  - button "🪒 Beard & Shave"
  - button "🍰 Desserts"
  - button "💇 Hair Styling"
  - button "🍟 Snacks"
  - button "💆 Spa & Massage"
  - button "🎁 Combos"
  - button "💅 Nail Art"
  - button "🥞 Breakfast"
  - button "🧖 Skin Care"
  - button "🎁 Packages"
  - button "📦 Aromatherapy Spa ₹80.00":
    - text: 📦
    - paragraph: Aromatherapy Spa
    - paragraph: ₹80.00
  - button "📦 Beard Coloring ₹25.00":
    - text: 📦
    - paragraph: Beard Coloring
    - paragraph: ₹25.00
  - button "📦 Beard Trim ₹15.00":
    - text: 📦
    - paragraph: Beard Trim
    - paragraph: ₹15.00
  - button "📦 Blowdry & Style ₹30.00":
    - text: 📦
    - paragraph: Blowdry & Style
    - paragraph: ₹30.00
  - button "📦 Bridal Package ₹199.00":
    - text: 📦
    - paragraph: Bridal Package
    - paragraph: ₹199.00
  - button "📦 Burger Combo ₹14.99":
    - text: 📦
    - paragraph: Burger Combo
    - paragraph: ₹14.99
  - button "📦 Buzz Cut ₹15.00":
    - text: 📦
    - paragraph: Buzz Cut
    - paragraph: ₹15.00
  - button "📦 Cappuccino ₹4.50":
    - text: 📦
    - paragraph: Cappuccino
    - paragraph: ₹4.50
  - button "📦 Chicken Sandwich ₹8.49":
    - text: 📦
    - paragraph: Chicken Sandwich
    - paragraph: ₹8.49
  - button "📦 Chocolate Cake ₹6.99":
    - text: 📦
    - paragraph: Chocolate Cake
    - paragraph: ₹6.99
  - button "📦 Classic Burger ₹9.99":
    - text: 📦
    - paragraph: Classic Burger
    - paragraph: ₹9.99
  - button "📦 Clean Shave ₹20.00":
    - text: 📦
    - paragraph: Clean Shave
    - paragraph: ₹20.00
  - button "📦 Espresso ₹3.50":
    - text: 📦
    - paragraph: Espresso
    - paragraph: ₹3.50
  - button "📦 Facial ₹45.00":
    - text: 📦
    - paragraph: Facial
    - paragraph: ₹45.00
  - button "📦 French Fries ₹3.99":
    - text: 📦
    - paragraph: French Fries
    - paragraph: ₹3.99
  - button "📦 Full Body Massage ₹60.00":
    - text: 📦
    - paragraph: Full Body Massage
    - paragraph: ₹60.00
  - button "📦 Gel Nails ₹40.00":
    - text: 📦
    - paragraph: Gel Nails
    - paragraph: ₹40.00
  - button "📦 Groom Package ₹50.00":
    - text: 📦
    - paragraph: Groom Package
    - paragraph: ₹50.00
  - button "📦 Hair Coloring ₹65.00":
    - text: 📦
    - paragraph: Hair Coloring
    - paragraph: ₹65.00
  - button "📦 Head Massage ₹20.00":
    - text: 📦
    - paragraph: Head Massage
    - paragraph: ₹20.00
  - button "📦 Highlights ₹85.00":
    - text: 📦
    - paragraph: Highlights
    - paragraph: ₹85.00
  - button "📦 Keratin Treatment ₹120.00":
    - text: 📦
    - paragraph: Keratin Treatment
    - paragraph: ₹120.00
  - button "📦 Kids' Haircut ₹15.00":
    - text: 📦
    - paragraph: Kids' Haircut
    - paragraph: ₹15.00
  - button "📦 Latte ₹4.99":
    - text: 📦
    - paragraph: Latte
    - paragraph: ₹4.99
  - button "📦 Manicure ₹25.00":
    - text: 📦
    - paragraph: Manicure
    - paragraph: ₹25.00
  - button "📦 Margherita Pizza ₹12.99":
    - text: 📦
    - paragraph: Margherita Pizza
    - paragraph: ₹12.99
  - button "📦 Men's Haircut ₹25.00":
    - text: 📦
    - paragraph: Men's Haircut
    - paragraph: ₹25.00
  - button "📦 Nail Art Design ₹50.00":
    - text: 📦
    - paragraph: Nail Art Design
    - paragraph: ₹50.00
  - button "📦 Pamper Package ₹150.00":
    - text: 📦
    - paragraph: Pamper Package
    - paragraph: ₹150.00
  - button "📦 Pancake Stack ₹7.99":
    - text: 📦
    - paragraph: Pancake Stack
    - paragraph: ₹7.99
  - button "📦 Pedicure ₹35.00":
    - text: 📦
    - paragraph: Pedicure
    - paragraph: ₹35.00
  - button "📦 Threading (Eyebrows) ₹10.00":
    - text: 📦
    - paragraph: Threading (Eyebrows)
    - paragraph: ₹10.00
  - button "📦 Waxing (Full Legs) ₹35.00":
    - text: 📦
    - paragraph: Waxing (Full Legs)
    - paragraph: ₹35.00
  - button "📦 Women's Haircut ₹45.00":
    - text: 📦
    - paragraph: Women's Haircut
    - paragraph: ₹45.00
  - heading "Cart (0)" [level=2]:
    - img
    - text: Cart (0)
  - button "WALK IN"
  - button "APPOINTMENT"
  - button "ONLINE"
  - button "Select Customer":
    - img
    - text: Select Customer
  - text: Cart is empty
  - button "Discount":
    - img
    - text: Discount
  - text: Subtotal ₹0.00 Tax (8.5%) ₹0.00 Total ₹0.00
  - button "Charge ₹0.00" [disabled]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('POS Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/login');
  6  |     await page.getByRole('textbox').first().fill('admin@mypos.com');
  7  |     await page.getByRole('textbox').nth(1).fill('admin123');
  8  |     await page.getByRole('button', { name: 'Sign In' }).click();
  9  |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  10 |     await page.goto('/pos');
  11 |   });
  12 | 
  13 |   test('should display products grid', async ({ page }) => {
  14 |     await expect(page.getByPlaceholder('Search products...')).toBeVisible();
  15 |     // Wait for products to load
  16 |     await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  17 |     await expect(page.getByText('Classic Burger')).toBeVisible();
  18 |   });
  19 | 
  20 |   test('should display category filters', async ({ page }) => {
  21 |     await expect(page.getByRole('button', { name: /All/ })).toBeVisible({ timeout: 15000 });
  22 |     await expect(page.getByRole('button', { name: /Beverages/ })).toBeVisible({ timeout: 15000 });
  23 |     await expect(page.getByRole('button', { name: /Food/ })).toBeVisible({ timeout: 15000 });
  24 |   });
  25 | 
  26 |   test('should filter products by category', async ({ page }) => {
  27 |     await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  28 |     await page.getByRole('button', { name: /Food/ }).click();
  29 |     // Food items should be visible
  30 |     await expect(page.getByText('Classic Burger')).toBeVisible();
  31 |     // Beverages should be hidden
  32 |     await expect(page.getByText('Espresso')).not.toBeVisible();
  33 |   });
  34 | 
  35 |   test('should add product to cart', async ({ page }) => {
  36 |     await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  37 |     // Click on Espresso product card
  38 |     await page.getByText('Espresso').first().click();
  39 |     // Cart should update
  40 |     await expect(page.getByText('Cart (1)')).toBeVisible();
  41 |     await expect(page.getByText('$3.50').first()).toBeVisible();
  42 |   });
  43 | 
  44 |   test('should show order type toggle', async ({ page }) => {
  45 |     await expect(page.getByRole('button', { name: 'DINE IN' })).toBeVisible();
  46 |     await expect(page.getByRole('button', { name: 'TAKEAWAY' })).toBeVisible();
> 47 |     await expect(page.getByRole('button', { name: 'DELIVERY' })).toBeVisible();
     |                                                                  ^ Error: expect(locator).toBeVisible() failed
  48 |   });
  49 | 
  50 |   test('should search products', async ({ page }) => {
  51 |     await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  52 |     await page.getByPlaceholder('Search products...').fill('burger');
  53 |     await expect(page.getByText('Classic Burger')).toBeVisible();
  54 |     await expect(page.getByText('Espresso')).not.toBeVisible();
  55 |   });
  56 | });
  57 | 
```