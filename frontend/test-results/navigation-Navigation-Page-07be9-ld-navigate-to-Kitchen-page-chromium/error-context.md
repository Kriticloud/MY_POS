# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Navigation >> Page Routing >> should navigate to Kitchen page
- Location: e2e\navigation.spec.ts:40:5

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
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Navigation', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.route('**/api/settings', async (route) => {
  6   |       const response = await route.fetch();
  7   |       const json = await response.json();
  8   |       if (json.data) {
  9   |         json.data = json.data.map((s: any) => s.key === 'businessType' ? { ...s, value: 'RESTAURANT' } : s);
  10  |       }
  11  |       await route.fulfill({ json });
  12  |     });
  13  |     await page.goto('/login');
  14  |     await page.getByPlaceholder('admin@mypos.com').fill('admin@mypos.com');
  15  |     await page.getByPlaceholder('••••••••').fill('admin123');
  16  |     await page.getByRole('button', { name: 'Sign In' }).click();
> 17  |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  18  |   });
  19  | 
  20  |   test.afterEach(async ({ page }) => {
  21  |     await page.unrouteAll({ behavior: 'ignoreErrors' });
  22  |   });
  23  | 
  24  |   test.describe('Page Routing', () => {
  25  |     test('should navigate to POS page', async ({ page }) => {
  26  |       await page.goto('/pos');
  27  |       await expect(page.getByPlaceholder(/Search products/i)).toBeVisible({ timeout: 15000 });
  28  |     });
  29  | 
  30  |     test('should navigate to Orders page', async ({ page }) => {
  31  |       await page.goto('/orders');
  32  |       await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible({ timeout: 15000 });
  33  |     });
  34  | 
  35  |     test('should navigate to Tables page', async ({ page }) => {
  36  |       await page.goto('/tables');
  37  |       await expect(page.getByRole('heading', { name: 'Tables' })).toBeVisible({ timeout: 15000 });
  38  |     });
  39  | 
  40  |     test('should navigate to Kitchen page', async ({ page }) => {
  41  |       await page.goto('/kitchen');
  42  |       await expect(page.getByRole('heading', { name: 'Kitchen Display' })).toBeVisible({ timeout: 15000 });
  43  |     });
  44  | 
  45  |     test('should navigate to Products page', async ({ page }) => {
  46  |       await page.goto('/products');
  47  |       await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible({ timeout: 15000 });
  48  |     });
  49  | 
  50  |     test('should navigate to Customers page', async ({ page }) => {
  51  |       await page.goto('/customers');
  52  |       await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible({ timeout: 15000 });
  53  |     });
  54  | 
  55  |     test('should navigate to Reports page', async ({ page }) => {
  56  |       await page.goto('/reports');
  57  |       await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible({ timeout: 15000 });
  58  |     });
  59  | 
  60  |     test('should navigate to Settings page', async ({ page }) => {
  61  |       await page.goto('/settings');
  62  |       await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible({ timeout: 15000 });
  63  |     });
  64  |   });
  65  | 
  66  |   test.describe('Sidebar', () => {
  67  |     test('should show all navigation links in sidebar', async ({ page }) => {
  68  |       await page.setViewportSize({ width: 1280, height: 720 });
  69  |       await page.goto('/dashboard');
  70  |       await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  71  |       await expect(page.getByRole('link', { name: 'POS' })).toBeVisible();
  72  |       await expect(page.getByRole('link', { name: 'Orders' })).toBeVisible();
  73  |       await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
  74  |       await expect(page.getByRole('link', { name: 'Customers' })).toBeVisible();
  75  |       await expect(page.getByRole('link', { name: 'Reports' })).toBeVisible();
  76  |       await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
  77  |     });
  78  | 
  79  |     test('should display user info in sidebar', async ({ page }) => {
  80  |       await page.setViewportSize({ width: 1280, height: 720 });
  81  |       await page.goto('/dashboard');
  82  |       await expect(page.getByText('Admin User')).toBeVisible();
  83  |       await expect(page.getByText('ADMIN', { exact: true })).toBeVisible();
  84  |     });
  85  | 
  86  |     test('should navigate when clicking sidebar links', async ({ page }) => {
  87  |       await page.setViewportSize({ width: 1280, height: 720 });
  88  |       await page.goto('/dashboard');
  89  |       await page.getByRole('link', { name: 'Orders' }).click();
  90  |       await expect(page).toHaveURL(/\/orders/);
  91  |       await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible({ timeout: 15000 });
  92  |     });
  93  | 
  94  |     test('should highlight the active navigation link', async ({ page }) => {
  95  |       await page.setViewportSize({ width: 1280, height: 720 });
  96  |       await page.goto('/dashboard');
  97  |       // The Dashboard link should have an active/selected style
  98  |       const dashboardLink = page.getByRole('link', { name: 'Dashboard' });
  99  |       await expect(dashboardLink).toBeVisible();
  100 |     });
  101 |   });
  102 | 
  103 |   test.describe('Responsive Layout', () => {
  104 |     test('should handle mobile viewport', async ({ page }) => {
  105 |       await page.setViewportSize({ width: 375, height: 812 });
  106 |       await page.goto('/dashboard');
  107 |       await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });
  108 |     });
  109 |   });
  110 | });
  111 | 
```