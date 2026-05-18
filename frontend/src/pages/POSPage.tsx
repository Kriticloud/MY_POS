import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../utils/helpers';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  ShoppingBag,
  X,
  Percent,
  StickyNote,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data for demo - in production, this comes from API
const categories = [
  { id: 'all', name: 'All', icon: '🛒', color: '#6366F1' },
  { id: 'beverages', name: 'Beverages', icon: '🥤', color: '#3B82F6' },
  { id: 'food', name: 'Food', icon: '🍔', color: '#EF4444' },
  { id: 'desserts', name: 'Desserts', icon: '🍰', color: '#F59E0B' },
  { id: 'snacks', name: 'Snacks', icon: '🍿', color: '#22C55E' },
  { id: 'combos', name: 'Combos', icon: '🍱', color: '#8B5CF6' },
];

const products = [
  { id: '1', name: 'Americano', price: 3.99, category: 'beverages', image: '☕' },
  { id: '2', name: 'Cappuccino', price: 4.99, category: 'beverages', image: '☕' },
  { id: '3', name: 'Latte', price: 5.49, category: 'beverages', image: '☕' },
  { id: '4', name: 'Orange Juice', price: 4.49, category: 'beverages', image: '🍊' },
  { id: '5', name: 'Iced Tea', price: 3.49, category: 'beverages', image: '🧊' },
  { id: '6', name: 'Classic Burger', price: 9.99, category: 'food', image: '🍔' },
  { id: '7', name: 'Chicken Sandwich', price: 8.49, category: 'food', image: '🥪' },
  { id: '8', name: 'Caesar Salad', price: 7.99, category: 'food', image: '🥗' },
  { id: '9', name: 'Margherita Pizza', price: 12.99, category: 'food', image: '🍕' },
  { id: '10', name: 'Grilled Salmon', price: 16.99, category: 'food', image: '🐟' },
  { id: '11', name: 'Chocolate Cake', price: 6.99, category: 'desserts', image: '🍫' },
  { id: '12', name: 'Cheesecake', price: 7.49, category: 'desserts', image: '🍰' },
  { id: '13', name: 'Ice Cream', price: 5.99, category: 'desserts', image: '🍨' },
  { id: '14', name: 'French Fries', price: 3.99, category: 'snacks', image: '🍟' },
  { id: '15', name: 'Onion Rings', price: 4.49, category: 'snacks', image: '🧅' },
  { id: '16', name: 'Nachos', price: 5.99, category: 'snacks', image: '🌮' },
  { id: '17', name: 'Burger Combo', price: 14.99, category: 'combos', image: '🍱' },
  { id: '18', name: 'Family Meal', price: 29.99, category: 'combos', image: '👨‍👩‍👧‍👦' },
];

export function POSPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  const { items, addItem, removeItem, updateQuantity, clearCart, getSubtotal, getTax, getTotal, discount, setDiscount } =
    useCartStore();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
    });
  };

  const handleCheckout = (method: string) => {
    toast.success(`Payment of ${formatCurrency(getTotal())} received via ${method}!`);
    clearCart();
    setShowPayment(false);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] lg:h-screen">
      {/* Product Grid Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search & Categories */}
        <div className="p-4 space-y-3 bg-white dark:bg-dark-900 border-b border-gray-100 dark:border-dark-700">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products or scan barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-600'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredProducts.map((product) => (
              <motion.button
                key={product.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddToCart(product)}
                className="bg-white dark:bg-dark-800 rounded-xl p-4 shadow-card hover:shadow-soft transition-all text-left group"
              >
                <div className="text-3xl mb-2">{product.image}</div>
                <p className="text-sm font-medium text-dark-900 dark:text-white truncate">
                  {product.name}
                </p>
                <p className="text-sm font-bold text-primary mt-1">
                  {formatCurrency(product.price)}
                </p>
                <div className="absolute top-2 right-2 w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="w-4 h-4 text-primary" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-white dark:bg-dark-900 border-l border-gray-200 dark:border-dark-700 flex flex-col hidden lg:flex">
        {/* Cart Header */}
        <div className="p-4 border-b border-gray-100 dark:border-dark-700">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-dark-900 dark:text-white">
              Current Order
            </h2>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:text-red-600 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Order Type */}
          <div className="flex gap-2 mt-3">
            {['DINE_IN', 'TAKEAWAY', 'DELIVERY'].map((type) => (
              <button
                key={type}
                onClick={() => useCartStore.getState().setOrderType(type as any)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                  useCartStore.getState().orderType === type
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ShoppingBag className="w-12 h-12 mb-3" />
                <p className="text-sm">No items in cart</p>
                <p className="text-xs mt-1">Tap products to add them</p>
              </div>
            ) : (
              items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3 bg-gray-50 dark:bg-dark-800 rounded-xl p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">{formatCurrency(item.price)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 flex items-center justify-center"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-dark-900 dark:text-white w-16 text-right">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 dark:border-dark-700 p-4 space-y-3">
            {/* Quick Actions */}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-dark-700 rounded-lg hover:bg-gray-200">
                <Percent className="w-3.5 h-3.5" /> Discount
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-dark-700 rounded-lg hover:bg-gray-200">
                <StickyNote className="w-3.5 h-3.5" /> Note
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-dark-700 rounded-lg hover:bg-gray-200">
                <User className="w-3.5 h-3.5" /> Customer
              </button>
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{formatCurrency(getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax (8.5%)</span>
                <span>{formatCurrency(getTax())}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-dark-900 dark:text-white pt-2 border-t border-gray-100 dark:border-dark-700">
                <span>Total</span>
                <span>{formatCurrency(getTotal())}</span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={() => setShowPayment(true)}
              className="w-full py-4 bg-primary hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/25 text-lg"
            >
              Charge {formatCurrency(getTotal())}
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowPayment(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-dark-900 dark:text-white">
                  Payment
                </h3>
                <button
                  onClick={() => setShowPayment(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mb-6">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-4xl font-bold text-dark-900 dark:text-white mt-1">
                  {formatCurrency(getTotal())}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleCheckout('Cash')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-dark-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Banknote className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-dark-900 dark:text-white">Cash</p>
                    <p className="text-xs text-gray-500">Pay with cash</p>
                  </div>
                </button>

                <button
                  onClick={() => handleCheckout('Card')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-dark-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-dark-900 dark:text-white">Card</p>
                    <p className="text-xs text-gray-500">Credit or Debit card</p>
                  </div>
                </button>

                <button
                  onClick={() => handleCheckout('UPI')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-dark-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-dark-900 dark:text-white">UPI / Digital Wallet</p>
                    <p className="text-xs text-gray-500">Google Pay, PhonePe, etc.</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
