export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: Role;
  branchId?: string;
  branch?: Branch;
}

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'CASHIER' | 'WAITER' | 'STAFF' | 'ACCOUNTANT';

export type BusinessType = 'RESTAURANT' | 'GROCERY' | 'RETAIL' | 'SALON' | 'CAFE' | 'PHARMACY' | 'GENERAL';

export interface Branch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  businessType: BusinessType;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  isActive: boolean;
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sku?: string;
  barcode?: string;
  price: number;
  costPrice?: number;
  image?: string;
  isActive: boolean;
  isWeighted: boolean;
  unit?: string;
  taxRate: number;
  categoryId?: string;
  category?: Category;
  modifiers?: Record<string, unknown>;
  variants?: Record<string, unknown>;
  batchNumber?: string;
  expiryDate?: string;
  stockQuantity?: number;
  minStockLevel?: number;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  loyaltyPoints: number;
  totalSpent: number;
  loyaltyTier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  storeCredit?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  orderType: OrderType;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  notes?: string;
  customerId?: string;
  customer?: Customer;
  userId: string;
  tableId?: string;
  items: OrderItem[];
  payments: Payment[];
  createdAt: string;
  voidReason?: string;
  voidedBy?: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELLED';
export type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY' | 'ONLINE';
export type PaymentMethod = 'CASH' | 'CARD' | 'UPI' | 'WALLET' | 'MIXED';

export interface OrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
  notes?: string;
  modifiers?: Record<string, unknown>;
}

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  reference?: string;
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING';
  floor?: string;
  orders?: Order[];
}

export interface Employee {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  role: Role;
  email: string;
  phone?: string;
  isActive: boolean;
  clockedIn: boolean;
  lastClockIn?: string;
  lastClockOut?: string;
  totalHoursToday?: number;
  totalSalesToday?: number;
  ordersToday?: number;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  clockIn: string;
  clockOut?: string;
  breakMinutes?: number;
  hoursWorked?: number;
  date: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  product?: { name: string; sku?: string; barcode?: string };
  quantity: number;
  minStock: number;
  batchNumber?: string;
  expiryDate?: string;
  lastRestocked?: string;
  reorderPoint?: number;
  reorderQuantity?: number;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  details: string;
  timestamp: string;
  entityType?: string;
  entityId?: string;
}

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  orderId?: string;
  points: number;
  type: 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'ADJUSTED';
  description: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  customerId?: string;
  staffId?: string;
  service: string;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
  price?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
