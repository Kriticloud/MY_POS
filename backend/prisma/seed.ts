import { PrismaClient } from '@prisma/client';
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
    { name: "Men's Haircut", slug: 'mens-haircut', description: 'Classic men\'s haircut with styling', sku: 'SAL-001', barcode: '700001', price: 25.00, costPrice: 5.00, unit: 'service', taxRate: 8.5, duration: 30, catSlug: 'haircuts' },
    { name: "Women's Haircut", slug: 'womens-haircut', description: 'Women\'s haircut with wash & blowdry', sku: 'SAL-002', barcode: '700002', price: 45.00, costPrice: 8.00, unit: 'service', taxRate: 8.5, duration: 45, catSlug: 'haircuts' },
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

  // ═══ CAFE categories & products ═══
  const cafeCats: Record<string, any> = {};
  const cafeCatData = [
    { name: 'Hot Drinks', slug: 'hot-drinks', icon: '☕', color: '#8B5CF6', sortOrder: 1 },
    { name: 'Cold Drinks', slug: 'cold-drinks', icon: '🧊', color: '#3B82F6', sortOrder: 2 },
    { name: 'Pastries', slug: 'pastries', icon: '🥐', color: '#F59E0B', sortOrder: 3 },
    { name: 'Sandwiches', slug: 'sandwiches', icon: '🥪', color: '#22C55E', sortOrder: 4 },
    { name: 'Cakes', slug: 'cakes', icon: '🍰', color: '#EC4899', sortOrder: 5 },
  ];
  for (const c of cafeCatData) {
    cafeCats[c.slug] = await prisma.category.create({ data: { ...c, businessType: 'CAFE', branchId: branch.id } });
  }
  const cafeProds = [
    { name: 'Americano', slug: 'americano', description: 'Classic black coffee', sku: 'CAF-001', barcode: '800001', price: 3.00, costPrice: 0.80, unit: 'cup', taxRate: 8.5, catSlug: 'hot-drinks' },
    { name: 'Flat White', slug: 'flat-white', description: 'Smooth espresso with velvety milk', sku: 'CAF-002', barcode: '800002', price: 4.50, costPrice: 1.20, unit: 'cup', taxRate: 8.5, catSlug: 'hot-drinks' },
    { name: 'Mocha', slug: 'mocha', description: 'Espresso with chocolate and milk', sku: 'CAF-003', barcode: '800003', price: 5.00, costPrice: 1.50, unit: 'cup', taxRate: 8.5, catSlug: 'hot-drinks' },
    { name: 'Hot Chocolate', slug: 'hot-chocolate', description: 'Rich cocoa with whipped cream', sku: 'CAF-004', barcode: '800004', price: 4.00, costPrice: 1.00, unit: 'cup', taxRate: 8.5, catSlug: 'hot-drinks' },
    { name: 'Chai Latte', slug: 'chai-latte', description: 'Spiced tea with steamed milk', sku: 'CAF-005', barcode: '800005', price: 4.50, costPrice: 1.00, unit: 'cup', taxRate: 8.5, catSlug: 'hot-drinks' },
    { name: 'Iced Latte', slug: 'iced-latte', description: 'Cold espresso with milk over ice', sku: 'CAF-006', barcode: '800006', price: 5.00, costPrice: 1.30, unit: 'cup', taxRate: 8.5, catSlug: 'cold-drinks' },
    { name: 'Iced Matcha', slug: 'iced-matcha', description: 'Green tea latte over ice', sku: 'CAF-007', barcode: '800007', price: 5.50, costPrice: 1.50, unit: 'cup', taxRate: 8.5, catSlug: 'cold-drinks' },
    { name: 'Lemonade', slug: 'lemonade', description: 'Fresh-squeezed lemonade', sku: 'CAF-008', barcode: '800008', price: 3.50, costPrice: 0.80, unit: 'cup', taxRate: 8.5, catSlug: 'cold-drinks' },
    { name: 'Smoothie Bowl', slug: 'smoothie-bowl', description: 'Acai smoothie bowl with toppings', sku: 'CAF-009', barcode: '800009', price: 8.00, costPrice: 3.00, unit: 'bowl', taxRate: 8.5, catSlug: 'cold-drinks' },
    { name: 'Croissant', slug: 'croissant', description: 'Butter croissant, freshly baked', sku: 'CAF-010', barcode: '800010', price: 3.50, costPrice: 1.00, unit: 'piece', taxRate: 8.5, catSlug: 'pastries' },
    { name: 'Almond Danish', slug: 'almond-danish', description: 'Flaky danish with almond cream', sku: 'CAF-011', barcode: '800011', price: 4.00, costPrice: 1.20, unit: 'piece', taxRate: 8.5, catSlug: 'pastries' },
    { name: 'Blueberry Muffin', slug: 'blueberry-muffin', description: 'Fluffy blueberry muffin', sku: 'CAF-012', barcode: '800012', price: 3.50, costPrice: 1.00, unit: 'piece', taxRate: 8.5, catSlug: 'pastries' },
    { name: 'Club Sandwich', slug: 'club-sandwich', description: 'Triple-decker club sandwich', sku: 'CAF-013', barcode: '800013', price: 7.50, costPrice: 3.00, unit: 'piece', taxRate: 8.5, catSlug: 'sandwiches' },
    { name: 'Avocado Toast', slug: 'avocado-toast', description: 'Smashed avocado on sourdough', sku: 'CAF-014', barcode: '800014', price: 8.00, costPrice: 3.50, unit: 'piece', taxRate: 8.5, catSlug: 'sandwiches' },
    { name: 'Cheesecake Slice', slug: 'cheesecake-slice', description: 'New York style cheesecake', sku: 'CAF-015', barcode: '800015', price: 6.00, costPrice: 2.00, unit: 'slice', taxRate: 8.5, catSlug: 'cakes' },
    { name: 'Carrot Cake', slug: 'carrot-cake', description: 'Spiced carrot cake with cream cheese', sku: 'CAF-016', barcode: '800016', price: 5.50, costPrice: 2.00, unit: 'slice', taxRate: 8.5, catSlug: 'cakes' },
  ];
  for (const p of cafeProds) {
    const { catSlug, ...data } = p;
    await prisma.product.create({ data: { ...data, businessType: 'CAFE', categoryId: cafeCats[catSlug].id, branchId: branch.id } });
  }

  // ═══ GROCERY categories & products ═══
  const groceryCats: Record<string, any> = {};
  const groceryCatData = [
    { name: 'Fruits & Vegetables', slug: 'fruits-vegs', icon: '🥬', color: '#22C55E', sortOrder: 1 },
    { name: 'Dairy & Eggs', slug: 'dairy-eggs', icon: '🥛', color: '#3B82F6', sortOrder: 2 },
    { name: 'Bakery', slug: 'bakery', icon: '🍞', color: '#F59E0B', sortOrder: 3 },
    { name: 'Meat & Seafood', slug: 'meat-seafood', icon: '🥩', color: '#EF4444', sortOrder: 4 },
    { name: 'Pantry', slug: 'pantry', icon: '🫙', color: '#8B5CF6', sortOrder: 5 },
    { name: 'Beverages', slug: 'groc-beverages', icon: '🧃', color: '#14B8A6', sortOrder: 6 },
  ];
  for (const c of groceryCatData) {
    groceryCats[c.slug] = await prisma.category.create({ data: { ...c, businessType: 'GROCERY', branchId: branch.id } });
  }
  const groceryProds = [
    { name: 'Bananas (1 kg)', slug: 'bananas', description: 'Fresh yellow bananas', sku: 'GRO-001', barcode: '900001', price: 1.29, costPrice: 0.60, unit: 'kg', taxRate: 0, catSlug: 'fruits-vegs' },
    { name: 'Tomatoes (1 kg)', slug: 'tomatoes', description: 'Vine-ripened tomatoes', sku: 'GRO-002', barcode: '900002', price: 2.49, costPrice: 1.00, unit: 'kg', taxRate: 0, catSlug: 'fruits-vegs' },
    { name: 'Baby Spinach', slug: 'baby-spinach', description: 'Pre-washed baby spinach 200g', sku: 'GRO-003', barcode: '900003', price: 3.49, costPrice: 1.50, unit: 'pack', taxRate: 0, catSlug: 'fruits-vegs' },
    { name: 'Avocado', slug: 'avocado', description: 'Ripe Hass avocado', sku: 'GRO-004', barcode: '900004', price: 1.99, costPrice: 0.80, unit: 'piece', taxRate: 0, catSlug: 'fruits-vegs' },
    { name: 'Whole Milk (1 gal)', slug: 'whole-milk', description: 'Fresh whole milk', sku: 'GRO-005', barcode: '900005', price: 4.29, costPrice: 2.00, unit: 'gallon', taxRate: 0, catSlug: 'dairy-eggs' },
    { name: 'Free-Range Eggs (12)', slug: 'free-range-eggs', description: 'Dozen free-range eggs', sku: 'GRO-006', barcode: '900006', price: 5.49, costPrice: 2.50, unit: 'dozen', taxRate: 0, catSlug: 'dairy-eggs' },
    { name: 'Cheddar Cheese', slug: 'cheddar-cheese', description: 'Sharp cheddar block 250g', sku: 'GRO-007', barcode: '900007', price: 4.99, costPrice: 2.00, unit: 'block', taxRate: 0, catSlug: 'dairy-eggs' },
    { name: 'Greek Yogurt', slug: 'greek-yogurt', description: 'Plain Greek yogurt 500g', sku: 'GRO-008', barcode: '900008', price: 3.99, costPrice: 1.50, unit: 'tub', taxRate: 0, catSlug: 'dairy-eggs' },
    { name: 'Sourdough Bread', slug: 'sourdough-bread', description: 'Artisan sourdough loaf', sku: 'GRO-009', barcode: '900009', price: 5.99, costPrice: 2.00, unit: 'loaf', taxRate: 0, catSlug: 'bakery' },
    { name: 'Bagels (6 pack)', slug: 'bagels', description: 'Plain bagels pack of 6', sku: 'GRO-010', barcode: '900010', price: 4.49, costPrice: 1.50, unit: 'pack', taxRate: 0, catSlug: 'bakery' },
    { name: 'Chicken Breast (1 lb)', slug: 'chicken-breast', description: 'Boneless skinless chicken breast', sku: 'GRO-011', barcode: '900011', price: 6.99, costPrice: 3.50, unit: 'lb', taxRate: 0, catSlug: 'meat-seafood' },
    { name: 'Salmon Fillet', slug: 'salmon-fillet', description: 'Atlantic salmon fillet 200g', sku: 'GRO-012', barcode: '900012', price: 8.99, costPrice: 5.00, unit: 'piece', taxRate: 0, catSlug: 'meat-seafood' },
    { name: 'Olive Oil', slug: 'olive-oil', description: 'Extra virgin olive oil 500ml', sku: 'GRO-013', barcode: '900013', price: 7.99, costPrice: 4.00, unit: 'bottle', taxRate: 0, catSlug: 'pantry' },
    { name: 'Pasta (500g)', slug: 'pasta', description: 'Penne pasta', sku: 'GRO-014', barcode: '900014', price: 1.99, costPrice: 0.60, unit: 'pack', taxRate: 0, catSlug: 'pantry' },
    { name: 'Rice (2 lb)', slug: 'rice', description: 'Long grain white rice', sku: 'GRO-015', barcode: '900015', price: 3.49, costPrice: 1.50, unit: 'bag', taxRate: 0, catSlug: 'pantry' },
    { name: 'Orange Juice (1 L)', slug: 'orange-juice', description: 'Fresh-squeezed orange juice', sku: 'GRO-016', barcode: '900016', price: 4.49, costPrice: 2.00, unit: 'bottle', taxRate: 0, catSlug: 'groc-beverages' },
    { name: 'Sparkling Water (6pk)', slug: 'sparkling-water', description: 'Sparkling mineral water cans', sku: 'GRO-017', barcode: '900017', price: 5.99, costPrice: 2.50, unit: 'pack', taxRate: 0, catSlug: 'groc-beverages' },
  ];
  for (const p of groceryProds) {
    const { catSlug, ...data } = p;
    await prisma.product.create({ data: { ...data, businessType: 'GROCERY', categoryId: groceryCats[catSlug].id, branchId: branch.id } });
  }

  // ═══ PHARMACY categories & products ═══
  const pharmCats: Record<string, any> = {};
  const pharmCatData = [
    { name: 'Over-The-Counter', slug: 'otc', icon: '💊', color: '#3B82F6', sortOrder: 1 },
    { name: 'Vitamins & Supplements', slug: 'vitamins', icon: '🧬', color: '#22C55E', sortOrder: 2 },
    { name: 'First Aid', slug: 'first-aid', icon: '🩹', color: '#EF4444', sortOrder: 3 },
    { name: 'Personal Care', slug: 'personal-care', icon: '🧴', color: '#EC4899', sortOrder: 4 },
    { name: 'Baby & Child', slug: 'baby-child', icon: '👶', color: '#F59E0B', sortOrder: 5 },
  ];
  for (const c of pharmCatData) {
    pharmCats[c.slug] = await prisma.category.create({ data: { ...c, businessType: 'PHARMACY', branchId: branch.id } });
  }
  const pharmProds = [
    { name: 'Paracetamol 500mg (20)', slug: 'paracetamol', description: 'Pain relief tablets', sku: 'PHR-001', barcode: '110001', price: 5.99, costPrice: 2.00, unit: 'box', taxRate: 0, catSlug: 'otc' },
    { name: 'Ibuprofen 200mg (30)', slug: 'ibuprofen', description: 'Anti-inflammatory tablets', sku: 'PHR-002', barcode: '110002', price: 7.49, costPrice: 2.50, unit: 'box', taxRate: 0, catSlug: 'otc' },
    { name: 'Cough Syrup 200ml', slug: 'cough-syrup', description: 'Honey & lemon cough relief', sku: 'PHR-003', barcode: '110003', price: 8.99, costPrice: 3.00, unit: 'bottle', taxRate: 0, catSlug: 'otc' },
    { name: 'Allergy Relief (30)', slug: 'allergy-relief', description: 'Antihistamine tablets', sku: 'PHR-004', barcode: '110004', price: 9.99, costPrice: 3.50, unit: 'box', taxRate: 0, catSlug: 'otc' },
    { name: 'Antacid Tablets (60)', slug: 'antacid', description: 'Chewable antacid tablets', sku: 'PHR-005', barcode: '110005', price: 6.49, costPrice: 2.00, unit: 'bottle', taxRate: 0, catSlug: 'otc' },
    { name: 'Vitamin C 1000mg (60)', slug: 'vitamin-c', description: 'Immune support vitamin C', sku: 'PHR-006', barcode: '110006', price: 12.99, costPrice: 5.00, unit: 'bottle', taxRate: 0, catSlug: 'vitamins' },
    { name: 'Multivitamin (90)', slug: 'multivitamin', description: 'Daily multivitamin tablets', sku: 'PHR-007', barcode: '110007', price: 15.99, costPrice: 6.00, unit: 'bottle', taxRate: 0, catSlug: 'vitamins' },
    { name: 'Omega-3 Fish Oil (60)', slug: 'omega3', description: 'Fish oil softgels', sku: 'PHR-008', barcode: '110008', price: 18.99, costPrice: 8.00, unit: 'bottle', taxRate: 0, catSlug: 'vitamins' },
    { name: 'Vitamin D3 (120)', slug: 'vitamin-d3', description: 'Vitamin D3 2000 IU', sku: 'PHR-009', barcode: '110009', price: 11.49, costPrice: 4.00, unit: 'bottle', taxRate: 0, catSlug: 'vitamins' },
    { name: 'Adhesive Bandages (50)', slug: 'bandages', description: 'Assorted adhesive bandages', sku: 'PHR-010', barcode: '110010', price: 4.99, costPrice: 1.50, unit: 'box', taxRate: 0, catSlug: 'first-aid' },
    { name: 'Antiseptic Spray', slug: 'antiseptic-spray', description: 'First aid antiseptic 100ml', sku: 'PHR-011', barcode: '110011', price: 6.99, costPrice: 2.50, unit: 'bottle', taxRate: 0, catSlug: 'first-aid' },
    { name: 'Digital Thermometer', slug: 'thermometer', description: 'Digital body thermometer', sku: 'PHR-012', barcode: '110012', price: 9.99, costPrice: 4.00, unit: 'piece', taxRate: 0, catSlug: 'first-aid' },
    { name: 'Hand Sanitizer 500ml', slug: 'hand-sanitizer', description: 'Antibacterial hand gel', sku: 'PHR-013', barcode: '110013', price: 5.49, costPrice: 1.50, unit: 'bottle', taxRate: 0, catSlug: 'personal-care' },
    { name: 'Sunscreen SPF50', slug: 'sunscreen', description: 'Broad-spectrum sunscreen 200ml', sku: 'PHR-014', barcode: '110014', price: 14.99, costPrice: 6.00, unit: 'tube', taxRate: 0, catSlug: 'personal-care' },
    { name: 'Baby Formula (800g)', slug: 'baby-formula', description: 'Infant formula powder', sku: 'PHR-015', barcode: '110015', price: 24.99, costPrice: 12.00, unit: 'tin', taxRate: 0, catSlug: 'baby-child' },
    { name: 'Diaper Pack (40)', slug: 'diapers', description: 'Disposable diapers size 3', sku: 'PHR-016', barcode: '110016', price: 19.99, costPrice: 10.00, unit: 'pack', taxRate: 0, catSlug: 'baby-child' },
  ];
  for (const p of pharmProds) {
    const { catSlug, ...data } = p;
    await prisma.product.create({ data: { ...data, businessType: 'PHARMACY', categoryId: pharmCats[catSlug].id, branchId: branch.id } });
  }

  // ═══ RETAIL categories & products ═══
  const retailCats: Record<string, any> = {};
  const retailCatData = [
    { name: 'Clothing', slug: 'clothing', icon: '👕', color: '#3B82F6', sortOrder: 1 },
    { name: 'Footwear', slug: 'footwear', icon: '👟', color: '#22C55E', sortOrder: 2 },
    { name: 'Accessories', slug: 'accessories', icon: '👜', color: '#EC4899', sortOrder: 3 },
    { name: 'Electronics', slug: 'electronics', icon: '📱', color: '#8B5CF6', sortOrder: 4 },
    { name: 'Home & Living', slug: 'home-living', icon: '🏠', color: '#F59E0B', sortOrder: 5 },
  ];
  for (const c of retailCatData) {
    retailCats[c.slug] = await prisma.category.create({ data: { ...c, businessType: 'RETAIL', branchId: branch.id } });
  }
  const retailProds = [
    { name: 'Classic T-Shirt', slug: 'classic-tshirt', description: 'Cotton crew neck tee', sku: 'RET-001', barcode: '120001', price: 19.99, costPrice: 6.00, unit: 'piece', taxRate: 8.5, catSlug: 'clothing' },
    { name: 'Denim Jeans', slug: 'denim-jeans', description: 'Slim fit denim jeans', sku: 'RET-002', barcode: '120002', price: 49.99, costPrice: 18.00, unit: 'piece', taxRate: 8.5, catSlug: 'clothing' },
    { name: 'Hoodie', slug: 'hoodie', description: 'Pullover fleece hoodie', sku: 'RET-003', barcode: '120003', price: 39.99, costPrice: 14.00, unit: 'piece', taxRate: 8.5, catSlug: 'clothing' },
    { name: 'Summer Dress', slug: 'summer-dress', description: 'Floral print summer dress', sku: 'RET-004', barcode: '120004', price: 34.99, costPrice: 12.00, unit: 'piece', taxRate: 8.5, catSlug: 'clothing' },
    { name: 'Running Shoes', slug: 'running-shoes', description: 'Lightweight running shoes', sku: 'RET-005', barcode: '120005', price: 79.99, costPrice: 35.00, unit: 'pair', taxRate: 8.5, catSlug: 'footwear' },
    { name: 'Canvas Sneakers', slug: 'canvas-sneakers', description: 'Classic canvas sneakers', sku: 'RET-006', barcode: '120006', price: 44.99, costPrice: 15.00, unit: 'pair', taxRate: 8.5, catSlug: 'footwear' },
    { name: 'Leather Belt', slug: 'leather-belt', description: 'Genuine leather belt', sku: 'RET-007', barcode: '120007', price: 24.99, costPrice: 8.00, unit: 'piece', taxRate: 8.5, catSlug: 'accessories' },
    { name: 'Sunglasses', slug: 'sunglasses', description: 'UV protection sunglasses', sku: 'RET-008', barcode: '120008', price: 29.99, costPrice: 8.00, unit: 'piece', taxRate: 8.5, catSlug: 'accessories' },
    { name: 'Backpack', slug: 'backpack', description: 'Water-resistant laptop backpack', sku: 'RET-009', barcode: '120009', price: 54.99, costPrice: 20.00, unit: 'piece', taxRate: 8.5, catSlug: 'accessories' },
    { name: 'Wireless Earbuds', slug: 'wireless-earbuds', description: 'Bluetooth wireless earbuds', sku: 'RET-010', barcode: '120010', price: 39.99, costPrice: 15.00, unit: 'piece', taxRate: 8.5, catSlug: 'electronics' },
    { name: 'Phone Case', slug: 'phone-case', description: 'Protective phone case', sku: 'RET-011', barcode: '120011', price: 14.99, costPrice: 3.00, unit: 'piece', taxRate: 8.5, catSlug: 'electronics' },
    { name: 'USB-C Cable', slug: 'usb-c-cable', description: 'Fast-charge USB-C cable 1m', sku: 'RET-012', barcode: '120012', price: 9.99, costPrice: 2.00, unit: 'piece', taxRate: 8.5, catSlug: 'electronics' },
    { name: 'Scented Candle', slug: 'scented-candle', description: 'Lavender scented soy candle', sku: 'RET-013', barcode: '120013', price: 18.99, costPrice: 5.00, unit: 'piece', taxRate: 8.5, catSlug: 'home-living' },
    { name: 'Throw Pillow', slug: 'throw-pillow', description: 'Decorative throw pillow', sku: 'RET-014', barcode: '120014', price: 22.99, costPrice: 7.00, unit: 'piece', taxRate: 8.5, catSlug: 'home-living' },
    { name: 'Coffee Mug', slug: 'coffee-mug', description: 'Ceramic coffee mug 350ml', sku: 'RET-015', barcode: '120015', price: 12.99, costPrice: 3.00, unit: 'piece', taxRate: 8.5, catSlug: 'home-living' },
  ];
  for (const p of retailProds) {
    const { catSlug, ...data } = p;
    await prisma.product.create({ data: { ...data, businessType: 'RETAIL', categoryId: retailCats[catSlug].id, branchId: branch.id } });
  }

  // ═══ ORDERS ═══
  // Get all restaurant products for order items
  const allRestProducts = await prisma.product.findMany({ where: { businessType: 'RESTAURANT', branchId: branch.id } });
  const allCustomers = await prisma.customer.findMany();
  const allTables = await prisma.table.findMany({ where: { branchId: branch.id } });

  const now = Date.now();
  const DAY = 86400000;

  const ordersData = [
    {
      orderNumber: 'ORD-001', status: 'COMPLETED', orderType: 'DINE_IN',
      customerId: allCustomers[0]?.id, tableId: allTables[1]?.id,
      createdAt: new Date(now - DAY * 0.1),
      items: [
        { product: allRestProducts.find(p => p.slug === 'classic-burger'), quantity: 2 },
        { product: allRestProducts.find(p => p.slug === 'espresso'), quantity: 1 },
      ],
      payment: { method: 'CARD' },
    },
    {
      orderNumber: 'ORD-002', status: 'CONFIRMED', orderType: 'DINE_IN',
      customerId: allCustomers[1]?.id, tableId: allTables[7]?.id,
      createdAt: new Date(now - DAY * 0.05),
      items: [
        { product: allRestProducts.find(p => p.slug === 'chicken-sandwich'), quantity: 1 },
        { product: allRestProducts.find(p => p.slug === 'latte'), quantity: 2 },
      ],
      payment: { method: 'CASH' },
    },
    {
      orderNumber: 'ORD-003', status: 'PREPARING', orderType: 'TAKEAWAY',
      customerId: allCustomers[2]?.id, tableId: null,
      createdAt: new Date(now - DAY * 0.04),
      items: [
        { product: allRestProducts.find(p => p.slug === 'burger-combo'), quantity: 1 },
      ],
      payment: { method: 'CARD' },
    },
    {
      orderNumber: 'ORD-004', status: 'READY', orderType: 'DINE_IN',
      customerId: allCustomers[3]?.id, tableId: allTables[1]?.id,
      createdAt: new Date(now - DAY * 0.03),
      items: [
        { product: allRestProducts.find(p => p.slug === 'margherita-pizza'), quantity: 1 },
        { product: allRestProducts.find(p => p.slug === 'chocolate-cake'), quantity: 1 },
        { product: allRestProducts.find(p => p.slug === 'french-fries'), quantity: 1 },
      ],
      payment: { method: 'CARD' },
    },
    {
      orderNumber: 'ORD-005', status: 'COMPLETED', orderType: 'DELIVERY',
      customerId: allCustomers[4]?.id, tableId: null,
      createdAt: new Date(now - DAY * 1),
      items: [
        { product: allRestProducts.find(p => p.slug === 'classic-burger'), quantity: 1 },
        { product: allRestProducts.find(p => p.slug === 'french-fries'), quantity: 2 },
      ],
      payment: { method: 'CARD' },
    },
    {
      orderNumber: 'ORD-006', status: 'COMPLETED', orderType: 'TAKEAWAY',
      customerId: allCustomers[5]?.id, tableId: null,
      createdAt: new Date(now - DAY * 1.5),
      items: [
        { product: allRestProducts.find(p => p.slug === 'cappuccino'), quantity: 2 },
        { product: allRestProducts.find(p => p.slug === 'pancake-stack'), quantity: 1 },
      ],
      payment: { method: 'CASH' },
    },
    {
      orderNumber: 'ORD-007', status: 'COMPLETED', orderType: 'DINE_IN',
      customerId: allCustomers[0]?.id, tableId: allTables[2]?.id,
      createdAt: new Date(now - DAY * 2),
      items: [
        { product: allRestProducts.find(p => p.slug === 'pancake-stack'), quantity: 1 },
        { product: allRestProducts.find(p => p.slug === 'espresso'), quantity: 2 },
      ],
      payment: { method: 'CASH' },
    },
    {
      orderNumber: 'ORD-008', status: 'CANCELLED', orderType: 'ONLINE',
      customerId: allCustomers[1]?.id, tableId: null,
      createdAt: new Date(now - DAY * 2.5),
      items: [
        { product: allRestProducts.find(p => p.slug === 'latte'), quantity: 1 },
      ],
      payment: null,
    },
    {
      orderNumber: 'ORD-009', status: 'CONFIRMED', orderType: 'DINE_IN',
      customerId: allCustomers[0]?.id, tableId: allTables[4]?.id,
      createdAt: new Date(now - DAY * 0.02),
      notes: 'Birthday celebration',
      items: [
        { product: allRestProducts.find(p => p.slug === 'margherita-pizza'), quantity: 1 },
        { product: allRestProducts.find(p => p.slug === 'chocolate-cake'), quantity: 2 },
      ],
      payment: { method: 'CASH' },
    },
    {
      orderNumber: 'ORD-010', status: 'COMPLETED', orderType: 'DINE_IN',
      customerId: allCustomers[1]?.id, tableId: allTables[6]?.id,
      createdAt: new Date(now - DAY * 3),
      items: [
        { product: allRestProducts.find(p => p.slug === 'classic-burger'), quantity: 1 },
        { product: allRestProducts.find(p => p.slug === 'espresso'), quantity: 1 },
        { product: allRestProducts.find(p => p.slug === 'burger-combo'), quantity: 1 },
      ],
      payment: { method: 'CARD' },
    },
    {
      orderNumber: 'ORD-011', status: 'COMPLETED', orderType: 'TAKEAWAY',
      customerId: allCustomers[2]?.id, tableId: null,
      createdAt: new Date(now - DAY * 0.5),
      items: [
        { product: allRestProducts.find(p => p.slug === 'latte'), quantity: 2 },
        { product: allRestProducts.find(p => p.slug === 'cappuccino'), quantity: 1 },
      ],
      payment: { method: 'CARD' },
    },
    {
      orderNumber: 'ORD-012', status: 'COMPLETED', orderType: 'DINE_IN',
      customerId: allCustomers[3]?.id, tableId: allTables[0]?.id,
      createdAt: new Date(now - DAY * 4),
      items: [
        { product: allRestProducts.find(p => p.slug === 'margherita-pizza'), quantity: 2 },
        { product: allRestProducts.find(p => p.slug === 'french-fries'), quantity: 1 },
      ],
      payment: { method: 'CASH' },
    },
  ];

  let orderCount = 0;
  for (const o of ordersData) {
    const validItems = o.items.filter(i => i.product);
    if (validItems.length === 0) continue;
    const subtotal = validItems.reduce((s, i) => s + i.product!.price * i.quantity, 0);
    const taxAmount = +(subtotal * 0.085).toFixed(2);
    const totalAmount = +(subtotal + taxAmount).toFixed(2);

    await prisma.order.create({
      data: {
        orderNumber: o.orderNumber,
        status: o.status,
        orderType: o.orderType,
        subtotal,
        taxAmount,
        discountAmount: 0,
        totalAmount,
        notes: o.notes || '',
        customerId: o.customerId || null,
        userId: admin.id,
        branchId: branch.id,
        tableId: o.tableId || null,
        createdAt: o.createdAt,
        items: {
          create: validItems.map(i => ({
            productId: i.product!.id,
            quantity: i.quantity,
            unitPrice: i.product!.price,
            totalPrice: i.product!.price * i.quantity,
            discount: 0,
            notes: '',
          })),
        },
        payments: o.payment ? {
          create: { method: o.payment.method, amount: totalAmount, status: 'COMPLETED' },
        } : undefined,
      },
    });
    orderCount++;
  }

  console.log(`✅ Database seeded successfully! (${orderCount} orders created)`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
