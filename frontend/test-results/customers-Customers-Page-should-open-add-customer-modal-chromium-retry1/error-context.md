# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: customers.spec.ts >> Customers Page >> should open add customer modal
- Location: e2e\customers.spec.ts:30:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Add Customer')
Expected: visible
Error: strict mode violation: getByText('Add Customer') resolved to 2 elements:
    1) <button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">…</button> aka getByRole('button', { name: 'Add Customer' })
    2) <h2 class="text-lg font-bold">Add Customer</h2> aka getByRole('heading', { name: 'Add Customer' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Add Customer')

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
      - generic [ref=e87]:
        - generic [ref=e88]:
          - heading "Customers" [level=1] [ref=e89]
          - paragraph [ref=e90]: Manage customers & loyalty programs
        - button "Add Customer" [active] [ref=e91] [cursor=pointer]:
          - img [ref=e92]
          - text: Add Customer
      - generic [ref=e93]:
        - img [ref=e94]
        - textbox "Search customers..." [ref=e97]
      - generic [ref=e98]:
        - generic [ref=e99]:
          - generic [ref=e100]:
            - generic [ref=e101]: ED
            - generic [ref=e102]:
              - paragraph [ref=e103]: Emily Davis
              - paragraph [ref=e104]: emily@example.com
              - generic [ref=e105]:
                - img [ref=e106]
                - text: SILVER
          - generic [ref=e109]:
            - generic [ref=e110]:
              - paragraph [ref=e111]: "600"
              - paragraph [ref=e112]: Points
            - generic [ref=e113]:
              - paragraph [ref=e114]: $1,675.25
              - paragraph [ref=e115]: Spent
            - generic [ref=e116]:
              - paragraph [ref=e117]: $0.00
              - paragraph [ref=e118]: Credit
          - generic [ref=e119]:
            - button "Loyalty" [ref=e120] [cursor=pointer]:
              - img [ref=e121]
              - text: Loyalty
            - button "Edit" [ref=e123] [cursor=pointer]
            - button "Delete" [ref=e124] [cursor=pointer]
        - generic [ref=e125]:
          - generic [ref=e126]:
            - generic [ref=e127]: DB
            - generic [ref=e128]:
              - paragraph [ref=e129]: David Brown
              - paragraph [ref=e130]: david@example.com
              - generic [ref=e131]:
                - img [ref=e132]
                - text: BRONZE
          - generic [ref=e135]:
            - generic [ref=e136]:
              - paragraph [ref=e137]: "350"
              - paragraph [ref=e138]: Points
            - generic [ref=e139]:
              - paragraph [ref=e140]: $920.00
              - paragraph [ref=e141]: Spent
            - generic [ref=e142]:
              - paragraph [ref=e143]: $0.00
              - paragraph [ref=e144]: Credit
          - generic [ref=e145]:
            - button "Loyalty" [ref=e146] [cursor=pointer]:
              - img [ref=e147]
              - text: Loyalty
            - button "Edit" [ref=e149] [cursor=pointer]
            - button "Delete" [ref=e150] [cursor=pointer]
        - generic [ref=e151]:
          - generic [ref=e152]:
            - generic [ref=e153]: SW
            - generic [ref=e154]:
              - paragraph [ref=e155]: Sarah Williams
              - paragraph [ref=e156]: sarah@example.com
              - generic [ref=e157]:
                - img [ref=e158]
                - text: SILVER
          - generic [ref=e161]:
            - generic [ref=e162]:
              - paragraph [ref=e163]: "1200"
              - paragraph [ref=e164]: Points
            - generic [ref=e165]:
              - paragraph [ref=e166]: $3,890.75
              - paragraph [ref=e167]: Spent
            - generic [ref=e168]:
              - paragraph [ref=e169]: $0.00
              - paragraph [ref=e170]: Credit
          - generic [ref=e171]:
            - button "Loyalty" [ref=e172] [cursor=pointer]:
              - img [ref=e173]
              - text: Loyalty
            - button "Edit" [ref=e175] [cursor=pointer]
            - button "Delete" [ref=e176] [cursor=pointer]
        - generic [ref=e177]:
          - generic [ref=e178]:
            - generic [ref=e179]: MJ
            - generic [ref=e180]:
              - paragraph [ref=e181]: Mike Johnson
              - paragraph [ref=e182]: mike@example.com
              - generic [ref=e183]:
                - img [ref=e184]
                - text: BRONZE
          - generic [ref=e187]:
            - generic [ref=e188]:
              - paragraph [ref=e189]: "200"
              - paragraph [ref=e190]: Points
            - generic [ref=e191]:
              - paragraph [ref=e192]: $680.00
              - paragraph [ref=e193]: Spent
            - generic [ref=e194]:
              - paragraph [ref=e195]: $0.00
              - paragraph [ref=e196]: Credit
          - generic [ref=e197]:
            - button "Loyalty" [ref=e198] [cursor=pointer]:
              - img [ref=e199]
              - text: Loyalty
            - button "Edit" [ref=e201] [cursor=pointer]
            - button "Delete" [ref=e202] [cursor=pointer]
        - generic [ref=e203]:
          - generic [ref=e204]:
            - generic [ref=e205]: JS
            - generic [ref=e206]:
              - paragraph [ref=e207]: Jane Smith
              - paragraph [ref=e208]: jane@example.com
              - generic [ref=e209]:
                - img [ref=e210]
                - text: SILVER
          - generic [ref=e213]:
            - generic [ref=e214]:
              - paragraph [ref=e215]: "820"
              - paragraph [ref=e216]: Points
            - generic [ref=e217]:
              - paragraph [ref=e218]: $2,340.50
              - paragraph [ref=e219]: Spent
            - generic [ref=e220]:
              - paragraph [ref=e221]: $0.00
              - paragraph [ref=e222]: Credit
          - generic [ref=e223]:
            - button "Loyalty" [ref=e224] [cursor=pointer]:
              - img [ref=e225]
              - text: Loyalty
            - button "Edit" [ref=e227] [cursor=pointer]
            - button "Delete" [ref=e228] [cursor=pointer]
        - generic [ref=e229]:
          - generic [ref=e230]:
            - generic [ref=e231]: JD
            - generic [ref=e232]:
              - paragraph [ref=e233]: John Doe
              - paragraph [ref=e234]: john@example.com
              - generic [ref=e235]:
                - img [ref=e236]
                - text: BRONZE
          - generic [ref=e239]:
            - generic [ref=e240]:
              - paragraph [ref=e241]: "450"
              - paragraph [ref=e242]: Points
            - generic [ref=e243]:
              - paragraph [ref=e244]: $1,250.00
              - paragraph [ref=e245]: Spent
            - generic [ref=e246]:
              - paragraph [ref=e247]: $0.00
              - paragraph [ref=e248]: Credit
          - generic [ref=e249]:
            - button "Loyalty" [ref=e250] [cursor=pointer]:
              - img [ref=e251]
              - text: Loyalty
            - button "Edit" [ref=e253] [cursor=pointer]
            - button "Delete" [ref=e254] [cursor=pointer]
      - generic [ref=e256]:
        - generic [ref=e257]:
          - heading "Add Customer" [level=2] [ref=e258]
          - button [ref=e259] [cursor=pointer]:
            - img [ref=e260]
        - generic [ref=e263]:
          - generic [ref=e264]:
            - text: First Name *
            - textbox [ref=e265]
          - generic [ref=e266]:
            - text: Last Name
            - textbox [ref=e267]
          - generic [ref=e268]:
            - text: Email
            - textbox [ref=e269]
          - generic [ref=e270]:
            - text: Phone
            - textbox [ref=e271]
          - generic [ref=e272]:
            - text: Address
            - textbox [ref=e273]
        - button "Create Customer" [ref=e274] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Customers Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/login');
  6  |     await page.getByRole('textbox').first().fill('admin@mypos.com');
  7  |     await page.getByRole('textbox').nth(1).fill('admin123');
  8  |     await page.getByRole('button', { name: 'Sign In' }).click();
  9  |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  10 |     await page.goto('/customers');
  11 |   });
  12 | 
  13 |   test('should display customers page', async ({ page }) => {
  14 |     await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible();
  15 |     await expect(page.getByRole('button', { name: 'Add Customer' })).toBeVisible();
  16 |   });
  17 | 
  18 |   test('should display customer list', async ({ page }) => {
  19 |     await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
  20 |     await expect(page.getByText('Jane Smith')).toBeVisible();
  21 |   });
  22 | 
  23 |   test('should search customers', async ({ page }) => {
  24 |     await expect(page.getByText('John Doe')).toBeVisible({ timeout: 15000 });
  25 |     await page.getByPlaceholder('Search customers...').fill('Jane');
  26 |     await expect(page.getByText('Jane Smith')).toBeVisible();
  27 |     await expect(page.getByText('John Doe')).not.toBeVisible();
  28 |   });
  29 | 
  30 |   test('should open add customer modal', async ({ page }) => {
  31 |     await page.getByRole('button', { name: 'Add Customer' }).click();
> 32 |     await expect(page.getByText('Add Customer')).toBeVisible();
     |                                                  ^ Error: expect(locator).toBeVisible() failed
  33 |   });
  34 | });
  35 | 
```