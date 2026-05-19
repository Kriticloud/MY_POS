# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: products.spec.ts >> Products Page >> should open add product modal
- Location: e2e\products.spec.ts:35:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Add Product' })
    - locator resolved to <button class="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium">…</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
  - element was detached from the DOM, retrying

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
          - heading "Services" [level=1] [ref=e86]
          - paragraph [ref=e87]: Manage your services and pricing
        - button "Add Service" [ref=e88] [cursor=pointer]:
          - img [ref=e89]
          - text: Add Service
      - generic [ref=e90]:
        - img [ref=e91]
        - textbox "Search by name, SKU, or barcode..." [ref=e94]
      - table [ref=e97]:
        - rowgroup [ref=e98]:
          - row "Product SKU Category Price Cost Actions" [ref=e99]:
            - columnheader "Product" [ref=e100]
            - columnheader "SKU" [ref=e101]
            - columnheader "Category" [ref=e102]
            - columnheader "Price" [ref=e103]
            - columnheader "Cost" [ref=e104]
            - columnheader "Actions" [ref=e105]
        - rowgroup [ref=e106]:
          - row "📦 Aromatherapy Spa 700016 SAL-016 Spa & Massage $80.00 $15.00" [ref=e107]:
            - cell "📦 Aromatherapy Spa 700016" [ref=e108]:
              - generic [ref=e109]:
                - generic [ref=e110]: 📦
                - generic [ref=e111]:
                  - paragraph [ref=e112]: Aromatherapy Spa
                  - paragraph [ref=e113]: "700016"
            - cell "SAL-016" [ref=e114]
            - cell "Spa & Massage" [ref=e115]
            - cell "$80.00" [ref=e116]
            - cell "$15.00" [ref=e117]
            - cell [ref=e118]:
              - generic [ref=e119]:
                - button [ref=e120] [cursor=pointer]:
                  - img [ref=e121]
                - button [ref=e124] [cursor=pointer]:
                  - img [ref=e125]
          - row "📦 Beard Coloring 700008 SAL-008 Beard & Shave $25.00 $8.00" [ref=e128]:
            - cell "📦 Beard Coloring 700008" [ref=e129]:
              - generic [ref=e130]:
                - generic [ref=e131]: 📦
                - generic [ref=e132]:
                  - paragraph [ref=e133]: Beard Coloring
                  - paragraph [ref=e134]: "700008"
            - cell "SAL-008" [ref=e135]
            - cell "Beard & Shave" [ref=e136]
            - cell "$25.00" [ref=e137]
            - cell "$8.00" [ref=e138]
            - cell [ref=e139]:
              - generic [ref=e140]:
                - button [ref=e141] [cursor=pointer]:
                  - img [ref=e142]
                - button [ref=e145] [cursor=pointer]:
                  - img [ref=e146]
          - row "📦 Beard Trim 700006 SAL-006 Beard & Shave $15.00 $3.00" [ref=e149]:
            - cell "📦 Beard Trim 700006" [ref=e150]:
              - generic [ref=e151]:
                - generic [ref=e152]: 📦
                - generic [ref=e153]:
                  - paragraph [ref=e154]: Beard Trim
                  - paragraph [ref=e155]: "700006"
            - cell "SAL-006" [ref=e156]
            - cell "Beard & Shave" [ref=e157]
            - cell "$15.00" [ref=e158]
            - cell "$3.00" [ref=e159]
            - cell [ref=e160]:
              - generic [ref=e161]:
                - button [ref=e162] [cursor=pointer]:
                  - img [ref=e163]
                - button [ref=e166] [cursor=pointer]:
                  - img [ref=e167]
          - row "📦 Blowdry & Style 700012 SAL-012 Hair Styling $30.00 $5.00" [ref=e170]:
            - cell "📦 Blowdry & Style 700012" [ref=e171]:
              - generic [ref=e172]:
                - generic [ref=e173]: 📦
                - generic [ref=e174]:
                  - paragraph [ref=e175]: Blowdry & Style
                  - paragraph [ref=e176]: "700012"
            - cell "SAL-012" [ref=e177]
            - cell "Hair Styling" [ref=e178]
            - cell "$30.00" [ref=e179]
            - cell "$5.00" [ref=e180]
            - cell [ref=e181]:
              - generic [ref=e182]:
                - button [ref=e183] [cursor=pointer]:
                  - img [ref=e184]
                - button [ref=e187] [cursor=pointer]:
                  - img [ref=e188]
          - row "📦 Bridal Package 700027 SAL-027 Packages $199.00 $40.00" [ref=e191]:
            - cell "📦 Bridal Package 700027" [ref=e192]:
              - generic [ref=e193]:
                - generic [ref=e194]: 📦
                - generic [ref=e195]:
                  - paragraph [ref=e196]: Bridal Package
                  - paragraph [ref=e197]: "700027"
            - cell "SAL-027" [ref=e198]
            - cell "Packages" [ref=e199]
            - cell "$199.00" [ref=e200]
            - cell "$40.00" [ref=e201]
            - cell [ref=e202]:
              - generic [ref=e203]:
                - button [ref=e204] [cursor=pointer]:
                  - img [ref=e205]
                - button [ref=e208] [cursor=pointer]:
                  - img [ref=e209]
          - row "📦 Burger Combo 500001 CMB-001 Combos $14.99 $5.50" [ref=e212]:
            - cell "📦 Burger Combo 500001" [ref=e213]:
              - generic [ref=e214]:
                - generic [ref=e215]: 📦
                - generic [ref=e216]:
                  - paragraph [ref=e217]: Burger Combo
                  - paragraph [ref=e218]: "500001"
            - cell "CMB-001" [ref=e219]
            - cell "Combos" [ref=e220]
            - cell "$14.99" [ref=e221]
            - cell "$5.50" [ref=e222]
            - cell [ref=e223]:
              - generic [ref=e224]:
                - button [ref=e225] [cursor=pointer]:
                  - img [ref=e226]
                - button [ref=e229] [cursor=pointer]:
                  - img [ref=e230]
          - row "📦 Buzz Cut 700004 SAL-004 Haircuts $15.00 $3.00" [ref=e233]:
            - cell "📦 Buzz Cut 700004" [ref=e234]:
              - generic [ref=e235]:
                - generic [ref=e236]: 📦
                - generic [ref=e237]:
                  - paragraph [ref=e238]: Buzz Cut
                  - paragraph [ref=e239]: "700004"
            - cell "SAL-004" [ref=e240]
            - cell "Haircuts" [ref=e241]
            - cell "$15.00" [ref=e242]
            - cell "$3.00" [ref=e243]
            - cell [ref=e244]:
              - generic [ref=e245]:
                - button [ref=e246] [cursor=pointer]:
                  - img [ref=e247]
                - button [ref=e250] [cursor=pointer]:
                  - img [ref=e251]
          - row "📦 Cappuccino 100002 BEV-002 Beverages $4.50 $1.50" [ref=e254]:
            - cell "📦 Cappuccino 100002" [ref=e255]:
              - generic [ref=e256]:
                - generic [ref=e257]: 📦
                - generic [ref=e258]:
                  - paragraph [ref=e259]: Cappuccino
                  - paragraph [ref=e260]: "100002"
            - cell "BEV-002" [ref=e261]
            - cell "Beverages" [ref=e262]
            - cell "$4.50" [ref=e263]
            - cell "$1.50" [ref=e264]
            - cell [ref=e265]:
              - generic [ref=e266]:
                - button [ref=e267] [cursor=pointer]:
                  - img [ref=e268]
                - button [ref=e271] [cursor=pointer]:
                  - img [ref=e272]
          - row "📦 Chicken Sandwich 200002 FOOD-002 Food $8.49 $3.50" [ref=e275]:
            - cell "📦 Chicken Sandwich 200002" [ref=e276]:
              - generic [ref=e277]:
                - generic [ref=e278]: 📦
                - generic [ref=e279]:
                  - paragraph [ref=e280]: Chicken Sandwich
                  - paragraph [ref=e281]: "200002"
            - cell "FOOD-002" [ref=e282]
            - cell "Food" [ref=e283]
            - cell "$8.49" [ref=e284]
            - cell "$3.50" [ref=e285]
            - cell [ref=e286]:
              - generic [ref=e287]:
                - button [ref=e288] [cursor=pointer]:
                  - img [ref=e289]
                - button [ref=e292] [cursor=pointer]:
                  - img [ref=e293]
          - row "📦 Chocolate Cake 300001 DES-001 Desserts $6.99 $2.50" [ref=e296]:
            - cell "📦 Chocolate Cake 300001" [ref=e297]:
              - generic [ref=e298]:
                - generic [ref=e299]: 📦
                - generic [ref=e300]:
                  - paragraph [ref=e301]: Chocolate Cake
                  - paragraph [ref=e302]: "300001"
            - cell "DES-001" [ref=e303]
            - cell "Desserts" [ref=e304]
            - cell "$6.99" [ref=e305]
            - cell "$2.50" [ref=e306]
            - cell [ref=e307]:
              - generic [ref=e308]:
                - button [ref=e309] [cursor=pointer]:
                  - img [ref=e310]
                - button [ref=e313] [cursor=pointer]:
                  - img [ref=e314]
          - row "📦 Classic Burger 200001 FOOD-001 Food $9.99 $4.00" [ref=e317]:
            - cell "📦 Classic Burger 200001" [ref=e318]:
              - generic [ref=e319]:
                - generic [ref=e320]: 📦
                - generic [ref=e321]:
                  - paragraph [ref=e322]: Classic Burger
                  - paragraph [ref=e323]: "200001"
            - cell "FOOD-001" [ref=e324]
            - cell "Food" [ref=e325]
            - cell "$9.99" [ref=e326]
            - cell "$4.00" [ref=e327]
            - cell [ref=e328]:
              - generic [ref=e329]:
                - button [ref=e330] [cursor=pointer]:
                  - img [ref=e331]
                - button [ref=e334] [cursor=pointer]:
                  - img [ref=e335]
          - row "📦 Clean Shave 700007 SAL-007 Beard & Shave $20.00 $4.00" [ref=e338]:
            - cell "📦 Clean Shave 700007" [ref=e339]:
              - generic [ref=e340]:
                - generic [ref=e341]: 📦
                - generic [ref=e342]:
                  - paragraph [ref=e343]: Clean Shave
                  - paragraph [ref=e344]: "700007"
            - cell "SAL-007" [ref=e345]
            - cell "Beard & Shave" [ref=e346]
            - cell "$20.00" [ref=e347]
            - cell "$4.00" [ref=e348]
            - cell [ref=e349]:
              - generic [ref=e350]:
                - button [ref=e351] [cursor=pointer]:
                  - img [ref=e352]
                - button [ref=e355] [cursor=pointer]:
                  - img [ref=e356]
          - row "📦 Espresso 100001 BEV-001 Beverages $3.50 $1.00" [ref=e359]:
            - cell "📦 Espresso 100001" [ref=e360]:
              - generic [ref=e361]:
                - generic [ref=e362]: 📦
                - generic [ref=e363]:
                  - paragraph [ref=e364]: Espresso
                  - paragraph [ref=e365]: "100001"
            - cell "BEV-001" [ref=e366]
            - cell "Beverages" [ref=e367]
            - cell "$3.50" [ref=e368]
            - cell "$1.00" [ref=e369]
            - cell [ref=e370]:
              - generic [ref=e371]:
                - button [ref=e372] [cursor=pointer]:
                  - img [ref=e373]
                - button [ref=e376] [cursor=pointer]:
                  - img [ref=e377]
          - row "📦 Facial 700022 SAL-022 Skin Care $45.00 $10.00" [ref=e380]:
            - cell "📦 Facial 700022" [ref=e381]:
              - generic [ref=e382]:
                - generic [ref=e383]: 📦
                - generic [ref=e384]:
                  - paragraph [ref=e385]: Facial
                  - paragraph [ref=e386]: "700022"
            - cell "SAL-022" [ref=e387]
            - cell "Skin Care" [ref=e388]
            - cell "$45.00" [ref=e389]
            - cell "$10.00" [ref=e390]
            - cell [ref=e391]:
              - generic [ref=e392]:
                - button [ref=e393] [cursor=pointer]:
                  - img [ref=e394]
                - button [ref=e397] [cursor=pointer]:
                  - img [ref=e398]
          - row "📦 French Fries 400001 SNK-001 Snacks $3.99 $1.00" [ref=e401]:
            - cell "📦 French Fries 400001" [ref=e402]:
              - generic [ref=e403]:
                - generic [ref=e404]: 📦
                - generic [ref=e405]:
                  - paragraph [ref=e406]: French Fries
                  - paragraph [ref=e407]: "400001"
            - cell "SNK-001" [ref=e408]
            - cell "Snacks" [ref=e409]
            - cell "$3.99" [ref=e410]
            - cell "$1.00" [ref=e411]
            - cell [ref=e412]:
              - generic [ref=e413]:
                - button [ref=e414] [cursor=pointer]:
                  - img [ref=e415]
                - button [ref=e418] [cursor=pointer]:
                  - img [ref=e419]
          - row "📦 Full Body Massage 700015 SAL-015 Spa & Massage $60.00 $10.00" [ref=e422]:
            - cell "📦 Full Body Massage 700015" [ref=e423]:
              - generic [ref=e424]:
                - generic [ref=e425]: 📦
                - generic [ref=e426]:
                  - paragraph [ref=e427]: Full Body Massage
                  - paragraph [ref=e428]: "700015"
            - cell "SAL-015" [ref=e429]
            - cell "Spa & Massage" [ref=e430]
            - cell "$60.00" [ref=e431]
            - cell "$10.00" [ref=e432]
            - cell [ref=e433]:
              - generic [ref=e434]:
                - button [ref=e435] [cursor=pointer]:
                  - img [ref=e436]
                - button [ref=e439] [cursor=pointer]:
                  - img [ref=e440]
          - row "📦 Gel Nails 700020 SAL-020 Nail Art $40.00 $10.00" [ref=e443]:
            - cell "📦 Gel Nails 700020" [ref=e444]:
              - generic [ref=e445]:
                - generic [ref=e446]: 📦
                - generic [ref=e447]:
                  - paragraph [ref=e448]: Gel Nails
                  - paragraph [ref=e449]: "700020"
            - cell "SAL-020" [ref=e450]
            - cell "Nail Art" [ref=e451]
            - cell "$40.00" [ref=e452]
            - cell "$10.00" [ref=e453]
            - cell [ref=e454]:
              - generic [ref=e455]:
                - button [ref=e456] [cursor=pointer]:
                  - img [ref=e457]
                - button [ref=e460] [cursor=pointer]:
                  - img [ref=e461]
          - row "📦 Groom Package 700026 SAL-026 Packages $50.00 $10.00" [ref=e464]:
            - cell "📦 Groom Package 700026" [ref=e465]:
              - generic [ref=e466]:
                - generic [ref=e467]: 📦
                - generic [ref=e468]:
                  - paragraph [ref=e469]: Groom Package
                  - paragraph [ref=e470]: "700026"
            - cell "SAL-026" [ref=e471]
            - cell "Packages" [ref=e472]
            - cell "$50.00" [ref=e473]
            - cell "$10.00" [ref=e474]
            - cell [ref=e475]:
              - generic [ref=e476]:
                - button [ref=e477] [cursor=pointer]:
                  - img [ref=e478]
                - button [ref=e481] [cursor=pointer]:
                  - img [ref=e482]
          - row "📦 Hair Coloring 700009 SAL-009 Hair Styling $65.00 $15.00" [ref=e485]:
            - cell "📦 Hair Coloring 700009" [ref=e486]:
              - generic [ref=e487]:
                - generic [ref=e488]: 📦
                - generic [ref=e489]:
                  - paragraph [ref=e490]: Hair Coloring
                  - paragraph [ref=e491]: "700009"
            - cell "SAL-009" [ref=e492]
            - cell "Hair Styling" [ref=e493]
            - cell "$65.00" [ref=e494]
            - cell "$15.00" [ref=e495]
            - cell [ref=e496]:
              - generic [ref=e497]:
                - button [ref=e498] [cursor=pointer]:
                  - img [ref=e499]
                - button [ref=e502] [cursor=pointer]:
                  - img [ref=e503]
          - row "📦 Head Massage 700014 SAL-014 Spa & Massage $20.00 $3.00" [ref=e506]:
            - cell "📦 Head Massage 700014" [ref=e507]:
              - generic [ref=e508]:
                - generic [ref=e509]: 📦
                - generic [ref=e510]:
                  - paragraph [ref=e511]: Head Massage
                  - paragraph [ref=e512]: "700014"
            - cell "SAL-014" [ref=e513]
            - cell "Spa & Massage" [ref=e514]
            - cell "$20.00" [ref=e515]
            - cell "$3.00" [ref=e516]
            - cell [ref=e517]:
              - generic [ref=e518]:
                - button [ref=e519] [cursor=pointer]:
                  - img [ref=e520]
                - button [ref=e523] [cursor=pointer]:
                  - img [ref=e524]
          - row "📦 Highlights 700010 SAL-010 Hair Styling $85.00 $20.00" [ref=e527]:
            - cell "📦 Highlights 700010" [ref=e528]:
              - generic [ref=e529]:
                - generic [ref=e530]: 📦
                - generic [ref=e531]:
                  - paragraph [ref=e532]: Highlights
                  - paragraph [ref=e533]: "700010"
            - cell "SAL-010" [ref=e534]
            - cell "Hair Styling" [ref=e535]
            - cell "$85.00" [ref=e536]
            - cell "$20.00" [ref=e537]
            - cell [ref=e538]:
              - generic [ref=e539]:
                - button [ref=e540] [cursor=pointer]:
                  - img [ref=e541]
                - button [ref=e544] [cursor=pointer]:
                  - img [ref=e545]
          - row "📦 Keratin Treatment 700011 SAL-011 Hair Styling $120.00 $30.00" [ref=e548]:
            - cell "📦 Keratin Treatment 700011" [ref=e549]:
              - generic [ref=e550]:
                - generic [ref=e551]: 📦
                - generic [ref=e552]:
                  - paragraph [ref=e553]: Keratin Treatment
                  - paragraph [ref=e554]: "700011"
            - cell "SAL-011" [ref=e555]
            - cell "Hair Styling" [ref=e556]
            - cell "$120.00" [ref=e557]
            - cell "$30.00" [ref=e558]
            - cell [ref=e559]:
              - generic [ref=e560]:
                - button [ref=e561] [cursor=pointer]:
                  - img [ref=e562]
                - button [ref=e565] [cursor=pointer]:
                  - img [ref=e566]
          - row "📦 Kids' Haircut 700003 SAL-003 Haircuts $15.00 $3.00" [ref=e569]:
            - cell "📦 Kids' Haircut 700003" [ref=e570]:
              - generic [ref=e571]:
                - generic [ref=e572]: 📦
                - generic [ref=e573]:
                  - paragraph [ref=e574]: Kids' Haircut
                  - paragraph [ref=e575]: "700003"
            - cell "SAL-003" [ref=e576]
            - cell "Haircuts" [ref=e577]
            - cell "$15.00" [ref=e578]
            - cell "$3.00" [ref=e579]
            - cell [ref=e580]:
              - generic [ref=e581]:
                - button [ref=e582] [cursor=pointer]:
                  - img [ref=e583]
                - button [ref=e586] [cursor=pointer]:
                  - img [ref=e587]
          - row "📦 Latte 100003 BEV-003 Beverages $4.99 $1.50" [ref=e590]:
            - cell "📦 Latte 100003" [ref=e591]:
              - generic [ref=e592]:
                - generic [ref=e593]: 📦
                - generic [ref=e594]:
                  - paragraph [ref=e595]: Latte
                  - paragraph [ref=e596]: "100003"
            - cell "BEV-003" [ref=e597]
            - cell "Beverages" [ref=e598]
            - cell "$4.99" [ref=e599]
            - cell "$1.50" [ref=e600]
            - cell [ref=e601]:
              - generic [ref=e602]:
                - button [ref=e603] [cursor=pointer]:
                  - img [ref=e604]
                - button [ref=e607] [cursor=pointer]:
                  - img [ref=e608]
          - row "📦 Manicure 700018 SAL-018 Nail Art $25.00 $5.00" [ref=e611]:
            - cell "📦 Manicure 700018" [ref=e612]:
              - generic [ref=e613]:
                - generic [ref=e614]: 📦
                - generic [ref=e615]:
                  - paragraph [ref=e616]: Manicure
                  - paragraph [ref=e617]: "700018"
            - cell "SAL-018" [ref=e618]
            - cell "Nail Art" [ref=e619]
            - cell "$25.00" [ref=e620]
            - cell "$5.00" [ref=e621]
            - cell [ref=e622]:
              - generic [ref=e623]:
                - button [ref=e624] [cursor=pointer]:
                  - img [ref=e625]
                - button [ref=e628] [cursor=pointer]:
                  - img [ref=e629]
          - row "📦 Margherita Pizza 200004 FOOD-004 Food $12.99 $4.50" [ref=e632]:
            - cell "📦 Margherita Pizza 200004" [ref=e633]:
              - generic [ref=e634]:
                - generic [ref=e635]: 📦
                - generic [ref=e636]:
                  - paragraph [ref=e637]: Margherita Pizza
                  - paragraph [ref=e638]: "200004"
            - cell "FOOD-004" [ref=e639]
            - cell "Food" [ref=e640]
            - cell "$12.99" [ref=e641]
            - cell "$4.50" [ref=e642]
            - cell [ref=e643]:
              - generic [ref=e644]:
                - button [ref=e645] [cursor=pointer]:
                  - img [ref=e646]
                - button [ref=e649] [cursor=pointer]:
                  - img [ref=e650]
          - row "📦 Men's Haircut 700001 SAL-001 Haircuts $25.00 $5.00" [ref=e653]:
            - cell "📦 Men's Haircut 700001" [ref=e654]:
              - generic [ref=e655]:
                - generic [ref=e656]: 📦
                - generic [ref=e657]:
                  - paragraph [ref=e658]: Men's Haircut
                  - paragraph [ref=e659]: "700001"
            - cell "SAL-001" [ref=e660]
            - cell "Haircuts" [ref=e661]
            - cell "$25.00" [ref=e662]
            - cell "$5.00" [ref=e663]
            - cell [ref=e664]:
              - generic [ref=e665]:
                - button [ref=e666] [cursor=pointer]:
                  - img [ref=e667]
                - button [ref=e670] [cursor=pointer]:
                  - img [ref=e671]
          - row "📦 Nail Art Design 700021 SAL-021 Nail Art $50.00 $12.00" [ref=e674]:
            - cell "📦 Nail Art Design 700021" [ref=e675]:
              - generic [ref=e676]:
                - generic [ref=e677]: 📦
                - generic [ref=e678]:
                  - paragraph [ref=e679]: Nail Art Design
                  - paragraph [ref=e680]: "700021"
            - cell "SAL-021" [ref=e681]
            - cell "Nail Art" [ref=e682]
            - cell "$50.00" [ref=e683]
            - cell "$12.00" [ref=e684]
            - cell [ref=e685]:
              - generic [ref=e686]:
                - button [ref=e687] [cursor=pointer]:
                  - img [ref=e688]
                - button [ref=e691] [cursor=pointer]:
                  - img [ref=e692]
          - row "📦 Pamper Package 700028 SAL-028 Packages $150.00 $30.00" [ref=e695]:
            - cell "📦 Pamper Package 700028" [ref=e696]:
              - generic [ref=e697]:
                - generic [ref=e698]: 📦
                - generic [ref=e699]:
                  - paragraph [ref=e700]: Pamper Package
                  - paragraph [ref=e701]: "700028"
            - cell "SAL-028" [ref=e702]
            - cell "Packages" [ref=e703]
            - cell "$150.00" [ref=e704]
            - cell "$30.00" [ref=e705]
            - cell [ref=e706]:
              - generic [ref=e707]:
                - button [ref=e708] [cursor=pointer]:
                  - img [ref=e709]
                - button [ref=e712] [cursor=pointer]:
                  - img [ref=e713]
          - row "📦 Pancake Stack 600001 BRK-001 Breakfast $7.99 $2.50" [ref=e716]:
            - cell "📦 Pancake Stack 600001" [ref=e717]:
              - generic [ref=e718]:
                - generic [ref=e719]: 📦
                - generic [ref=e720]:
                  - paragraph [ref=e721]: Pancake Stack
                  - paragraph [ref=e722]: "600001"
            - cell "BRK-001" [ref=e723]
            - cell "Breakfast" [ref=e724]
            - cell "$7.99" [ref=e725]
            - cell "$2.50" [ref=e726]
            - cell [ref=e727]:
              - generic [ref=e728]:
                - button [ref=e729] [cursor=pointer]:
                  - img [ref=e730]
                - button [ref=e733] [cursor=pointer]:
                  - img [ref=e734]
          - row "📦 Pedicure 700019 SAL-019 Nail Art $35.00 $7.00" [ref=e737]:
            - cell "📦 Pedicure 700019" [ref=e738]:
              - generic [ref=e739]:
                - generic [ref=e740]: 📦
                - generic [ref=e741]:
                  - paragraph [ref=e742]: Pedicure
                  - paragraph [ref=e743]: "700019"
            - cell "SAL-019" [ref=e744]
            - cell "Nail Art" [ref=e745]
            - cell "$35.00" [ref=e746]
            - cell "$7.00" [ref=e747]
            - cell [ref=e748]:
              - generic [ref=e749]:
                - button [ref=e750] [cursor=pointer]:
                  - img [ref=e751]
                - button [ref=e754] [cursor=pointer]:
                  - img [ref=e755]
          - row "📦 Threading (Eyebrows) 700024 SAL-024 Skin Care $10.00 $2.00" [ref=e758]:
            - cell "📦 Threading (Eyebrows) 700024" [ref=e759]:
              - generic [ref=e760]:
                - generic [ref=e761]: 📦
                - generic [ref=e762]:
                  - paragraph [ref=e763]: Threading (Eyebrows)
                  - paragraph [ref=e764]: "700024"
            - cell "SAL-024" [ref=e765]
            - cell "Skin Care" [ref=e766]
            - cell "$10.00" [ref=e767]
            - cell "$2.00" [ref=e768]
            - cell [ref=e769]:
              - generic [ref=e770]:
                - button [ref=e771] [cursor=pointer]:
                  - img [ref=e772]
                - button [ref=e775] [cursor=pointer]:
                  - img [ref=e776]
          - row "📦 Waxing (Full Legs) 700023 SAL-023 Skin Care $35.00 $8.00" [ref=e779]:
            - cell "📦 Waxing (Full Legs) 700023" [ref=e780]:
              - generic [ref=e781]:
                - generic [ref=e782]: 📦
                - generic [ref=e783]:
                  - paragraph [ref=e784]: Waxing (Full Legs)
                  - paragraph [ref=e785]: "700023"
            - cell "SAL-023" [ref=e786]
            - cell "Skin Care" [ref=e787]
            - cell "$35.00" [ref=e788]
            - cell "$8.00" [ref=e789]
            - cell [ref=e790]:
              - generic [ref=e791]:
                - button [ref=e792] [cursor=pointer]:
                  - img [ref=e793]
                - button [ref=e796] [cursor=pointer]:
                  - img [ref=e797]
          - row "📦 Women's Haircut 700002 SAL-002 Haircuts $45.00 $8.00" [ref=e800]:
            - cell "📦 Women's Haircut 700002" [ref=e801]:
              - generic [ref=e802]:
                - generic [ref=e803]: 📦
                - generic [ref=e804]:
                  - paragraph [ref=e805]: Women's Haircut
                  - paragraph [ref=e806]: "700002"
            - cell "SAL-002" [ref=e807]
            - cell "Haircuts" [ref=e808]
            - cell "$45.00" [ref=e809]
            - cell "$8.00" [ref=e810]
            - cell [ref=e811]:
              - generic [ref=e812]:
                - button [ref=e813] [cursor=pointer]:
                  - img [ref=e814]
                - button [ref=e817] [cursor=pointer]:
                  - img [ref=e818]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Products Page', () => {
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
  18 |     await page.goto('/products');
  19 |   });
  20 | 
  21 |   test('should display products page with table', async ({ page }) => {
  22 |     await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  23 |     await expect(page.getByText('Manage your product catalog')).toBeVisible();
  24 |     await expect(page.getByRole('button', { name: 'Add Product' })).toBeVisible();
  25 |   });
  26 | 
  27 |   test('should display product list', async ({ page }) => {
  28 |     await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  29 |     await expect(page.getByText('Classic Burger')).toBeVisible();
  30 |     await expect(page.getByText('Cappuccino')).toBeVisible();
  31 |   });
  32 | 
  33 |   test('should search products', async ({ page }) => {
  34 |     await expect(page.getByText('Espresso')).toBeVisible({ timeout: 15000 });
  35 |     await page.getByPlaceholder('Search by name, SKU, or barcode...').fill('burger');
> 36 |     await expect(page.getByText('Classic Burger')).toBeVisible();
     |                                                             ^ Error: locator.click: Test timeout of 30000ms exceeded.
  37 |     await expect(page.getByText('Espresso')).not.toBeVisible();
  38 |   });
  39 | 
  40 |   test('should open add product modal', async ({ page }) => {
  41 |     await page.getByRole('button', { name: 'Add Product' }).click();
  42 |     await expect(page.getByText('Add Product')).toBeVisible();
  43 |     await expect(page.getByText('Name *')).toBeVisible();
  44 |     await expect(page.getByText('Price *')).toBeVisible();
  45 |   });
  46 | });
  47 | 
```