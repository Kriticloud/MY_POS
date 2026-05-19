const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, 'frontend', 'src', 'pages');

const files = {};

// ─── DashboardPage ──────────────────────────────────────────────────────
files['DashboardPage.tsx'] = `import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { useDailySummary, useOrders, useTopProducts, useSalesReport } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: daily, isLoading: loadingDaily } = useDailySummary();
  const { data: salesData } = useSalesReport();
  const { data: ordersData, isLoading: loadingOrders } = useOrders();
  const { data: topProducts, isLoading: loadingTop } = useTopProducts();

  const recentOrders = (ordersData || []).slice(0, 8);
  const topProds = (topProducts || []).slice(0, 5);

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(salesData?.totalRevenue || 0), icon: DollarSign, change: '+12.5%', up: true, color: 'bg-blue-500' },
    { label: "Today's Orders", value: String(daily?.orderCount || 0), icon: ShoppingBag, change: '+8.2%', up: true, color: 'bg-green-500' },
    { label: 'Avg Order Value', value: formatCurrency(salesData?.averageOrderValue || 0), icon: TrendingUp, change: '+5.7%', up: true, color: 'bg-amber-500' },
    { label: 'Total Orders', value: String(salesData?.orderCount || 0), icon: Users, change: '+4.1%', up: true, color: 'bg-purple-500' },
  ];

  const statusColor: Record<string, string> = {
    COMPLETED: 'bg-green-100 text-green-700', CONFIRMED: 'bg-blue-100 text-blue-700',
    PREPARING: 'bg-amber-100 text-amber-700', READY: 'bg-purple-100 text-purple-700',
    PENDING: 'bg-gray-100 text-gray-700', CANCELLED: 'bg-red-100 text-red-700',
    SERVED: 'bg-teal-100 text-teal-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-card">
            {loadingDaily ? <Skeleton className="h-20 w-full" /> : <>
              <div className="flex items-center justify-between mb-3">
                <div className={\`w-10 h-10 \${stat.color} rounded-lg flex items-center justify-center\`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span className={\`flex items-center text-xs font-medium \${stat.up ? 'text-green-600' : 'text-red-500'}\`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </>}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-card">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
            <button onClick={() => navigate('/orders')} className="text-sm text-blue-600 hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            {loadingOrders ? <div className="p-5"><Skeleton className="h-40 w-full" /></div> : (
              <table className="w-full">
                <thead><tr className="text-xs text-gray-500 uppercase border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left p-4">Order</th><th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Items</th><th className="text-left p-4">Total</th>
                  <th className="text-left p-4">Status</th><th className="text-left p-4">Date</th>
                </tr></thead>
                <tbody>
                  {recentOrders.map((order: any) => (
                    <tr key={order.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="p-4 font-medium text-sm">{order.orderNumber}</td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{order.customer ? \`\${order.customer.firstName} \${order.customer.lastName || ''}\` : 'Walk-in'}</td>
                      <td className="p-4 text-sm text-gray-600">{order.items?.length || 0}</td>
                      <td className="p-4 text-sm font-medium">{formatCurrency(order.totalAmount)}</td>
                      <td className="p-4"><span className={\`px-2 py-1 rounded-full text-xs font-medium \${statusColor[order.status] || 'bg-gray-100'}\`}>{order.status}</span></td>
                      <td className="p-4 text-sm text-gray-500">{formatDate(new Date(order.createdAt))}</td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No orders yet</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Top Products</h2>
          </div>
          <div className="p-5 space-y-4">
            {loadingTop ? <Skeleton className="h-40 w-full" /> : topProds.length > 0 ? topProds.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.product?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{item.totalQuantity} sold</p>
                  </div>
                </div>
                <p className="text-sm font-medium">{formatCurrency(item.product?.price || 0)}</p>
              </div>
            )) : <p className="text-sm text-gray-400 text-center py-4">No data yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
`;

// ─── POSPage ────────────────────────────────────────────────────────────
files['POSPage.tsx'] = `import { useState, useMemo } from 'react';
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
        cashierName: user ? \`\${user.firstName} \${user.lastName}\` : 'Staff',
        businessName: 'MyPOS Restaurant',
      });
      cart.clearCart();
      setShowPayment(false);
      toast.success('Order placed successfully!');
    } catch { toast.error('Failed to place order'); }
  };

  const applyDiscount = () => {
    const val = parseFloat(discountInput);
    if (!isNaN(val) && val >= 0) { cart.setDiscount(val); setShowDiscount(false); setDiscountInput(''); toast.success(\`Discount of \${formatCurrency(val)} applied\`); }
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
              className={\`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all \${selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50'}\`}>
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
                className={\`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all \${cart.orderType === t ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}\`}>
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
                    className={\`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all \${paymentMethod === pm.method ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}\`}>
                    <pm.icon className={\`w-6 h-6 \${paymentMethod === pm.method ? 'text-blue-600' : 'text-gray-400'}\`} />
                    <span className="text-sm font-medium">{pm.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={handleCheckout} disabled={createOrder.isPending}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition-all">
                {createOrder.isPending ? 'Processing...' : \`Complete Payment - \${formatCurrency(total)}\`}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;

// ─── OrdersPage ─────────────────────────────────────────────────────────
files['OrdersPage.tsx'] = `import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatDate } from '../utils/helpers';
import { useOrders, useUpdateOrderStatus } from '../hooks/useApi';
import { Search, Filter, Eye, X, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { Skeleton } from '../components/ui/Skeleton';

const statusOptions = ['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED'];
const statusColor: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-700', CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-amber-100 text-amber-700', READY: 'bg-purple-100 text-purple-700',
  PENDING: 'bg-gray-100 text-gray-700', CANCELLED: 'bg-red-100 text-red-700',
  SERVED: 'bg-teal-100 text-teal-700',
};
const nextStatus: Record<string, string> = {
  PENDING: 'CONFIRMED', CONFIRMED: 'PREPARING', PREPARING: 'READY', READY: 'SERVED', SERVED: 'COMPLETED',
};

export function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { data: orders, isLoading } = useOrders(statusFilter !== 'ALL' ? { status: statusFilter } : undefined);
  const updateStatus = useUpdateOrderStatus();

  const filteredOrders = (orders || []).filter((o: any) => {
    if (search) {
      const s = search.toLowerCase();
      return o.orderNumber?.toLowerCase().includes(s) || o.customer?.firstName?.toLowerCase().includes(s);
    }
    return true;
  });

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status });
      toast.success(\`Order updated to \${status}\`);
      if (selectedOrder?.id === orderId) setSelectedOrder((prev: any) => prev ? { ...prev, status } : null);
    } catch { toast.error('Failed to update order'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track all orders</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {statusOptions.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={\`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all \${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 hover:bg-gray-50'}\`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden">
        {isLoading ? <div className="p-6"><Skeleton className="h-60 w-full" /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-xs text-gray-500 uppercase border-b border-gray-100 dark:border-gray-700">
                <th className="text-left p-4">Order</th><th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Type</th><th className="text-left p-4">Items</th>
                <th className="text-left p-4">Total</th><th className="text-left p-4">Status</th>
                <th className="text-left p-4">Date</th><th className="text-left p-4">Actions</th>
              </tr></thead>
              <tbody>
                {filteredOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="p-4 font-medium text-sm">{order.orderNumber}</td>
                    <td className="p-4 text-sm text-gray-600">{order.customer ? \`\${order.customer.firstName} \${order.customer.lastName || ''}\` : 'Walk-in'}</td>
                    <td className="p-4"><span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs">{order.orderType?.replace('_', ' ')}</span></td>
                    <td className="p-4 text-sm">{order.items?.length || 0}</td>
                    <td className="p-4 text-sm font-medium">{formatCurrency(order.totalAmount)}</td>
                    <td className="p-4"><span className={\`px-2 py-1 rounded-full text-xs font-medium \${statusColor[order.status] || ''}\`}>{order.status}</span></td>
                    <td className="p-4 text-sm text-gray-500">{formatDate(new Date(order.createdAt))}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedOrder(order)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><Eye className="w-4 h-4 text-gray-500" /></button>
                        {nextStatus[order.status] && (
                          <button onClick={() => handleStatusUpdate(order.id, nextStatus[order.status])}
                            className="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">
                            {nextStatus[order.status]}
                          </button>
                        )}
                        {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                          <button onClick={() => handleStatusUpdate(order.id, 'CANCELLED')} className="px-2 py-1 bg-red-100 text-red-600 rounded-lg text-xs hover:bg-red-200">Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-gray-400">No orders found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedOrder(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Order {selectedOrder.orderNumber}</h2>
                <button onClick={() => setSelectedOrder(null)}><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3 text-sm">
                  <span className={\`px-2 py-1 rounded-full text-xs font-medium \${statusColor[selectedOrder.status]}\`}>{selectedOrder.status}</span>
                  <span className="text-gray-500">{selectedOrder.orderType?.replace('_', ' ')}</span>
                  <span className="text-gray-500">{formatDate(new Date(selectedOrder.createdAt))}</span>
                </div>
                {selectedOrder.customer && <p className="text-sm"><span className="text-gray-500">Customer:</span> {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>}
                {selectedOrder.notes && <p className="text-sm bg-amber-50 p-2 rounded-lg"><span className="font-medium">Note:</span> {selectedOrder.notes}</p>}
                <div className="border-t pt-3">
                  <h3 className="font-medium mb-2">Items</h3>
                  {(selectedOrder.items || []).map((item: any, i: number) => (
                    <div key={i} className="flex justify-between py-2 text-sm border-b border-gray-50">
                      <div><span className="font-medium">{item.product?.name || 'Item'}</span> <span className="text-gray-500">x{item.quantity}</span></div>
                      <span>{formatCurrency(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(selectedOrder.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{formatCurrency(selectedOrder.taxAmount)}</span></div>
                  {selectedOrder.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(selectedOrder.discountAmount)}</span></div>}
                  <div className="flex justify-between font-bold text-lg pt-2"><span>Total</span><span>{formatCurrency(selectedOrder.totalAmount)}</span></div>
                </div>
                {nextStatus[selectedOrder.status] && (
                  <button onClick={() => handleStatusUpdate(selectedOrder.id, nextStatus[selectedOrder.status])}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
                    Move to {nextStatus[selectedOrder.status]}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;

// ─── KitchenPage ────────────────────────────────────────────────────────
files['KitchenPage.tsx'] = `import { motion } from 'framer-motion';
import { Clock, ChefHat, CheckCircle2, AlertCircle } from 'lucide-react';
import { useKitchenQueue, useUpdateOrderStatus } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

export function KitchenPage() {
  const { data: orders, isLoading } = useKitchenQueue();
  const updateStatus = useUpdateOrderStatus();

  const handleStatus = async (orderId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status });
      toast.success(\`Order moved to \${status}\`);
    } catch { toast.error('Failed to update order'); }
  };

  const getElapsed = (createdAt: string) => {
    const mins = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
    return mins < 60 ? \`\${mins}m\` : \`\${Math.floor(mins / 60)}h \${mins % 60}m\`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Kitchen Display</h1>
          <p className="text-gray-500 mt-1">Active orders in the kitchen</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live
        </div>
      </div>

      {isLoading ? <Skeleton className="h-60 w-full" /> : (orders || []).length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <ChefHat className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg">No active orders</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(orders || []).map((order: any) => {
            const elapsed = getElapsed(order.createdAt);
            const isPriority = parseInt(elapsed) > 15;
            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className={\`bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden \${isPriority ? 'ring-2 ring-red-400' : ''}\`}>
                <div className={\`px-4 py-3 flex items-center justify-between \${order.status === 'CONFIRMED' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}\`}>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{order.orderNumber}</span>
                    {order.table && <span className="text-xs bg-white dark:bg-gray-700 px-2 py-0.5 rounded-full">{order.table.name}</span>}
                    {isPriority && <AlertCircle className="w-4 h-4 text-red-500" />}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Clock className="w-3.5 h-3.5" /> {elapsed}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {(order.items || []).map((item: any, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-bold text-blue-600 text-sm">{item.quantity}x</span>
                      <div>
                        <p className="text-sm font-medium">{item.product?.name || 'Item'}</p>
                        {item.notes && <p className="text-xs text-amber-600 mt-0.5">Note: {item.notes}</p>}
                      </div>
                    </div>
                  ))}
                  {order.notes && <p className="text-xs bg-amber-50 text-amber-700 p-2 rounded-lg mt-2">Order note: {order.notes}</p>}
                </div>
                <div className="px-4 pb-4">
                  {order.status === 'CONFIRMED' ? (
                    <button onClick={() => handleStatus(order.id, 'PREPARING')}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium flex items-center justify-center gap-2">
                      <ChefHat className="w-4 h-4" /> Start Preparing
                    </button>
                  ) : (
                    <button onClick={() => handleStatus(order.id, 'READY')}
                      className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Mark Ready
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
`;

// ─── ProductsPage ───────────────────────────────────────────────────────
files['ProductsPage.tsx'] = `import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Package, X } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { useProducts, useCategories, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const emptyForm = { name: '', slug: '', price: '', costPrice: '', sku: '', barcode: '', description: '', categoryId: '', taxRate: '8.5', unit: 'piece' };

export function ProductsPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: products, isLoading } = useProducts({ search: search || undefined });
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const openNew = () => { setForm(emptyForm); setEditing(null); setShowForm(true); };
  const openEdit = (p: any) => {
    setForm({ name: p.name, slug: p.slug, price: String(p.price), costPrice: String(p.costPrice || ''), sku: p.sku || '', barcode: p.barcode || '', description: p.description || '', categoryId: p.categoryId || '', taxRate: String(p.taxRate || 8.5), unit: p.unit || 'piece' });
    setEditing(p); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, price: parseFloat(form.price), costPrice: form.costPrice ? parseFloat(form.costPrice) : undefined, taxRate: parseFloat(form.taxRate), slug: form.slug || form.name.toLowerCase().replace(/\\s+/g, '-') };
    try {
      if (editing) { await updateProduct.mutateAsync({ id: editing.id, ...data }); toast.success('Product updated'); }
      else { await createProduct.mutateAsync(data); toast.success('Product created'); }
      setShowForm(false);
    } catch { toast.error('Failed to save product'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await deleteProduct.mutateAsync(deleteId); toast.success('Product deleted'); setDeleteId(null); }
    catch { toast.error('Failed to delete product'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product catalog</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search by name, SKU, or barcode..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden">
        {isLoading ? <div className="p-6"><Skeleton className="h-60 w-full" /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-xs text-gray-500 uppercase border-b border-gray-100 dark:border-gray-700">
                <th className="text-left p-4">Product</th><th className="text-left p-4">SKU</th>
                <th className="text-left p-4">Category</th><th className="text-left p-4">Price</th>
                <th className="text-left p-4">Cost</th><th className="text-left p-4">Actions</th>
              </tr></thead>
              <tbody>
                {(products || []).map((p: any) => (
                  <tr key={p.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-lg">{p.category?.icon || '📦'}</div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.barcode || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{p.sku || '-'}</td>
                    <td className="p-4 text-sm text-gray-600">{p.category?.name || '-'}</td>
                    <td className="p-4 text-sm font-medium">{formatCurrency(p.price)}</td>
                    <td className="p-4 text-sm text-gray-500">{p.costPrice ? formatCurrency(p.costPrice) : '-'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><Edit className="w-4 h-4 text-gray-500" /></button>
                        <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(products || []).length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No products found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">{editing ? 'Edit Product' : 'New Product'}</h2>
                <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2"><label className="block text-xs font-medium text-gray-500 mb-1">Name *</label>
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Price *</label>
                    <input required type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Cost Price</label>
                    <input type="number" step="0.01" value={form.costPrice} onChange={e => setForm({...form, costPrice: e.target.value})} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">SKU</label>
                    <input value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Barcode</label>
                    <input value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                    <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} className="w-full px-3 py-2 rounded-lg border text-sm">
                      <option value="">None</option>
                      {(categories || []).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select></div>
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Tax Rate %</label>
                    <input type="number" step="0.1" value={form.taxRate} onChange={e => setForm({...form, taxRate: e.target.value})} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                  <div className="col-span-2"><label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <textarea rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                </div>
                <button type="submit" disabled={createProduct.isPending || updateProduct.isPending}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">
                  {editing ? 'Update Product' : 'Create Product'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm mx-4 shadow-xl">
              <h2 className="text-lg font-bold mb-2">Delete Product?</h2>
              <p className="text-sm text-gray-500 mb-4">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2 rounded-xl border text-sm">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;

// ─── CustomersPage ──────────────────────────────────────────────────────
files['CustomersPage.tsx'] = `import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, User, Mail, Phone, Star, X, Edit, Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const emptyForm = { firstName: '', lastName: '', email: '', phone: '', address: '' };

export function CustomersPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: customers, isLoading } = useCustomers({ search: search || undefined });
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const openNew = () => { setForm(emptyForm); setEditing(null); setShowForm(true); };
  const openEdit = (c: any) => {
    setForm({ firstName: c.firstName, lastName: c.lastName || '', email: c.email || '', phone: c.phone || '', address: c.address || '' });
    setEditing(c); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) { await updateCustomer.mutateAsync({ id: editing.id, ...form }); toast.success('Customer updated'); }
      else { await createCustomer.mutateAsync(form); toast.success('Customer created'); }
      setShowForm(false);
    } catch { toast.error('Failed to save customer'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await deleteCustomer.mutateAsync(deleteId); toast.success('Customer deleted'); setDeleteId(null); }
    catch { toast.error('Failed to delete customer'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-gray-500 mt-1">Manage your customer database</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
      </div>

      {isLoading ? <Skeleton className="h-60 w-full" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(customers || []).map((c: any) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    {c.firstName[0]}{(c.lastName || '')[0] || ''}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{c.firstName} {c.lastName}</p>
                    {c.email && <p className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {c.email}</p>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><Edit className="w-3.5 h-3.5 text-gray-400" /></button>
                  <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                </div>
              </div>
              {c.phone && <p className="text-xs text-gray-500 flex items-center gap-1 mb-3"><Phone className="w-3 h-3" /> {c.phone}</p>}
              <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100 dark:border-gray-700">
                <div><p className="text-gray-500 text-xs">Total Spent</p><p className="font-medium">{formatCurrency(c.totalSpent || 0)}</p></div>
                <div className="text-right"><p className="text-gray-500 text-xs">Loyalty Points</p>
                  <p className="font-medium flex items-center justify-end gap-1"><Star className="w-3 h-3 text-amber-400" /> {c.loyaltyPoints || 0}</p></div>
              </div>
            </motion.div>
          ))}
          {(customers || []).length === 0 && <div className="col-span-full text-center py-12 text-gray-400">No customers found</div>}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">{editing ? 'Edit Customer' : 'New Customer'}</h2>
                <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">First Name *</label>
                    <input required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
                    <input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                </div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                  <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
                  <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">
                  {editing ? 'Update Customer' : 'Create Customer'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm mx-4 shadow-xl">
              <h2 className="text-lg font-bold mb-2">Delete Customer?</h2>
              <p className="text-sm text-gray-500 mb-4">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2 rounded-xl border text-sm">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;

// ─── TablesPage ─────────────────────────────────────────────────────────
files['TablesPage.tsx'] = `import { motion } from 'framer-motion';
import { Users, Clock, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useTables, useUpdateTableStatus } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import { useState } from 'react';

const statusConfig: Record<string, { bg: string; text: string; icon: any; dot: string }> = {
  AVAILABLE: { bg: 'bg-green-50 dark:bg-green-900/20 border-green-200', text: 'text-green-700', icon: CheckCircle, dot: 'bg-green-500' },
  OCCUPIED: { bg: 'bg-red-50 dark:bg-red-900/20 border-red-200', text: 'text-red-700', icon: Users, dot: 'bg-red-500' },
  RESERVED: { bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200', text: 'text-amber-700', icon: Clock, dot: 'bg-amber-500' },
  CLEANING: { bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200', text: 'text-blue-700', icon: AlertCircle, dot: 'bg-blue-500' },
};

export function TablesPage() {
  const { data: tables, isLoading } = useTables();
  const updateStatus = useUpdateTableStatus();
  const [selected, setSelected] = useState<any>(null);

  const handleStatus = async (tableId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id: tableId, status });
      toast.success(\`Table updated to \${status}\`);
      setSelected(null);
    } catch { toast.error('Failed to update table'); }
  };

  const floors = (tables || []).reduce((acc: Record<string, any[]>, t: any) => {
    const floor = t.floor || 'Main';
    (acc[floor] = acc[floor] || []).push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Tables</h1>
          <p className="text-gray-500 mt-1">Manage table assignments and status</p>
        </div>
        <div className="flex items-center gap-4">
          {Object.entries(statusConfig).map(([status, cfg]) => (
            <div key={status} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className={\`w-2 h-2 rounded-full \${cfg.dot}\`} /> {status}
            </div>
          ))}
        </div>
      </div>

      {isLoading ? <Skeleton className="h-60 w-full" /> : Object.entries(floors).map(([floor, floorTables]) => (
        <div key={floor}>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{floor}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {(floorTables as any[]).map((table: any) => {
              const cfg = statusConfig[table.status] || statusConfig.AVAILABLE;
              const Icon = cfg.icon;
              const activeOrder = (table.orders || [])[0];
              return (
                <motion.button key={table.id} whileTap={{ scale: 0.97 }} onClick={() => setSelected(table)}
                  className={\`\${cfg.bg} border rounded-xl p-4 text-left transition-all hover:shadow-md\`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={\`w-5 h-5 \${cfg.text}\`} />
                    <span className={\`text-xs font-medium px-1.5 py-0.5 rounded-full \${cfg.text} bg-white/50\`}>{table.status}</span>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">{table.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{table.capacity} seats</p>
                  {activeOrder && <p className="text-xs text-blue-600 mt-1 font-medium">{activeOrder.orderNumber}</p>}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Table Detail Modal */}
      {selected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{selected.name}</h2>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 mb-4">
              <p className="text-sm"><span className="text-gray-500">Capacity:</span> {selected.capacity} seats</p>
              <p className="text-sm"><span className="text-gray-500">Floor:</span> {selected.floor}</p>
              <p className="text-sm"><span className="text-gray-500">Status:</span> <span className={\`font-medium \${statusConfig[selected.status]?.text}\`}>{selected.status}</span></p>
              {(selected.orders || []).length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Active Order</p>
                  <p className="text-sm font-medium">{selected.orders[0].orderNumber} - {formatCurrency(selected.orders[0].totalAmount)}</p>
                </div>
              )}
            </div>
            <p className="text-xs font-medium text-gray-500 mb-2">Change Status</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(statusConfig).map(status => (
                <button key={status} onClick={() => handleStatus(selected.id, status)} disabled={selected.status === status}
                  className={\`py-2 rounded-lg text-xs font-medium transition-all \${selected.status === status ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}\`}>
                  {status}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
`;

// ─── ReportsPage ────────────────────────────────────────────────────────
files['ReportsPage.tsx'] = `import { formatCurrency } from '../utils/helpers';
import { BarChart3, TrendingUp, ShoppingBag, DollarSign } from 'lucide-react';
import { useSalesReport, useTopProducts, useOrders } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';

export function ReportsPage() {
  const { data: sales, isLoading: loadingSales } = useSalesReport();
  const { data: topProducts, isLoading: loadingTop } = useTopProducts();
  const { data: orders } = useOrders();

  const paymentBreakdown = (orders || []).reduce((acc: Record<string, number>, o: any) => {
    (o.payments || []).forEach((p: any) => { acc[p.method] = (acc[p.method] || 0) + p.amount; });
    return acc;
  }, {});
  const totalPayments = Object.values(paymentBreakdown).reduce((s: number, v) => s + (v as number), 0);

  const orderTypeBreakdown = (orders || []).reduce((acc: Record<string, number>, o: any) => {
    acc[o.orderType] = (acc[o.orderType] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(sales?.totalRevenue || 0), icon: DollarSign, color: 'bg-blue-500' },
    { label: 'Total Orders', value: String(sales?.orderCount || 0), icon: ShoppingBag, color: 'bg-green-500' },
    { label: 'Avg Order Value', value: formatCurrency(sales?.averageOrderValue || 0), icon: TrendingUp, color: 'bg-amber-500' },
    { label: 'Total Tax', value: formatCurrency(sales?.totalTax || 0), icon: BarChart3, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Reports</h1>
        <p className="text-gray-500 mt-1">Business analytics and insights</p>
      </div>

      {loadingSales ? <Skeleton className="h-32 w-full" /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-2">
                <div className={\`w-10 h-10 \${stat.color} rounded-lg flex items-center justify-center\`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Top Selling Products</h2>
          </div>
          {loadingTop ? <div className="p-5"><Skeleton className="h-40 w-full" /></div> : (
            <div className="p-5 space-y-3">
              {(topProducts || []).slice(0, 8).map((item: any, i: number) => {
                const maxQty = (topProducts || [])[0]?.totalQuantity || 1;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{item.product?.name || 'Unknown'}</span>
                      <span className="text-gray-500">{item.totalQuantity} sold</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: \`\${(item.totalQuantity / maxQty) * 100}%\` }} />
                    </div>
                  </div>
                );
              })}
              {(topProducts || []).length === 0 && <p className="text-sm text-gray-400 text-center py-4">No data</p>}
            </div>
          )}
        </div>

        {/* Payment Methods & Order Types */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">Payment Methods</h2>
            </div>
            <div className="p-5 space-y-3">
              {Object.entries(paymentBreakdown).map(([method, amount]) => (
                <div key={method} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium">{method}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(amount as number)}</p>
                    <p className="text-xs text-gray-500">{totalPayments > 0 ? Math.round(((amount as number) / totalPayments) * 100) : 0}%</p>
                  </div>
                </div>
              ))}
              {Object.keys(paymentBreakdown).length === 0 && <p className="text-sm text-gray-400 text-center">No data</p>}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">Order Types</h2>
            </div>
            <div className="p-5 space-y-3">
              {Object.entries(orderTypeBreakdown).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{type.replace('_', ' ')}</span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">{count as number} orders</span>
                </div>
              ))}
              {Object.keys(orderTypeBreakdown).length === 0 && <p className="text-sm text-gray-400 text-center">No data</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

// ─── SettingsPage ───────────────────────────────────────────────────────
files['SettingsPage.tsx'] = `import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, Printer, Globe, Palette, Bell, Shield, Save } from 'lucide-react';
import { useSettings, useUpdateSetting } from '../hooks/useApi';
import toast from 'react-hot-toast';
import { Skeleton } from '../components/ui/Skeleton';

const sections = [
  { id: 'business', label: 'Business', icon: Store },
  { id: 'printing', label: 'Printing', icon: Printer },
  { id: 'localization', label: 'Localization', icon: Globe },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState('business');
  const { data: settings, isLoading } = useSettings();
  const updateSetting = useUpdateSetting();
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      (settings as any[]).forEach((s: any) => { map[s.key] = s.value; });
      setForm(map);
    }
  }, [settings]);

  const getValue = (key: string, fallback = '') => form[key] ?? fallback;
  const setValue = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const saveSection = async (keys: string[], group: string) => {
    try {
      for (const key of keys) {
        if (form[key] !== undefined) await updateSetting.mutateAsync({ key, value: form[key], group });
      }
      toast.success('Settings saved');
    } catch { toast.error('Failed to save settings'); }
  };

  return (
    <div className="flex gap-6 min-h-[calc(100vh-6rem)]">
      {/* Sidebar */}
      <div className="w-56 shrink-0">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
        <nav className="space-y-1">
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all \${activeSection === s.id ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}\`}>
              <s.icon className="w-4 h-4" /> {s.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1">
        {isLoading ? <Skeleton className="h-60 w-full" /> : (
          <motion.div key={activeSection} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 max-w-2xl">

            {activeSection === 'business' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-4">Business Settings</h2>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input value={getValue('businessName', 'MyPOS Restaurant')} onChange={e => setValue('businessName', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                  <select value={getValue('businessType', 'RESTAURANT')} onChange={e => setValue('businessType', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm">
                    {['RESTAURANT', 'CAFE', 'RETAIL', 'GROCERY', 'SALON', 'PHARMACY', 'GENERAL'].map(t => <option key={t}>{t}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select value={getValue('currency', 'USD')} onChange={e => setValue('currency', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm">
                    {['USD', 'EUR', 'GBP', 'INR', 'AED', 'SAR'].map(c => <option key={c}>{c}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Default Tax Rate (%)</label>
                  <input type="number" step="0.1" value={getValue('taxRate', '8.5')} onChange={e => setValue('taxRate', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Tax Included in Price</span>
                  <button onClick={() => setValue('taxInclusive', getValue('taxInclusive') === 'true' ? 'false' : 'true')}
                    className={\`w-11 h-6 rounded-full transition-all \${getValue('taxInclusive') === 'true' ? 'bg-blue-600' : 'bg-gray-300'}\`}>
                    <div className={\`w-5 h-5 bg-white rounded-full shadow transform transition-all \${getValue('taxInclusive') === 'true' ? 'translate-x-5' : 'translate-x-0.5'}\`} />
                  </button>
                </div>
                <button onClick={() => saveSection(['businessName', 'businessType', 'currency', 'taxRate', 'taxInclusive'], 'business')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"><Save className="w-4 h-4" /> Save Changes</button>
              </div>
            )}

            {activeSection === 'printing' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-4">Printing Settings</h2>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Receipt Paper Size</label>
                  <select value={getValue('receiptPaperSize', '80mm')} onChange={e => setValue('receiptPaperSize', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm">
                    {['58mm', '80mm'].map(s => <option key={s}>{s}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Printer Type</label>
                  <select value={getValue('printerType', 'thermal')} onChange={e => setValue('printerType', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm">
                    {['thermal', 'inkjet', 'laser'].map(t => <option key={t}>{t}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Receipt Header</label>
                  <input value={getValue('receiptHeader')} onChange={e => setValue('receiptHeader', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Receipt Footer</label>
                  <input value={getValue('receiptFooter')} onChange={e => setValue('receiptFooter', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                <button onClick={() => saveSection(['receiptPaperSize', 'printerType', 'receiptHeader', 'receiptFooter'], 'printing')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"><Save className="w-4 h-4" /> Save Changes</button>
              </div>
            )}

            {activeSection === 'localization' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-4">Localization</h2>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select value={getValue('language', 'en')} onChange={e => setValue('language', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm">
                    {[['en', 'English'], ['es', 'Spanish'], ['fr', 'French'], ['ar', 'Arabic'], ['hi', 'Hindi']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <select value={getValue('timezone', 'America/New_York')} onChange={e => setValue('timezone', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm">
                    {['America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Europe/London', 'Asia/Dubai', 'Asia/Kolkata'].map(t => <option key={t}>{t}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                  <select value={getValue('dateFormat', 'MM/DD/YYYY')} onChange={e => setValue('dateFormat', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm">
                    {['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].map(f => <option key={f}>{f}</option>)}
                  </select></div>
                <button onClick={() => saveSection(['language', 'timezone', 'dateFormat'], 'localization')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"><Save className="w-4 h-4" /> Save Changes</button>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-4">Appearance</h2>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                  <select value={getValue('theme', 'light')} onChange={e => setValue('theme', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm">
                    {['light', 'dark', 'system'].map(t => <option key={t}>{t}</option>)}
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                  <input type="color" value={getValue('primaryColor', '#2563EB')} onChange={e => setValue('primaryColor', e.target.value)} className="w-full h-10 rounded-lg border cursor-pointer" /></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Compact Mode</span>
                  <button onClick={() => setValue('compactMode', getValue('compactMode') === 'true' ? 'false' : 'true')}
                    className={\`w-11 h-6 rounded-full transition-all \${getValue('compactMode') === 'true' ? 'bg-blue-600' : 'bg-gray-300'}\`}>
                    <div className={\`w-5 h-5 bg-white rounded-full shadow transform transition-all \${getValue('compactMode') === 'true' ? 'translate-x-5' : 'translate-x-0.5'}\`} />
                  </button>
                </div>
                <button onClick={() => saveSection(['theme', 'primaryColor', 'compactMode'], 'appearance')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"><Save className="w-4 h-4" /> Save Changes</button>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-4">Notifications</h2>
                {[['orderAlerts', 'New Order Alerts'], ['kitchenAlerts', 'Kitchen Ready Alerts'], ['lowStockAlerts', 'Low Stock Alerts'], ['soundEnabled', 'Sound Notifications']].map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <button onClick={() => setValue(key, getValue(key, 'true') === 'true' ? 'false' : 'true')}
                      className={\`w-11 h-6 rounded-full transition-all \${getValue(key, 'true') === 'true' ? 'bg-blue-600' : 'bg-gray-300'}\`}>
                      <div className={\`w-5 h-5 bg-white rounded-full shadow transform transition-all \${getValue(key, 'true') === 'true' ? 'translate-x-5' : 'translate-x-0.5'}\`} />
                    </button>
                  </div>
                ))}
                <button onClick={() => saveSection(['orderAlerts', 'kitchenAlerts', 'lowStockAlerts', 'soundEnabled'], 'notifications')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"><Save className="w-4 h-4" /> Save Changes</button>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-4">Security</h2>
                <div className="flex items-center justify-between py-2">
                  <div><p className="text-sm font-medium text-gray-700">Two-Factor Authentication</p><p className="text-xs text-gray-500">Add an extra layer of security</p></div>
                  <button onClick={() => setValue('twoFactorEnabled', getValue('twoFactorEnabled') === 'true' ? 'false' : 'true')}
                    className={\`w-11 h-6 rounded-full transition-all \${getValue('twoFactorEnabled') === 'true' ? 'bg-blue-600' : 'bg-gray-300'}\`}>
                    <div className={\`w-5 h-5 bg-white rounded-full shadow transform transition-all \${getValue('twoFactorEnabled') === 'true' ? 'translate-x-5' : 'translate-x-0.5'}\`} />
                  </button>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                  <input type="number" value={getValue('sessionTimeout', '60')} onChange={e => setValue('sessionTimeout', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
                  <input type="number" value={getValue('maxLoginAttempts', '5')} onChange={e => setValue('maxLoginAttempts', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                <button onClick={() => saveSection(['twoFactorEnabled', 'sessionTimeout', 'maxLoginAttempts'], 'security')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"><Save className="w-4 h-4" /> Save Changes</button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
`;

// ─── Write all files ────────────────────────────────────────────────────
Object.entries(files).forEach(([name, content]) => {
  const filePath = path.join(pagesDir, name);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Wrote:', name);
});

console.log('All pages written successfully!');
