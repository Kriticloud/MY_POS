import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Track DB availability to avoid repeated timeouts
let dbChecked = false;
let dbAvailable = true;

// ─── In-Memory Dev Store ────────────────────────────────────────────────
const categories = [
  { id: 'cat-1', name: 'Beverages', slug: 'beverages', icon: '☕', color: '#8B5CF6', sortOrder: 1, isActive: true, branchId: null },
  { id: 'cat-2', name: 'Food', slug: 'food', icon: '🍔', color: '#EF4444', sortOrder: 2, isActive: true, branchId: null },
  { id: 'cat-3', name: 'Desserts', slug: 'desserts', icon: '🍰', color: '#F59E0B', sortOrder: 3, isActive: true, branchId: null },
  { id: 'cat-4', name: 'Snacks', slug: 'snacks', icon: '🍟', color: '#22C55E', sortOrder: 4, isActive: true, branchId: null },
  { id: 'cat-5', name: 'Combos', slug: 'combos', icon: '🎁', color: '#3B82F6', sortOrder: 5, isActive: true, branchId: null },
  { id: 'cat-6', name: 'Breakfast', slug: 'breakfast', icon: '🥞', color: '#14B8A6', sortOrder: 6, isActive: true, branchId: null },
];

const products = [
  { id: 'prod-1', name: 'Espresso', slug: 'espresso', description: 'Rich and bold espresso shot', sku: 'BEV-001', barcode: '100001', price: 3.50, costPrice: 1.00, image: null, isActive: true, isWeighted: false, unit: 'cup', taxRate: 8.5, categoryId: 'cat-1', branchId: null, modifiers: null, variants: null },
  { id: 'prod-2', name: 'Cappuccino', slug: 'cappuccino', description: 'Classic Italian coffee with steamed milk', sku: 'BEV-002', barcode: '100002', price: 4.50, costPrice: 1.50, image: null, isActive: true, isWeighted: false, unit: 'cup', taxRate: 8.5, categoryId: 'cat-1', branchId: null, modifiers: null, variants: null },
  { id: 'prod-3', name: 'Latte', slug: 'latte', description: 'Smooth espresso with steamed milk', sku: 'BEV-003', barcode: '100003', price: 4.99, costPrice: 1.50, image: null, isActive: true, isWeighted: false, unit: 'cup', taxRate: 8.5, categoryId: 'cat-1', branchId: null, modifiers: null, variants: null },
  { id: 'prod-4', name: 'Green Tea', slug: 'green-tea', description: 'Organic Japanese green tea', sku: 'BEV-004', barcode: '100004', price: 3.00, costPrice: 0.80, image: null, isActive: true, isWeighted: false, unit: 'cup', taxRate: 8.5, categoryId: 'cat-1', branchId: null, modifiers: null, variants: null },
  { id: 'prod-5', name: 'Mango Smoothie', slug: 'mango-smoothie', description: 'Fresh mango blended with yogurt', sku: 'BEV-005', barcode: '100005', price: 5.99, costPrice: 2.00, image: null, isActive: true, isWeighted: false, unit: 'cup', taxRate: 8.5, categoryId: 'cat-1', branchId: null, modifiers: null, variants: null },
  { id: 'prod-6', name: 'Classic Burger', slug: 'classic-burger', description: 'Beef patty with lettuce, tomato, and cheese', sku: 'FOOD-001', barcode: '200001', price: 9.99, costPrice: 4.00, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'cat-2', branchId: null, modifiers: null, variants: null },
  { id: 'prod-7', name: 'Chicken Sandwich', slug: 'chicken-sandwich', description: 'Grilled chicken breast on ciabatta', sku: 'FOOD-002', barcode: '200002', price: 8.49, costPrice: 3.50, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'cat-2', branchId: null, modifiers: null, variants: null },
  { id: 'prod-8', name: 'Veggie Wrap', slug: 'veggie-wrap', description: 'Fresh vegetables in a whole wheat wrap', sku: 'FOOD-003', barcode: '200003', price: 7.99, costPrice: 3.00, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'cat-2', branchId: null, modifiers: null, variants: null },
  { id: 'prod-9', name: 'Margherita Pizza', slug: 'margherita-pizza', description: 'Classic pizza with mozzarella and basil', sku: 'FOOD-004', barcode: '200004', price: 12.99, costPrice: 4.50, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'cat-2', branchId: null, modifiers: null, variants: null },
  { id: 'prod-10', name: 'Caesar Salad', slug: 'caesar-salad', description: 'Romaine lettuce with Caesar dressing and croutons', sku: 'FOOD-005', barcode: '200005', price: 8.99, costPrice: 3.00, image: null, isActive: true, isWeighted: false, unit: 'piece', taxRate: 8.5, categoryId: 'cat-2', branchId: null, modifiers: null, variants: null },
  { id: 'prod-11', name: 'Chocolate Cake', slug: 'chocolate-cake', description: 'Rich dark chocolate layer cake', sku: 'DES-001', barcode: '300001', price: 6.99, costPrice: 2.50, image: null, isActive: true, isWeighted: false, unit: 'slice', taxRate: 8.5, categoryId: 'cat-3', branchId: null, modifiers: null, variants: null },
  { id: 'prod-12', name: 'Cheesecake', slug: 'cheesecake', description: 'New York style cheesecake', sku: 'DES-002', barcode: '300002', price: 7.49, costPrice: 2.80, image: null, isActive: true, isWeighted: false, unit: 'slice', taxRate: 8.5, categoryId: 'cat-3', branchId: null, modifiers: null, variants: null },
  { id: 'prod-13', name: 'Ice Cream Sundae', slug: 'ice-cream-sundae', description: 'Vanilla ice cream with toppings', sku: 'DES-003', barcode: '300003', price: 5.49, costPrice: 1.80, image: null, isActive: true, isWeighted: false, unit: 'bowl', taxRate: 8.5, categoryId: 'cat-3', branchId: null, modifiers: null, variants: null },
  { id: 'prod-14', name: 'French Fries', slug: 'french-fries', description: 'Crispy golden french fries', sku: 'SNK-001', barcode: '400001', price: 3.99, costPrice: 1.00, image: null, isActive: true, isWeighted: false, unit: 'portion', taxRate: 8.5, categoryId: 'cat-4', branchId: null, modifiers: null, variants: null },
  { id: 'prod-15', name: 'Onion Rings', slug: 'onion-rings', description: 'Beer-battered onion rings', sku: 'SNK-002', barcode: '400002', price: 4.49, costPrice: 1.20, image: null, isActive: true, isWeighted: false, unit: 'portion', taxRate: 8.5, categoryId: 'cat-4', branchId: null, modifiers: null, variants: null },
  { id: 'prod-16', name: 'Nachos Supreme', slug: 'nachos-supreme', description: 'Tortilla chips with cheese and toppings', sku: 'SNK-003', barcode: '400003', price: 6.99, costPrice: 2.00, image: null, isActive: true, isWeighted: false, unit: 'portion', taxRate: 8.5, categoryId: 'cat-4', branchId: null, modifiers: null, variants: null },
  { id: 'prod-17', name: 'Burger Combo', slug: 'burger-combo', description: 'Classic burger with fries and a drink', sku: 'CMB-001', barcode: '500001', price: 14.99, costPrice: 5.50, image: null, isActive: true, isWeighted: false, unit: 'combo', taxRate: 8.5, categoryId: 'cat-5', branchId: null, modifiers: null, variants: null },
  { id: 'prod-18', name: 'Family Meal', slug: 'family-meal', description: '2 burgers, 2 fries, 4 drinks', sku: 'CMB-002', barcode: '500002', price: 29.99, costPrice: 11.00, image: null, isActive: true, isWeighted: false, unit: 'combo', taxRate: 8.5, categoryId: 'cat-5', branchId: null, modifiers: null, variants: null },
  { id: 'prod-19', name: 'Pancake Stack', slug: 'pancake-stack', description: 'Fluffy pancakes with maple syrup', sku: 'BRK-001', barcode: '600001', price: 7.99, costPrice: 2.50, image: null, isActive: true, isWeighted: false, unit: 'plate', taxRate: 8.5, categoryId: 'cat-6', branchId: null, modifiers: null, variants: null },
  { id: 'prod-20', name: 'Eggs Benedict', slug: 'eggs-benedict', description: 'Poached eggs with hollandaise on English muffin', sku: 'BRK-002', barcode: '600002', price: 10.99, costPrice: 3.50, image: null, isActive: true, isWeighted: false, unit: 'plate', taxRate: 8.5, categoryId: 'cat-6', branchId: null, modifiers: null, variants: null },
  { id: 'prod-21', name: 'Avocado Toast', slug: 'avocado-toast', description: 'Sourdough with smashed avocado and eggs', sku: 'BRK-003', barcode: '600003', price: 9.49, costPrice: 3.00, image: null, isActive: true, isWeighted: false, unit: 'plate', taxRate: 8.5, categoryId: 'cat-6', branchId: null, modifiers: null, variants: null },
  { id: 'prod-22', name: 'Americano', slug: 'americano', description: 'Espresso with hot water', sku: 'BEV-006', barcode: '100006', price: 3.99, costPrice: 1.00, image: null, isActive: true, isWeighted: false, unit: 'cup', taxRate: 8.5, categoryId: 'cat-1', branchId: null, modifiers: null, variants: null },
  { id: 'prod-23', name: 'Mocha', slug: 'mocha', description: 'Espresso with chocolate and steamed milk', sku: 'BEV-007', barcode: '100007', price: 5.49, costPrice: 1.80, image: null, isActive: true, isWeighted: false, unit: 'cup', taxRate: 8.5, categoryId: 'cat-1', branchId: null, modifiers: null, variants: null },
  { id: 'prod-24', name: 'Tiramisu', slug: 'tiramisu', description: 'Classic Italian coffee-flavored dessert', sku: 'DES-004', barcode: '300004', price: 7.99, costPrice: 3.00, image: null, isActive: true, isWeighted: false, unit: 'slice', taxRate: 8.5, categoryId: 'cat-3', branchId: null, modifiers: null, variants: null },
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
    if (path === '/api/inventory' && method === 'GET') {
      const inv = products.map(p => ({ id: `inv-${p.id}`, productId: p.id, quantity: Math.floor(Math.random() * 100) + 10, minStock: 15, branchId: null, product: { name: p.name, sku: p.sku, barcode: p.barcode } }));
      return res.json({ success: true, data: inv });
    }
    if (path === '/api/inventory/alerts' && method === 'GET') {
      const alerts = products.slice(0, 4).map(p => ({ id: `inv-${p.id}`, productId: p.id, quantity: Math.floor(Math.random() * 10) + 1, minStock: 15, branchId: null, product: { name: p.name, sku: p.sku, barcode: p.barcode } }));
      return res.json({ success: true, data: alerts });
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
