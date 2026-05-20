# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: customers.spec.ts >> Customers Page >> Customer List >> should display customer loyalty badges
- Location: e2e\customers.spec.ts:33:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/dashboard/
Received string:  "http://localhost:5173/login"
Timeout: 15000ms

Call log:
  - Expect "toHaveURL" with timeout 15000ms
    33 × unexpected value "http://localhost:5173/login"

```

```yaml
- img
- heading "Welcome to MyPOS" [level=1]
- paragraph: Sign in to your account
- text: Email
- textbox "admin@mypos.com"
- text: Password
- textbox "••••••••": admin123
- button:
  - img
- checkbox "Remember me"
- text: Remember me
- link "Forgot password?":
  - /url: "#"
- button "Sign In"
- paragraph: "Demo Credentials:"
- paragraph: "Admin: admin@mypos.com / admin123"
- paragraph: "Cashier: cashier@mypos.com / cashier123"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Customers Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/login');
  6  |     await page.getByPlaceholder('admin@mypos.com').fill('admin@mypos.com');
  7  |     await page.getByPlaceholder('••••••••').fill('admin123');
  8  |     await page.getByRole('button', { name: 'Sign In' }).click();
> 9  |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  10 |     await page.goto('/customers');
  11 |   });
  12 | 
  13 |   test.describe('Page Layout', () => {
  14 |     test('should display page heading and subtitle', async ({ page }) => {
  15 |       await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible();
  16 |     });
  17 | 
  18 |     test('should display add customer button', async ({ page }) => {
  19 |       await expect(page.getByRole('button', { name: /Add Customer/ })).toBeVisible();
  20 |     });
  21 | 
  22 |     test('should display search input', async ({ page }) => {
  23 |       await expect(page.getByPlaceholder(/Search customers/i)).toBeVisible();
  24 |     });
  25 |   });
  26 | 
  27 |   test.describe('Customer List', () => {
  28 |     test('should display seeded customers', async ({ page }) => {
  29 |       await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
  30 |       await expect(page.getByText('Jane Smith')).toBeVisible();
  31 |     });
  32 | 
  33 |     test('should display customer loyalty badges', async ({ page }) => {
  34 |       await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
  35 |       // Loyalty tier badges should be visible
  36 |       const tierBadge = page.getByText(/BRONZE|SILVER|GOLD|PLATINUM/).first();
  37 |       await expect(tierBadge).toBeVisible();
  38 |     });
  39 | 
  40 |     test('should show customer action buttons', async ({ page }) => {
  41 |       await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
  42 |       // Each customer card should have Edit and Delete buttons
  43 |       await expect(page.getByRole('button', { name: /Edit/i }).first()).toBeVisible();
  44 |     });
  45 |   });
  46 | 
  47 |   test.describe('Search', () => {
  48 |     test('should filter customers by name', async ({ page }) => {
  49 |       await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
  50 |       await page.getByPlaceholder(/Search customers/i).fill('Jane');
  51 |       await expect(page.getByText('Jane Smith')).toBeVisible();
  52 |       await expect(page.getByText('John Doe')).not.toBeVisible();
  53 |     });
  54 | 
  55 |     test('should show all customers when search is cleared', async ({ page }) => {
  56 |       await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
  57 |       await page.getByPlaceholder(/Search customers/i).fill('Jane');
  58 |       await expect(page.getByText('John Doe')).not.toBeVisible();
  59 |       await page.getByPlaceholder(/Search customers/i).clear();
  60 |       await expect(page.getByText('John Doe')).toBeVisible();
  61 |       await expect(page.getByText('Jane Smith')).toBeVisible();
  62 |     });
  63 |   });
  64 | 
  65 |   test.describe('Add Customer Modal', () => {
  66 |     test('should open modal with form fields', async ({ page }) => {
  67 |       await page.getByRole('button', { name: /Add Customer/ }).click();
  68 |       await expect(page.getByRole('heading', { name: /Add Customer/i })).toBeVisible();
  69 |       await expect(page.getByText('First Name')).toBeVisible();
  70 |       await expect(page.getByText('Last Name')).toBeVisible();
  71 |       await expect(page.getByText('Email')).toBeVisible();
  72 |       await expect(page.getByText('Phone')).toBeVisible();
  73 |     });
  74 | 
  75 |     test('should close modal via X button', async ({ page }) => {
  76 |       await page.getByRole('button', { name: /Add Customer/ }).click();
  77 |       await expect(page.getByRole('heading', { name: /Add Customer/i })).toBeVisible();
  78 |       // Close via X button in modal header
  79 |       const modal = page.locator('.fixed.inset-0');
  80 |       await modal.locator('button').filter({ has: page.locator('svg') }).first().click();
  81 |       await expect(page.getByRole('heading', { name: /Add Customer/i })).not.toBeVisible({ timeout: 5000 });
  82 |     });
  83 |   });
  84 | 
  85 |   test.describe('Loyalty Program', () => {
  86 |     test('should open loyalty modal for a customer', async ({ page }) => {
  87 |       await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
  88 |       // Click the Loyalty button on the first customer card
  89 |       const customerCard = page.locator('.shadow-card').filter({ hasText: 'John Doe' }).first();
  90 |       await customerCard.getByRole('button', { name: /Loyalty/i }).click();
  91 |       await expect(page.getByRole('heading', { name: 'Loyalty Program' })).toBeVisible({ timeout: 5000 });
  92 |       await expect(page.getByText('Available Points')).toBeVisible();
  93 |     });
  94 |   });
  95 | });
  96 | 
```