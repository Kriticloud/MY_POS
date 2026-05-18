import { PrismaClient, Role, BusinessType, TableStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default branch
  const branch = await prisma.branch.create({
    data: {
      name: 'Main Branch',
      address: '123 Main Street',
      phone: '+1234567890',
      email: 'main@mypos.com',
      businessType: BusinessType.RESTAURANT,
      settings: {
        currency: 'USD',
        timezone: 'America/New_York',
        taxIncluded: false,
      },
    },
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.create({
    data: {
      email: 'admin@mypos.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: Role.SUPER_ADMIN,
      emailVerified: true,
      branchId: branch.id,
    },
  });

  // Create cashier user
  await prisma.user.create({
    data: {
      email: 'cashier@mypos.com',
      password: await bcrypt.hash('cashier123', 12),
      firstName: 'John',
      lastName: 'Cashier',
      role: Role.CASHIER,
      emailVerified: true,
      branchId: branch.id,
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Beverages', slug: 'beverages', icon: '🥤', color: '#3B82F6', branchId: branch.id } }),
    prisma.category.create({ data: { name: 'Food', slug: 'food', icon: '🍔', color: '#EF4444', branchId: branch.id } }),
    prisma.category.create({ data: { name: 'Desserts', slug: 'desserts', icon: '🍰', color: '#F59E0B', branchId: branch.id } }),
    prisma.category.create({ data: { name: 'Snacks', slug: 'snacks', icon: '🍿', color: '#22C55E', branchId: branch.id } }),
    prisma.category.create({ data: { name: 'Combo Meals', slug: 'combo-meals', icon: '🍱', color: '#8B5CF6', branchId: branch.id } }),
  ]);

  // Create products
  const products = [
    { name: 'Americano', slug: 'americano', price: 3.99, categoryId: categories[0].id, barcode: '1000001' },
    { name: 'Cappuccino', slug: 'cappuccino', price: 4.99, categoryId: categories[0].id, barcode: '1000002' },
    { name: 'Latte', slug: 'latte', price: 5.49, categoryId: categories[0].id, barcode: '1000003' },
    { name: 'Fresh Orange Juice', slug: 'orange-juice', price: 4.49, categoryId: categories[0].id, barcode: '1000004' },
    { name: 'Iced Tea', slug: 'iced-tea', price: 3.49, categoryId: categories[0].id, barcode: '1000005' },
    { name: 'Classic Burger', slug: 'classic-burger', price: 9.99, categoryId: categories[1].id, barcode: '2000001' },
    { name: 'Chicken Sandwich', slug: 'chicken-sandwich', price: 8.49, categoryId: categories[1].id, barcode: '2000002' },
    { name: 'Caesar Salad', slug: 'caesar-salad', price: 7.99, categoryId: categories[1].id, barcode: '2000003' },
    { name: 'Margherita Pizza', slug: 'margherita-pizza', price: 12.99, categoryId: categories[1].id, barcode: '2000004' },
    { name: 'Grilled Salmon', slug: 'grilled-salmon', price: 16.99, categoryId: categories[1].id, barcode: '2000005' },
    { name: 'Chocolate Cake', slug: 'chocolate-cake', price: 6.99, categoryId: categories[2].id, barcode: '3000001' },
    { name: 'Cheesecake', slug: 'cheesecake', price: 7.49, categoryId: categories[2].id, barcode: '3000002' },
    { name: 'Ice Cream Sundae', slug: 'ice-cream-sundae', price: 5.99, categoryId: categories[2].id, barcode: '3000003' },
    { name: 'French Fries', slug: 'french-fries', price: 3.99, categoryId: categories[3].id, barcode: '4000001' },
    { name: 'Onion Rings', slug: 'onion-rings', price: 4.49, categoryId: categories[3].id, barcode: '4000002' },
    { name: 'Nachos', slug: 'nachos', price: 5.99, categoryId: categories[3].id, barcode: '4000003' },
    { name: 'Burger Combo', slug: 'burger-combo', price: 14.99, categoryId: categories[4].id, barcode: '5000001' },
    { name: 'Family Meal', slug: 'family-meal', price: 29.99, categoryId: categories[4].id, barcode: '5000002' },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: { ...product, branchId: branch.id, taxRate: 8.5 },
    });
  }

  // Create tables
  for (let i = 1; i <= 12; i++) {
    await prisma.table.create({
      data: {
        name: `Table ${i}`,
        capacity: i <= 4 ? 2 : i <= 8 ? 4 : 6,
        status: TableStatus.AVAILABLE,
        floor: i <= 6 ? 'Ground Floor' : 'First Floor',
        branchId: branch.id,
      },
    });
  }

  // Create taxes
  await prisma.tax.create({ data: { name: 'GST', rate: 8.5 } });
  await prisma.tax.create({ data: { name: 'Service Tax', rate: 5.0 } });

  // Create discounts
  await prisma.discount.create({
    data: { name: 'Happy Hour', type: 'percentage', value: 10, minOrder: 20 },
  });
  await prisma.discount.create({
    data: { name: 'Loyalty Discount', type: 'percentage', value: 5 },
  });

  // Create settings
  await prisma.setting.create({
    data: {
      key: 'business',
      value: {
        name: 'MyPOS Restaurant',
        type: 'RESTAURANT',
        currency: 'USD',
        currencySymbol: '$',
        taxIncluded: false,
        defaultTaxRate: 8.5,
      },
      group: 'general',
    },
  });

  await prisma.setting.create({
    data: {
      key: 'receipt',
      value: {
        header: 'MyPOS Restaurant',
        footer: 'Thank you for your visit!',
        showLogo: true,
        paperSize: '80mm',
      },
      group: 'printing',
    },
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
