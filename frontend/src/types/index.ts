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
