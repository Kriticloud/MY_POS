# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> Dashboard >> Stats Cards >> should display revenue with dollar sign
- Location: e2e\dashboard.spec.ts:35:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Revenue')
Expected: visible
Error: strict mode violation: getByText('Revenue') resolved to 2 elements:
    1) <h2 class="font-semibold text-gray-900 dark:text-white mb-4">Revenue by Day</h2> aka getByRole('heading', { name: 'Revenue by Day' })
    2) <p class="text-sm text-gray-400 text-center py-12">No revenue data yet</p> aka getByText('No revenue data yet')

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByText('Revenue')

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
          - generic [ref=e142]:
            - img [ref=e143]
            - heading "Good afternoon, Admin!" [level=1] [ref=e149]
          - paragraph [ref=e150]: Here's what's happening with your business today.
        - generic [ref=e151]:
          - img [ref=e152]
          - generic [ref=e155]:
            - paragraph [ref=e156]: 12:40 PM
            - paragraph [ref=e157]: Thursday, May 21
      - generic [ref=e158]:
        - button "New Order Start taking an order" [ref=e159] [cursor=pointer]:
          - img [ref=e162]
          - paragraph [ref=e166]: New Order
          - paragraph [ref=e167]: Start taking an order
          - img [ref=e168]
        - button "View Orders Check active orders" [ref=e170] [cursor=pointer]:
          - img [ref=e173]
          - paragraph [ref=e176]: View Orders
          - paragraph [ref=e177]: Check active orders
          - img [ref=e178]
        - button "Add Customer Register new customer" [ref=e180] [cursor=pointer]:
          - img [ref=e183]
          - paragraph [ref=e188]: Add Customer
          - paragraph [ref=e189]: Register new customer
          - img [ref=e190]
        - button "Add Product Add to catalog" [ref=e192] [cursor=pointer]:
          - img [ref=e195]
          - paragraph [ref=e199]: Add Product
          - paragraph [ref=e200]: Add to catalog
          - img [ref=e201]
      - generic [ref=e203]:
        - generic [ref=e204]:
          - generic [ref=e205]:
            - img [ref=e207]
            - generic [ref=e209]:
              - img [ref=e210]
              - text: 9 orders
          - paragraph [ref=e213]: ₹18,890.83
          - paragraph [ref=e214]: Revenue
        - generic [ref=e215]:
          - generic [ref=e216]:
            - img [ref=e218]
            - generic [ref=e221]:
              - img [ref=e222]
              - text: No data
          - paragraph [ref=e225]: "7"
          - paragraph [ref=e226]: Today Orders
        - generic [ref=e227]:
          - generic [ref=e228]:
            - img [ref=e230]
            - generic [ref=e233]:
              - img [ref=e234]
              - text: Per order
          - paragraph [ref=e237]: ₹2,098.98
          - paragraph [ref=e238]: Total Order
        - generic [ref=e239]:
          - generic [ref=e240]:
            - img [ref=e242]
            - generic [ref=e247]:
              - img [ref=e248]
              - text: All time
          - paragraph [ref=e251]: "9"
          - paragraph [ref=e252]: Total Orders
      - generic [ref=e253]:
        - generic [ref=e254]:
          - heading "Revenue by Day" [level=2] [ref=e255]
          - generic [ref=e256]:
            - generic [ref=e257]:
              - generic [ref=e258]: ₹0.00
              - generic [ref=e259]: Mon
            - generic [ref=e260]:
              - generic [ref=e261]: ₹0.00
              - generic [ref=e262]: Tue
            - generic [ref=e263]:
              - generic [ref=e264]: ₹40,658.91
              - generic [ref=e266]: Wed
            - generic [ref=e267]:
              - generic [ref=e268]: ₹24,141.51
              - generic [ref=e270]: Thu
            - generic [ref=e271]:
              - generic [ref=e272]: ₹0.00
              - generic [ref=e273]: Fri
            - generic [ref=e274]:
              - generic [ref=e275]: ₹0.00
              - generic [ref=e276]: Sat
            - generic [ref=e277]:
              - generic [ref=e278]: ₹0.00
              - generic [ref=e279]: Sun
        - generic [ref=e280]:
          - heading "Payment Methods" [level=2] [ref=e281]
          - generic [ref=e282]:
            - generic [ref=e283]:
              - img [ref=e284]
              - generic [ref=e287]:
                - generic [ref=e288]: "1"
                - generic [ref=e289]: Methods
            - generic [ref=e291]:
              - generic [ref=e293]: CASH
              - generic [ref=e294]: ₹64,800.14
      - generic [ref=e295]:
        - generic [ref=e296]:
          - generic [ref=e297]:
            - heading "Recent Orders" [level=2] [ref=e298]
            - button "View All" [ref=e299] [cursor=pointer]
          - table [ref=e301]:
            - rowgroup [ref=e302]:
              - row "Order Customer Items Total Status Date" [ref=e303]:
                - columnheader "Order" [ref=e304]
                - columnheader "Customer" [ref=e305]
                - columnheader "Items" [ref=e306]
                - columnheader "Total" [ref=e307]
                - columnheader "Status" [ref=e308]
                - columnheader "Date" [ref=e309]
            - rowgroup [ref=e310]:
              - row "ORD-MPEGZ8TL-324E Walk-in 1 ₹1,574.77 CONFIRMED May 21, 2026, 01:13 AM" [ref=e311]:
                - cell "ORD-MPEGZ8TL-324E" [ref=e312]
                - cell "Walk-in" [ref=e313]
                - cell "1" [ref=e314]
                - cell "₹1,574.77" [ref=e315]
                - cell "CONFIRMED" [ref=e316]
                - cell "May 21, 2026, 01:13 AM" [ref=e317]
              - row "ORD-MPEGVU7R-D25A Walk-in 1 ₹1,363.61 CONFIRMED May 21, 2026, 01:10 AM" [ref=e318]:
                - cell "ORD-MPEGVU7R-D25A" [ref=e319]
                - cell "Walk-in" [ref=e320]
                - cell "1" [ref=e321]
                - cell "₹1,363.61" [ref=e322]
                - cell "CONFIRMED" [ref=e323]
                - cell "May 21, 2026, 01:10 AM" [ref=e324]
              - row "ORD-MPEGHP1B-3EC2 Walk-in 2 ₹1,573.72 READY May 21, 2026, 12:59 AM" [ref=e325]:
                - cell "ORD-MPEGHP1B-3EC2" [ref=e326]
                - cell "Walk-in" [ref=e327]
                - cell "2" [ref=e328]
                - cell "₹1,573.72" [ref=e329]
                - cell "READY" [ref=e330]
                - cell "May 21, 2026, 12:59 AM" [ref=e331]
              - row "ORD-MPEGD8XZ-67D5 Walk-in 3 ₹4,356.61 PENDING May 21, 2026, 12:56 AM" [ref=e332]:
                - cell "ORD-MPEGD8XZ-67D5" [ref=e333]
                - cell "Walk-in" [ref=e334]
                - cell "3" [ref=e335]
                - cell "₹4,356.61" [ref=e336]
                - cell "PENDING" [ref=e337]
                - cell "May 21, 2026, 12:56 AM" [ref=e338]
              - row "ORD-MPEFFZJB-1E3D Walk-in 2 ₹2,780.79 PENDING May 21, 2026, 12:30 AM" [ref=e339]:
                - cell "ORD-MPEFFZJB-1E3D" [ref=e340]
                - cell "Walk-in" [ref=e341]
                - cell "2" [ref=e342]
                - cell "₹2,780.79" [ref=e343]
                - cell "PENDING" [ref=e344]
                - cell "May 21, 2026, 12:30 AM" [ref=e345]
              - row "ORD-MPEFE6WR-7260 Walk-in 4 ₹10,918.31 PENDING May 21, 2026, 12:29 AM" [ref=e346]:
                - cell "ORD-MPEFE6WR-7260" [ref=e347]
                - cell "Walk-in" [ref=e348]
                - cell "4" [ref=e349]
                - cell "₹10,918.31" [ref=e350]
                - cell "PENDING" [ref=e351]
                - cell "May 21, 2026, 12:29 AM" [ref=e352]
              - row "ORD-MPEFCJ49-DC00 Walk-in 2 ₹1,573.72 PENDING May 21, 2026, 12:27 AM" [ref=e353]:
                - cell "ORD-MPEFCJ49-DC00" [ref=e354]
                - cell "Walk-in" [ref=e355]
                - cell "2" [ref=e356]
                - cell "₹1,573.72" [ref=e357]
                - cell "PENDING" [ref=e358]
                - cell "May 21, 2026, 12:27 AM" [ref=e359]
              - row "ORD-MPE8E0KP-93FA Walk-in 1 ₹1,049.49 COMPLETED May 20, 2026, 09:13 PM" [ref=e360]:
                - cell "ORD-MPE8E0KP-93FA" [ref=e361]
                - cell "Walk-in" [ref=e362]
                - cell "1" [ref=e363]
                - cell "₹1,049.49" [ref=e364]
                - cell "COMPLETED" [ref=e365]
                - cell "May 20, 2026, 09:13 PM" [ref=e366]
        - generic [ref=e367]:
          - heading "Top Products" [level=2] [ref=e369]
          - generic [ref=e370]:
            - generic [ref=e371]:
              - generic [ref=e372]:
                - generic [ref=e373]: "1"
                - generic [ref=e374]:
                  - paragraph [ref=e375]: Antacid Tablets (60)
                  - paragraph [ref=e376]: 33 sold
              - paragraph [ref=e377]: ₹628.39
            - generic [ref=e378]:
              - generic [ref=e379]:
                - generic [ref=e380]: "2"
                - generic [ref=e381]:
                  - paragraph [ref=e382]: Espresso
                  - paragraph [ref=e383]: 12 sold
              - paragraph [ref=e384]: ₹338.89
            - generic [ref=e385]:
              - generic [ref=e386]:
                - generic [ref=e387]: "3"
                - generic [ref=e388]:
                  - paragraph [ref=e389]: Allergy Relief (30)
                  - paragraph [ref=e390]: 8 sold
              - paragraph [ref=e391]: ₹967.28
            - generic [ref=e392]:
              - generic [ref=e393]:
                - generic [ref=e394]: "4"
                - generic [ref=e395]:
                  - paragraph [ref=e396]: Cappuccino
                  - paragraph [ref=e397]: 7 sold
              - paragraph [ref=e398]: ₹435.71
            - generic [ref=e399]:
              - generic [ref=e400]:
                - generic [ref=e401]: "5"
                - generic [ref=e402]:
                  - paragraph [ref=e403]: Adhesive Bandages (50)
                  - paragraph [ref=e404]: 7 sold
              - paragraph [ref=e405]: ₹483.15
      - generic [ref=e406]:
        - generic [ref=e407]:
          - heading "Recent Activity" [level=2] [ref=e408]:
            - img [ref=e409]
            - text: Recent Activity
          - generic [ref=e412]: Live
        - generic [ref=e414]:
          - generic [ref=e415]:
            - img [ref=e417]
            - paragraph [ref=e421]: "New order #ORD-045 placed"
            - generic [ref=e422]: 2 min ago
          - generic [ref=e423]:
            - img [ref=e425]
            - paragraph [ref=e428]: Payment of $32.50 received
            - generic [ref=e429]: 5 min ago
          - generic [ref=e430]:
            - img [ref=e432]
            - paragraph [ref=e436]: "New customer registered: Mike Lee"
            - generic [ref=e437]: 12 min ago
          - generic [ref=e438]:
            - img [ref=e440]
            - paragraph [ref=e444]: "Order #ORD-044 completed"
            - generic [ref=e445]: 18 min ago
          - generic [ref=e446]:
            - img [ref=e448]
            - paragraph [ref=e453]: "Stock updated: Cappuccino +20"
            - generic [ref=e454]: 25 min ago
          - generic [ref=e455]:
            - img [ref=e457]
            - paragraph [ref=e460]: Refund of $12.00 processed
            - generic [ref=e461]: 30 min ago
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Dashboard', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.route('**/api/settings', async (route) => {
  6  |       const response = await route.fetch();
  7  |       const json = await response.json();
  8  |       if (json.data) {
  9  |         json.data = json.data.map((s: any) => s.key === 'businessType' ? { ...s, value: 'RESTAURANT' } : s);
  10 |       }
  11 |       await route.fulfill({ json });
  12 |     });
  13 |     await page.goto('/dashboard');
  14 |   });
  15 | 
  16 |   test.afterEach(async ({ page }) => {
  17 |     await page.unrouteAll({ behavior: 'ignoreErrors' });
  18 |   });
  19 | 
  20 |   test.describe('Page Header', () => {
  21 |     test('should display greeting and welcome message', async ({ page }) => {
  22 |       // Dashboard shows a greeting like "Good morning, Admin!"
  23 |       await expect(page.getByText(/Good (morning|afternoon|evening|night)/)).toBeVisible({ timeout: 15000 });
  24 |       await expect(page.getByText(/Here's what's happening/)).toBeVisible();
  25 |     });
  26 |   });
  27 | 
  28 |   test.describe('Stats Cards', () => {
  29 |     test('should display stat cards', async ({ page }) => {
  30 |       await expect(page.getByText('Revenue')).toBeVisible({ timeout: 15000 });
  31 |       await expect(page.getByText(/Today.*Orders/)).toBeVisible();
  32 |       await expect(page.getByText(/Total.*Order/)).toBeVisible();
  33 |     });
  34 | 
  35 |     test('should display revenue with dollar sign', async ({ page }) => {
> 36 |       await expect(page.getByText('Revenue')).toBeVisible({ timeout: 15000 });
     |                                               ^ Error: expect(locator).toBeVisible() failed
  37 |       // Revenue card should contain a dollar amount
  38 |       await expect(page.getByText(/\$[\d,.]+/).first()).toBeVisible();
  39 |     });
  40 |   });
  41 | 
  42 |   test.describe('Recent Orders Table', () => {
  43 |     test('should display recent orders section with table', async ({ page }) => {
  44 |       await expect(page.getByRole('heading', { name: /Recent Orders/ })).toBeVisible({ timeout: 15000 });
  45 |       await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
  46 |     });
  47 | 
  48 |     test('should show order data with order numbers', async ({ page }) => {
  49 |       await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
  50 |       await expect(page.getByText(/^ORD-/).first()).toBeVisible();
  51 |     });
  52 | 
  53 |     test('should display order status badges', async ({ page }) => {
  54 |       await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
  55 |       // At least one status badge should be present
  56 |       const statusBadge = page.getByText(/COMPLETED|CONFIRMED|PREPARING|READY|PENDING|SERVED/).first();
  57 |       await expect(statusBadge).toBeVisible();
  58 |     });
  59 | 
  60 |     test('should have View All button that navigates to orders', async ({ page }) => {
  61 |       await page.getByRole('button', { name: 'View All' }).click();
  62 |       await expect(page).toHaveURL(/\/orders/);
  63 |     });
  64 |   });
  65 | 
  66 |   test.describe('Top Products', () => {
  67 |     test('should display top products section', async ({ page }) => {
  68 |       await expect(page.getByRole('heading', { name: /Top Products/ })).toBeVisible({ timeout: 15000 });
  69 |     });
  70 | 
  71 |     test('should show product names with ranking', async ({ page }) => {
  72 |       await expect(page.getByText('Classic Burger')).toBeVisible({ timeout: 15000 });
  73 |     });
  74 |   });
  75 | });
  76 | 
```