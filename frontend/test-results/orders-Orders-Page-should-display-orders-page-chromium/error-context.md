# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: orders.spec.ts >> Orders Page >> should display orders page
- Location: e2e\orders.spec.ts:21:3

# Error details

```
Error: "route.fetch: Target page, context or browser has been closed
Call log:
  - → GET http://localhost:5173/api/settings
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.96 Safari/537.36
    - accept: application/json, text/plain, */*
    - accept-encoding: gzip,deflate,br
    - accept-language: en-US
    - authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmZTMxMDNkOC0wNDY3LTRlODYtOTcxOS03NTg4YTg0ZjkzNzAiLCJlbWFpbCI6ImFkbWluQG15cG9zLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3OTI2NjY2NCwiZXhwIjoxNzc5MjcwMjY0fQ.HTw-Qwld0PQzTRcskRwbpF8iLL7o7A_zynt5jwQ0BQo
    - referer: http://localhost:5173/orders
    - sec-ch-ua: "Chromium";v="148", "HeadlessChrome";v="148", "Not/A)Brand";v="99"
    - sec-ch-ua-mobile: ?0
    - sec-ch-ua-platform: "Windows"
" while running route callback.
Consider awaiting `await page.unrouteAll({ behavior: 'ignoreErrors' })`
before the end of the test to ignore remaining routes in flight.
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img [ref=e8]
        - generic [ref=e12]: MyPOS Restaurant
      - navigation [ref=e13]:
        - link "Dashboard" [ref=e14] [cursor=pointer]:
          - /url: /dashboard
          - img [ref=e15]
          - text: Dashboard
        - link "POS" [ref=e20] [cursor=pointer]:
          - /url: /pos
          - img [ref=e21]
          - text: POS
        - link "Orders" [ref=e25] [cursor=pointer]:
          - /url: /orders
          - img [ref=e26]
          - text: Orders
        - link "Tables" [ref=e29] [cursor=pointer]:
          - /url: /tables
          - img [ref=e30]
          - text: Tables
        - link "Kitchen" [ref=e35] [cursor=pointer]:
          - /url: /kitchen
          - img [ref=e36]
          - text: Kitchen
        - link "Products" [ref=e38] [cursor=pointer]:
          - /url: /products
          - img [ref=e39]
          - text: Products
        - link "Customers" [ref=e43] [cursor=pointer]:
          - /url: /customers
          - img [ref=e44]
          - text: Customers
        - link "Reports" [ref=e49] [cursor=pointer]:
          - /url: /reports
          - img [ref=e50]
          - text: Reports
        - link "Employees" [ref=e52] [cursor=pointer]:
          - /url: /employees
          - img [ref=e53]
          - text: Employees
        - link "Inventory" [ref=e65] [cursor=pointer]:
          - /url: /inventory
          - img [ref=e66]
          - text: Inventory
        - link "Settings" [ref=e69] [cursor=pointer]:
          - /url: /settings
          - img [ref=e70]
          - text: Settings
      - generic [ref=e74]:
        - generic [ref=e76]: AU
        - generic [ref=e77]:
          - paragraph [ref=e78]: Admin User
          - paragraph [ref=e79]: ADMIN
        - button [ref=e80] [cursor=pointer]:
          - img [ref=e81]
  - main [ref=e84]:
    - generic [ref=e86]:
      - generic [ref=e88]:
        - heading "Orders" [level=1] [ref=e89]
        - paragraph [ref=e90]: Manage and track all orders
      - generic [ref=e91]:
        - generic [ref=e92]:
          - img [ref=e93]
          - textbox "Search orders..." [ref=e96]
        - generic [ref=e97]:
          - button "ALL" [ref=e98] [cursor=pointer]
          - button "PENDING" [ref=e99] [cursor=pointer]
          - button "CONFIRMED" [ref=e100] [cursor=pointer]
          - button "PREPARING" [ref=e101] [cursor=pointer]
          - button "READY" [ref=e102] [cursor=pointer]
          - button "SERVED" [ref=e103] [cursor=pointer]
          - button "COMPLETED" [ref=e104] [cursor=pointer]
          - button "CANCELLED" [ref=e105] [cursor=pointer]
      - table [ref=e108]:
        - rowgroup [ref=e109]:
          - row "Order Customer Type Items Total Status Date Actions" [ref=e110]:
            - columnheader "Order" [ref=e111]
            - columnheader "Customer" [ref=e112]
            - columnheader "Type" [ref=e113]
            - columnheader "Items" [ref=e114]
            - columnheader "Total" [ref=e115]
            - columnheader "Status" [ref=e116]
            - columnheader "Date" [ref=e117]
            - columnheader "Actions" [ref=e118]
        - rowgroup [ref=e119]:
          - row "ORD-MPDSOGMW-ED7D Walk-in WALK IN 1 $16.28 PENDING May 20, 2026, 01:53 PM CONFIRMED Cancel" [ref=e120]:
            - cell "ORD-MPDSOGMW-ED7D" [ref=e121]
            - cell "Walk-in" [ref=e122]
            - cell "WALK IN" [ref=e123]
            - cell "1" [ref=e124]
            - cell "$16.28" [ref=e125]
            - cell "PENDING" [ref=e126]
            - cell "May 20, 2026, 01:53 PM" [ref=e127]
            - cell "CONFIRMED Cancel" [ref=e128]:
              - generic [ref=e129]:
                - button [ref=e130] [cursor=pointer]:
                  - img [ref=e131]
                - button "CONFIRMED" [ref=e134] [cursor=pointer]
                - button "Cancel" [ref=e135] [cursor=pointer]
          - row "ORD-MPDS50R5-9FDE Walk-in DINE IN 1 $16.26 PENDING May 20, 2026, 01:38 PM CONFIRMED Cancel" [ref=e136]:
            - cell "ORD-MPDS50R5-9FDE" [ref=e137]
            - cell "Walk-in" [ref=e138]
            - cell "DINE IN" [ref=e139]
            - cell "1" [ref=e140]
            - cell "$16.26" [ref=e141]
            - cell "PENDING" [ref=e142]
            - cell "May 20, 2026, 01:38 PM" [ref=e143]
            - cell "CONFIRMED Cancel" [ref=e144]:
              - generic [ref=e145]:
                - button [ref=e146] [cursor=pointer]:
                  - img [ref=e147]
                - button "CONFIRMED" [ref=e150] [cursor=pointer]
                - button "Cancel" [ref=e151] [cursor=pointer]
          - row "ORD-MPDS50M9-D188 Walk-in IN STORE 1 $2.16 PENDING May 20, 2026, 01:38 PM CONFIRMED Cancel" [ref=e152]:
            - cell "ORD-MPDS50M9-D188" [ref=e153]
            - cell "Walk-in" [ref=e154]
            - cell "IN STORE" [ref=e155]
            - cell "1" [ref=e156]
            - cell "$2.16" [ref=e157]
            - cell "PENDING" [ref=e158]
            - cell "May 20, 2026, 01:38 PM" [ref=e159]
            - cell "CONFIRMED Cancel" [ref=e160]:
              - generic [ref=e161]:
                - button [ref=e162] [cursor=pointer]:
                  - img [ref=e163]
                - button "CONFIRMED" [ref=e166] [cursor=pointer]
                - button "Cancel" [ref=e167] [cursor=pointer]
          - row "ORD-MPDS50KE-530E Walk-in DINE IN 1 $4.34 PENDING May 20, 2026, 01:38 PM CONFIRMED Cancel" [ref=e168]:
            - cell "ORD-MPDS50KE-530E" [ref=e169]
            - cell "Walk-in" [ref=e170]
            - cell "DINE IN" [ref=e171]
            - cell "1" [ref=e172]
            - cell "$4.34" [ref=e173]
            - cell "PENDING" [ref=e174]
            - cell "May 20, 2026, 01:38 PM" [ref=e175]
            - cell "CONFIRMED Cancel" [ref=e176]:
              - generic [ref=e177]:
                - button [ref=e178] [cursor=pointer]:
                  - img [ref=e179]
                - button "CONFIRMED" [ref=e182] [cursor=pointer]
                - button "Cancel" [ref=e183] [cursor=pointer]
          - row "ORD-MPDS50IL-580F Walk-in IN STORE 1 $59.66 PENDING May 20, 2026, 01:38 PM CONFIRMED Cancel" [ref=e184]:
            - cell "ORD-MPDS50IL-580F" [ref=e185]
            - cell "Walk-in" [ref=e186]
            - cell "IN STORE" [ref=e187]
            - cell "1" [ref=e188]
            - cell "$59.66" [ref=e189]
            - cell "PENDING" [ref=e190]
            - cell "May 20, 2026, 01:38 PM" [ref=e191]
            - cell "CONFIRMED Cancel" [ref=e192]:
              - generic [ref=e193]:
                - button [ref=e194] [cursor=pointer]:
                  - img [ref=e195]
                - button "CONFIRMED" [ref=e198] [cursor=pointer]
                - button "Cancel" [ref=e199] [cursor=pointer]
          - row "ORD-MPDS50G7-C356 Walk-in WALK IN 1 $86.80 PENDING May 20, 2026, 01:38 PM CONFIRMED Cancel" [ref=e200]:
            - cell "ORD-MPDS50G7-C356" [ref=e201]
            - cell "Walk-in" [ref=e202]
            - cell "WALK IN" [ref=e203]
            - cell "1" [ref=e204]
            - cell "$86.80" [ref=e205]
            - cell "PENDING" [ref=e206]
            - cell "May 20, 2026, 01:38 PM" [ref=e207]
            - cell "CONFIRMED Cancel" [ref=e208]:
              - generic [ref=e209]:
                - button [ref=e210] [cursor=pointer]:
                  - img [ref=e211]
                - button "CONFIRMED" [ref=e214] [cursor=pointer]
                - button "Cancel" [ref=e215] [cursor=pointer]
          - row "ORD-MPDS4P9O-F879 Walk-in IN STORE 1 $5.41 PENDING May 20, 2026, 01:37 PM CONFIRMED Cancel" [ref=e216]:
            - cell "ORD-MPDS4P9O-F879" [ref=e217]
            - cell "Walk-in" [ref=e218]
            - cell "IN STORE" [ref=e219]
            - cell "1" [ref=e220]
            - cell "$5.41" [ref=e221]
            - cell "PENDING" [ref=e222]
            - cell "May 20, 2026, 01:37 PM" [ref=e223]
            - cell "CONFIRMED Cancel" [ref=e224]:
              - generic [ref=e225]:
                - button [ref=e226] [cursor=pointer]:
                  - img [ref=e227]
                - button "CONFIRMED" [ref=e230] [cursor=pointer]
                - button "Cancel" [ref=e231] [cursor=pointer]
          - row "ORD-MPCLF59W-A57D Walk-in IN STORE 3 $25.46 COMPLETED May 19, 2026, 05:42 PM" [ref=e232]:
            - cell "ORD-MPCLF59W-A57D" [ref=e233]
            - cell "Walk-in" [ref=e234]
            - cell "IN STORE" [ref=e235]
            - cell "3" [ref=e236]
            - cell "$25.46" [ref=e237]
            - cell "COMPLETED" [ref=e238]
            - cell "May 19, 2026, 05:42 PM" [ref=e239]
            - cell [ref=e240]:
              - button [ref=e242] [cursor=pointer]:
                - img [ref=e243]
          - row "ORD-MPCL3FTT-E035 Walk-in WALK IN 1 $16.28 PENDING May 19, 2026, 05:33 PM CONFIRMED Cancel" [ref=e246]:
            - cell "ORD-MPCL3FTT-E035" [ref=e247]
            - cell "Walk-in" [ref=e248]
            - cell "WALK IN" [ref=e249]
            - cell "1" [ref=e250]
            - cell "$16.28" [ref=e251]
            - cell "PENDING" [ref=e252]
            - cell "May 19, 2026, 05:33 PM" [ref=e253]
            - cell "CONFIRMED Cancel" [ref=e254]:
              - generic [ref=e255]:
                - button [ref=e256] [cursor=pointer]:
                  - img [ref=e257]
                - button "CONFIRMED" [ref=e260] [cursor=pointer]
                - button "Cancel" [ref=e261] [cursor=pointer]
          - row "ORD-MPCL1FCV-BF7E Walk-in IN STORE 1 $9.75 PENDING May 19, 2026, 05:31 PM CONFIRMED Cancel" [ref=e262]:
            - cell "ORD-MPCL1FCV-BF7E" [ref=e263]
            - cell "Walk-in" [ref=e264]
            - cell "IN STORE" [ref=e265]
            - cell "1" [ref=e266]
            - cell "$9.75" [ref=e267]
            - cell "PENDING" [ref=e268]
            - cell "May 19, 2026, 05:31 PM" [ref=e269]
            - cell "CONFIRMED Cancel" [ref=e270]:
              - generic [ref=e271]:
                - button [ref=e272] [cursor=pointer]:
                  - img [ref=e273]
                - button "CONFIRMED" [ref=e276] [cursor=pointer]
                - button "Cancel" [ref=e277] [cursor=pointer]
          - row "ORD-MPCL0T0Z-B2C1 Walk-in IN STORE 1 $5.41 PENDING May 19, 2026, 05:31 PM CONFIRMED Cancel" [ref=e278]:
            - cell "ORD-MPCL0T0Z-B2C1" [ref=e279]
            - cell "Walk-in" [ref=e280]
            - cell "IN STORE" [ref=e281]
            - cell "1" [ref=e282]
            - cell "$5.41" [ref=e283]
            - cell "PENDING" [ref=e284]
            - cell "May 19, 2026, 05:31 PM" [ref=e285]
            - cell "CONFIRMED Cancel" [ref=e286]:
              - generic [ref=e287]:
                - button [ref=e288] [cursor=pointer]:
                  - img [ref=e289]
                - button "CONFIRMED" [ref=e292] [cursor=pointer]
                - button "Cancel" [ref=e293] [cursor=pointer]
          - row "ORD-MPCKXZ66-812E Walk-in IN STORE 1 $5.41 PENDING May 19, 2026, 05:29 PM CONFIRMED Cancel" [ref=e294]:
            - cell "ORD-MPCKXZ66-812E" [ref=e295]
            - cell "Walk-in" [ref=e296]
            - cell "IN STORE" [ref=e297]
            - cell "1" [ref=e298]
            - cell "$5.41" [ref=e299]
            - cell "PENDING" [ref=e300]
            - cell "May 19, 2026, 05:29 PM" [ref=e301]
            - cell "CONFIRMED Cancel" [ref=e302]:
              - generic [ref=e303]:
                - button [ref=e304] [cursor=pointer]:
                  - img [ref=e305]
                - button "CONFIRMED" [ref=e308] [cursor=pointer]
                - button "Cancel" [ref=e309] [cursor=pointer]
          - row "ORD-MPCKU9T2-4A85 Walk-in PICKUP 1 $59.66 PENDING May 19, 2026, 05:26 PM CONFIRMED Cancel" [ref=e310]:
            - cell "ORD-MPCKU9T2-4A85" [ref=e311]
            - cell "Walk-in" [ref=e312]
            - cell "PICKUP" [ref=e313]
            - cell "1" [ref=e314]
            - cell "$59.66" [ref=e315]
            - cell "PENDING" [ref=e316]
            - cell "May 19, 2026, 05:26 PM" [ref=e317]
            - cell "CONFIRMED Cancel" [ref=e318]:
              - generic [ref=e319]:
                - button [ref=e320] [cursor=pointer]:
                  - img [ref=e321]
                - button "CONFIRMED" [ref=e324] [cursor=pointer]
                - button "Cancel" [ref=e325] [cursor=pointer]
          - row "ORD-MPCKU9SA-0AE9 Walk-in APPOINTMENT 1 $27.13 PENDING May 19, 2026, 05:26 PM CONFIRMED Cancel" [ref=e326]:
            - cell "ORD-MPCKU9SA-0AE9" [ref=e327]
            - cell "Walk-in" [ref=e328]
            - cell "APPOINTMENT" [ref=e329]
            - cell "1" [ref=e330]
            - cell "$27.13" [ref=e331]
            - cell "PENDING" [ref=e332]
            - cell "May 19, 2026, 05:26 PM" [ref=e333]
            - cell "CONFIRMED Cancel" [ref=e334]:
              - generic [ref=e335]:
                - button [ref=e336] [cursor=pointer]:
                  - img [ref=e337]
                - button "CONFIRMED" [ref=e340] [cursor=pointer]
                - button "Cancel" [ref=e341] [cursor=pointer]
          - row "ORD-MPCKU9RA-BAD6 Walk-in IN STORE 1 $59.66 PENDING May 19, 2026, 05:26 PM CONFIRMED Cancel" [ref=e342]:
            - cell "ORD-MPCKU9RA-BAD6" [ref=e343]
            - cell "Walk-in" [ref=e344]
            - cell "IN STORE" [ref=e345]
            - cell "1" [ref=e346]
            - cell "$59.66" [ref=e347]
            - cell "PENDING" [ref=e348]
            - cell "May 19, 2026, 05:26 PM" [ref=e349]
            - cell "CONFIRMED Cancel" [ref=e350]:
              - generic [ref=e351]:
                - button [ref=e352] [cursor=pointer]:
                  - img [ref=e353]
                - button "CONFIRMED" [ref=e356] [cursor=pointer]
                - button "Cancel" [ref=e357] [cursor=pointer]
          - row "ORD-MPCKU21S-5571 Walk-in WALK IN 1 $86.80 PENDING May 19, 2026, 05:25 PM CONFIRMED Cancel" [ref=e358]:
            - cell "ORD-MPCKU21S-5571" [ref=e359]
            - cell "Walk-in" [ref=e360]
            - cell "WALK IN" [ref=e361]
            - cell "1" [ref=e362]
            - cell "$86.80" [ref=e363]
            - cell "PENDING" [ref=e364]
            - cell "May 19, 2026, 05:25 PM" [ref=e365]
            - cell "CONFIRMED Cancel" [ref=e366]:
              - generic [ref=e367]:
                - button [ref=e368] [cursor=pointer]:
                  - img [ref=e369]
                - button "CONFIRMED" [ref=e372] [cursor=pointer]
                - button "Cancel" [ref=e373] [cursor=pointer]
          - row "ORD-009 John Doe DINE IN 2 $29.26 CONFIRMED May 19, 2026, 04:42 PM PREPARING Cancel" [ref=e374]:
            - cell "ORD-009" [ref=e375]
            - cell "John Doe" [ref=e376]
            - cell "DINE IN" [ref=e377]
            - cell "2" [ref=e378]
            - cell "$29.26" [ref=e379]
            - cell "CONFIRMED" [ref=e380]
            - cell "May 19, 2026, 04:42 PM" [ref=e381]
            - cell "PREPARING Cancel" [ref=e382]:
              - generic [ref=e383]:
                - button [ref=e384] [cursor=pointer]:
                  - img [ref=e385]
                - button "PREPARING" [ref=e388] [cursor=pointer]
                - button "Cancel" [ref=e389] [cursor=pointer]
          - row "ORD-004 Sarah Williams DINE IN 3 $26.01 READY May 19, 2026, 04:28 PM SERVED Cancel" [ref=e390]:
            - cell "ORD-004" [ref=e391]
            - cell "Sarah Williams" [ref=e392]
            - cell "DINE IN" [ref=e393]
            - cell "3" [ref=e394]
            - cell "$26.01" [ref=e395]
            - cell "READY" [ref=e396]
            - cell "May 19, 2026, 04:28 PM" [ref=e397]
            - cell "SERVED Cancel" [ref=e398]:
              - generic [ref=e399]:
                - button [ref=e400] [cursor=pointer]:
                  - img [ref=e401]
                - button "SERVED" [ref=e404] [cursor=pointer]
                - button "Cancel" [ref=e405] [cursor=pointer]
          - row "ORD-003 Mike Johnson TAKEAWAY 1 $16.26 PREPARING May 19, 2026, 04:13 PM READY Cancel" [ref=e406]:
            - cell "ORD-003" [ref=e407]
            - cell "Mike Johnson" [ref=e408]
            - cell "TAKEAWAY" [ref=e409]
            - cell "1" [ref=e410]
            - cell "$16.26" [ref=e411]
            - cell "PREPARING" [ref=e412]
            - cell "May 19, 2026, 04:13 PM" [ref=e413]
            - cell "READY Cancel" [ref=e414]:
              - generic [ref=e415]:
                - button [ref=e416] [cursor=pointer]:
                  - img [ref=e417]
                - button "READY" [ref=e420] [cursor=pointer]
                - button "Cancel" [ref=e421] [cursor=pointer]
          - row "ORD-002 Jane Smith DINE IN 2 $20.04 CONFIRMED May 19, 2026, 03:59 PM PREPARING Cancel" [ref=e422]:
            - cell "ORD-002" [ref=e423]
            - cell "Jane Smith" [ref=e424]
            - cell "DINE IN" [ref=e425]
            - cell "2" [ref=e426]
            - cell "$20.04" [ref=e427]
            - cell "CONFIRMED" [ref=e428]
            - cell "May 19, 2026, 03:59 PM" [ref=e429]
            - cell "PREPARING Cancel" [ref=e430]:
              - generic [ref=e431]:
                - button [ref=e432] [cursor=pointer]:
                  - img [ref=e433]
                - button "PREPARING" [ref=e436] [cursor=pointer]
                - button "Cancel" [ref=e437] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Orders Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.route('**/api/settings', async (route) => {
> 6  |       const response = await route.fetch();
     |                                    ^ Error: "route.fetch: Target page, context or browser has been closed
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
  18 |     await page.goto('/orders');
  19 |   });
  20 | 
  21 |   test('should display orders page', async ({ page }) => {
  22 |     await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
  23 |     await expect(page.getByText('Manage and track all orders')).toBeVisible();
  24 |   });
  25 | 
  26 |   test('should display status filter tabs', async ({ page }) => {
  27 |     const filterSection = page.locator('[class*="gap"]').filter({ has: page.getByRole('button', { name: 'ALL' }) }).first();
  28 |     await expect(filterSection.getByRole('button', { name: 'ALL' })).toBeVisible();
  29 |     await expect(filterSection.getByRole('button', { name: 'PENDING' })).toBeVisible();
  30 |     await expect(filterSection.getByRole('button', { name: 'CONFIRMED' })).toBeVisible();
  31 |     await expect(filterSection.getByRole('button', { name: 'PREPARING' })).toBeVisible();
  32 |     await expect(filterSection.getByRole('button', { name: 'READY' })).toBeVisible();
  33 |     await expect(filterSection.getByRole('button', { name: 'COMPLETED' })).toBeVisible();
  34 |   });
  35 | 
  36 |   test('should show orders in table', async ({ page }) => {
  37 |     await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
  38 |     await expect(page.getByText('ORD-001')).toBeVisible({ timeout: 15000 });
  39 |   });
  40 | 
  41 |   test('should filter orders by status', async ({ page }) => {
  42 |     await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
  43 |     await page.getByRole('button', { name: 'COMPLETED' }).first().click();
  44 |     // Completed orders should show in the table
  45 |     await expect(page.getByRole('cell', { name: 'COMPLETED' }).first()).toBeVisible();
  46 |   });
  47 | 
  48 |   test('should search orders', async ({ page }) => {
  49 |     await expect(page.getByRole('table')).toBeVisible({ timeout: 15000 });
  50 |     await page.getByPlaceholder('Search orders...').fill('John');
  51 |     await expect(page.getByText('John Doe').first()).toBeVisible();
  52 |   });
  53 | });
  54 | 
```