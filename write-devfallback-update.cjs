// This script updates devFallback with business-type-specific products and categories
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend', 'src', 'middleware', 'devFallback.ts');
let content = fs.readFileSync(filePath, 'utf8');

// ── Find the categories array and replace it with multi-business-type categories ──
const oldCategoriesStart = "const categories = [";
const oldCategoriesEnd = "];";

// Find the exact categories block
const catStartIdx = content.indexOf(oldCategoriesStart);
const catEndIdx = content.indexOf(oldCategoriesEnd, catStartIdx) + 2;
const oldCategoriesBlock = content.substring(catStartIdx, catEndIdx);

const newCategoriesBlock = `const categories: any[] = [
  // ── RESTAURANT categories ──
  { id: 'cat-1', name: 'Beverages', slug: 'beverages', icon: '☕', color: '#8B5CF6', sortOrder: 1, isActive: true, branchId: null, businessType: 'RESTAURANT' },
  { id: 'cat-2', name: 'Food', slug: 'food', icon: '🍔', color: '#EF4444', sortOrder: 2, isActive: true, branchId: null, businessType: 'RESTAURANT' },
  { id: 'cat-3', name: 'Desserts', slug: 'desserts', icon: '🍰', color: '#F59E0B', sortOrder: 3, isActive: true, branchId: null, businessType: 'RESTAURANT' },
  { id: 'cat-4', name: 'Snacks', slug: 'snacks', icon: '🍟', color: '#22C55E', sortOrder: 4, isActive: true, branchId: null, businessType: 'RESTAURANT' },
  { id: 'cat-5', name: 'Combos', slug: 'combos', icon: '🎁', color: '#3B82F6', sortOrder: 5, isActive: true, branchId: null, businessType: 'RESTAURANT' },
  { id: 'cat-6', name: 'Breakfast', slug: 'breakfast', icon: '🥞', color: '#14B8A6', sortOrder: 6, isActive: true, branchId: null, businessType: 'RESTAURANT' },
  // ── SALON categories ──
  { id: 'scat-1', name: 'Haircuts', slug: 'haircuts', icon: '✂️', color: '#8B5CF6', sortOrder: 1, isActive: true, branchId: null, businessType: 'SALON' },
  { id: 'scat-2', name: 'Beard & Shave', slug: 'beard-shave', icon: '🪒', color: '#EF4444', sortOrder: 2, isActive: true, branchId: null, businessType: 'SALON' },
  { id: 'scat-3', name: 'Hair Styling', slug: 'hair-styling', icon: '💇', color: '#F59E0B', sortOrder: 3, isActive: true, branchId: null, businessType: 'SALON' },
  { id: 'scat-4', name: 'Spa & Massage', slug: 'spa-massage', icon: '💆', color: '#22C55E', sortOrder: 4, isActive: true, branchId: null, businessType: 'SALON' },
  { id: 'scat-5', name: 'Nail Art', slug: 'nail-art', icon: '💅', color: '#EC4899', sortOrder: 5, isActive: true, branchId: null, businessType: 'SALON' },
  { id: 'scat-6', name: 'Skin Care', slug: 'skin-care', icon: '🧖', color: '#14B8A6', sortOrder: 6, isActive: true, branchId: null, businessType: 'SALON' },
  { id: 'scat-7', name: 'Packages', slug: 'packages', icon: '🎁', color: '#3B82F6', sortOrder: 7, isActive: true, branchId: null, businessType: 'SALON' },
  // ── CAFE categories ──
  { id: 'ccat-1', name: 'Hot Drinks', slug: 'hot-drinks', icon: '☕', color: '#8B5CF6', sortOrder: 1, isActive: true, branchId: null, businessType: 'CAFE' },
  { id: 'ccat-2', name: 'Cold Drinks', slug: 'cold-drinks', icon: '🧊', color: '#3B82F6', sortOrder: 2, isActive: true, branchId: null, businessType: 'CAFE' },
  { id: 'ccat-3', name: 'Pastries', slug: 'pastries', icon: '🥐', color: '#F59E0B', sortOrder: 3, isActive: true, branchId: null, businessType: 'CAFE' },
  { id: 'ccat-4', name: 'Sandwiches', slug: 'sandwiches', icon: '🥪', color: '#22C55E', sortOrder: 4, isActive: true, branchId: null, businessType: 'CAFE' },
  { id: 'ccat-5', name: 'Cakes', slug: 'cakes', icon: '🎂', color: '#EC4899', sortOrder: 5, isActive: true, branchId: null, businessType: 'CAFE' },
  // ── RETAIL categories ──
  { id: 'rcat-1', name: 'Electronics', slug: 'electronics', icon: '📱', color: '#3B82F6', sortOrder: 1, isActive: true, branchId: null, businessType: 'RETAIL' },
  { id: 'rcat-2', name: 'Clothing', slug: 'clothing', icon: '👕', color: '#8B5CF6', sortOrder: 2, isActive: true, branchId: null, businessType: 'RETAIL' },
  { id: 'rcat-3', name: 'Accessories', slug: 'accessories', icon: '👜', color: '#EC4899', sortOrder: 3, isActive: true, branchId: null, businessType: 'RETAIL' },
  { id: 'rcat-4', name: 'Home & Living', slug: 'home-living', icon: '🏠', color: '#22C55E', sortOrder: 4, isActive: true, branchId: null, businessType: 'RETAIL' },
  { id: 'rcat-5', name: 'Footwear', slug: 'footwear', icon: '👟', color: '#F59E0B', sortOrder: 5, isActive: true, branchId: null, businessType: 'RETAIL' },
  // ── GROCERY categories ──
  { id: 'gcat-1', name: 'Fruits & Vegetables', slug: 'fruits-vegetables', icon: '🥬', color: '#22C55E', sortOrder: 1, isActive: true, branchId: null, businessType: 'GROCERY' },
  { id: 'gcat-2', name: 'Dairy & Eggs', slug: 'dairy-eggs', icon: '🥛', color: '#F59E0B', sortOrder: 2, isActive: true, branchId: null, businessType: 'GROCERY' },
  { id: 'gcat-3', name: 'Bakery', slug: 'bakery', icon: '🍞', color: '#EF4444', sortOrder: 3, isActive: true, branchId: null, businessType: 'GROCERY' },
  { id: 'gcat-4', name: 'Snacks & Beverages', slug: 'snacks-beverages', icon: '🥤', color: '#8B5CF6', sortOrder: 4, isActive: true, branchId: null, businessType: 'GROCERY' },
  { id: 'gcat-5', name: 'Household', slug: 'household', icon: '🧹', color: '#3B82F6', sortOrder: 5, isActive: true, branchId: null, businessType: 'GROCERY' },
  // ── PHARMACY categories ──
  { id: 'pcat-1', name: 'Prescription', slug: 'prescription', icon: '💊', color: '#EF4444', sortOrder: 1, isActive: true, branchId: null, businessType: 'PHARMACY' },
  { id: 'pcat-2', name: 'Over-the-Counter', slug: 'otc', icon: '🩹', color: '#22C55E', sortOrder: 2, isActive: true, branchId: null, businessType: 'PHARMACY' },
  { id: 'pcat-3', name: 'Vitamins & Supplements', slug: 'vitamins', icon: '💪', color: '#F59E0B', sortOrder: 3, isActive: true, branchId: null, businessType: 'PHARMACY' },
  { id: 'pcat-4', name: 'Personal Care', slug: 'personal-care', icon: '🧴', color: '#8B5CF6', sortOrder: 4, isActive: true, branchId: null, businessType: 'PHARMACY' },
  { id: 'pcat-5', name: 'Medical Devices', slug: 'medical-devices', icon: '🩺', color: '#3B82F6', sortOrder: 5, isActive: true, branchId: null, businessType: 'PHARMACY' },
];`;

content = content.replace(oldCategoriesBlock, newCategoriesBlock);

// ── Now replace the products array ──
const prodStartIdx = content.indexOf("const products = [");
// Find the matching closing ];  by counting brackets
let bracketCount = 0;
let prodEndIdx = prodStartIdx;
for (let i = prodStartIdx; i < content.length; i++) {
  if (content[i] === '[') bracketCount++;
  if (content[i] === ']') bracketCount--;
  if (bracketCount === 0) { prodEndIdx = i + 2; break; } // +2 for ]; 
}
const oldProductsBlock = content.substring(prodStartIdx, prodEndIdx);

const newProductsBlock = `const products: any[] = [
  // ═══ RESTAURANT Products ═══
  { id: 'prod-1', name: 'Espresso', slug: 'espresso', description: 'Rich and bold espresso shot', sku: 'BEV-001', barcode: '100001', price: 3.50, costPrice: 1.00, image: null, isActive: true, isWeighted: false, unit: 'cup', taxRate: 8.5, categoryId: 'cat-1', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-2', name: 'Cappuccino', slug: 'cappuccino', description: 'Classic Italian coffee with steamed milk', sku: 'BEV-002', barcode: '100002', price: 4.50, costPrice: 1.50, image: null, isActive: true, isWeighted: false, unit: 'cup', taxRate: 8.5, categoryId: 'cat-1', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-3', name: 'Latte', slug: 'latte', description: 'Smooth espresso with steamed milk', sku: 'BEV-003', barcode: '100003', price: 4.99, costPrice: 1.50, image: null, isActive: true, isWeighted: false, unit: 'cup', taxRate: 8.5, categoryId: 'cat-1', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-4', name: 'Green Tea', slug: 'green-tea', description: 'Organic Japanese green tea', sku: 'BEV-004', barcode: '100004', price: 3.00, costPrice: 0.80, image: null, isActive: true, isWeighted: false, unit: 'cup', taxRate: 8.5, categoryId: 'cat-1', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-5', name: 'Mango Smoothie', slug: 'mango-smoothie', description: 'Fresh mango blended with yogurt', sku: 'BEV-005', barcode: '100005', price: 5.99, costPrice: 2.00, image: null, isActive: true, isWeighted: false, unit: 'cup', taxRate: 8.5, categoryId: 'cat-1', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-6', name: 'Classic Burger', slug: 'classic-burger', description: 'Beef patty with lettuce, tomato, and cheese', sku: 'FOOD-001', barcode: '200001', price: 9.99, costPrice: 4.00, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'cat-2', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-7', name: 'Chicken Sandwich', slug: 'chicken-sandwich', description: 'Grilled chicken breast on ciabatta', sku: 'FOOD-002', barcode: '200002', price: 8.49, costPrice: 3.50, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'cat-2', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-8', name: 'Veggie Wrap', slug: 'veggie-wrap', description: 'Fresh vegetables in a whole wheat wrap', sku: 'FOOD-003', barcode: '200003', price: 7.99, costPrice: 3.00, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'cat-2', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-9', name: 'Margherita Pizza', slug: 'margherita-pizza', description: 'Classic pizza with mozzarella and basil', sku: 'FOOD-004', barcode: '200004', price: 12.99, costPrice: 4.50, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'cat-2', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-10', name: 'Caesar Salad', slug: 'caesar-salad', description: 'Romaine lettuce with Caesar dressing and croutons', sku: 'FOOD-005', barcode: '200005', price: 8.99, costPrice: 3.00, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'cat-2', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-11', name: 'Chocolate Cake', slug: 'chocolate-cake', description: 'Rich dark chocolate layer cake', sku: 'DES-001', barcode: '300001', price: 6.99, costPrice: 2.50, image: null, isActive: true, isWeighted: false, unit: 'slice', taxRate: 8.5, categoryId: 'cat-3', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-12', name: 'Cheesecake', slug: 'cheesecake', description: 'New York style cheesecake', sku: 'DES-002', barcode: '300002', price: 7.49, costPrice: 2.80, image: null, isActive: true, isWeighted: false, unit: 'slice', taxRate: 8.5, categoryId: 'cat-3', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-13', name: 'Ice Cream Sundae', slug: 'ice-cream-sundae', description: 'Vanilla ice cream with toppings', sku: 'DES-003', barcode: '300003', price: 5.49, costPrice: 1.80, image: null, isActive: true, isWeighted: false, unit: 'bowl', taxRate: 8.5, categoryId: 'cat-3', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-14', name: 'French Fries', slug: 'french-fries', description: 'Crispy golden french fries', sku: 'SNK-001', barcode: '400001', price: 3.99, costPrice: 1.00, image: null, isActive: true, isWeighted: false, unit: 'portion', taxRate: 8.5, categoryId: 'cat-4', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-15', name: 'Onion Rings', slug: 'onion-rings', description: 'Beer-battered onion rings', sku: 'SNK-002', barcode: '400002', price: 4.49, costPrice: 1.20, image: null, isActive: true, isWeighted: false, unit: 'portion', taxRate: 8.5, categoryId: 'cat-4', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-16', name: 'Nachos Supreme', slug: 'nachos-supreme', description: 'Tortilla chips with cheese and toppings', sku: 'SNK-003', barcode: '400003', price: 6.99, costPrice: 2.00, image: null, isActive: true, isWeighted: false, unit: 'portion', taxRate: 8.5, categoryId: 'cat-4', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-17', name: 'Burger Combo', slug: 'burger-combo', description: 'Classic burger with fries and a drink', sku: 'CMB-001', barcode: '500001', price: 14.99, costPrice: 5.50, image: null, isActive: true, isWeighted: false, unit: 'combo', taxRate: 8.5, categoryId: 'cat-5', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-18', name: 'Family Meal', slug: 'family-meal', description: '2 burgers, 2 fries, 4 drinks', sku: 'CMB-002', barcode: '500002', price: 29.99, costPrice: 11.00, image: null, isActive: true, isWeighted: false, unit: 'combo', taxRate: 8.5, categoryId: 'cat-5', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-19', name: 'Pancake Stack', slug: 'pancake-stack', description: 'Fluffy pancakes with maple syrup', sku: 'BRK-001', barcode: '600001', price: 7.99, costPrice: 2.50, image: null, isActive: true, isWeighted: false, unit: 'plate', taxRate: 8.5, categoryId: 'cat-6', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-20', name: 'Eggs Benedict', slug: 'eggs-benedict', description: 'Poached eggs with hollandaise on English muffin', sku: 'BRK-002', barcode: '600002', price: 10.99, costPrice: 3.50, image: null, isActive: true, isWeighted: false, unit: 'plate', taxRate: 8.5, categoryId: 'cat-6', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-21', name: 'Avocado Toast', slug: 'avocado-toast', description: 'Sourdough with smashed avocado and eggs', sku: 'BRK-003', barcode: '600003', price: 9.49, costPrice: 3.00, image: null, isActive: true, isWeighted: false, unit: 'plate', taxRate: 8.5, categoryId: 'cat-6', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-22', name: 'Americano', slug: 'americano', description: 'Espresso with hot water', sku: 'BEV-006', barcode: '100006', price: 3.99, costPrice: 1.00, image: null, isActive: true, isWeighted: false, unit: 'cup', taxRate: 8.5, categoryId: 'cat-1', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-23', name: 'Mocha', slug: 'mocha', description: 'Espresso with chocolate and steamed milk', sku: 'BEV-007', barcode: '100007', price: 5.49, costPrice: 1.80, image: null, isActive: true, isWeighted: false, unit: 'cup', taxRate: 8.5, categoryId: 'cat-1', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },
  { id: 'prod-24', name: 'Tiramisu', slug: 'tiramisu', description: 'Classic Italian coffee-flavored dessert', sku: 'DES-004', barcode: '300004', price: 7.99, costPrice: 3.00, image: null, isActive: true, isWeighted: false, unit: 'slice', taxRate: 8.5, categoryId: 'cat-3', branchId: null, businessType: 'RESTAURANT', duration: null, modifiers: null, variants: null },

  // ═══ SALON Products (Services) ═══
  // -- Haircuts --
  { id: 'sprod-1',  name: "Men's Haircut",         slug: 'mens-haircut',       description: 'Classic men\\'s haircut with styling', sku: 'SAL-001', barcode: '700001', price: 25.00, costPrice: 5.00,  image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-1', branchId: null, businessType: 'SALON', duration: 30, modifiers: null, variants: null },
  { id: 'sprod-2',  name: "Women's Haircut",        slug: 'womens-haircut',     description: 'Women\\'s haircut with wash and blowdry', sku: 'SAL-002', barcode: '700002', price: 45.00, costPrice: 8.00,  image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-1', branchId: null, businessType: 'SALON', duration: 45, modifiers: null, variants: null },
  { id: 'sprod-3',  name: "Kids' Haircut",          slug: 'kids-haircut',       description: 'Haircut for children under 12', sku: 'SAL-003', barcode: '700003', price: 15.00, costPrice: 3.00,  image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-1', branchId: null, businessType: 'SALON', duration: 20, modifiers: null, variants: null },
  { id: 'sprod-4',  name: 'Buzz Cut',               slug: 'buzz-cut',           description: 'Clean buzz cut with clippers', sku: 'SAL-004', barcode: '700004', price: 15.00, costPrice: 3.00,  image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-1', branchId: null, businessType: 'SALON', duration: 15, modifiers: null, variants: null },
  { id: 'sprod-5',  name: 'Hair Trim',              slug: 'hair-trim',          description: 'Quick trim to maintain current style', sku: 'SAL-005', barcode: '700005', price: 18.00, costPrice: 4.00,  image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-1', branchId: null, businessType: 'SALON', duration: 20, modifiers: null, variants: null },
  // -- Beard & Shave --
  { id: 'sprod-6',  name: 'Beard Trim',             slug: 'beard-trim',         description: 'Professional beard shaping and trim', sku: 'SAL-006', barcode: '700006', price: 15.00, costPrice: 3.00,  image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-2', branchId: null, businessType: 'SALON', duration: 15, modifiers: null, variants: null },
  { id: 'sprod-7',  name: 'Clean Shave',            slug: 'clean-shave',        description: 'Traditional hot towel clean shave', sku: 'SAL-007', barcode: '700007', price: 20.00, costPrice: 4.00,  image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-2', branchId: null, businessType: 'SALON', duration: 25, modifiers: null, variants: null },
  { id: 'sprod-8',  name: 'Beard Coloring',         slug: 'beard-coloring',     description: 'Beard dye and styling', sku: 'SAL-008', barcode: '700008', price: 25.00, costPrice: 8.00,  image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-2', branchId: null, businessType: 'SALON', duration: 30, modifiers: null, variants: null },
  // -- Hair Styling --
  { id: 'sprod-9',  name: 'Hair Coloring',          slug: 'hair-coloring',      description: 'Full head hair coloring with premium dye', sku: 'SAL-009', barcode: '700009', price: 65.00, costPrice: 15.00, image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-3', branchId: null, businessType: 'SALON', duration: 90, modifiers: null, variants: null },
  { id: 'sprod-10', name: 'Highlights',             slug: 'highlights',         description: 'Partial or full highlights', sku: 'SAL-010', barcode: '700010', price: 85.00, costPrice: 20.00, image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-3', branchId: null, businessType: 'SALON', duration: 120, modifiers: null, variants: null },
  { id: 'sprod-11', name: 'Keratin Treatment',      slug: 'keratin-treatment',  description: 'Smoothing keratin treatment for frizzy hair', sku: 'SAL-011', barcode: '700011', price: 120.00, costPrice: 30.00, image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-3', branchId: null, businessType: 'SALON', duration: 150, modifiers: null, variants: null },
  { id: 'sprod-12', name: 'Blowdry & Style',        slug: 'blowdry-style',      description: 'Professional blowdry and styling', sku: 'SAL-012', barcode: '700012', price: 30.00, costPrice: 5.00,  image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-3', branchId: null, businessType: 'SALON', duration: 30, modifiers: null, variants: null },
  { id: 'sprod-13', name: 'Perming',                slug: 'perming',            description: 'Permanent wave for curly look', sku: 'SAL-013', barcode: '700013', price: 75.00, costPrice: 18.00, image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-3', branchId: null, businessType: 'SALON', duration: 120, modifiers: null, variants: null },
  // -- Spa & Massage --
  { id: 'sprod-14', name: 'Head Massage',           slug: 'head-massage',       description: 'Relaxing scalp and head massage with oil', sku: 'SAL-014', barcode: '700014', price: 20.00, costPrice: 3.00,  image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-4', branchId: null, businessType: 'SALON', duration: 20, modifiers: null, variants: null },
  { id: 'sprod-15', name: 'Full Body Massage',      slug: 'full-body-massage',  description: 'Full body relaxation massage', sku: 'SAL-015', barcode: '700015', price: 60.00, costPrice: 10.00, image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-4', branchId: null, businessType: 'SALON', duration: 60, modifiers: null, variants: null },
  { id: 'sprod-16', name: 'Aromatherapy Spa',       slug: 'aromatherapy-spa',   description: 'Luxury aromatherapy spa session', sku: 'SAL-016', barcode: '700016', price: 80.00, costPrice: 15.00, image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-4', branchId: null, businessType: 'SALON', duration: 75, modifiers: null, variants: null },
  { id: 'sprod-17', name: 'Hot Stone Therapy',      slug: 'hot-stone-therapy',  description: 'Hot stone relaxation therapy', sku: 'SAL-017', barcode: '700017', price: 70.00, costPrice: 12.00, image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-4', branchId: null, businessType: 'SALON', duration: 60, modifiers: null, variants: null },
  // -- Nail Art --
  { id: 'sprod-18', name: 'Manicure',               slug: 'manicure',           description: 'Classic manicure with nail shaping and polish', sku: 'SAL-018', barcode: '700018', price: 25.00, costPrice: 5.00,  image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-5', branchId: null, businessType: 'SALON', duration: 30, modifiers: null, variants: null },
  { id: 'sprod-19', name: 'Pedicure',               slug: 'pedicure',           description: 'Full pedicure with foot soak and polish', sku: 'SAL-019', barcode: '700019', price: 35.00, costPrice: 7.00,  image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-5', branchId: null, businessType: 'SALON', duration: 45, modifiers: null, variants: null },
  { id: 'sprod-20', name: 'Gel Nails',              slug: 'gel-nails',          description: 'Long-lasting gel nail application', sku: 'SAL-020', barcode: '700020', price: 40.00, costPrice: 10.00, image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-5', branchId: null, businessType: 'SALON', duration: 45, modifiers: null, variants: null },
  { id: 'sprod-21', name: 'Nail Art Design',        slug: 'nail-art-design',    description: 'Custom nail art with intricate designs', sku: 'SAL-021', barcode: '700021', price: 50.00, costPrice: 12.00, image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-5', branchId: null, businessType: 'SALON', duration: 60, modifiers: null, variants: null },
  // -- Skin Care --
  { id: 'sprod-22', name: 'Facial',                 slug: 'facial',             description: 'Deep cleansing facial treatment', sku: 'SAL-022', barcode: '700022', price: 45.00, costPrice: 10.00, image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-6', branchId: null, businessType: 'SALON', duration: 45, modifiers: null, variants: null },
  { id: 'sprod-23', name: 'Waxing (Full Legs)',     slug: 'waxing-legs',        description: 'Full leg waxing service', sku: 'SAL-023', barcode: '700023', price: 35.00, costPrice: 8.00,  image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-6', branchId: null, businessType: 'SALON', duration: 30, modifiers: null, variants: null },
  { id: 'sprod-24', name: 'Threading (Eyebrows)',   slug: 'threading-eyebrows', description: 'Eyebrow threading and shaping', sku: 'SAL-024', barcode: '700024', price: 10.00, costPrice: 2.00,  image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-6', branchId: null, businessType: 'SALON', duration: 10, modifiers: null, variants: null },
  { id: 'sprod-25', name: 'De-Tan Treatment',       slug: 'de-tan',             description: 'Full face and neck de-tan treatment', sku: 'SAL-025', barcode: '700025', price: 30.00, costPrice: 8.00,  image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-6', branchId: null, businessType: 'SALON', duration: 30, modifiers: null, variants: null },
  // -- Packages --
  { id: 'sprod-26', name: 'Groom Package',          slug: 'groom-package',      description: 'Haircut + Beard Trim + Head Massage', sku: 'SAL-026', barcode: '700026', price: 50.00, costPrice: 10.00, image: null, isActive: true, isWeighted: false, unit: 'package', taxRate: 8.5, categoryId: 'scat-7', branchId: null, businessType: 'SALON', duration: 60, modifiers: null, variants: null },
  { id: 'sprod-27', name: 'Bridal Package',         slug: 'bridal-package',     description: 'Hair + Makeup + Manicure + Pedicure + Facial', sku: 'SAL-027', barcode: '700027', price: 199.00, costPrice: 40.00, image: null, isActive: true, isWeighted: false, unit: 'package', taxRate: 8.5, categoryId: 'scat-7', branchId: null, businessType: 'SALON', duration: 240, modifiers: null, variants: null },
  { id: 'sprod-28', name: 'Pamper Package',         slug: 'pamper-package',     description: 'Full Body Massage + Facial + Manicure + Pedicure', sku: 'SAL-028', barcode: '700028', price: 150.00, costPrice: 30.00, image: null, isActive: true, isWeighted: false, unit: 'package', taxRate: 8.5, categoryId: 'scat-7', branchId: null, businessType: 'SALON', duration: 180, modifiers: null, variants: null },

  // ═══ CAFE Products ═══
  { id: 'cprod-1', name: 'Flat White',      slug: 'flat-white',      description: 'Velvety espresso with steamed milk', sku: 'CAF-001', barcode: '800001', price: 4.50, costPrice: 1.20, image: null, isActive: true, isWeighted: false, unit: 'cup', taxRate: 8.5, categoryId: 'ccat-1', branchId: null, businessType: 'CAFE', duration: null, modifiers: null, variants: null },
  { id: 'cprod-2', name: 'Chai Latte',      slug: 'chai-latte',      description: 'Spiced tea with steamed milk', sku: 'CAF-002', barcode: '800002', price: 4.99, costPrice: 1.00, image: null, isActive: true, isWeighted: false, unit: 'cup', taxRate: 8.5, categoryId: 'ccat-1', branchId: null, businessType: 'CAFE', duration: null, modifiers: null, variants: null },
  { id: 'cprod-3', name: 'Hot Chocolate',   slug: 'hot-chocolate',   description: 'Rich Belgian hot chocolate', sku: 'CAF-003', barcode: '800003', price: 4.50, costPrice: 1.30, image: null, isActive: true, isWeighted: false, unit: 'cup', taxRate: 8.5, categoryId: 'ccat-1', branchId: null, businessType: 'CAFE', duration: null, modifiers: null, variants: null },
  { id: 'cprod-4', name: 'Iced Coffee',     slug: 'iced-coffee',     description: 'Cold brew coffee over ice', sku: 'CAF-004', barcode: '800004', price: 5.49, costPrice: 1.50, image: null, isActive: true, isWeighted: false, unit: 'cup', taxRate: 8.5, categoryId: 'ccat-2', branchId: null, businessType: 'CAFE', duration: null, modifiers: null, variants: null },
  { id: 'cprod-5', name: 'Iced Matcha',     slug: 'iced-matcha',     description: 'Matcha green tea latte on ice', sku: 'CAF-005', barcode: '800005', price: 5.99, costPrice: 2.00, image: null, isActive: true, isWeighted: false, unit: 'cup', taxRate: 8.5, categoryId: 'ccat-2', branchId: null, businessType: 'CAFE', duration: null, modifiers: null, variants: null },
  { id: 'cprod-6', name: 'Fresh Lemonade',  slug: 'fresh-lemonade',  description: 'Freshly squeezed lemonade', sku: 'CAF-006', barcode: '800006', price: 3.99, costPrice: 0.80, image: null, isActive: true, isWeighted: false, unit: 'glass', taxRate: 8.5, categoryId: 'ccat-2', branchId: null, businessType: 'CAFE', duration: null, modifiers: null, variants: null },
  { id: 'cprod-7', name: 'Butter Croissant',slug: 'butter-croissant',description: 'Flaky French butter croissant', sku: 'CAF-007', barcode: '800007', price: 3.49, costPrice: 1.00, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'ccat-3', branchId: null, businessType: 'CAFE', duration: null, modifiers: null, variants: null },
  { id: 'cprod-8', name: 'Blueberry Muffin',slug: 'blueberry-muffin',description: 'Fresh-baked blueberry muffin', sku: 'CAF-008', barcode: '800008', price: 3.99, costPrice: 1.20, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'ccat-3', branchId: null, businessType: 'CAFE', duration: null, modifiers: null, variants: null },
  { id: 'cprod-9', name: 'Cinnamon Roll',   slug: 'cinnamon-roll',   description: 'Warm cinnamon roll with icing', sku: 'CAF-009', barcode: '800009', price: 4.49, costPrice: 1.30, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'ccat-3', branchId: null, businessType: 'CAFE', duration: null, modifiers: null, variants: null },
  { id: 'cprod-10', name: 'Club Sandwich',  slug: 'club-sandwich',   description: 'Triple-decker club sandwich', sku: 'CAF-010', barcode: '800010', price: 8.99, costPrice: 3.50, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'ccat-4', branchId: null, businessType: 'CAFE', duration: null, modifiers: null, variants: null },
  { id: 'cprod-11', name: 'Avocado Panini', slug: 'avocado-panini',  description: 'Grilled panini with avocado', sku: 'CAF-011', barcode: '800011', price: 9.49, costPrice: 3.80, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'ccat-4', branchId: null, businessType: 'CAFE', duration: null, modifiers: null, variants: null },
  { id: 'cprod-12', name: 'Red Velvet Cake',slug: 'red-velvet-cake', description: 'Classic red velvet cake slice', sku: 'CAF-012', barcode: '800012', price: 6.99, costPrice: 2.50, image: null, isActive: true, isWeighted: false, unit: 'slice', taxRate: 8.5, categoryId: 'ccat-5', branchId: null, businessType: 'CAFE', duration: null, modifiers: null, variants: null },

  // ═══ RETAIL Products ═══
  { id: 'rprod-1', name: 'Wireless Earbuds',   slug: 'wireless-earbuds',   description: 'Bluetooth wireless earbuds', sku: 'RET-001', barcode: '900001', price: 49.99, costPrice: 20.00, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'rcat-1', branchId: null, businessType: 'RETAIL', duration: null, modifiers: null, variants: null },
  { id: 'rprod-2', name: 'Phone Case',         slug: 'phone-case',         description: 'Protective phone case', sku: 'RET-002', barcode: '900002', price: 19.99, costPrice: 5.00,  image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'rcat-1', branchId: null, businessType: 'RETAIL', duration: null, modifiers: null, variants: null },
  { id: 'rprod-3', name: 'USB-C Cable',        slug: 'usb-c-cable',        description: 'Fast charging USB-C cable', sku: 'RET-003', barcode: '900003', price: 12.99, costPrice: 3.00,  image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'rcat-1', branchId: null, businessType: 'RETAIL', duration: null, modifiers: null, variants: null },
  { id: 'rprod-4', name: 'Cotton T-Shirt',     slug: 'cotton-tshirt',      description: 'Premium cotton T-shirt', sku: 'RET-004', barcode: '900004', price: 24.99, costPrice: 8.00,  image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'rcat-2', branchId: null, businessType: 'RETAIL', duration: null, modifiers: null, variants: null },
  { id: 'rprod-5', name: 'Denim Jeans',        slug: 'denim-jeans',        description: 'Classic fit denim jeans', sku: 'RET-005', barcode: '900005', price: 59.99, costPrice: 22.00, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'rcat-2', branchId: null, businessType: 'RETAIL', duration: null, modifiers: null, variants: null },
  { id: 'rprod-6', name: 'Leather Belt',       slug: 'leather-belt',       description: 'Genuine leather belt', sku: 'RET-006', barcode: '900006', price: 29.99, costPrice: 10.00, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'rcat-3', branchId: null, businessType: 'RETAIL', duration: null, modifiers: null, variants: null },
  { id: 'rprod-7', name: 'Sunglasses',         slug: 'sunglasses',         description: 'UV protection sunglasses', sku: 'RET-007', barcode: '900007', price: 34.99, costPrice: 12.00, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'rcat-3', branchId: null, businessType: 'RETAIL', duration: null, modifiers: null, variants: null },
  { id: 'rprod-8', name: 'Scented Candle',     slug: 'scented-candle',     description: 'Premium scented candle', sku: 'RET-008', barcode: '900008', price: 18.99, costPrice: 6.00,  image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'rcat-4', branchId: null, businessType: 'RETAIL', duration: null, modifiers: null, variants: null },
  { id: 'rprod-9', name: 'Running Shoes',      slug: 'running-shoes',      description: 'Lightweight running shoes', sku: 'RET-009', barcode: '900009', price: 89.99, costPrice: 35.00, image: null, isActive: true, isWeighted: false, unit: 'pair', taxRate: 8.5, categoryId: 'rcat-5', branchId: null, businessType: 'RETAIL', duration: null, modifiers: null, variants: null },
  { id: 'rprod-10', name: 'Flip Flops',        slug: 'flip-flops',         description: 'Comfortable flip flop sandals', sku: 'RET-010', barcode: '900010', price: 14.99, costPrice: 4.00,  image: null, isActive: true, isWeighted: false, unit: 'pair', taxRate: 8.5, categoryId: 'rcat-5', branchId: null, businessType: 'RETAIL', duration: null, modifiers: null, variants: null },

  // ═══ GROCERY Products ═══
  { id: 'gprod-1', name: 'Bananas (1kg)',     slug: 'bananas',      description: 'Fresh bananas per kg', sku: 'GRC-001', barcode: 'A00001', price: 1.29, costPrice: 0.60, image: null, isActive: true, isWeighted: true, unit: 'kg', taxRate: 0, categoryId: 'gcat-1', branchId: null, businessType: 'GROCERY', duration: null, modifiers: null, variants: null },
  { id: 'gprod-2', name: 'Tomatoes (1kg)',    slug: 'tomatoes',     description: 'Fresh ripe tomatoes', sku: 'GRC-002', barcode: 'A00002', price: 2.49, costPrice: 1.20, image: null, isActive: true, isWeighted: true, unit: 'kg', taxRate: 0, categoryId: 'gcat-1', branchId: null, businessType: 'GROCERY', duration: null, modifiers: null, variants: null },
  { id: 'gprod-3', name: 'Spinach Bundle',    slug: 'spinach',      description: 'Fresh organic spinach', sku: 'GRC-003', barcode: 'A00003', price: 1.99, costPrice: 0.80, image: null, isActive: true, isWeighted: false, unit: 'bundle', taxRate: 0, categoryId: 'gcat-1', branchId: null, businessType: 'GROCERY', duration: null, modifiers: null, variants: null },
  { id: 'gprod-4', name: 'Whole Milk (1L)',   slug: 'whole-milk',   description: 'Fresh whole milk', sku: 'GRC-004', barcode: 'A00004', price: 3.49, costPrice: 2.00, image: null, isActive: true, isWeighted: false, unit: 'liter', taxRate: 0, categoryId: 'gcat-2', branchId: null, businessType: 'GROCERY', duration: null, modifiers: null, variants: null },
  { id: 'gprod-5', name: 'Free Range Eggs',   slug: 'eggs',         description: 'Dozen free range eggs', sku: 'GRC-005', barcode: 'A00005', price: 4.99, costPrice: 3.00, image: null, isActive: true, isWeighted: false, unit: 'dozen', taxRate: 0, categoryId: 'gcat-2', branchId: null, businessType: 'GROCERY', duration: null, modifiers: null, variants: null },
  { id: 'gprod-6', name: 'Sourdough Bread',   slug: 'sourdough',    description: 'Artisan sourdough loaf', sku: 'GRC-006', barcode: 'A00006', price: 5.49, costPrice: 2.50, image: null, isActive: true, isWeighted: false, unit: 'loaf', taxRate: 0, categoryId: 'gcat-3', branchId: null, businessType: 'GROCERY', duration: null, modifiers: null, variants: null },
  { id: 'gprod-7', name: 'Chocolate Cookies', slug: 'choc-cookies', description: 'Pack of chocolate chip cookies', sku: 'GRC-007', barcode: 'A00007', price: 3.99, costPrice: 1.50, image: null, isActive: true, isWeighted: false, unit: 'pack', taxRate: 8.5, categoryId: 'gcat-3', branchId: null, businessType: 'GROCERY', duration: null, modifiers: null, variants: null },
  { id: 'gprod-8', name: 'Potato Chips',      slug: 'potato-chips', description: 'Sea salt potato chips', sku: 'GRC-008', barcode: 'A00008', price: 2.99, costPrice: 1.00, image: null, isActive: true, isWeighted: false, unit: 'bag', taxRate: 8.5, categoryId: 'gcat-4', branchId: null, businessType: 'GROCERY', duration: null, modifiers: null, variants: null },
  { id: 'gprod-9', name: 'Orange Juice (1L)', slug: 'orange-juice', description: 'Fresh squeezed orange juice', sku: 'GRC-009', barcode: 'A00009', price: 4.49, costPrice: 2.00, image: null, isActive: true, isWeighted: false, unit: 'bottle', taxRate: 0, categoryId: 'gcat-4', branchId: null, businessType: 'GROCERY', duration: null, modifiers: null, variants: null },
  { id: 'gprod-10', name: 'Dish Soap',        slug: 'dish-soap',    description: 'Eco-friendly dish soap', sku: 'GRC-010', barcode: 'A00010', price: 3.49, costPrice: 1.50, image: null, isActive: true, isWeighted: false, unit: 'bottle', taxRate: 8.5, categoryId: 'gcat-5', branchId: null, businessType: 'GROCERY', duration: null, modifiers: null, variants: null },

  // ═══ PHARMACY Products ═══
  { id: 'pprod-1', name: 'Amoxicillin 500mg',  slug: 'amoxicillin',  description: 'Antibiotic capsules (10 strip)', sku: 'PHA-001', barcode: 'B00001', price: 8.99,  costPrice: 4.00,  image: null, isActive: true, isWeighted: false, unit: 'strip', taxRate: 0, categoryId: 'pcat-1', branchId: null, businessType: 'PHARMACY', duration: null, modifiers: null, variants: null },
  { id: 'pprod-2', name: 'Ibuprofen 200mg',    slug: 'ibuprofen',    description: 'Pain relief tablets (20 pack)', sku: 'PHA-002', barcode: 'B00002', price: 5.99,  costPrice: 2.00,  image: null, isActive: true, isWeighted: false, unit: 'pack', taxRate: 0, categoryId: 'pcat-2', branchId: null, businessType: 'PHARMACY', duration: null, modifiers: null, variants: null },
  { id: 'pprod-3', name: 'Cough Syrup',        slug: 'cough-syrup',  description: 'Honey & lemon cough syrup', sku: 'PHA-003', barcode: 'B00003', price: 7.49,  costPrice: 3.00,  image: null, isActive: true, isWeighted: false, unit: 'bottle', taxRate: 0, categoryId: 'pcat-2', branchId: null, businessType: 'PHARMACY', duration: null, modifiers: null, variants: null },
  { id: 'pprod-4', name: 'Vitamin D3 1000IU',  slug: 'vitamin-d3',   description: 'Vitamin D supplement (60 capsules)', sku: 'PHA-004', barcode: 'B00004', price: 12.99, costPrice: 5.00,  image: null, isActive: true, isWeighted: false, unit: 'bottle', taxRate: 0, categoryId: 'pcat-3', branchId: null, businessType: 'PHARMACY', duration: null, modifiers: null, variants: null },
  { id: 'pprod-5', name: 'Multivitamin',       slug: 'multivitamin', description: 'Daily multivitamin tablets (30)', sku: 'PHA-005', barcode: 'B00005', price: 14.99, costPrice: 6.00,  image: null, isActive: true, isWeighted: false, unit: 'bottle', taxRate: 0, categoryId: 'pcat-3', branchId: null, businessType: 'PHARMACY', duration: null, modifiers: null, variants: null },
  { id: 'pprod-6', name: 'Sunscreen SPF 50',   slug: 'sunscreen',    description: 'High protection sunscreen', sku: 'PHA-006', barcode: 'B00006', price: 11.99, costPrice: 5.00,  image: null, isActive: true, isWeighted: false, unit: 'tube', taxRate: 8.5, categoryId: 'pcat-4', branchId: null, businessType: 'PHARMACY', duration: null, modifiers: null, variants: null },
  { id: 'pprod-7', name: 'Digital Thermometer', slug: 'thermometer',  description: 'Digital fever thermometer', sku: 'PHA-007', barcode: 'B00007', price: 9.99,  costPrice: 4.00,  image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'pcat-5', branchId: null, businessType: 'PHARMACY', duration: null, modifiers: null, variants: null },
  { id: 'pprod-8', name: 'Blood Pressure Monitor', slug: 'bp-monitor', description: 'Digital BP monitor', sku: 'PHA-008', barcode: 'B00008', price: 39.99, costPrice: 18.00, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'pcat-5', branchId: null, businessType: 'PHARMACY', duration: null, modifiers: null, variants: null },
];`;

content = content.replace(oldProductsBlock, newProductsBlock);

// ── Now update the product/category endpoints to filter by current businessType ──
// Replace the products GET handler
const oldProdGet = `    if (path === '/api/products' && method === 'GET') {
      let result = products.filter(p => p.isActive);`;
const newProdGet = `    if (path === '/api/products' && method === 'GET') {
      const currentBT = settings.businessType?.value || 'RESTAURANT';
      let result = products.filter(p => p.isActive && p.businessType === currentBT);`;
content = content.replace(oldProdGet, newProdGet);

// Replace the categories GET handler
const oldCatGet = `    if (path === '/api/categories' && method === 'GET') {
      const result = categories.filter(c => c.isActive).map(c => ({
        ...c, _count: { products: products.filter(p => p.categoryId === c.id && p.isActive).length }
      }));`;
const newCatGet = `    if (path === '/api/categories' && method === 'GET') {
      const currentBT = settings.businessType?.value || 'RESTAURANT';
      const result = categories.filter(c => c.isActive && c.businessType === currentBT).map(c => ({
        ...c, _count: { products: products.filter(p => p.categoryId === c.id && p.isActive).length }
      }));`;
content = content.replace(oldCatGet, newCatGet);

// Update the inventory store to use only active business type products
const oldInventory = `const inventory: any[] = products.map((p, i) => ({`;
const newInventory = `const inventory: any[] = products.filter(p => p.businessType === 'RESTAURANT').map((p, i) => ({`;
content = content.replace(oldInventory, newInventory);

// Update the enrichProduct function to search across all products (not just current business type)
// (enrichProduct already works with the full products array, so it's fine)

fs.writeFileSync(filePath, content);
console.log('devFallback updated successfully');
