# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: customers.spec.ts >> Customers Page >> Page Layout >> should display search input
- Location: e2e\customers.spec.ts:17:5

# Error details

```
Error: page.goto: net::ERR_ABORTED at http://localhost:5173/customers
Call log:
  - navigating to "http://localhost:5173/customers", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Customers Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
> 5  |     await page.goto('/customers');
     |                ^ Error: page.goto: net::ERR_ABORTED at http://localhost:5173/customers
  6  |   });
  7  | 
  8  |   test.describe('Page Layout', () => {
  9  |     test('should display page heading and subtitle', async ({ page }) => {
  10 |       await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible();
  11 |     });
  12 | 
  13 |     test('should display add customer button', async ({ page }) => {
  14 |       await expect(page.getByRole('button', { name: /Add Customer/ })).toBeVisible();
  15 |     });
  16 | 
  17 |     test('should display search input', async ({ page }) => {
  18 |       await expect(page.getByPlaceholder(/Search customers/i)).toBeVisible();
  19 |     });
  20 |   });
  21 | 
  22 |   test.describe('Customer List', () => {
  23 |     test('should display seeded customers', async ({ page }) => {
  24 |       await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
  25 |       await expect(page.getByText('Jane Smith')).toBeVisible();
  26 |     });
  27 | 
  28 |     test('should display customer loyalty badges', async ({ page }) => {
  29 |       await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
  30 |       // Loyalty tier badges should be visible
  31 |       const tierBadge = page.getByText(/BRONZE|SILVER|GOLD|PLATINUM/).first();
  32 |       await expect(tierBadge).toBeVisible();
  33 |     });
  34 | 
  35 |     test('should show customer action buttons', async ({ page }) => {
  36 |       await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
  37 |       // Each customer card should have Edit and Delete buttons
  38 |       await expect(page.getByRole('button', { name: /Edit/i }).first()).toBeVisible();
  39 |     });
  40 |   });
  41 | 
  42 |   test.describe('Search', () => {
  43 |     test('should filter customers by name', async ({ page }) => {
  44 |       await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
  45 |       await page.getByPlaceholder(/Search customers/i).fill('Jane');
  46 |       await expect(page.getByText('Jane Smith')).toBeVisible();
  47 |       await expect(page.getByText('John Doe')).not.toBeVisible();
  48 |     });
  49 | 
  50 |     test('should show all customers when search is cleared', async ({ page }) => {
  51 |       await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
  52 |       await page.getByPlaceholder(/Search customers/i).fill('Jane');
  53 |       await expect(page.getByText('John Doe')).not.toBeVisible();
  54 |       await page.getByPlaceholder(/Search customers/i).clear();
  55 |       await expect(page.getByText('John Doe')).toBeVisible();
  56 |       await expect(page.getByText('Jane Smith')).toBeVisible();
  57 |     });
  58 |   });
  59 | 
  60 |   test.describe('Add Customer Modal', () => {
  61 |     test('should open modal with form fields', async ({ page }) => {
  62 |       await page.getByRole('button', { name: /Add Customer/ }).click();
  63 |       await expect(page.getByRole('heading', { name: /Add Customer/i })).toBeVisible();
  64 |       await expect(page.getByText('First Name')).toBeVisible();
  65 |       await expect(page.getByText('Last Name')).toBeVisible();
  66 |       await expect(page.getByText('Email')).toBeVisible();
  67 |       await expect(page.getByText('Phone')).toBeVisible();
  68 |     });
  69 | 
  70 |     test('should close modal via X button', async ({ page }) => {
  71 |       await page.getByRole('button', { name: /Add Customer/ }).click();
  72 |       await expect(page.getByRole('heading', { name: /Add Customer/i })).toBeVisible();
  73 |       // Close via X button in modal header
  74 |       const modal = page.locator('.fixed.inset-0');
  75 |       await modal.locator('button').filter({ has: page.locator('svg') }).first().click();
  76 |       await expect(page.getByRole('heading', { name: /Add Customer/i })).not.toBeVisible({ timeout: 5000 });
  77 |     });
  78 |   });
  79 | 
  80 |   test.describe('Loyalty Program', () => {
  81 |     test('should open loyalty modal for a customer', async ({ page }) => {
  82 |       await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
  83 |       // Click the Loyalty button on the first customer card
  84 |       const customerCard = page.locator('.shadow-card').filter({ hasText: 'John Doe' }).first();
  85 |       await customerCard.getByRole('button', { name: /Loyalty/i }).click();
  86 |       await expect(page.getByRole('heading', { name: 'Loyalty Program' })).toBeVisible({ timeout: 5000 });
  87 |       await expect(page.getByText('Available Points')).toBeVisible();
  88 |     });
  89 |   });
  90 | });
  91 | 
```