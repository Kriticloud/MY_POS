# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: kitchen.spec.ts >> Kitchen Page >> should display kitchen display page
- Location: e2e\kitchen.spec.ts:21:3

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/kitchen", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Kitchen Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.route('**/api/settings', async (route) => {
  6  |       const response = await route.fetch();
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
> 18 |     await page.goto('/kitchen');
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  19 |   });
  20 | 
  21 |   test('should display kitchen display page', async ({ page }) => {
  22 |     await expect(page.getByRole('heading', { name: 'Kitchen Display' })).toBeVisible();
  23 |     await expect(page.getByText('Live')).toBeVisible();
  24 |   });
  25 | 
  26 |   test('should show active orders', async ({ page }) => {
  27 |     // Kitchen shows CONFIRMED and PREPARING orders
  28 |     await expect(page.getByText('ORD-').first()).toBeVisible({ timeout: 15000 });
  29 |   });
  30 | 
  31 |   test('should show action buttons for orders', async ({ page }) => {
  32 |     await expect(page.getByText('ORD-').first()).toBeVisible({ timeout: 15000 });
  33 |     // Should have at least one action button
  34 |     const actionButtons = page.getByRole('button', { name: /Start Preparing|Mark Ready/ });
  35 |     await expect(actionButtons.first()).toBeVisible();
  36 |   });
  37 | });
  38 | 
```