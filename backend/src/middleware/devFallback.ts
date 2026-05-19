import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Track DB availability to avoid repeated timeouts
let dbChecked = false;
let dbAvailable = true;

// ─── In-Memory Dev Store ────────────────────────────────────────────────
const products: any[] = [
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
  { id: 'sprod-1',  name: "Men's Haircut",         slug: 'mens-haircut',       description: 'Classic men\'s haircut with styling', sku: 'SAL-001', barcode: '700001', price: 25.00, costPrice: 5.00,  image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-1', branchId: null, businessType: 'SALON', duration: 30, modifiers: null, variants: null },
  { id: 'sprod-2',  name: "Women's Haircut",        slug: 'womens-haircut',     description: 'Women\'s haircut with wash and blowdry', sku: 'SAL-002', barcode: '700002', price: 45.00, costPrice: 8.00,  image: null, isActive: true, isWeighted: false, unit: 'service', taxRate: 8.5, categoryId: 'scat-1', branchId: null, businessType: 'SALON', duration: 45, modifiers: null, variants: null },
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
];

const categories: any[] = [
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
];

const customers = [
  { id: 'cust-1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '+1-555-0101', address: '123 Main St', loyaltyPoints: 450, totalSpent: 1250.00, branchId: null, createdAt: '2024-01-15T10:00:00Z' },
  { id: 'cust-2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '+1-555-0102', address: '456 Oak Ave', loyaltyPoints: 820, totalSpent: 2340.50, branchId: null, createdAt: '2024-01-20T10:00:00Z' },
  { id: 'cust-3', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', phone: '+1-555-0103', address: '789 Pine Rd', loyaltyPoints: 200, totalSpent: 680.00, branchId: null, createdAt: '2024-02-01T10:00:00Z' },
  { id: 'cust-4', firstName: 'Sarah', lastName: 'Williams', email: 'sarah@example.com', phone: '+1-555-0104', address: '321 Elm Dr', loyaltyPoints: 1200, totalSpent: 3890.75, branchId: null, createdAt: '2024-02-10T10:00:00Z' },
  { id: 'cust-5', firstName: 'David', lastName: 'Brown', email: 'david@example.com', phone: '+1-555-0105', address: '654 Maple Ln', loyaltyPoints: 350, totalSpent: 920.00, branchId: null, createdAt: '2024-02-15T10:00:00Z' },
  { id: 'cust-6', firstName: 'Emily', lastName: 'Davis', email: 'emily@example.com', phone: '+1-555-0106', address: '987 Cedar Ct', loyaltyPoints: 600, totalSpent: 1675.25, branchId: null, createdAt: '2024-03-01T10:00:00Z' },
  { id: 'cust-7', firstName: 'Alex', lastName: 'Wilson', email: 'alex@example.com', phone: '+1-555-0107', address: '147 Birch St', loyaltyPoints: 180, totalSpent: 540.00, branchId: null, createdAt: '2024-03-10T10:00:00Z' },
  { id: 'cust-8', firstName: 'Lisa', lastName: 'Taylor', email: 'lisa@example.com', phone: '+1-555-0108', address: '258 Walnut Ave', loyaltyPoints: 950, totalSpent: 2800.00, branchId: null, createdAt: '2024-03-15T10:00:00Z' },
];

const tables = [
  { id: 'tbl-1', name: 'Table 1', capacity: 2, status: 'AVAILABLE', floor: 'Ground Floor', branchId: null },
  { id: 'tbl-2', name: 'Table 2', capacity: 4, status: 'OCCUPIED', floor: 'Ground Floor', branchId: null },
  { id: 'tbl-3', name: 'Table 3', capacity: 4, status: 'AVAILABLE', floor: 'Ground Floor', branchId: null },
  { id: 'tbl-4', name: 'Table 4', capacity: 6, status: 'RESERVED', floor: 'Ground Floor', branchId: null },
  { id: 'tbl-5', name: 'Table 5', capacity: 2, status: 'AVAILABLE', floor: 'Ground Floor', branchId: null },
  { id: 'tbl-6', name: 'Table 6', capacity: 8, status: 'CLEANING', floor: 'Ground Floor', branchId: null },
  { id: 'tbl-7', name: 'Table 7', capacity: 4, status: 'AVAILABLE', floor: 'First Floor', branchId: null },
  { id: 'tbl-8', name: 'Table 8', capacity: 6, status: 'OCCUPIED', floor: 'First Floor', branchId: null },
  { id: 'tbl-9', name: 'Table 9', capacity: 2, status: 'AVAILABLE', floor: 'First Floor', branchId: null },
  { id: 'tbl-10', name: 'Table 10', capacity: 4, status: 'AVAILABLE', floor: 'First Floor', branchId: null },
  { id: 'tbl-11', name: 'Table 11', capacity: 8, status: 'RESERVED', floor: 'First Floor', branchId: null },
  { id: 'tbl-12', name: 'Table 12', capacity: 2, status: 'AVAILABLE', floor: 'First Floor', branchId: null },
];

function makeOrders(): any[] {
  const now = Date.now();
  const day = 86400000;
  return [
    { id: 'ord-1', orderNumber: 'ORD-001', status: 'COMPLETED', orderType: 'DINE_IN', subtotal: 23.48, taxAmount: 2.00, discountAmount: 0, totalAmount: 25.48, notes: '', customerId: 'cust-1', userId: 'dev-admin-001', tableId: 'tbl-2', createdAt: new Date(now - day * 0.1).toISOString(),
      items: [{ id: 'oi-1', productId: 'prod-6', quantity: 2, unitPrice: 9.99, totalPrice: 19.98, discount: 0, notes: '' }, { id: 'oi-2', productId: 'prod-1', quantity: 1, unitPrice: 3.50, totalPrice: 3.50, discount: 0, notes: '' }],
      payments: [{ id: 'pay-1', orderId: 'ord-1', method: 'CARD', amount: 25.48, status: 'COMPLETED', reference: null }] },
    { id: 'ord-2', orderNumber: 'ORD-002', status: 'CONFIRMED', orderType: 'DINE_IN', subtotal: 18.48, taxAmount: 1.57, discountAmount: 0, totalAmount: 20.05, notes: 'No onions', customerId: 'cust-2', userId: 'dev-admin-001', tableId: 'tbl-8', createdAt: new Date(now - day * 0.05).toISOString(),
      items: [{ id: 'oi-3', productId: 'prod-7', quantity: 1, unitPrice: 8.49, totalPrice: 8.49, discount: 0, notes: '' }, { id: 'oi-4', productId: 'prod-3', quantity: 2, unitPrice: 4.99, totalPrice: 9.98, discount: 0, notes: '' }],
      payments: [{ id: 'pay-2', orderId: 'ord-2', method: 'CASH', amount: 20.05, status: 'COMPLETED', reference: null }] },
    { id: 'ord-3', orderNumber: 'ORD-003', status: 'PREPARING', orderType: 'TAKEAWAY', subtotal: 14.99, taxAmount: 1.27, discountAmount: 0, totalAmount: 16.26, notes: '', customerId: 'cust-3', userId: 'dev-admin-001', tableId: null, createdAt: new Date(now - day * 0.04).toISOString(),
      items: [{ id: 'oi-5', productId: 'prod-17', quantity: 1, unitPrice: 14.99, totalPrice: 14.99, discount: 0, notes: 'Extra ketchup' }],
      payments: [{ id: 'pay-3', orderId: 'ord-3', method: 'UPI', amount: 16.26, status: 'COMPLETED', reference: 'UPI-12345' }] },
    { id: 'ord-4', orderNumber: 'ORD-004', status: 'READY', orderType: 'DINE_IN', subtotal: 26.47, taxAmount: 2.25, discountAmount: 2.00, totalAmount: 26.72, notes: '', customerId: 'cust-4', userId: 'dev-admin-001', tableId: 'tbl-2', createdAt: new Date(now - day * 0.03).toISOString(),
      items: [{ id: 'oi-6', productId: 'prod-9', quantity: 1, unitPrice: 12.99, totalPrice: 12.99, discount: 0, notes: '' }, { id: 'oi-7', productId: 'prod-11', quantity: 1, unitPrice: 6.99, totalPrice: 6.99, discount: 0, notes: '' }, { id: 'oi-8', productId: 'prod-14', quantity: 1, unitPrice: 3.99, totalPrice: 3.99, discount: 0, notes: '' }, { id: 'oi-9', productId: 'prod-2', quantity: 1, unitPrice: 4.50, totalPrice: 4.50, discount: 2.00, notes: '' }],
      payments: [{ id: 'pay-4', orderId: 'ord-4', method: 'CARD', amount: 26.72, status: 'COMPLETED', reference: null }] },
    { id: 'ord-5', orderNumber: 'ORD-005', status: 'COMPLETED', orderType: 'DELIVERY', subtotal: 29.99, taxAmount: 2.55, discountAmount: 0, totalAmount: 32.54, notes: 'Ring doorbell', customerId: 'cust-5', userId: 'dev-admin-001', tableId: null, createdAt: new Date(now - day * 1).toISOString(),
      items: [{ id: 'oi-10', productId: 'prod-18', quantity: 1, unitPrice: 29.99, totalPrice: 29.99, discount: 0, notes: '' }],
      payments: [{ id: 'pay-5', orderId: 'ord-5', method: 'CARD', amount: 32.54, status: 'COMPLETED', reference: null }] },
    { id: 'ord-6', orderNumber: 'ORD-006', status: 'COMPLETED', orderType: 'TAKEAWAY', subtotal: 15.48, taxAmount: 1.32, discountAmount: 0, totalAmount: 16.80, notes: '', customerId: 'cust-6', userId: 'dev-admin-001', tableId: null, createdAt: new Date(now - day * 1.5).toISOString(),
      items: [{ id: 'oi-11', productId: 'prod-8', quantity: 1, unitPrice: 7.99, totalPrice: 7.99, discount: 0, notes: '' }, { id: 'oi-12', productId: 'prod-12', quantity: 1, unitPrice: 7.49, totalPrice: 7.49, discount: 0, notes: '' }],
      payments: [{ id: 'pay-6', orderId: 'ord-6', method: 'CASH', amount: 16.80, status: 'COMPLETED', reference: null }] },
    { id: 'ord-7', orderNumber: 'ORD-007', status: 'COMPLETED', orderType: 'DINE_IN', subtotal: 19.48, taxAmount: 1.66, discountAmount: 0, totalAmount: 21.14, notes: '', customerId: 'cust-7', userId: 'dev-admin-001', tableId: 'tbl-3', createdAt: new Date(now - day * 2).toISOString(),
      items: [{ id: 'oi-13', productId: 'prod-19', quantity: 1, unitPrice: 7.99, totalPrice: 7.99, discount: 0, notes: '' }, { id: 'oi-14', productId: 'prod-20', quantity: 1, unitPrice: 10.99, totalPrice: 10.99, discount: 0, notes: '' }, { id: 'oi-15', productId: 'prod-1', quantity: 1, unitPrice: 3.50, totalPrice: 3.50, discount: 0, notes: '' }],
      payments: [] },
    { id: 'ord-8', orderNumber: 'ORD-008', status: 'CANCELLED', orderType: 'ONLINE', subtotal: 5.49, taxAmount: 0.47, discountAmount: 0, totalAmount: 5.96, notes: 'Customer cancelled', customerId: 'cust-8', userId: 'dev-admin-001', tableId: null, createdAt: new Date(now - day * 2.5).toISOString(),
      items: [{ id: 'oi-16', productId: 'prod-23', quantity: 1, unitPrice: 5.49, totalPrice: 5.49, discount: 0, notes: '' }],
      payments: [] },
    { id: 'ord-9', orderNumber: 'ORD-009', status: 'CONFIRMED', orderType: 'DINE_IN', subtotal: 22.47, taxAmount: 1.91, discountAmount: 0, totalAmount: 24.38, notes: 'Birthday celebration', customerId: 'cust-1', userId: 'dev-admin-001', tableId: 'tbl-5', createdAt: new Date(now - day * 0.02).toISOString(),
      items: [{ id: 'oi-17', productId: 'prod-9', quantity: 1, unitPrice: 12.99, totalPrice: 12.99, discount: 0, notes: '' }, { id: 'oi-18', productId: 'prod-21', quantity: 1, unitPrice: 9.49, totalPrice: 9.49, discount: 0, notes: '' }],
      payments: [{ id: 'pay-9', orderId: 'ord-9', method: 'CASH', amount: 24.38, status: 'COMPLETED', reference: null }] },
    { id: 'ord-10', orderNumber: 'ORD-010', status: 'COMPLETED', orderType: 'DINE_IN', subtotal: 33.97, taxAmount: 2.89, discountAmount: 5.00, totalAmount: 31.86, notes: '', customerId: 'cust-2', userId: 'dev-admin-001', tableId: 'tbl-7', createdAt: new Date(now - day * 3).toISOString(),
      items: [{ id: 'oi-19', productId: 'prod-6', quantity: 1, unitPrice: 9.99, totalPrice: 9.99, discount: 0, notes: '' }, { id: 'oi-20', productId: 'prod-10', quantity: 1, unitPrice: 8.99, totalPrice: 8.99, discount: 0, notes: '' }, { id: 'oi-21', productId: 'prod-17', quantity: 1, unitPrice: 14.99, totalPrice: 14.99, discount: 0, notes: '' }],
      payments: [{ id: 'pay-10', orderId: 'ord-10', method: 'CARD', amount: 31.86, status: 'COMPLETED', reference: null }] },
    { id: 'ord-11', orderNumber: 'ORD-011', status: 'COMPLETED', orderType: 'TAKEAWAY', subtotal: 11.98, taxAmount: 1.02, discountAmount: 0, totalAmount: 13.00, notes: '', customerId: 'cust-3', userId: 'dev-admin-001', tableId: null, createdAt: new Date(now - day * 0.5).toISOString(),
      items: [{ id: 'oi-22', productId: 'prod-5', quantity: 2, unitPrice: 5.99, totalPrice: 11.98, discount: 0, notes: '' }],
      payments: [{ id: 'pay-11', orderId: 'ord-11', method: 'UPI', amount: 13.00, status: 'COMPLETED', reference: 'UPI-67890' }] },
    { id: 'ord-12', orderNumber: 'ORD-012', status: 'COMPLETED', orderType: 'DINE_IN', subtotal: 42.46, taxAmount: 3.61, discountAmount: 0, totalAmount: 46.07, notes: '', customerId: 'cust-4', userId: 'dev-admin-001', tableId: 'tbl-1', createdAt: new Date(now - day * 4).toISOString(),
      items: [{ id: 'oi-23', productId: 'prod-9', quantity: 2, unitPrice: 12.99, totalPrice: 25.98, discount: 0, notes: '' }, { id: 'oi-24', productId: 'prod-16', quantity: 1, unitPrice: 6.99, totalPrice: 6.99, discount: 0, notes: '' }, { id: 'oi-25', productId: 'prod-21', quantity: 1, unitPrice: 9.49, totalPrice: 9.49, discount: 0, notes: '' }],
      payments: [{ id: 'pay-12', orderId: 'ord-12', method: 'CASH', amount: 46.07, status: 'COMPLETED', reference: null }] },
  ];
}

let orders = makeOrders();

const settings: Record<string, { key: string; value: string; group: string }> = {
  businessName: { key: 'businessName', value: 'MyPOS Restaurant', group: 'business' },
  businessType: { key: 'businessType', value: 'RESTAURANT', group: 'business' },
  currency: { key: 'currency', value: 'USD', group: 'business' },
  taxRate: { key: 'taxRate', value: '8.5', group: 'business' },
  taxInclusive: { key: 'taxInclusive', value: 'false', group: 'business' },
  receiptPaperSize: { key: 'receiptPaperSize', value: '80mm', group: 'printing' },
  printerType: { key: 'printerType', value: 'thermal', group: 'printing' },
  receiptHeader: { key: 'receiptHeader', value: 'Thank you for dining with us!', group: 'printing' },
  receiptFooter: { key: 'receiptFooter', value: 'Visit us again soon!', group: 'printing' },
};

let orderCounter = 13;

// ─── Employees Store ──────────────────────────────────────────────────────
const employees: any[] = [
  { id: 'emp-1', userId: 'dev-admin-001', firstName: 'Admin', lastName: 'User', role: 'ADMIN', email: 'admin@mypos.com', phone: '+1-555-0001', isActive: true, clockedIn: true, lastClockIn: new Date(Date.now() - 3600000 * 3).toISOString(), lastClockOut: null, totalHoursToday: 3, totalSalesToday: 125.48, ordersToday: 5 },
  { id: 'emp-2', userId: 'dev-emp-002', firstName: 'Maria', lastName: 'Garcia', role: 'CASHIER', email: 'maria@mypos.com', phone: '+1-555-0002', isActive: true, clockedIn: true, lastClockIn: new Date(Date.now() - 3600000 * 5).toISOString(), lastClockOut: null, totalHoursToday: 5, totalSalesToday: 287.30, ordersToday: 12 },
  { id: 'emp-3', userId: 'dev-emp-003', firstName: 'James', lastName: 'Wilson', role: 'WAITER', email: 'james@mypos.com', phone: '+1-555-0003', isActive: true, clockedIn: false, lastClockIn: new Date(Date.now() - 86400000).toISOString(), lastClockOut: new Date(Date.now() - 86400000 + 28800000).toISOString(), totalHoursToday: 0, totalSalesToday: 0, ordersToday: 0 },
  { id: 'emp-4', userId: 'dev-emp-004', firstName: 'Sarah', lastName: 'Chen', role: 'CASHIER', email: 'sarah@mypos.com', phone: '+1-555-0004', isActive: true, clockedIn: true, lastClockIn: new Date(Date.now() - 3600000 * 2).toISOString(), lastClockOut: null, totalHoursToday: 2, totalSalesToday: 156.75, ordersToday: 8 },
  { id: 'emp-5', userId: 'dev-emp-005', firstName: 'Robert', lastName: 'Kim', role: 'MANAGER', email: 'robert@mypos.com', phone: '+1-555-0005', isActive: true, clockedIn: false, lastClockIn: null, lastClockOut: null, totalHoursToday: 0, totalSalesToday: 0, ordersToday: 0 },
];

// ─── Inventory Store (stable, not random) ───────────────────────────────
const inventory: any[] = products.filter(p => p.businessType === 'RESTAURANT').map((p, i) => ({
  id: `inv-${p.id}`, productId: p.id, quantity: [50, 35, 28, 8, 42, 15, 22, 3, 60, 45, 12, 38, 55, 20, 30, 18, 40, 25, 10, 33, 48, 5, 14, 27][i] || 30,
  minStock: 15, batchNumber: `B${String(2024000 + i).slice(-6)}`,
  expiryDate: i < 6 ? new Date(Date.now() + (i < 2 ? 3 : 30) * 86400000).toISOString() : null,
  lastRestocked: new Date(Date.now() - i * 86400000 * 2).toISOString(),
  product: { name: p.name, sku: p.sku, barcode: p.barcode },
}));

// ─── Loyalty History Store ────────────────────────────────────────────────
const loyaltyHistory: any[] = [
  { id: 'lh-1', customerId: 'cust-1', orderId: 'ord-1', points: 25, type: 'EARNED', description: 'Order ORD-001', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'lh-2', customerId: 'cust-2', orderId: 'ord-2', points: 20, type: 'EARNED', description: 'Order ORD-002', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'lh-3', customerId: 'cust-4', orderId: null, points: 100, type: 'REDEEMED', description: 'Redeemed for $1.00', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'lh-4', customerId: 'cust-4', orderId: 'ord-4', points: 27, type: 'EARNED', description: 'Order ORD-004', createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString() },
];

// ─── Audit Log Store ──────────────────────────────────────────────────────
const auditLog: any[] = [
  { id: 'al-1', action: 'ORDER_CREATED', userId: 'dev-admin-001', userName: 'Admin User', details: 'Created order ORD-001', timestamp: new Date(Date.now() - 86400000).toISOString(), entityType: 'ORDER', entityId: 'ord-1' },
  { id: 'al-2', action: 'LOGIN', userId: 'dev-admin-001', userName: 'Admin User', details: 'User logged in', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), entityType: 'USER', entityId: 'dev-admin-001' },
  { id: 'al-3', action: 'PRODUCT_UPDATED', userId: 'dev-admin-001', userName: 'Admin User', details: 'Updated Espresso price', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), entityType: 'PRODUCT', entityId: 'prod-1' },
];

// ─── Helpers ────────────────────────────────────────────────────────────
function uid() { return `dev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

function paginate<T>(arr: T[], page = 1, limit = 50) {
  const start = (page - 1) * limit;
  return { data: arr.slice(start, start + limit), total: arr.length, page, limit };
}

function enrichProduct(p: any) {
  const cat = categories.find(c => c.id === p.categoryId);
  return { ...p, category: cat || null };
}

function enrichOrder(o: any) {
  const customer = customers.find(c => c.id === o.customerId);
  const table = tables.find(t => t.id === o.tableId);
  const items = (o.items || []).map((item: any) => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product: product || null };
  });
  return { ...o, customer: customer || null, table: table || null, items };
}

// ─── Proactive Dev Router (skips routes entirely when DB is unavailable) ──
export function devRouter(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV !== 'development') return next();
  if (!req.originalUrl.startsWith('/api/')) return next();
  // If DB hasn't been checked yet or is available, let routes handle it
  if (!dbChecked || dbAvailable) return next();
  // DB is known to be unavailable — handle the request directly
  return handleDevRequest(req, res, next);
}

// Mark DB as unavailable (called from error middleware)
function markDbUnavailable() {
  dbChecked = true;
  dbAvailable = false;
}

// ─── Dev Fallback Error Middleware ────────────────────────────────────────────
export function devFallback(err: any, req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV !== 'development') return next(err);

  // Only handle DB connection errors
  const msg = err?.message || '';
  const code = err?.code || '';
  const isDbError = code === 'P1001' || code === 'P1002' || code === 'P1003' ||
    code === 'P2021' || code === 'P2002' || code === 'P2025' ||
    msg.includes('connect') || msg.includes('ECONNREFUSED') ||
    msg.includes("Can't reach database") || msg.includes('prepared statement') ||
    err?.name === 'PrismaClientInitializationError' || err?.name === 'PrismaClientKnownRequestError' ||
    err?.name === 'PrismaClientUnknownRequestError';

  if (!isDbError) return next(err);

  // Mark DB as unavailable so devRouter handles future requests instantly
  markDbUnavailable();

  return handleDevRequest(req, res, () => next(err));
}

function handleDevRequest(req: Request, res: Response, next: NextFunction) {
  const path = req.originalUrl.replace(/\?.*/, '');
  const method = req.method;
  const query = req.query as any;
  const body = req.body;

  try {
    // ── Products ──
    if (path === '/api/products' && method === 'GET') {
      let result = products.filter(p => p.isActive);
      if (query.search) {
        const s = query.search.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(s) || p.sku?.toLowerCase().includes(s) || p.barcode?.includes(s));
      }
      if (query.categoryId) result = result.filter(p => p.categoryId === query.categoryId);
      return res.json({ success: true, data: result.map(enrichProduct) });
    }
    if (path === '/api/products' && method === 'POST') {
      const newProd = { id: uid(), ...body, isActive: true, isWeighted: false, taxRate: body.taxRate || 8.5, branchId: null, modifiers: null, variants: null };
      products.push(newProd);
      return res.status(201).json({ success: true, data: enrichProduct(newProd) });
    }
    const prodMatch = path.match(/^\/api\/products\/barcode\/(.+)$/);
    if (prodMatch) {
      const p = products.find(pr => pr.barcode === prodMatch[1]);
      if (p) return res.json({ success: true, data: enrichProduct(p) });
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const prodIdMatch = path.match(/^\/api\/products\/([^/]+)$/);
    if (prodIdMatch && method === 'GET') {
      const p = products.find(pr => pr.id === prodIdMatch[1]);
      if (p) return res.json({ success: true, data: enrichProduct(p) });
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (prodIdMatch && method === 'PUT') {
      const idx = products.findIndex(p => p.id === prodIdMatch[1]);
      if (idx >= 0) { products[idx] = { ...products[idx], ...body }; return res.json({ success: true, data: enrichProduct(products[idx]) }); }
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (prodIdMatch && method === 'DELETE') {
      const idx = products.findIndex(p => p.id === prodIdMatch[1]);
      if (idx >= 0) { products.splice(idx, 1); return res.json({ success: true, message: 'Product deleted' }); }
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // ── Categories ──
    if (path === '/api/categories' && method === 'GET') {
      const result = categories.filter(c => c.isActive).map(c => ({
        ...c, _count: { products: products.filter(p => p.categoryId === c.id && p.isActive).length }
      }));
      return res.json({ success: true, data: result });
    }
    if (path === '/api/categories' && method === 'POST') {
      const cat = { id: uid(), ...body, isActive: true, sortOrder: categories.length + 1, branchId: null };
      categories.push(cat);
      return res.status(201).json({ success: true, data: cat });
    }
    const catIdMatch = path.match(/^\/api\/categories\/([^/]+)$/);
    if (catIdMatch && method === 'GET') {
      const c = categories.find(cat => cat.id === catIdMatch[1]);
      if (c) return res.json({ success: true, data: { ...c, products: products.filter(p => p.categoryId === c.id) } });
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    if (catIdMatch && method === 'PUT') {
      const idx = categories.findIndex(c => c.id === catIdMatch[1]);
      if (idx >= 0) { categories[idx] = { ...categories[idx], ...body }; return res.json({ success: true, data: categories[idx] }); }
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    if (catIdMatch && method === 'DELETE') {
      const idx = categories.findIndex(c => c.id === catIdMatch[1]);
      if (idx >= 0) { categories.splice(idx, 1); return res.json({ success: true, message: 'Category deleted' }); }
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // ── Orders ──
    if (path === '/api/orders/kitchen/queue' && method === 'GET') {
      const queue = orders.filter(o => ['CONFIRMED', 'PREPARING'].includes(o.status)).map(enrichOrder);
      return res.json({ success: true, data: queue });
    }
    if (path === '/api/orders' && method === 'GET') {
      let result = [...orders];
      if (query.status) result = result.filter(o => o.status === query.status);
      if (query.orderType) result = result.filter(o => o.orderType === query.orderType);
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return res.json({ success: true, data: result.map(enrichOrder) });
    }
    if (path === '/api/orders' && method === 'POST') {
      const items = (body.items || []).map((item: any) => {
        const product = products.find(p => p.id === item.productId);
        const totalPrice = (item.unitPrice || product?.price || 0) * item.quantity - (item.discount || 0);
        return { id: uid(), productId: item.productId, quantity: item.quantity, unitPrice: item.unitPrice || product?.price || 0, totalPrice, discount: item.discount || 0, notes: item.notes || '', modifiers: item.modifiers || null };
      });
      const subtotal = items.reduce((s: number, i: any) => s + i.totalPrice, 0);
      const taxAmount = +(subtotal * 0.085).toFixed(2);
      const discountAmount = body.discountAmount || 0;
      const totalAmount = +(subtotal + taxAmount - discountAmount).toFixed(2);
      const order = {
        id: uid(), orderNumber: `ORD-${String(orderCounter++).padStart(3, '0')}`, status: 'CONFIRMED',
        orderType: body.orderType || 'DINE_IN', subtotal, taxAmount, discountAmount, totalAmount,
        notes: body.notes || '', customerId: body.customerId || null, userId: 'dev-admin-001',
        tableId: body.tableId || null, createdAt: new Date().toISOString(), items,
        payments: (body.payments || []).map((p: any) => ({ id: uid(), orderId: '', method: p.method, amount: p.amount, status: 'COMPLETED', reference: p.reference || null })),
      };
      order.payments.forEach((p: any) => { p.orderId = order.id; });
      orders.unshift(order);
      if (body.tableId) {
        const tbl = tables.find(t => t.id === body.tableId);
        if (tbl) tbl.status = 'OCCUPIED';
      }
      return res.status(201).json({ success: true, data: enrichOrder(order) });
    }
    const orderStatusMatch = path.match(/^\/api\/orders\/([^/]+)\/status$/);
    if (orderStatusMatch && method === 'PUT') {
      const o = orders.find(ord => ord.id === orderStatusMatch[1]);
      if (o) {
        o.status = body.status;
        if (body.status === 'COMPLETED' || body.status === 'CANCELLED') {
          if (o.tableId) { const tbl = tables.find(t => t.id === o.tableId); if (tbl) tbl.status = 'AVAILABLE'; }
        }
        return res.json({ success: true, data: enrichOrder(o) });
      }
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    const orderIdMatch = path.match(/^\/api\/orders\/([^/]+)$/);
    if (orderIdMatch && method === 'GET') {
      const o = orders.find(ord => ord.id === orderIdMatch[1]);
      if (o) return res.json({ success: true, data: enrichOrder(o) });
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // ── Customers ──
    if (path === '/api/customers' && method === 'GET') {
      let result = [...customers];
      if (query.search) {
        const s = query.search.toLowerCase();
        result = result.filter(c => c.firstName.toLowerCase().includes(s) || c.lastName.toLowerCase().includes(s) || c.email?.toLowerCase().includes(s) || c.phone?.includes(s));
      }
      return res.json({ success: true, data: result });
    }
    if (path === '/api/customers' && method === 'POST') {
      const cust = { id: uid(), loyaltyPoints: 0, totalSpent: 0, branchId: null, createdAt: new Date().toISOString(), ...body };
      customers.push(cust);
      return res.status(201).json({ success: true, data: cust });
    }
    const custIdMatch = path.match(/^\/api\/customers\/([^/]+)$/);
    if (custIdMatch && method === 'GET') {
      const c = customers.find(cust => cust.id === custIdMatch[1]);
      if (c) {
        const custOrders = orders.filter(o => o.customerId === c.id).slice(0, 10).map(enrichOrder);
        return res.json({ success: true, data: { ...c, orders: custOrders } });
      }
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    if (custIdMatch && method === 'PUT') {
      const idx = customers.findIndex(c => c.id === custIdMatch[1]);
      if (idx >= 0) { customers[idx] = { ...customers[idx], ...body }; return res.json({ success: true, data: customers[idx] }); }
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    if (custIdMatch && method === 'DELETE') {
      const idx = customers.findIndex(c => c.id === custIdMatch[1]);
      if (idx >= 0) { customers.splice(idx, 1); return res.json({ success: true, message: 'Customer deleted' }); }
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // ── Tables ──
    if (path === '/api/tables' && method === 'GET') {
      const result = tables.map(t => {
        const activeOrders = orders.filter(o => o.tableId === t.id && ['PENDING', 'CONFIRMED', 'PREPARING', 'SERVED'].includes(o.status)).map(enrichOrder);
        return { ...t, orders: activeOrders };
      });
      return res.json({ success: true, data: result });
    }
    if (path === '/api/tables' && method === 'POST') {
      const tbl = { id: uid(), status: 'AVAILABLE', branchId: null, ...body };
      tables.push(tbl);
      return res.status(201).json({ success: true, data: tbl });
    }
    const tblStatusMatch = path.match(/^\/api\/tables\/([^/]+)\/status$/);
    if (tblStatusMatch && method === 'PUT') {
      const t = tables.find(tbl => tbl.id === tblStatusMatch[1]);
      if (t) { t.status = body.status; return res.json({ success: true, data: t }); }
      return res.status(404).json({ success: false, message: 'Table not found' });
    }
    const tblIdMatch = path.match(/^\/api\/tables\/([^/]+)$/);
    if (tblIdMatch && method === 'PUT') {
      const idx = tables.findIndex(t => t.id === tblIdMatch[1]);
      if (idx >= 0) { tables[idx] = { ...tables[idx], ...body }; return res.json({ success: true, data: tables[idx] }); }
      return res.status(404).json({ success: false, message: 'Table not found' });
    }

    // ── Inventory ──
    if (path === '/api/inventory/alerts' && method === 'GET') {
      const alerts = inventory.filter((i: any) => i.quantity <= i.minStock);
      return res.json({ success: true, data: alerts });
    }
    if (path === '/api/inventory' && method === 'GET') {
      return res.json({ success: true, data: inventory });
    }
    const invIdMatch = path.match(/^\/api\/inventory\/([^/]+)$/);
    if (invIdMatch && method === 'PUT') {
      const item = inventory.find((i: any) => i.id === invIdMatch[1]);
      if (item) {
        if (body.quantity !== undefined) item.quantity = body.quantity;
        if (body.minStock !== undefined) item.minStock = body.minStock;
        return res.json({ success: true, data: item });
      }
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    // ── Employees ──
    if (path === '/api/employees' && method === 'GET') {
      return res.json({ success: true, data: employees });
    }
    const empClockInMatch = path.match(/^\/api\/employees\/([^/]+)\/clock-in$/);
    if (empClockInMatch && method === 'POST') {
      const emp = employees.find((e: any) => e.id === empClockInMatch[1]);
      if (emp) { emp.clockedIn = true; emp.lastClockIn = new Date().toISOString(); return res.json({ success: true, data: emp }); }
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    const empClockOutMatch = path.match(/^\/api\/employees\/([^/]+)\/clock-out$/);
    if (empClockOutMatch && method === 'POST') {
      const emp = employees.find((e: any) => e.id === empClockOutMatch[1]);
      if (emp) { emp.clockedIn = false; emp.lastClockOut = new Date().toISOString(); return res.json({ success: true, data: emp }); }
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // ── Loyalty / Redeem ──
    const redeemMatch = path.match(/^\/api\/customers\/([^/]+)\/redeem$/);
    if (redeemMatch && method === 'POST') {
      const cust = customers.find(c => c.id === redeemMatch[1]);
      if (!cust) return res.status(404).json({ success: false, message: 'Customer not found' });
      const pts = body.points || 0;
      if (pts > cust.loyaltyPoints) return res.status(400).json({ success: false, message: 'Insufficient points' });
      cust.loyaltyPoints -= pts;
      loyaltyHistory.push({ id: uid(), customerId: cust.id, orderId: null, points: pts, type: 'REDEEMED', description: `Redeemed ${pts} points for ${(pts * 0.01).toFixed(2)} credit`, createdAt: new Date().toISOString() });
      return res.json({ success: true, data: cust });
    }
    const loyaltyMatch = path.match(/^\/api\/customers\/([^/]+)\/loyalty$/);
    if (loyaltyMatch && method === 'GET') {
      const history = loyaltyHistory.filter(l => l.customerId === loyaltyMatch[1]);
      return res.json({ success: true, data: history });
    }

    // ── Void Order ──
    const voidMatch = path.match(/^\/api\/orders\/([^/]+)\/void$/);
    if (voidMatch && method === 'PUT') {
      const o = orders.find(ord => ord.id === voidMatch[1]);
      if (o) {
        o.status = 'CANCELLED'; o.voidReason = body.reason || 'Voided'; o.voidedBy = 'dev-admin-001';
        auditLog.push({ id: uid(), action: 'ORDER_VOIDED', userId: 'dev-admin-001', userName: 'Admin User', details: `Voided order ${o.orderNumber}: ${o.voidReason}`, timestamp: new Date().toISOString(), entityType: 'ORDER', entityId: o.id });
        return res.json({ success: true, data: enrichOrder(o) });
      }
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // ── Staff Performance ──
    if (path === '/api/reports/staff-performance' && method === 'GET') {
      const perf = employees.map(e => ({
        id: e.id, name: `${e.firstName} ${e.lastName}`, orders: e.ordersToday || 0, revenue: e.totalSalesToday || 0,
        avgOrder: e.ordersToday ? +((e.totalSalesToday || 0) / e.ordersToday).toFixed(2) : 0,
        hours: e.totalHoursToday || 0, revenuePerHour: e.totalHoursToday ? +((e.totalSalesToday || 0) / e.totalHoursToday).toFixed(2) : 0,
      }));
      return res.json({ success: true, data: perf });
    }

    // ── Margins ──
    if (path === '/api/reports/margins' && method === 'GET') {
      const productSales: Record<string, number> = {};
      orders.filter(o => o.status === 'COMPLETED').forEach(o => {
        o.items.forEach((item: any) => { productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity; });
      });
      const marginData = Object.entries(productSales).map(([productId, quantity]) => {
        const p = products.find(pr => pr.id === productId);
        if (!p) return null;
        const revenue = +(p.price * quantity).toFixed(2);
        const cost = +((p.costPrice || 0) * quantity).toFixed(2);
        const profit = +(revenue - cost).toFixed(2);
        const margin = revenue > 0 ? +((profit / revenue) * 100).toFixed(1) : 0;
        return { productId, name: p.name, quantity, revenue, cost, profit, margin };
      }).filter(Boolean);
      return res.json({ success: true, data: marginData });
    }

    // ── Audit Log ──
    if (path === '/api/audit-log' && method === 'GET') {
      const limit = parseInt(query.limit) || 50;
      return res.json({ success: true, data: auditLog.slice(0, limit) });
    }

    // ── Reports ──
    if (path === '/api/reports/sales' && method === 'GET') {
      const completed = orders.filter(o => o.status === 'COMPLETED');
      const totalRevenue = completed.reduce((s, o) => s + o.totalAmount, 0);
      const totalTax = completed.reduce((s, o) => s + o.taxAmount, 0);
      const totalDiscount = completed.reduce((s, o) => s + o.discountAmount, 0);
      return res.json({ success: true, data: { totalRevenue: +totalRevenue.toFixed(2), totalTax: +totalTax.toFixed(2), totalDiscount: +totalDiscount.toFixed(2), orderCount: completed.length, averageOrderValue: completed.length ? +(totalRevenue / completed.length).toFixed(2) : 0 } });
    }
    if (path === '/api/reports/daily' && method === 'GET') {
      const today = new Date().toDateString();
      const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
      const totalRevenue = todayOrders.reduce((s, o) => s + o.totalAmount, 0);
      const totalTax = todayOrders.reduce((s, o) => s + o.taxAmount, 0);
      return res.json({ success: true, data: { totalRevenue: +totalRevenue.toFixed(2), totalTax: +totalTax.toFixed(2), totalDiscount: 0, orderCount: todayOrders.length, averageOrderValue: todayOrders.length ? +(totalRevenue / todayOrders.length).toFixed(2) : 0 } });
    }
    if (path === '/api/reports/top-products' && method === 'GET') {
      const productSales: Record<string, number> = {};
      orders.filter(o => o.status === 'COMPLETED').forEach(o => {
        o.items.forEach((item: any) => { productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity; });
      });
      const top = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1]).slice(0, 10)
        .map(([productId, totalQuantity]) => {
          const p = products.find(pr => pr.id === productId);
          return { productId, totalQuantity, product: p ? { name: p.name, price: p.price } : null };
        });
      return res.json({ success: true, data: top });
    }

    // ── Settings ──
    if (path === '/api/settings' && method === 'GET') {
      return res.json({ success: true, data: Object.values(settings) });
    }
    const settingKeyMatch = path.match(/^\/api\/settings\/([^/]+)$/);
    if (settingKeyMatch && method === 'GET') {
      const s = settings[settingKeyMatch[1]];
      if (s) return res.json({ success: true, data: s });
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    if (settingKeyMatch && method === 'PUT') {
      settings[settingKeyMatch[1]] = { key: settingKeyMatch[1], value: body.value, group: body.group || 'general' };
      return res.json({ success: true, data: settings[settingKeyMatch[1]] });
    }

    // ── Auth me ──
    if (path === '/api/auth/me' && method === 'GET') {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key-change-me') as any;
          return res.json({ success: true, data: { id: decoded.userId, email: decoded.email, firstName: 'Admin', lastName: 'User', role: decoded.role, branchId: null } });
        } catch {}
      }
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    next();
  } catch (fallbackErr) {
    next();
  }
}
