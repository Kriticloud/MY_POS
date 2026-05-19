import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../utils/helpers';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, ShoppingBag, X, Percent, StickyNote, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProducts, useCategories, useCreateOrder } from '../hooks/useApi';
import { useAuthStore } from '../store/authStore';
import { printReceipt } from '../services/receipt';

export function POSPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH');
  const [discountInput, setDiscountInput] = useState('');
  const [showDiscount, setShowDiscount] = useState(false);

  const { data: apiProducts } = useProducts();
  const { data: apiCategories } = useCategories();
  const createOrder = useCreateOrder();
  const user = useAuthStore(s => s.user);

  const allCategories = useMemo(() => {
    const cats = (apiCategories || []).map((c: any) => ({ id: c.id, name: c.name, icon: c.icon || '📦' }));
    return [{ id: 'all', name: 'All', icon: '🍽️' }, ...cats];
  }, [apiCategories]);

  const products = useMemo(() => {
    let list = apiProducts || [];
    if (selectedCategory !== 'all') list = list.filter((p: any) => p.categoryId === selectedCategory);
    if (search) { const s = search.toLowerCase(); list = list.filter((p: any) => p.name.toLowerCase().includes(s)); }
    return list;
  }, [apiProducts, selectedCategory, search]);

  const cart = useCartStore();
  const subtotal = cart.getSubtotal();
  const tax = cart.getTax();
  const total = cart.getTotal();

  const handleCheckout = async () => {
    if (cart.items.length === 0) return;
    try {
      const orderData = {
        orderType: cart.orderType,
        customerId: cart.customerId,
        tableId: cart.tableId,
        notes: cart.notes,
        discountAmount: cart.discount,
        items: cart.items.map(item => ({ productId: item.productId, quantity: item.quantity, unitPrice: item.price, discount: 0, notes: item.notes || '' })),
        payments: [{ method: paymentMethod, amount: total }],
      };
      const order = await createOrder.mutateAsync(orderData);
      printReceipt({
        orderNumber: order?.orderNumber || 'N/A', date: new Date(),
        items: cart.items.map(i => ({ name: i.name, quantity: i.quantity, unitPrice: i.price, totalPrice: i.price * i.quantity })),
        subtotal, tax, discount: cart.discount, total, paymentMethod,
        cashierName: user ? `${user.firstName} ${user.lastName}` : 'Staff',
        businessName: 'MyPOS Restaurant',
      });
      cart.clearCart();
      setShowPayment(false);
      toast.success('Order placed successfully!');
    } catch { toast.error('Failed to place order'); }
  };

  const applyDiscount = () => {
    const val = parseFloat(discountInput);
    if (!isNaN(val) && val >= 0) { cart.setDiscount(val); setShowDiscount(false); setDiscountInput(''); toast.success(`Discount of ${formatCurrency(val)} applied`); }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
          </div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {allCategories.map((cat: any) => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50'}`}>
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 content-start">
          {products.map((product: any) => (
            <motion.button key={product.id} whileTap={{ scale: 0.97 }}
              onClick={() => cart.addItem({ productId: product.id, name: product.name, price: product.price })}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 text-left shadow-card hover:shadow-md transition-all border border-transparent hover:border-blue-200">
              <div className="w-full h-20 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-lg mb-3 flex items-center justify-center text-2xl">
                {product.category?.icon || '📦'}
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
              <p className="text-sm font-bold text-blue-600 mt-1">{formatCurrency(product.price)}</p>
            </motion.button>
          ))}
          {products.length === 0 && <div className="col-span-full text-center py-12 text-gray-400">No products found</div>}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-80 xl:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-card flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" /> Cart ({cart.items.length})
            </h2>
            {cart.items.length > 0 && <button onClick={cart.clearCart} className="text-xs text-red-500 hover:text-red-600">Clear</button>}
          </div>
          <div className="flex gap-1">
            {(['DINE_IN', 'TAKEAWAY', 'DELIVERY'] as const).map(t => (
              <button key={t} onClick={() => cart.setOrderType(t)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${cart.orderType === t ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {cart.items.map(item => (
              <motion.div key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatCurrency(item.price)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => cart.updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-md bg-white dark:bg-gray-600 flex items-center justify-center shadow-sm"><Minus className="w-3 h-3" /></button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button onClick={() => cart.updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-md bg-white dark:bg-gray-600 flex items-center justify-center shadow-sm"><Plus className="w-3 h-3" /></button>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</p>
                  <button onClick={() => cart.removeItem(item.id)} className="text-red-400 hover:text-red-500 mt-1"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {cart.items.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">Cart is empty</div>}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
          <div className="flex gap-2 mb-2">
            <button onClick={() => setShowDiscount(!showDiscount)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200"><Percent className="w-3.5 h-3.5" /> Discount</button>
          </div>
          {showDiscount && (
            <div className="flex gap-2">
              <input type="number" placeholder="Amount" value={discountInput} onChange={e => setDiscountInput(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border text-sm" />
              <button onClick={applyDiscount} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Apply</button>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="flex justify-between text-sm text-gray-500"><span>Tax (8.5%)</span><span>{formatCurrency(tax)}</span></div>
          {cart.discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-{formatCurrency(cart.discount)}</span></div>}
          <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t"><span>Total</span><span>{formatCurrency(total)}</span></div>
          <button onClick={() => cart.items.length > 0 && setShowPayment(true)} disabled={cart.items.length === 0}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all mt-2">
            Charge {formatCurrency(total)}
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Payment</h2>
                <button onClick={() => setShowPayment(false)}><X className="w-5 h-5" /></button>
              </div>
              <p className="text-3xl font-bold text-center mb-6">{formatCurrency(total)}</p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[{ method: 'CASH', icon: Banknote, label: 'Cash' }, { method: 'CARD', icon: CreditCard, label: 'Card' }, { method: 'UPI', icon: Smartphone, label: 'UPI' }].map(pm => (
                  <button key={pm.method} onClick={() => setPaymentMethod(pm.method)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${paymentMethod === pm.method ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    <pm.icon className={`w-6 h-6 ${paymentMethod === pm.method ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium">{pm.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={handleCheckout} disabled={createOrder.isPending}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition-all">
                {createOrder.isPending ? 'Processing...' : `Complete Payment - ${formatCurrency(total)}`}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
