import { create } from 'zustand';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  modifiers?: Record<string, string>;
}

interface CartState {
  items: CartItem[];
  customerId: string | null;
  tableId: string | null;
  orderType: string;
  discount: number;
  notes: string;
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNotes: (id: string, notes: string) => void;
  setCustomer: (customerId: string | null) => void;
  setTable: (tableId: string | null) => void;
  setOrderType: (type: string) => void;
  setDiscount: (discount: number) => void;
  setOrderNotes: (notes: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  customerId: null,
  tableId: null,
  orderType: 'DINE_IN',
  discount: 0,
  notes: '',

  addItem: (item) => {
    const existing = get().items.find((i) => i.productId === item.productId);
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({
        items: [...get().items, { ...item, id: crypto.randomUUID(), quantity: 1 }],
      });
    }
  },

  removeItem: (id) => {
    set({ items: get().items.filter((i) => i.id !== id) });
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      set({ items: get().items.filter((i) => i.id !== id) });
    } else {
      set({
        items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
      });
    }
  },

  updateNotes: (id, notes) => {
    set({
      items: get().items.map((i) => (i.id === id ? { ...i, notes } : i)),
    });
  },

  setCustomer: (customerId) => set({ customerId }),
  setTable: (tableId) => set({ tableId }),
  setOrderType: (orderType: string) => set({ orderType }),
  setDiscount: (discount) => set({ discount }),
  setOrderNotes: (notes) => set({ notes }),

  clearCart: () =>
    set({ items: [], customerId: null, tableId: null, discount: 0, notes: '', orderType: 'DINE_IN' }),

  getSubtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  getTax: () => get().getSubtotal() * 0.085,
  getTotal: () => get().getSubtotal() + get().getTax() - get().discount,
}));
