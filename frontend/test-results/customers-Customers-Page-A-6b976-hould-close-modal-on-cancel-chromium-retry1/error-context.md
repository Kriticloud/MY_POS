# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: customers.spec.ts >> Customers Page >> Add Customer Modal >> should close modal on cancel
- Location: e2e\customers.spec.ts:75:5

# Error details

```
Error: expect(locator).not.toBeVisible() failed

Locator:  getByRole('heading', { name: /Add Customer/i })
Expected: not visible
Received: visible
Timeout:  5000ms

Call log:
  - Expect "not toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /Add Customer/i })
    13 × locator resolved to <h2 class="text-lg font-bold">Add Customer</h2>
       - unexpected value "visible"

```

```yaml
- heading "Add Customer" [level=2]
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
  9  |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
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
  75 |     test('should close modal on cancel', async ({ page }) => {
  76 |       await page.getByRole('button', { name: /Add Customer/ }).click();
  77 |       await expect(page.getByRole('heading', { name: /Add Customer/i })).toBeVisible();
  78 |       // Close by clicking outside or pressing X
  79 |       await page.keyboard.press('Escape');
> 80 |       await expect(page.getByRole('heading', { name: /Add Customer/i })).not.toBeVisible({ timeout: 5000 });
     |                                                                              ^ Error: expect(locator).not.toBeVisible() failed
  81 |     });
  82 |   });
  83 | 
  84 |   test.describe('Loyalty Program', () => {
  85 |     test('should open loyalty modal for a customer', async ({ page }) => {
  86 |       await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
  87 |       const loyaltyButton = page.getByRole('button', { name: /Loyalty/i }).first();
  88 |       await loyaltyButton.click();
  89 |       await expect(page.getByText('Loyalty Program')).toBeVisible();
  90 |     });
  91 |   });
  92 | });
  93 | 
```