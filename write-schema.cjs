const fs = require('fs');
const path = require('path');

const schema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Branch {
  id           String   @id @default(uuid())
  name         String
  address      String?
  phone        String?
  email        String?
  isActive     Boolean  @default(true)
  businessType String   @default("GENERAL")
  settings     String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  users        User[]
  products     Product[]
  orders       Order[]
  tables       Table[]
  inventory    Inventory[]
  appointments Appointment[]
  categories   Category[]
  @@map("branches")
}

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password      String
  firstName     String
  lastName      String
  phone         String?
  avatar        String?
  role          String   @default("STAFF")
  isActive      Boolean  @default(true)
  emailVerified Boolean  @default(false)
  branchId      String?
  refreshToken  String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  branch        Branch?        @relation(fields: [branchId], references: [id])
  orders        Order[]
  activityLogs  ActivityLog[]
  appointments  Appointment[]  @relation("StaffAppointments")
  @@map("users")
}

model Category {
  id           String   @id @default(uuid())
  name         String
  slug         String
  icon         String?
  color        String?
  sortOrder    Int      @default(0)
  isActive     Boolean  @default(true)
  branchId     String?
  parentId     String?
  businessType String   @default("RESTAURANT")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  branch    Branch?    @relation(fields: [branchId], references: [id])
  parent    Category?  @relation("CategoryChildren", fields: [parentId], references: [id])
  children  Category[] @relation("CategoryChildren")
  products  Product[]
  @@map("categories")
}

model Product {
  id           String   @id @default(uuid())
  name         String
  slug         String
  description  String?
  sku          String?
  barcode      String?
  price        Float
  costPrice    Float?
  image        String?
  isActive     Boolean  @default(true)
  isWeighted   Boolean  @default(false)
  unit         String?
  taxRate      Float    @default(0)
  categoryId   String?
  branchId     String?
  businessType String   @default("RESTAURANT")
  duration     Int?
  modifiers    String?
  variants     String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  category    Category?   @relation(fields: [categoryId], references: [id])
  branch      Branch?     @relation(fields: [branchId], references: [id])
  orderItems  OrderItem[]
  inventory   Inventory[]
  @@index([barcode])
  @@index([sku])
  @@map("products")
}

model Customer {
  id            String   @id @default(uuid())
  firstName     String
  lastName      String?
  email         String?
  phone         String?
  address       String?
  loyaltyPoints Int      @default(0)
  totalSpent    Float    @default(0)
  membershipId  String?
  notes         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  orders        Order[]
  membership    Membership? @relation(fields: [membershipId], references: [id])
  @@map("customers")
}

model Membership {
  id               String   @id @default(uuid())
  name             String
  discount         Float    @default(0)
  pointsMultiplier Float    @default(1)
  benefits         String?
  isActive         Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  customers        Customer[]
  @@map("memberships")
}

model Order {
  id             String   @id @default(uuid())
  orderNumber    String   @unique
  status         String   @default("PENDING")
  orderType      String   @default("DINE_IN")
  subtotal       Float
  taxAmount      Float    @default(0)
  discountAmount Float    @default(0)
  totalAmount    Float
  notes          String?
  customerId     String?
  userId         String
  branchId       String?
  tableId        String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  customer       Customer? @relation(fields: [customerId], references: [id])
  user           User      @relation(fields: [userId], references: [id])
  branch         Branch?   @relation(fields: [branchId], references: [id])
  table          Table?    @relation(fields: [tableId], references: [id])
  items          OrderItem[]
  payments       Payment[]
  @@index([orderNumber])
  @@index([createdAt])
  @@map("orders")
}

model OrderItem {
  id         String   @id @default(uuid())
  orderId    String
  productId  String
  quantity   Int
  unitPrice  Float
  totalPrice Float
  discount   Float    @default(0)
  notes      String?
  modifiers  String?
  createdAt  DateTime @default(now())
  order      Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product    Product  @relation(fields: [productId], references: [id])
  @@map("order_items")
}

model Payment {
  id        String   @id @default(uuid())
  orderId   String
  method    String
  amount    Float
  status    String   @default("PENDING")
  reference String?
  createdAt DateTime @default(now())
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  @@map("payments")
}

model Table {
  id        String   @id @default(uuid())
  name      String
  capacity  Int      @default(4)
  status    String   @default("AVAILABLE")
  floor     String?
  position  String?
  branchId  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  branch    Branch?  @relation(fields: [branchId], references: [id])
  orders    Order[]
  @@map("tables")
}

model Appointment {
  id         String   @id @default(uuid())
  customerId String?
  staffId    String?
  branchId   String?
  service    String
  startTime  DateTime
  endTime    DateTime
  status     String   @default("SCHEDULED")
  notes      String?
  price      Float?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  staff      User?    @relation("StaffAppointments", fields: [staffId], references: [id])
  branch     Branch?  @relation(fields: [branchId], references: [id])
  @@map("appointments")
}

model Inventory {
  id          String    @id @default(uuid())
  productId   String
  branchId    String?
  quantity    Int       @default(0)
  minStock    Int       @default(10)
  maxStock    Int?
  batchNumber String?
  expiryDate  DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  product     Product   @relation(fields: [productId], references: [id])
  branch      Branch?   @relation(fields: [branchId], references: [id])
  movements   StockMovement[]
  @@map("inventory")
}

model StockMovement {
  id          String   @id @default(uuid())
  inventoryId String
  type        String
  quantity    Int
  reason      String?
  reference   String?
  createdAt   DateTime @default(now())
  inventory   Inventory @relation(fields: [inventoryId], references: [id])
  @@map("stock_movements")
}

model Supplier {
  id        String   @id @default(uuid())
  name      String
  email     String?
  phone     String?
  address   String?
  company   String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("suppliers")
}

model Tax {
  id        String   @id @default(uuid())
  name      String
  rate      Float
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("taxes")
}

model Discount {
  id          String    @id @default(uuid())
  name        String
  type        String
  value       Float
  minOrder    Float?
  maxDiscount Float?
  isActive    Boolean   @default(true)
  startDate   DateTime?
  endDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  @@map("discounts")
}

model ActivityLog {
  id        String   @id @default(uuid())
  userId    String
  action    String
  entity    String?
  entityId  String?
  details   String?
  ipAddress String?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  @@index([createdAt])
  @@map("activity_logs")
}

model Setting {
  id        String   @id @default(uuid())
  key       String   @unique
  value     String
  group     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("settings")
}
`;

fs.writeFileSync(path.join(__dirname, 'backend', 'prisma', 'schema.prisma'), schema);
console.log('Schema written successfully');
