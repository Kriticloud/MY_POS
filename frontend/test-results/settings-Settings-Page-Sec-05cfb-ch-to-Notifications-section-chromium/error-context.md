# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: settings.spec.ts >> Settings Page >> Section Navigation >> should switch to Notifications section
- Location: e2e\settings.spec.ts:56:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/New Order Alerts|Kitchen Ready/i).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/New Order Alerts|Kitchen Ready/i).first()

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
  - heading "Settings" [level=1]
  - navigation:
    - button "Business":
      - img
      - text: Business
    - button "Printing":
      - img
      - text: Printing
    - button "Localization":
      - img
      - text: Localization
    - button "Appearance":
      - img
      - text: Appearance
    - button "Tax Rates":
      - img
      - text: Tax Rates
    - button "Notifications":
      - img
      - text: Notifications
    - button "SMS / Twilio":
      - img
      - text: SMS / Twilio
    - button "Devices":
      - img
      - text: Devices
    - button "Security":
      - img
      - text: Security
    - button "Database":
      - img
      - text: Database
  - heading "Business Settings" [level=2]
  - text: Business Name
  - textbox: MyPOS Restaurant
  - text: Business Type
  - combobox:
    - option "RESTAURANT" [selected]
    - option "CAFE"
    - option "RETAIL"
    - option "GROCERY"
    - option "SALON"
    - option "PHARMACY"
    - option "GENERAL"
  - text: Currency
  - combobox:
    - option "$ USD — US Dollar"
    - option "€ EUR — Euro"
    - option "£ GBP — British Pound"
    - option "₹ INR — Indian Rupee" [selected]
    - option "د.إ AED — UAE Dirham"
    - option "﷼ SAR — Saudi Riyal"
    - option "¥ JPY — Japanese Yen"
    - option "$ CAD — Canadian Dollar"
    - option "$ AUD — Australian Dollar"
    - option "R$ BRL — Brazilian Real"
    - option "$ MXN — Mexican Peso"
    - option "¥ CNY — Chinese Yuan"
  - text: Default Tax Rate (%)
  - spinbutton: "8.5"
  - text: Tax Included in Price
  - button
  - button "Save Changes":
    - img
    - text: Save Changes
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Settings Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/settings');
  6  |   });
  7  | 
  8  |   test.describe('Page Layout', () => {
  9  |     test('should display settings heading', async ({ page }) => {
  10 |       await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  11 |     });
  12 | 
  13 |     test('should display settings section tabs', async ({ page }) => {
  14 |       await expect(page.getByText('Business')).toBeVisible();
  15 |       await expect(page.getByText('Printing')).toBeVisible();
  16 |       await expect(page.getByText('Localization')).toBeVisible();
  17 |       await expect(page.getByText('Appearance')).toBeVisible();
  18 |       await expect(page.getByText('Notifications')).toBeVisible();
  19 |       await expect(page.getByText('Security')).toBeVisible();
  20 |     });
  21 |   });
  22 | 
  23 |   test.describe('Business Settings', () => {
  24 |     test('should display business name input', async ({ page }) => {
  25 |       await expect(page.getByText('Business Name')).toBeVisible();
  26 |     });
  27 | 
  28 |     test('should display business type selector', async ({ page }) => {
  29 |       await expect(page.getByText('Business Type')).toBeVisible();
  30 |     });
  31 | 
  32 |     test('should display currency selector', async ({ page }) => {
  33 |       await expect(page.getByText('Currency')).toBeVisible();
  34 |     });
  35 | 
  36 |     test('should display tax rate input', async ({ page }) => {
  37 |       await expect(page.getByText(/Tax Rate/i)).toBeVisible();
  38 |     });
  39 | 
  40 |     test('should have Save Changes button', async ({ page }) => {
  41 |       await expect(page.getByRole('button', { name: /Save Changes/i })).toBeVisible();
  42 |     });
  43 |   });
  44 | 
  45 |   test.describe('Section Navigation', () => {
  46 |     test('should switch to Printing section', async ({ page }) => {
  47 |       await page.getByText('Printing').click();
  48 |       await expect(page.getByText(/Paper Size|Printer Type/i).first()).toBeVisible();
  49 |     });
  50 | 
  51 |     test('should switch to Appearance section', async ({ page }) => {
  52 |       await page.getByText('Appearance').click();
  53 |       await expect(page.getByText(/Theme/i)).toBeVisible();
  54 |     });
  55 | 
  56 |     test('should switch to Notifications section', async ({ page }) => {
  57 |       await page.getByText('Notifications').click();
> 58 |       await expect(page.getByText(/New Order Alerts|Kitchen Ready/i).first()).toBeVisible();
     |                                                                               ^ Error: expect(locator).toBeVisible() failed
  59 |     });
  60 | 
  61 |     test('should switch to Security section', async ({ page }) => {
  62 |       await page.getByText('Security').click();
  63 |       await expect(page.getByText(/Two-Factor|Session Timeout|Login Attempts/i).first()).toBeVisible();
  64 |     });
  65 | 
  66 |     test('should switch to Localization section', async ({ page }) => {
  67 |       await page.getByText('Localization').click();
  68 |       await expect(page.getByText(/Language|Timezone/i).first()).toBeVisible();
  69 |     });
  70 |   });
  71 | });
  72 | 
```