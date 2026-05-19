# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: products.spec.ts >> Products Page >> should display product list
- Location: e2e\products.spec.ts:19:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Mango Smoothie')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Mango Smoothie')

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
  - heading "Products" [level=1]
  - paragraph: Manage your product catalog
  - button "Add Product":
    - img
    - text: Add Product
  - img
  - textbox "Search by name, SKU, or barcode..."
  - table:
    - rowgroup:
      - row "Product SKU Category Price Cost Actions":
        - columnheader "Product"
        - columnheader "SKU"
        - columnheader "Category"
        - columnheader "Price"
        - columnheader "Cost"
        - columnheader "Actions"
    - rowgroup:
      - row "📦 Aromatherapy Spa 700016 SAL-016 Spa & Massage ₹80.00 ₹15.00":
        - cell "📦 Aromatherapy Spa 700016":
          - text: 📦
          - paragraph: Aromatherapy Spa
          - paragraph: "700016"
        - cell "SAL-016"
        - cell "Spa & Massage"
        - cell "₹80.00"
        - cell "₹15.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Beard Coloring 700008 SAL-008 Beard & Shave ₹25.00 ₹8.00":
        - cell "📦 Beard Coloring 700008":
          - text: 📦
          - paragraph: Beard Coloring
          - paragraph: "700008"
        - cell "SAL-008"
        - cell "Beard & Shave"
        - cell "₹25.00"
        - cell "₹8.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Beard Trim 700006 SAL-006 Beard & Shave ₹15.00 ₹3.00":
        - cell "📦 Beard Trim 700006":
          - text: 📦
          - paragraph: Beard Trim
          - paragraph: "700006"
        - cell "SAL-006"
        - cell "Beard & Shave"
        - cell "₹15.00"
        - cell "₹3.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Blowdry & Style 700012 SAL-012 Hair Styling ₹30.00 ₹5.00":
        - cell "📦 Blowdry & Style 700012":
          - text: 📦
          - paragraph: Blowdry & Style
          - paragraph: "700012"
        - cell "SAL-012"
        - cell "Hair Styling"
        - cell "₹30.00"
        - cell "₹5.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Bridal Package 700027 SAL-027 Packages ₹199.00 ₹40.00":
        - cell "📦 Bridal Package 700027":
          - text: 📦
          - paragraph: Bridal Package
          - paragraph: "700027"
        - cell "SAL-027"
        - cell "Packages"
        - cell "₹199.00"
        - cell "₹40.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Burger Combo 500001 CMB-001 Combos ₹14.99 ₹5.50":
        - cell "📦 Burger Combo 500001":
          - text: 📦
          - paragraph: Burger Combo
          - paragraph: "500001"
        - cell "CMB-001"
        - cell "Combos"
        - cell "₹14.99"
        - cell "₹5.50"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Buzz Cut 700004 SAL-004 Haircuts ₹15.00 ₹3.00":
        - cell "📦 Buzz Cut 700004":
          - text: 📦
          - paragraph: Buzz Cut
          - paragraph: "700004"
        - cell "SAL-004"
        - cell "Haircuts"
        - cell "₹15.00"
        - cell "₹3.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Cappuccino 100002 BEV-002 Beverages ₹4.50 ₹1.50":
        - cell "📦 Cappuccino 100002":
          - text: 📦
          - paragraph: Cappuccino
          - paragraph: "100002"
        - cell "BEV-002"
        - cell "Beverages"
        - cell "₹4.50"
        - cell "₹1.50"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Chicken Sandwich 200002 FOOD-002 Food ₹8.49 ₹3.50":
        - cell "📦 Chicken Sandwich 200002":
          - text: 📦
          - paragraph: Chicken Sandwich
          - paragraph: "200002"
        - cell "FOOD-002"
        - cell "Food"
        - cell "₹8.49"
        - cell "₹3.50"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Chocolate Cake 300001 DES-001 Desserts ₹6.99 ₹2.50":
        - cell "📦 Chocolate Cake 300001":
          - text: 📦
          - paragraph: Chocolate Cake
          - paragraph: "300001"
        - cell "DES-001"
        - cell "Desserts"
        - cell "₹6.99"
        - cell "₹2.50"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Classic Burger 200001 FOOD-001 Food ₹9.99 ₹4.00":
        - cell "📦 Classic Burger 200001":
          - text: 📦
          - paragraph: Classic Burger
          - paragraph: "200001"
        - cell "FOOD-001"
        - cell "Food"
        - cell "₹9.99"
        - cell "₹4.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Clean Shave 700007 SAL-007 Beard & Shave ₹20.00 ₹4.00":
        - cell "📦 Clean Shave 700007":
          - text: 📦
          - paragraph: Clean Shave
          - paragraph: "700007"
        - cell "SAL-007"
        - cell "Beard & Shave"
        - cell "₹20.00"
        - cell "₹4.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Espresso 100001 BEV-001 Beverages ₹3.50 ₹1.00":
        - cell "📦 Espresso 100001":
          - text: 📦
          - paragraph: Espresso
          - paragraph: "100001"
        - cell "BEV-001"
        - cell "Beverages"
        - cell "₹3.50"
        - cell "₹1.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Facial 700022 SAL-022 Skin Care ₹45.00 ₹10.00":
        - cell "📦 Facial 700022":
          - text: 📦
          - paragraph: Facial
          - paragraph: "700022"
        - cell "SAL-022"
        - cell "Skin Care"
        - cell "₹45.00"
        - cell "₹10.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 French Fries 400001 SNK-001 Snacks ₹3.99 ₹1.00":
        - cell "📦 French Fries 400001":
          - text: 📦
          - paragraph: French Fries
          - paragraph: "400001"
        - cell "SNK-001"
        - cell "Snacks"
        - cell "₹3.99"
        - cell "₹1.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Full Body Massage 700015 SAL-015 Spa & Massage ₹60.00 ₹10.00":
        - cell "📦 Full Body Massage 700015":
          - text: 📦
          - paragraph: Full Body Massage
          - paragraph: "700015"
        - cell "SAL-015"
        - cell "Spa & Massage"
        - cell "₹60.00"
        - cell "₹10.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Gel Nails 700020 SAL-020 Nail Art ₹40.00 ₹10.00":
        - cell "📦 Gel Nails 700020":
          - text: 📦
          - paragraph: Gel Nails
          - paragraph: "700020"
        - cell "SAL-020"
        - cell "Nail Art"
        - cell "₹40.00"
        - cell "₹10.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Groom Package 700026 SAL-026 Packages ₹50.00 ₹10.00":
        - cell "📦 Groom Package 700026":
          - text: 📦
          - paragraph: Groom Package
          - paragraph: "700026"
        - cell "SAL-026"
        - cell "Packages"
        - cell "₹50.00"
        - cell "₹10.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Hair Coloring 700009 SAL-009 Hair Styling ₹65.00 ₹15.00":
        - cell "📦 Hair Coloring 700009":
          - text: 📦
          - paragraph: Hair Coloring
          - paragraph: "700009"
        - cell "SAL-009"
        - cell "Hair Styling"
        - cell "₹65.00"
        - cell "₹15.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Head Massage 700014 SAL-014 Spa & Massage ₹20.00 ₹3.00":
        - cell "📦 Head Massage 700014":
          - text: 📦
          - paragraph: Head Massage
          - paragraph: "700014"
        - cell "SAL-014"
        - cell "Spa & Massage"
        - cell "₹20.00"
        - cell "₹3.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Highlights 700010 SAL-010 Hair Styling ₹85.00 ₹20.00":
        - cell "📦 Highlights 700010":
          - text: 📦
          - paragraph: Highlights
          - paragraph: "700010"
        - cell "SAL-010"
        - cell "Hair Styling"
        - cell "₹85.00"
        - cell "₹20.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Keratin Treatment 700011 SAL-011 Hair Styling ₹120.00 ₹30.00":
        - cell "📦 Keratin Treatment 700011":
          - text: 📦
          - paragraph: Keratin Treatment
          - paragraph: "700011"
        - cell "SAL-011"
        - cell "Hair Styling"
        - cell "₹120.00"
        - cell "₹30.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Kids' Haircut 700003 SAL-003 Haircuts ₹15.00 ₹3.00":
        - cell "📦 Kids' Haircut 700003":
          - text: 📦
          - paragraph: Kids' Haircut
          - paragraph: "700003"
        - cell "SAL-003"
        - cell "Haircuts"
        - cell "₹15.00"
        - cell "₹3.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Latte 100003 BEV-003 Beverages ₹4.99 ₹1.50":
        - cell "📦 Latte 100003":
          - text: 📦
          - paragraph: Latte
          - paragraph: "100003"
        - cell "BEV-003"
        - cell "Beverages"
        - cell "₹4.99"
        - cell "₹1.50"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Manicure 700018 SAL-018 Nail Art ₹25.00 ₹5.00":
        - cell "📦 Manicure 700018":
          - text: 📦
          - paragraph: Manicure
          - paragraph: "700018"
        - cell "SAL-018"
        - cell "Nail Art"
        - cell "₹25.00"
        - cell "₹5.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Margherita Pizza 200004 FOOD-004 Food ₹12.99 ₹4.50":
        - cell "📦 Margherita Pizza 200004":
          - text: 📦
          - paragraph: Margherita Pizza
          - paragraph: "200004"
        - cell "FOOD-004"
        - cell "Food"
        - cell "₹12.99"
        - cell "₹4.50"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Men's Haircut 700001 SAL-001 Haircuts ₹25.00 ₹5.00":
        - cell "📦 Men's Haircut 700001":
          - text: 📦
          - paragraph: Men's Haircut
          - paragraph: "700001"
        - cell "SAL-001"
        - cell "Haircuts"
        - cell "₹25.00"
        - cell "₹5.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Nail Art Design 700021 SAL-021 Nail Art ₹50.00 ₹12.00":
        - cell "📦 Nail Art Design 700021":
          - text: 📦
          - paragraph: Nail Art Design
          - paragraph: "700021"
        - cell "SAL-021"
        - cell "Nail Art"
        - cell "₹50.00"
        - cell "₹12.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Pamper Package 700028 SAL-028 Packages ₹150.00 ₹30.00":
        - cell "📦 Pamper Package 700028":
          - text: 📦
          - paragraph: Pamper Package
          - paragraph: "700028"
        - cell "SAL-028"
        - cell "Packages"
        - cell "₹150.00"
        - cell "₹30.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Pancake Stack 600001 BRK-001 Breakfast ₹7.99 ₹2.50":
        - cell "📦 Pancake Stack 600001":
          - text: 📦
          - paragraph: Pancake Stack
          - paragraph: "600001"
        - cell "BRK-001"
        - cell "Breakfast"
        - cell "₹7.99"
        - cell "₹2.50"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Pedicure 700019 SAL-019 Nail Art ₹35.00 ₹7.00":
        - cell "📦 Pedicure 700019":
          - text: 📦
          - paragraph: Pedicure
          - paragraph: "700019"
        - cell "SAL-019"
        - cell "Nail Art"
        - cell "₹35.00"
        - cell "₹7.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Threading (Eyebrows) 700024 SAL-024 Skin Care ₹10.00 ₹2.00":
        - cell "📦 Threading (Eyebrows) 700024":
          - text: 📦
          - paragraph: Threading (Eyebrows)
          - paragraph: "700024"
        - cell "SAL-024"
        - cell "Skin Care"
        - cell "₹10.00"
        - cell "₹2.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Waxing (Full Legs) 700023 SAL-023 Skin Care ₹35.00 ₹8.00":
        - cell "📦 Waxing (Full Legs) 700023":
          - text: 📦
          - paragraph: Waxing (Full Legs)
          - paragraph: "700023"
        - cell "SAL-023"
        - cell "Skin Care"
        - cell "₹35.00"
        - cell "₹8.00"
        - cell:
          - button:
            - img
          - button:
            - img
      - row "📦 Women's Haircut 700002 SAL-002 Haircuts ₹45.00 ₹8.00":
        - cell "📦 Women's Haircut 700002":
          - text: 📦
          - paragraph: Women's Haircut
          - paragraph: "700002"
        - cell "SAL-002"
        - cell "Haircuts"
        - cell "₹45.00"
        - cell "₹8.00"
        - cell:
          - button:
            - img
          - button:
            - img
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Products Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/login');
  6  |     await page.getByRole('textbox').first().fill('admin@mypos.com');
  7  |     await page.getByRole('textbox').nth(1).fill('admin123');
  8  |     await page.getByRole('button', { name: 'Sign In' }).click();
  9  |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  10 |     await page.goto('/products');
  11 |   });
  12 | 
  13 |   test('should display products page with table', async ({ page }) => {
  14 |     await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  15 |     await expect(page.getByText('Manage your product catalog')).toBeVisible();
  16 |     await expect(page.getByRole('button', { name: 'Add Product' })).toBeVisible();
  17 |   });
  18 | 
  19 |   test('should display product list', async ({ page }) => {
  20 |     await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  21 |     await expect(page.getByText('Classic Burger')).toBeVisible();
> 22 |     await expect(page.getByText('Mango Smoothie')).toBeVisible();
     |                                                    ^ Error: expect(locator).toBeVisible() failed
  23 |   });
  24 | 
  25 |   test('should search products', async ({ page }) => {
  26 |     await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  27 |     await page.getByPlaceholder('Search by name, SKU, or barcode...').fill('burger');
  28 |     await expect(page.getByText('Classic Burger')).toBeVisible();
  29 |     await expect(page.getByText('Espresso')).not.toBeVisible();
  30 |   });
  31 | 
  32 |   test('should open add product modal', async ({ page }) => {
  33 |     await page.getByRole('button', { name: 'Add Product' }).click();
  34 |     await expect(page.getByText('Add Product')).toBeVisible();
  35 |     await expect(page.getByText('Name *')).toBeVisible();
  36 |     await expect(page.getByText('Price *')).toBeVisible();
  37 |   });
  38 | });
  39 | 
```