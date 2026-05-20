# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: customers.spec.ts >> Customers Page >> Loyalty Program >> should open loyalty modal for a customer
- Location: e2e\customers.spec.ts:85:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Loyalty Program')
Expected: visible
Error: strict mode violation: getByText('Loyalty Program') resolved to 2 elements:
    1) <p class="text-gray-500 mt-1">Manage customers & loyalty programs</p> aka getByText('Manage customers & loyalty')
    2) <h2 class="text-lg font-bold flex items-center gap-2">…</h2> aka getByRole('heading', { name: 'Loyalty Program' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Loyalty Program')

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
        - link "Appointments" [ref=e25] [cursor=pointer]:
          - /url: /orders
          - img [ref=e26]
          - text: Appointments
        - link "Stations" [ref=e29] [cursor=pointer]:
          - /url: /tables
          - img [ref=e30]
          - text: Stations
        - link "Services" [ref=e35] [cursor=pointer]:
          - /url: /products
          - img [ref=e36]
          - text: Services
        - link "Customers" [ref=e40] [cursor=pointer]:
          - /url: /customers
          - img [ref=e41]
          - text: Customers
        - link "Reports" [ref=e46] [cursor=pointer]:
          - /url: /reports
          - img [ref=e47]
          - text: Reports
        - link "Employees" [ref=e49] [cursor=pointer]:
          - /url: /employees
          - img [ref=e50]
          - text: Employees
        - link "Inventory" [ref=e62] [cursor=pointer]:
          - /url: /inventory
          - img [ref=e63]
          - text: Inventory
        - link "Settings" [ref=e66] [cursor=pointer]:
          - /url: /settings
          - img [ref=e67]
          - text: Settings
      - generic [ref=e71]:
        - generic [ref=e73]: AU
        - generic [ref=e74]:
          - paragraph [ref=e75]: Admin User
          - paragraph [ref=e76]: ADMIN
        - button [ref=e77] [cursor=pointer]:
          - img [ref=e78]
  - main [ref=e81]:
    - generic [ref=e83]:
      - generic [ref=e84]:
        - generic [ref=e85]:
          - heading "Customers" [level=1] [ref=e86]
          - paragraph [ref=e87]: Manage customers & loyalty programs
        - button "Add Customer" [ref=e88] [cursor=pointer]:
          - img [ref=e89]
          - text: Add Customer
      - generic [ref=e90]:
        - img [ref=e91]
        - textbox "Search customers..." [ref=e94]
      - generic [ref=e95]:
        - generic [ref=e96]:
          - generic [ref=e97]:
            - generic [ref=e98]: ED
            - generic [ref=e99]:
              - paragraph [ref=e100]: Emily Davis
              - paragraph [ref=e101]: emily@example.com
              - generic [ref=e102]:
                - img [ref=e103]
                - text: SILVER
          - generic [ref=e106]:
            - generic [ref=e107]:
              - paragraph [ref=e108]: "600"
              - paragraph [ref=e109]: Points
            - generic [ref=e110]:
              - paragraph [ref=e111]: $1,675.25
              - paragraph [ref=e112]: Spent
            - generic [ref=e113]:
              - paragraph [ref=e114]: $0.00
              - paragraph [ref=e115]: Credit
          - generic [ref=e116]:
            - button "Loyalty" [active] [ref=e117] [cursor=pointer]:
              - img [ref=e118]
              - text: Loyalty
            - button "Edit" [ref=e120] [cursor=pointer]
            - button "Delete" [ref=e121] [cursor=pointer]
        - generic [ref=e122]:
          - generic [ref=e123]:
            - generic [ref=e124]: DB
            - generic [ref=e125]:
              - paragraph [ref=e126]: David Brown
              - paragraph [ref=e127]: david@example.com
              - generic [ref=e128]:
                - img [ref=e129]
                - text: BRONZE
          - generic [ref=e132]:
            - generic [ref=e133]:
              - paragraph [ref=e134]: "350"
              - paragraph [ref=e135]: Points
            - generic [ref=e136]:
              - paragraph [ref=e137]: $920.00
              - paragraph [ref=e138]: Spent
            - generic [ref=e139]:
              - paragraph [ref=e140]: $0.00
              - paragraph [ref=e141]: Credit
          - generic [ref=e142]:
            - button "Loyalty" [ref=e143] [cursor=pointer]:
              - img [ref=e144]
              - text: Loyalty
            - button "Edit" [ref=e146] [cursor=pointer]
            - button "Delete" [ref=e147] [cursor=pointer]
        - generic [ref=e148]:
          - generic [ref=e149]:
            - generic [ref=e150]: SW
            - generic [ref=e151]:
              - paragraph [ref=e152]: Sarah Williams
              - paragraph [ref=e153]: sarah@example.com
              - generic [ref=e154]:
                - img [ref=e155]
                - text: SILVER
          - generic [ref=e158]:
            - generic [ref=e159]:
              - paragraph [ref=e160]: "1200"
              - paragraph [ref=e161]: Points
            - generic [ref=e162]:
              - paragraph [ref=e163]: $3,890.75
              - paragraph [ref=e164]: Spent
            - generic [ref=e165]:
              - paragraph [ref=e166]: $0.00
              - paragraph [ref=e167]: Credit
          - generic [ref=e168]:
            - button "Loyalty" [ref=e169] [cursor=pointer]:
              - img [ref=e170]
              - text: Loyalty
            - button "Edit" [ref=e172] [cursor=pointer]
            - button "Delete" [ref=e173] [cursor=pointer]
        - generic [ref=e174]:
          - generic [ref=e175]:
            - generic [ref=e176]: MJ
            - generic [ref=e177]:
              - paragraph [ref=e178]: Mike Johnson
              - paragraph [ref=e179]: mike@example.com
              - generic [ref=e180]:
                - img [ref=e181]
                - text: BRONZE
          - generic [ref=e184]:
            - generic [ref=e185]:
              - paragraph [ref=e186]: "200"
              - paragraph [ref=e187]: Points
            - generic [ref=e188]:
              - paragraph [ref=e189]: $680.00
              - paragraph [ref=e190]: Spent
            - generic [ref=e191]:
              - paragraph [ref=e192]: $0.00
              - paragraph [ref=e193]: Credit
          - generic [ref=e194]:
            - button "Loyalty" [ref=e195] [cursor=pointer]:
              - img [ref=e196]
              - text: Loyalty
            - button "Edit" [ref=e198] [cursor=pointer]
            - button "Delete" [ref=e199] [cursor=pointer]
        - generic [ref=e200]:
          - generic [ref=e201]:
            - generic [ref=e202]: JS
            - generic [ref=e203]:
              - paragraph [ref=e204]: Jane Smith
              - paragraph [ref=e205]: jane@example.com
              - generic [ref=e206]:
                - img [ref=e207]
                - text: SILVER
          - generic [ref=e210]:
            - generic [ref=e211]:
              - paragraph [ref=e212]: "820"
              - paragraph [ref=e213]: Points
            - generic [ref=e214]:
              - paragraph [ref=e215]: $2,340.50
              - paragraph [ref=e216]: Spent
            - generic [ref=e217]:
              - paragraph [ref=e218]: $0.00
              - paragraph [ref=e219]: Credit
          - generic [ref=e220]:
            - button "Loyalty" [ref=e221] [cursor=pointer]:
              - img [ref=e222]
              - text: Loyalty
            - button "Edit" [ref=e224] [cursor=pointer]
            - button "Delete" [ref=e225] [cursor=pointer]
        - generic [ref=e226]:
          - generic [ref=e227]:
            - generic [ref=e228]: JD
            - generic [ref=e229]:
              - paragraph [ref=e230]: John Doe
              - paragraph [ref=e231]: john@example.com
              - generic [ref=e232]:
                - img [ref=e233]
                - text: BRONZE
          - generic [ref=e236]:
            - generic [ref=e237]:
              - paragraph [ref=e238]: "450"
              - paragraph [ref=e239]: Points
            - generic [ref=e240]:
              - paragraph [ref=e241]: $1,250.00
              - paragraph [ref=e242]: Spent
            - generic [ref=e243]:
              - paragraph [ref=e244]: $0.00
              - paragraph [ref=e245]: Credit
          - generic [ref=e246]:
            - button "Loyalty" [ref=e247] [cursor=pointer]:
              - img [ref=e248]
              - text: Loyalty
            - button "Edit" [ref=e250] [cursor=pointer]
            - button "Delete" [ref=e251] [cursor=pointer]
      - generic [ref=e253]:
        - generic [ref=e254]:
          - heading "Loyalty Program" [level=2] [ref=e255]:
            - img [ref=e256]
            - text: Loyalty Program
          - button [ref=e258] [cursor=pointer]:
            - img [ref=e259]
        - generic [ref=e262]:
          - paragraph [ref=e263]: "600"
          - paragraph [ref=e264]: Available Points
          - generic [ref=e265]: SILVER Member
        - generic [ref=e266]:
          - paragraph [ref=e267]:
            - img [ref=e268]
            - text: Redeem Points
          - paragraph [ref=e272]: 100 points = $1.00 discount
          - generic [ref=e273]:
            - spinbutton [ref=e274]
            - button "Redeem" [disabled] [ref=e275]
        - generic [ref=e276]:
          - heading "Points History" [level=3] [ref=e277]:
            - img [ref=e278]
            - text: Points History
          - paragraph [ref=e283]: No history yet
        - generic [ref=e284]:
          - paragraph [ref=e285]: Tier Progress
          - generic [ref=e286]:
            - generic [ref=e287]: BRONZE
            - generic [ref=e288]: SILVER
            - generic [ref=e289]: GOLD
            - generic [ref=e290]: PLATINUM
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
  80 |       await expect(page.getByRole('heading', { name: /Add Customer/i })).not.toBeVisible({ timeout: 5000 });
  81 |     });
  82 |   });
  83 | 
  84 |   test.describe('Loyalty Program', () => {
  85 |     test('should open loyalty modal for a customer', async ({ page }) => {
  86 |       await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
  87 |       const loyaltyButton = page.getByRole('button', { name: /Loyalty/i }).first();
  88 |       await loyaltyButton.click();
> 89 |       await expect(page.getByText('Loyalty Program')).toBeVisible();
     |                                                       ^ Error: expect(locator).toBeVisible() failed
  90 |     });
  91 |   });
  92 | });
  93 | 
```