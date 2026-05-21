# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tables.spec.ts >> Tables Page >> Page Layout >> should display status legend
- Location: e2e\tables.spec.ts:26:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('RESERVED')
Expected: visible
Error: strict mode violation: getByText('RESERVED') resolved to 2 elements:
    1) <div class="flex items-center gap-1.5 text-xs text-gray-500">…</div> aka getByText('RESERVED').first()
    2) <span class="text-xs font-medium px-1.5 py-0.5 rounded-full text-amber-700 bg-white/50">RESERVED</span> aka getByRole('button', { name: 'RESERVED Table 1 2 seats' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('RESERVED')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to main content" [ref=e4] [cursor=pointer]:
    - /url: "#main-content"
  - complementary [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]:
        - img [ref=e9]
        - generic [ref=e13]: MyPOS Restaurant
      - navigation "Main navigation" [ref=e14]:
        - link "Dashboard" [ref=e15] [cursor=pointer]:
          - /url: /dashboard
          - img [ref=e16]
          - text: Dashboard
        - link "POS" [ref=e21] [cursor=pointer]:
          - /url: /pos
          - img [ref=e22]
          - text: POS
        - link "Orders" [ref=e26] [cursor=pointer]:
          - /url: /orders
          - img [ref=e27]
          - text: Orders
        - link "Tables" [ref=e30] [cursor=pointer]:
          - /url: /tables
          - img [ref=e31]
          - text: Tables
        - link "Kitchen" [ref=e36] [cursor=pointer]:
          - /url: /kitchen
          - img [ref=e37]
          - text: Kitchen
        - link "Products" [ref=e39] [cursor=pointer]:
          - /url: /products
          - img [ref=e40]
          - text: Products
        - link "Customers" [ref=e44] [cursor=pointer]:
          - /url: /customers
          - img [ref=e45]
          - text: Customers
        - link "Appointments" [ref=e50] [cursor=pointer]:
          - /url: /appointments
          - img [ref=e51]
          - text: Appointments
        - link "Reports" [ref=e53] [cursor=pointer]:
          - /url: /reports
          - img [ref=e54]
          - text: Reports
        - link "Employees" [ref=e56] [cursor=pointer]:
          - /url: /employees
          - img [ref=e57]
          - text: Employees
        - link "Inventory" [ref=e69] [cursor=pointer]:
          - /url: /inventory
          - img [ref=e70]
          - text: Inventory
        - link "Suppliers" [ref=e73] [cursor=pointer]:
          - /url: /suppliers
          - img [ref=e74]
          - text: Suppliers
        - link "Cash Drawer" [ref=e79] [cursor=pointer]:
          - /url: /cash-drawer
          - img [ref=e80]
          - text: Cash Drawer
        - link "Memberships" [ref=e82] [cursor=pointer]:
          - /url: /memberships
          - img [ref=e83]
          - text: Memberships
        - link "Discount" [ref=e85] [cursor=pointer]:
          - /url: /discounts
          - img [ref=e86]
          - text: Discount
        - link "Gift Cards" [ref=e89] [cursor=pointer]:
          - /url: /gift-cards
          - img [ref=e90]
          - text: Gift Cards
        - link "Branches" [ref=e94] [cursor=pointer]:
          - /url: /branches
          - img [ref=e95]
          - text: Branches
        - link "Audit Log" [ref=e99] [cursor=pointer]:
          - /url: /audit-log
          - img [ref=e100]
          - text: Audit Log
        - link "Settings" [ref=e103] [cursor=pointer]:
          - /url: /settings
          - img [ref=e104]
          - text: Settings
      - generic [ref=e108]:
        - link "Admin User Admin User ADMIN" [ref=e109] [cursor=pointer]:
          - /url: /profile
          - img "Admin User" [ref=e111]
          - generic [ref=e112]:
            - paragraph [ref=e113]: Admin User
            - paragraph [ref=e114]: ADMIN
        - button [ref=e115] [cursor=pointer]:
          - img [ref=e116]
  - main [ref=e119]:
    - generic [ref=e120]:
      - button "Search or jump to... K" [ref=e121] [cursor=pointer]:
        - img [ref=e122]
        - generic [ref=e125]: Search or jump to...
        - generic [ref=e126]:
          - img [ref=e127]
          - text: K
      - button "Switch to dark mode" [ref=e129] [cursor=pointer]:
        - img [ref=e130]
      - button "2" [ref=e133] [cursor=pointer]:
        - img [ref=e134]
        - generic [ref=e137]: "2"
    - generic [ref=e139]:
      - generic [ref=e140]:
        - generic [ref=e141]:
          - heading "Tables" [level=1] [ref=e142]
          - paragraph [ref=e143]: Manage table assignments and status
        - generic [ref=e144]:
          - generic [ref=e145]: AVAILABLE
          - generic [ref=e147]: OCCUPIED
          - generic [ref=e149]: RESERVED
          - generic [ref=e151]: CLEANING
      - generic [ref=e153]:
        - heading "Ground Floor" [level=2] [ref=e154]
        - generic [ref=e155]:
          - button "RESERVED Table 1 2 seats" [ref=e156] [cursor=pointer]:
            - generic [ref=e157]:
              - img [ref=e158]
              - generic [ref=e161]: RESERVED
            - paragraph [ref=e162]: Table 1
            - paragraph [ref=e163]: 2 seats
          - button "AVAILABLE Table 2 4 seats" [ref=e164] [cursor=pointer]:
            - generic [ref=e165]:
              - img [ref=e166]
              - generic [ref=e169]: AVAILABLE
            - paragraph [ref=e170]: Table 2
            - paragraph [ref=e171]: 4 seats
          - button "AVAILABLE Table 3 4 seats" [ref=e172] [cursor=pointer]:
            - generic [ref=e173]:
              - img [ref=e174]
              - generic [ref=e177]: AVAILABLE
            - paragraph [ref=e178]: Table 3
            - paragraph [ref=e179]: 4 seats
          - button "AVAILABLE Table 4 6 seats" [ref=e180] [cursor=pointer]:
            - generic [ref=e181]:
              - img [ref=e182]
              - generic [ref=e185]: AVAILABLE
            - paragraph [ref=e186]: Table 4
            - paragraph [ref=e187]: 6 seats
      - generic [ref=e188]:
        - heading "First Floor" [level=2] [ref=e189]
        - generic [ref=e190]:
          - button "AVAILABLE Table 5 2 seats" [ref=e191] [cursor=pointer]:
            - generic [ref=e192]:
              - img [ref=e193]
              - generic [ref=e196]: AVAILABLE
            - paragraph [ref=e197]: Table 5
            - paragraph [ref=e198]: 2 seats
          - button "AVAILABLE Table 6 8 seats" [ref=e199] [cursor=pointer]:
            - generic [ref=e200]:
              - img [ref=e201]
              - generic [ref=e204]: AVAILABLE
            - paragraph [ref=e205]: Table 6
            - paragraph [ref=e206]: 8 seats
          - button "AVAILABLE Table 7 4 seats" [ref=e207] [cursor=pointer]:
            - generic [ref=e208]:
              - img [ref=e209]
              - generic [ref=e212]: AVAILABLE
            - paragraph [ref=e213]: Table 7
            - paragraph [ref=e214]: 4 seats
          - button "AVAILABLE Table 8 6 seats" [ref=e215] [cursor=pointer]:
            - generic [ref=e216]:
              - img [ref=e217]
              - generic [ref=e220]: AVAILABLE
            - paragraph [ref=e221]: Table 8
            - paragraph [ref=e222]: 6 seats
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Tables Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.route('**/api/settings', async (route) => {
  6  |       const response = await route.fetch();
  7  |       const json = await response.json();
  8  |       if (json.data) {
  9  |         json.data = json.data.map((s: any) => s.key === 'businessType' ? { ...s, value: 'RESTAURANT' } : s);
  10 |       }
  11 |       await route.fulfill({ json });
  12 |     });
  13 |     await page.goto('/tables');
  14 |   });
  15 | 
  16 |   test.afterEach(async ({ page }) => {
  17 |     await page.unrouteAll({ behavior: 'ignoreErrors' });
  18 |   });
  19 | 
  20 |   test.describe('Page Layout', () => {
  21 |     test('should display tables heading and subtitle', async ({ page }) => {
  22 |       await expect(page.getByRole('heading', { name: 'Tables' })).toBeVisible();
  23 |       await expect(page.getByText('Manage table assignments and status')).toBeVisible();
  24 |     });
  25 | 
  26 |     test('should display status legend', async ({ page }) => {
  27 |       await expect(page.getByText('AVAILABLE')).toBeVisible({ timeout: 15000 });
  28 |       await expect(page.getByText('OCCUPIED')).toBeVisible();
> 29 |       await expect(page.getByText('RESERVED')).toBeVisible();
     |                                                ^ Error: expect(locator).toBeVisible() failed
  30 |     });
  31 |   });
  32 | 
  33 |   test.describe('Table Cards', () => {
  34 |     test('should display table cards with names', async ({ page }) => {
  35 |       // Wait for tables to load
  36 |       await expect(page.getByText(/Table \d+|T\d+/).first()).toBeVisible({ timeout: 15000 });
  37 |     });
  38 | 
  39 |     test('should show seat capacity on table cards', async ({ page }) => {
  40 |       await expect(page.getByText(/\d+ seats/).first()).toBeVisible({ timeout: 15000 });
  41 |     });
  42 | 
  43 |     test('should show status badges on table cards', async ({ page }) => {
  44 |       await expect(page.getByText(/AVAILABLE|OCCUPIED|RESERVED|CLEANING/).first()).toBeVisible({ timeout: 15000 });
  45 |     });
  46 |   });
  47 | 
  48 |   test.describe('Table Detail Modal', () => {
  49 |     test('should open table detail modal when clicking a table card', async ({ page }) => {
  50 |       await expect(page.getByText(/Table \d+|T\d+/).first()).toBeVisible({ timeout: 15000 });
  51 |       // Click first table card
  52 |       await page.getByText(/Table \d+|T\d+/).first().click();
  53 |       // Modal should show table details
  54 |       await expect(page.getByText(/seats|Capacity/i).first()).toBeVisible({ timeout: 5000 });
  55 |     });
  56 | 
  57 |     test('should show status change buttons in modal', async ({ page }) => {
  58 |       await expect(page.getByText(/Table \d+|T\d+/).first()).toBeVisible({ timeout: 15000 });
  59 |       await page.getByText(/Table \d+|T\d+/).first().click();
  60 |       // Should see status change options
  61 |       await expect(page.getByRole('button', { name: /AVAILABLE|OCCUPIED|RESERVED|CLEANING/ }).first()).toBeVisible({ timeout: 5000 });
  62 |     });
  63 |   });
  64 | });
  65 | 
```