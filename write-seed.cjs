const fs = require('fs');
const path = require('path');

const seedContent = `import { PrismaClient } from '@prisma/client';
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
      businessType: 'RESTAURANT',
      settings: JSON.stringify({ currency: 'USD', timezone: 'America/New_York', taxIncluded: false }),
    },
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@mypos.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      emailVerified: true,
      branchId: branch.id,
    },
  });

  // Create staff users
  const staffData = [
    { email: 'maria@mypos.com', password: await bcrypt.hash('staff123', 12), firstName: 'Maria', lastName: 'Garcia', role: 'CASHIER' },
    { email: 'james@mypos.com', password: await bcrypt.hash('staff123', 12), firstName: 'James', lastName: 'Wilson', role: 'STAFF' },
    { email: 'sarah@mypos.com', password: await bcrypt.hash('staff123', 12), firstName: 'Sarah', lastName: 'Chen', role: 'CASHIER' },
    { email: 'robert@mypos.com', password: await bcrypt.hash('staff123', 12), firstName: 'Robert', lastName: 'Kim', role: 'MANAGER' },
  ];
  for (const s of staffData) {
    await prisma.user.create({ data: { ...s, emailVerified: true, branchId: branch.id } });
  }

  // ── Settings ──
  const settingsData = [
    { key: 'businessName', value: 'MyPOS Restaurant', group: 'business' },
    { key: 'businessType', value: 'RESTAURANT', group: 'business' },
    { key: 'currency', value: 'USD', group: 'business' },
    { key: 'taxRate', value: '8.5', group: 'business' },
    { key: 'taxInclusive', value: 'false', group: 'business' },
    { key: 'receiptPaperSize', value: '80mm', group: 'printing' },
    { key: 'printerType', value: 'thermal', group: 'printing' },
  ];
  for (const s of settingsData) {
    await prisma.setting.create({ data: s });
  }

  // ── Customers ──
  const custData = [
    { firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '+1-555-0101', address: '123 Main St', loyaltyPoints: 450, totalSpent: 1250.00 },
    { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '+1-555-0102', address: '456 Oak Ave', loyaltyPoints: 820, totalSpent: 2340.50 },
    { firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', phone: '+1-555-0103', address: '789 Pine Rd', loyaltyPoints: 200, totalSpent: 680.00 },
    { firstName: 'Sarah', lastName: 'Williams', email: 'sarah@example.com', phone: '+1-555-0104', address: '321 Elm Dr', loyaltyPoints: 1200, totalSpent: 3890.75 },
    { firstName: 'David', lastName: 'Brown', email: 'david@example.com', phone: '+1-555-0105', address: '654 Maple Ln', loyaltyPoints: 350, totalSpent: 920.00 },
    { firstName: 'Emily', lastName: 'Davis', email: 'emily@example.com', phone: '+1-555-0106', address: '987 Cedar Ct', loyaltyPoints: 600, totalSpent: 1675.25 },
  ];
  for (const c of custData) {
    await prisma.customer.create({ data: c });
  }

  // ── Tables ──
  const tableData = [
    { name: 'Table 1', capacity: 2, status: 'AVAILABLE', floor: 'Ground Floor', branchId: branch.id },
    { name: 'Table 2', capacity: 4, status: 'AVAILABLE', floor: 'Ground Floor', branchId: branch.id },
    { name: 'Table 3', capacity: 4, status: 'AVAILABLE', floor: 'Ground Floor', branchId: branch.id },
    { name: 'Table 4', capacity: 6, status: 'AVAILABLE', floor: 'Ground Floor', branchId: branch.id },
    { name: 'Table 5', capacity: 2, status: 'AVAILABLE', floor: 'First Floor', branchId: branch.id },
    { name: 'Table 6', capacity: 8, status: 'AVAILABLE', floor: 'First Floor', branchId: branch.id },
    { name: 'Table 7', capacity: 4, status: 'AVAILABLE', floor: 'First Floor', branchId: branch.id },
    { name: 'Table 8', capacity: 6, status: 'AVAILABLE', floor: 'First Floor', branchId: branch.id },
  ];
  for (const t of tableData) {
    await prisma.table.create({ data: t });
  }

  // ═══ CATEGORIES (all business types) ═══

  // Restaurant
  const restCats: Record<string, any> = {};
  const restCatData = [
    { name: 'Beverages', slug: 'beverages', icon: '☕', color: '#8B5CF6', sortOrder: 1 },
    { name: 'Food', slug: 'food', icon: '🍔', color: '#EF4444', sortOrder: 2 },
    { name: 'Desserts', slug: 'desserts', icon: '🍰', color: '#F59E0B', sortOrder: 3 },
    { name: 'Snacks', slug: 'snacks', icon: '🍟', color: '#22C55E', sortOrder: 4 },
    { name: 'Combos', slug: 'combos', icon: '🎁', color: '#3B82F6', sortOrder: 5 },
    { name: 'Breakfast', slug: 'breakfast', icon: '🥞', color: '#14B8A6', sortOrder: 6 },
  ];
  for (const c of restCatData) {
    restCats[c.slug] = await prisma.category.create({ data: { ...c, businessType: 'RESTAURANT', branchId: branch.id } });
  }

  // Salon
  const salonCats: Record<string, any> = {};
  const salonCatData = [
    { name: 'Haircuts', slug: 'haircuts', icon: '✂️', color: '#8B5CF6', sortOrder: 1 },
    { name: 'Beard & Shave', slug: 'beard-shave', icon: '🪒', color: '#EF4444', sortOrder: 2 },
    { name: 'Hair Styling', slug: 'hair-styling', icon: '💇', color: '#F59E0B', sortOrder: 3 },
    { name: 'Spa & Massage', slug: 'spa-massage', icon: '💆', color: '#22C55E', sortOrder: 4 },
    { name: 'Nail Art', slug: 'nail-art', icon: '💅', color: '#EC4899', sortOrder: 5 },
    { name: 'Skin Care', slug: 'skin-care', icon: '🧖', color: '#14B8A6', sortOrder: 6 },
    { name: 'Packages', slug: 'packages', icon: '🎁', color: '#3B82F6', sortOrder: 7 },
  ];
  for (const c of salonCatData) {
    salonCats[c.slug] = await prisma.category.create({ data: { ...c, businessType: 'SALON', branchId: branch.id } });
  }

  // ═══ PRODUCTS ═══

  // Restaurant products
  const restProds = [
    { name: 'Espresso', slug: 'espresso', description: 'Rich espresso shot', sku: 'BEV-001', barcode: '100001', price: 3.50, costPrice: 1.00, unit: 'cup', taxRate: 8.5, catSlug: 'beverages' },
    { name: 'Cappuccino', slug: 'cappuccino', description: 'Italian coffee with steamed milk', sku: 'BEV-002', barcode: '100002', price: 4.50, costPrice: 1.50, unit: 'cup', taxRate: 8.5, catSlug: 'beverages' },
    { name: 'Latte', slug: 'latte', description: 'Smooth espresso with steamed milk', sku: 'BEV-003', barcode: '100003', price: 4.99, costPrice: 1.50, unit: 'cup', taxRate: 8.5, catSlug: 'beverages' },
    { name: 'Classic Burger', slug: 'classic-burger', description: 'Beef patty with cheese', sku: 'FOOD-001', barcode: '200001', price: 9.99, costPrice: 4.00, unit: 'piece', taxRate: 8.5, catSlug: 'food' },
    { name: 'Chicken Sandwich', slug: 'chicken-sandwich', description: 'Grilled chicken on ciabatta', sku: 'FOOD-002', barcode: '200002', price: 8.49, costPrice: 3.50, unit: 'piece', taxRate: 8.5, catSlug: 'food' },
    { name: 'Margherita Pizza', slug: 'margherita-pizza', description: 'Classic pizza with mozzarella', sku: 'FOOD-004', barcode: '200004', price: 12.99, costPrice: 4.50, unit: 'piece', taxRate: 8.5, catSlug: 'food' },
    { name: 'Chocolate Cake', slug: 'chocolate-cake', description: 'Rich dark chocolate cake', sku: 'DES-001', barcode: '300001', price: 6.99, costPrice: 2.50, unit: 'slice', taxRate: 8.5, catSlug: 'desserts' },
    { name: 'French Fries', slug: 'french-fries', description: 'Crispy golden fries', sku: 'SNK-001', barcode: '400001', price: 3.99, costPrice: 1.00, unit: 'portion', taxRate: 8.5, catSlug: 'snacks' },
    { name: 'Burger Combo', slug: 'burger-combo', description: 'Burger with fries and drink', sku: 'CMB-001', barcode: '500001', price: 14.99, costPrice: 5.50, unit: 'combo', taxRate: 8.5, catSlug: 'combos' },
    { name: 'Pancake Stack', slug: 'pancake-stack', description: 'Fluffy pancakes with maple syrup', sku: 'BRK-001', barcode: '600001', price: 7.99, costPrice: 2.50, unit: 'plate', taxRate: 8.5, catSlug: 'breakfast' },
  ];
  for (const p of restProds) {
    const { catSlug, ...data } = p;
    await prisma.product.create({ data: { ...data, businessType: 'RESTAURANT', categoryId: restCats[catSlug].id, branchId: branch.id } });
  }

  // Salon products (services)
  const salonProds = [
    { name: "Men's Haircut", slug: 'mens-haircut', description: 'Classic men\\'s haircut with styling', sku: 'SAL-001', barcode: '700001', price: 25.00, costPrice: 5.00, unit: 'service', taxRate: 8.5, duration: 30, catSlug: 'haircuts' },
    { name: "Women's Haircut", slug: 'womens-haircut', description: 'Women\\'s haircut with wash & blowdry', sku: 'SAL-002', barcode: '700002', price: 45.00, costPrice: 8.00, unit: 'service', taxRate: 8.5, duration: 45, catSlug: 'haircuts' },
    { name: "Kids' Haircut", slug: 'kids-haircut', description: 'Haircut for children under 12', sku: 'SAL-003', barcode: '700003', price: 15.00, costPrice: 3.00, unit: 'service', taxRate: 8.5, duration: 20, catSlug: 'haircuts' },
    { name: 'Buzz Cut', slug: 'buzz-cut', description: 'Clean buzz cut with clippers', sku: 'SAL-004', barcode: '700004', price: 15.00, costPrice: 3.00, unit: 'service', taxRate: 8.5, duration: 15, catSlug: 'haircuts' },
    { name: 'Beard Trim', slug: 'beard-trim', description: 'Professional beard shaping', sku: 'SAL-006', barcode: '700006', price: 15.00, costPrice: 3.00, unit: 'service', taxRate: 8.5, duration: 15, catSlug: 'beard-shave' },
    { name: 'Clean Shave', slug: 'clean-shave', description: 'Traditional hot towel clean shave', sku: 'SAL-007', barcode: '700007', price: 20.00, costPrice: 4.00, unit: 'service', taxRate: 8.5, duration: 25, catSlug: 'beard-shave' },
    { name: 'Beard Coloring', slug: 'beard-coloring', description: 'Beard dye and styling', sku: 'SAL-008', barcode: '700008', price: 25.00, costPrice: 8.00, unit: 'service', taxRate: 8.5, duration: 30, catSlug: 'beard-shave' },
    { name: 'Hair Coloring', slug: 'hair-coloring', description: 'Full head hair coloring', sku: 'SAL-009', barcode: '700009', price: 65.00, costPrice: 15.00, unit: 'service', taxRate: 8.5, duration: 90, catSlug: 'hair-styling' },
    { name: 'Highlights', slug: 'highlights', description: 'Partial or full highlights', sku: 'SAL-010', barcode: '700010', price: 85.00, costPrice: 20.00, unit: 'service', taxRate: 8.5, duration: 120, catSlug: 'hair-styling' },
    { name: 'Keratin Treatment', slug: 'keratin-treatment', description: 'Smoothing keratin treatment', sku: 'SAL-011', barcode: '700011', price: 120.00, costPrice: 30.00, unit: 'service', taxRate: 8.5, duration: 150, catSlug: 'hair-styling' },
    { name: 'Blowdry & Style', slug: 'blowdry-style', description: 'Professional blowdry and styling', sku: 'SAL-012', barcode: '700012', price: 30.00, costPrice: 5.00, unit: 'service', taxRate: 8.5, duration: 30, catSlug: 'hair-styling' },
    { name: 'Head Massage', slug: 'head-massage', description: 'Relaxing scalp massage with oil', sku: 'SAL-014', barcode: '700014', price: 20.00, costPrice: 3.00, unit: 'service', taxRate: 8.5, duration: 20, catSlug: 'spa-massage' },
    { name: 'Full Body Massage', slug: 'full-body-massage', description: 'Full body relaxation massage', sku: 'SAL-015', barcode: '700015', price: 60.00, costPrice: 10.00, unit: 'service', taxRate: 8.5, duration: 60, catSlug: 'spa-massage' },
    { name: 'Aromatherapy Spa', slug: 'aromatherapy-spa', description: 'Luxury aromatherapy session', sku: 'SAL-016', barcode: '700016', price: 80.00, costPrice: 15.00, unit: 'service', taxRate: 8.5, duration: 75, catSlug: 'spa-massage' },
    { name: 'Manicure', slug: 'manicure', description: 'Classic manicure with polish', sku: 'SAL-018', barcode: '700018', price: 25.00, costPrice: 5.00, unit: 'service', taxRate: 8.5, duration: 30, catSlug: 'nail-art' },
    { name: 'Pedicure', slug: 'pedicure', description: 'Full pedicure with foot soak', sku: 'SAL-019', barcode: '700019', price: 35.00, costPrice: 7.00, unit: 'service', taxRate: 8.5, duration: 45, catSlug: 'nail-art' },
    { name: 'Gel Nails', slug: 'gel-nails', description: 'Long-lasting gel nail application', sku: 'SAL-020', barcode: '700020', price: 40.00, costPrice: 10.00, unit: 'service', taxRate: 8.5, duration: 45, catSlug: 'nail-art' },
    { name: 'Nail Art Design', slug: 'nail-art-design', description: 'Custom nail art designs', sku: 'SAL-021', barcode: '700021', price: 50.00, costPrice: 12.00, unit: 'service', taxRate: 8.5, duration: 60, catSlug: 'nail-art' },
    { name: 'Facial', slug: 'facial', description: 'Deep cleansing facial treatment', sku: 'SAL-022', barcode: '700022', price: 45.00, costPrice: 10.00, unit: 'service', taxRate: 8.5, duration: 45, catSlug: 'skin-care' },
    { name: 'Waxing (Full Legs)', slug: 'waxing-legs', description: 'Full leg waxing', sku: 'SAL-023', barcode: '700023', price: 35.00, costPrice: 8.00, unit: 'service', taxRate: 8.5, duration: 30, catSlug: 'skin-care' },
    { name: 'Threading (Eyebrows)', slug: 'threading-eyebrows', description: 'Eyebrow threading and shaping', sku: 'SAL-024', barcode: '700024', price: 10.00, costPrice: 2.00, unit: 'service', taxRate: 8.5, duration: 10, catSlug: 'skin-care' },
    { name: 'Groom Package', slug: 'groom-package', description: 'Haircut + Beard Trim + Head Massage', sku: 'SAL-026', barcode: '700026', price: 50.00, costPrice: 10.00, unit: 'package', taxRate: 8.5, duration: 60, catSlug: 'packages' },
    { name: 'Bridal Package', slug: 'bridal-package', description: 'Hair + Makeup + Manicure + Pedicure + Facial', sku: 'SAL-027', barcode: '700027', price: 199.00, costPrice: 40.00, unit: 'package', taxRate: 8.5, duration: 240, catSlug: 'packages' },
    { name: 'Pamper Package', slug: 'pamper-package', description: 'Massage + Facial + Manicure + Pedicure', sku: 'SAL-028', barcode: '700028', price: 150.00, costPrice: 30.00, unit: 'package', taxRate: 8.5, duration: 180, catSlug: 'packages' },
  ];
  for (const p of salonProds) {
    const { catSlug, ...data } = p;
    await prisma.product.create({ data: { ...data, businessType: 'SALON', categoryId: salonCats[catSlug].id, branchId: branch.id } });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;

fs.writeFileSync(path.join(__dirname, 'backend', 'prisma', 'seed.ts'), seedContent);
console.log('Seed file written');
