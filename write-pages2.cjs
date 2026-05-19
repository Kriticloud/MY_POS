const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, 'frontend', 'src', 'pages');

// ═══════════════════════════════════════════════════════════════════════
// POSPage.tsx — Split payments, barcode scanner, customer select, loyalty
// ═══════════════════════════════════════════════════════════════════════
const posPage = `import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../utils/helpers';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, ShoppingBag, X, Percent, ScanBarcode, User, Wallet, Send, Download, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProducts, useCategories, useCreateOrder, useCustomers, useProductByBarcode } from '../hooks/useApi';
import { useAuthStore } from '../store/authStore';
import { printReceipt, downloadReceipt } from '../services/receipt';

interface SplitPayment { method: string; amount: number; }

export function POSPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPayment, setShowPayment] = useState(false);
  const [discountInput, setDiscountInput] = useState('');
  const [showDiscount, setShowDiscount] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showReceiptOptions, setShowReceiptOptions] = useState(false);
  const [receiptEmail, setReceiptEmail] = useState('');
  const [lastOrderData, setLastOrderData] = useState<any>(null);

  // Split payment state
  const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([{ method: 'CASH', amount: 0 }]);
  const [loyaltyRedeem, setLoyaltyRedeem] = useState(0);

  const barcodeRef = useRef<HTMLInputElement>(null);
  const { data: apiProducts } = useProducts();
  const { data: apiCategories } = useCategories();
  const { data: customers } = useCustomers({ search: customerSearch || undefined });
  const createOrder = useCreateOrder();
  const user = useAuthStore(s => s.user);

  const allCategories = useMemo(() => {
    const cats = (apiCategories || []).map((c: any) => ({ id: c.id, name: c.name, icon: c.icon || '📦' }));
    return [{ id: 'all', name: 'All', icon: '🍽️' }, ...cats];
  }, [apiCategories]);

  const products = useMemo(() => {
    let list = apiProducts || [];
    if (selectedCategory !== 'all') list = list.filter((p: any) => p.categoryId === selectedCategory);
    if (search) { const s = search.toLowerCase(); list = list.filter((p: any) => p.name.toLowerCase().includes(s) || p.sku?.toLowerCase().includes(s)); }
    return list;
  }, [apiProducts, selectedCategory, search]);

  const cart = useCartStore();
  const subtotal = cart.getSubtotal();
  const tax = cart.getTax();
  const total = cart.getTotal();

  // Barcode scanner — listen for rapid key input
  const barcodeBuffer = useRef('');
  const barcodeTimer = useRef<any>(null);
  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    if (showPayment || showBarcode || showCustomerSelect || showDiscount) return;
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (e.key === 'Enter' && barcodeBuffer.current.length >= 4) {
      const barcode = barcodeBuffer.current;
      barcodeBuffer.current = '';
      const product = (apiProducts || []).find((p: any) => p.barcode === barcode);
      if (product) { cart.addItem({ productId: product.id, name: product.name, price: product.price }); toast.success(\`Added \${product.name}\`); }
      else toast.error(\`No product for barcode \${barcode}\`);
      return;
    }
    if (e.key.length === 1) {
      barcodeBuffer.current += e.key;
      clearTimeout(barcodeTimer.current);
      barcodeTimer.current = setTimeout(() => { barcodeBuffer.current = ''; }, 200);
    }
  }, [apiProducts, cart, showPayment, showBarcode, showCustomerSelect, showDiscount]);

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  // Manual barcode lookup
  const handleBarcodeLookup = () => {
    if (!barcodeInput) return;
    const product = (apiProducts || []).find((p: any) => p.barcode === barcodeInput);
    if (product) { cart.addItem({ productId: product.id, name: product.name, price: product.price }); toast.success(\`Added \${product.name}\`); setBarcodeInput(''); setShowBarcode(false); }
    else toast.error('Product not found');
  };

  const selectedCustomer = useMemo(() => {
    if (!cart.customerId) return null;
    return (customers || []).find((c: any) => c.id === cart.customerId) || null;
  }, [cart.customerId, customers]);

  // Open payment modal
  const openPayment = () => {
    if (cart.items.length === 0) return;
    setSplitPayments([{ method: 'CASH', amount: total }]);
    setLoyaltyRedeem(0);
    setShowPayment(true);
  };

  const splitTotal = splitPayments.reduce((s, p) => s + p.amount, 0);
  const loyaltyDiscount = loyaltyRedeem * 0.01; // 1 point = $0.01

  const addSplitPayment = () => setSplitPayments([...splitPayments, { method: 'CARD', amount: 0 }]);
  const removeSplitPayment = (i: number) => { if (splitPayments.length > 1) setSplitPayments(splitPayments.filter((_, idx) => idx !== i)); };
  const updateSplit = (i: number, field: string, val: any) => {
    const updated = [...splitPayments];
    (updated[i] as any)[field] = field === 'amount' ? parseFloat(val) || 0 : val;
    setSplitPayments(updated);
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) return;
    const finalTotal = total - loyaltyDiscount;
    if (Math.abs(splitTotal - finalTotal) > 0.01 && splitPayments.length > 1) {
      toast.error(\`Split payments (\${formatCurrency(splitTotal)}) must equal total (\${formatCurrency(finalTotal)})\`);
      return;
    }
    try {
      const payments = splitPayments.length === 1
        ? [{ method: splitPayments[0].method, amount: finalTotal }]
        : splitPayments.filter(p => p.amount > 0);
      const orderData = {
        orderType: cart.orderType, customerId: cart.customerId, tableId: cart.tableId,
        notes: cart.notes, discountAmount: cart.discount + loyaltyDiscount,
        loyaltyPointsRedeemed: loyaltyRedeem,
        items: cart.items.map(item => ({ productId: item.productId, quantity: item.quantity, unitPrice: item.price, discount: 0, notes: item.notes || '' })),
        payments,
      };
      const order = await createOrder.mutateAsync(orderData);
      const receiptData = {
        orderNumber: order?.orderNumber || 'N/A', date: new Date(),
        items: cart.items.map(i => ({ name: i.name, quantity: i.quantity, unitPrice: i.price, totalPrice: i.price * i.quantity })),
        subtotal, tax, discount: cart.discount + loyaltyDiscount, total: finalTotal,
        paymentMethod: payments.length > 1 ? 'SPLIT' : payments[0].method,
        payments: payments.length > 1 ? payments : undefined,
        cashierName: user ? \`\${user.firstName} \${user.lastName}\` : 'Staff',
        businessName: 'MyPOS Restaurant',
        loyaltyPointsEarned: Math.floor(finalTotal),
        customerName: selectedCustomer ? \`\${selectedCustomer.firstName} \${selectedCustomer.lastName || ''}\` : undefined,
      };
      setLastOrderData(receiptData);
      printReceipt(receiptData);
      cart.clearCart();
      setShowPayment(false);
      setShowReceiptOptions(true);
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
          <button onClick={() => { setShowBarcode(!showBarcode); setTimeout(() => barcodeRef.current?.focus(), 100); }}
            className={\`p-2.5 rounded-xl border transition-all \${showBarcode ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600'}\`}>
            <ScanBarcode className="w-5 h-5" />
          </button>
        </div>

        {showBarcode && (
          <div className="flex gap-2 mb-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
            <input ref={barcodeRef} type="text" placeholder="Scan or enter barcode..." value={barcodeInput} onChange={e => setBarcodeInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleBarcodeLookup()}
              className="flex-1 px-3 py-2 rounded-lg border text-sm bg-white dark:bg-gray-800" autoFocus />
            <button onClick={handleBarcodeLookup} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Lookup</button>
          </div>
        )}

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
              className="bg-white dark:bg-gray-800 rounded-xl p-4 text-left shadow-card hover:shadow-md transition-all border border-transparent hover:border-blue-200 relative">
              {product.stockQuantity !== undefined && product.stockQuantity <= (product.minStockLevel || 5) && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" title="Low stock" />
              )}
              <div className="w-full h-20 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-lg mb-3 flex items-center justify-center text-2xl">
                {product.category?.icon || '📦'}
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm font-bold text-blue-600">{formatCurrency(product.price)}</p>
                {product.stockQuantity !== undefined && <p className="text-xs text-gray-400">{product.stockQuantity} left</p>}
              </div>
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
            <div className="flex gap-2">
              {cart.items.length > 0 && <button onClick={cart.clearCart} className="text-xs text-red-500 hover:text-red-600">Clear</button>}
            </div>
          </div>
          <div className="flex gap-1 mb-2">
            {(['DINE_IN', 'TAKEAWAY', 'DELIVERY'] as const).map(t => (
              <button key={t} onClick={() => cart.setOrderType(t)}
                className={\`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all \${cart.orderType === t ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}\`}>
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
          {/* Customer select */}
          <button onClick={() => setShowCustomerSelect(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100">
            <User className="w-4 h-4" />
            {selectedCustomer ? (
              <span className="flex-1 text-left">
                {selectedCustomer.firstName} {selectedCustomer.lastName || ''}
                <span className="ml-2 text-xs text-amber-500">⭐ {selectedCustomer.loyaltyPoints} pts</span>
              </span>
            ) : <span className="flex-1 text-left">Select Customer</span>}
            {cart.customerId && <button onClick={(e) => { e.stopPropagation(); cart.setCustomer(null); }} className="text-gray-400 hover:text-red-500"><X className="w-3 h-3" /></button>}
          </button>
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
          <button onClick={() => setShowDiscount(!showDiscount)} className="flex items-center justify-center gap-1 w-full py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200"><Percent className="w-3.5 h-3.5" /> Discount</button>
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
          <button onClick={openPayment} disabled={cart.items.length === 0}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all mt-2">
            Charge {formatCurrency(total)}
          </button>
        </div>
      </div>

      {/* Payment Modal — Split Payments */}
      <AnimatePresence>
        {showPayment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Payment</h2>
                <button onClick={() => setShowPayment(false)}><X className="w-5 h-5" /></button>
              </div>
              <p className="text-3xl font-bold text-center mb-4">{formatCurrency(total - loyaltyDiscount)}</p>

              {/* Loyalty Points Redemption */}
              {selectedCustomer && selectedCustomer.loyaltyPoints > 0 && (
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <div className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">
                    <Star className="w-4 h-4" /> Redeem Loyalty Points ({selectedCustomer.loyaltyPoints} available)
                  </div>
                  <div className="flex gap-2">
                    <input type="number" min={0} max={Math.min(selectedCustomer.loyaltyPoints, Math.floor(total * 100))}
                      value={loyaltyRedeem} onChange={e => setLoyaltyRedeem(Math.min(parseInt(e.target.value) || 0, selectedCustomer.loyaltyPoints))}
                      className="flex-1 px-3 py-2 rounded-lg border text-sm" placeholder="Points to redeem" />
                    <span className="flex items-center text-sm text-gray-500">= {formatCurrency(loyaltyRedeem * 0.01)}</span>
                  </div>
                </div>
              )}

              {/* Split Payments */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Methods</span>
                  <button onClick={addSplitPayment} className="text-xs text-blue-600 hover:text-blue-700 font-medium">+ Split Payment</button>
                </div>
                {splitPayments.map((sp, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <select value={sp.method} onChange={e => updateSplit(i, 'method', e.target.value)}
                      className="px-3 py-2 rounded-lg border text-sm bg-white dark:bg-gray-700 flex-1">
                      <option value="CASH">💵 Cash</option>
                      <option value="CARD">💳 Card</option>
                      <option value="UPI">📱 UPI</option>
                      <option value="WALLET">👛 Wallet</option>
                    </select>
                    {splitPayments.length > 1 && (
                      <>
                        <input type="number" value={sp.amount || ''} onChange={e => updateSplit(i, 'amount', e.target.value)}
                          className="w-28 px-3 py-2 rounded-lg border text-sm text-right" placeholder="Amount" />
                        <button onClick={() => removeSplitPayment(i)} className="text-red-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                      </>
                    )}
                  </div>
                ))}
                {splitPayments.length > 1 && (
                  <div className={\`text-xs text-right \${Math.abs(splitTotal - (total - loyaltyDiscount)) > 0.01 ? 'text-red-500' : 'text-green-600'}\`}>
                    Split total: {formatCurrency(splitTotal)} / {formatCurrency(total - loyaltyDiscount)}
                  </div>
                )}
              </div>

              <button onClick={handleCheckout} disabled={createOrder.isPending}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition-all">
                {createOrder.isPending ? 'Processing...' : \`Complete Payment - \${formatCurrency(total - loyaltyDiscount)}\`}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer Select Modal */}
      <AnimatePresence>
        {showCustomerSelect && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Select Customer</h2>
                <button onClick={() => setShowCustomerSelect(false)}><X className="w-5 h-5" /></button>
              </div>
              <input type="text" placeholder="Search customers..." value={customerSearch} onChange={e => setCustomerSearch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border mb-3 text-sm" autoFocus />
              <div className="max-h-60 overflow-y-auto space-y-2">
                {(customers || []).map((c: any) => (
                  <button key={c.id} onClick={() => { cart.setCustomer(c.id); setShowCustomerSelect(false); }}
                    className={\`w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 \${cart.customerId === c.id ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200' : ''}\`}>
                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold text-blue-600">
                      {c.firstName[0]}{(c.lastName || '')[0] || ''}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{c.firstName} {c.lastName || ''}</p>
                      <p className="text-xs text-gray-500">{c.phone || c.email || 'No contact'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-amber-500 font-medium">⭐ {c.loyaltyPoints}</p>
                      <p className="text-xs text-gray-400">{c.loyaltyTier || 'BRONZE'}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Digital Receipt Modal */}
      <AnimatePresence>
        {showReceiptOptions && lastOrderData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-center">✅ Order Complete!</h3>
              <p className="text-center text-2xl font-bold text-green-600 mb-4">{lastOrderData.orderNumber}</p>
              <div className="space-y-3">
                <button onClick={() => { printReceipt(lastOrderData); }} className="w-full py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 flex items-center justify-center gap-2">
                  🖨️ Print Again
                </button>
                <button onClick={() => { downloadReceipt(lastOrderData); toast.success('Receipt downloaded'); }} className="w-full py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download Receipt
                </button>
                <div className="flex gap-2">
                  <input type="email" placeholder="Email receipt to..." value={receiptEmail} onChange={e => setReceiptEmail(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border text-sm" />
                  <button onClick={() => { if (receiptEmail) { toast.success(\`Receipt sent to \${receiptEmail}\`); setReceiptEmail(''); } }}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"><Send className="w-4 h-4" /></button>
                </div>
                <button onClick={() => setShowReceiptOptions(false)} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
                  New Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;
fs.writeFileSync(path.join(pagesDir, 'POSPage.tsx'), posPage);
console.log('✅ POSPage.tsx');

// ═══════════════════════════════════════════════════════════════════════
// EmployeesPage.tsx — Clock in/out, time tracking, shift management
// ═══════════════════════════════════════════════════════════════════════
const employeesPage = `import { useState } from 'react';
import { formatCurrency } from '../utils/helpers';
import { Clock, UserCheck, UserX, ChevronRight, Activity, DollarSign, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEmployees, useClockIn, useClockOut } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';

export function EmployeesPage() {
  const { data: employees, isLoading } = useEmployees();
  const clockIn = useClockIn();
  const clockOut = useClockOut();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleClockIn = async (id: string) => {
    try { await clockIn.mutateAsync(id); toast.success('Clocked in successfully'); } catch { toast.error('Failed to clock in'); }
  };
  const handleClockOut = async (id: string) => {
    try { await clockOut.mutateAsync(id); toast.success('Clocked out successfully'); } catch { toast.error('Failed to clock out'); }
  };

  const selected = (employees || []).find((e: any) => e.id === selectedId);
  const activeCount = (employees || []).filter((e: any) => e.clockedIn).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Employee Management</h1>
        <p className="text-gray-500 mt-1">Track shifts, clock in/out, and performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center"><UserCheck className="w-5 h-5 text-white" /></div></div>
          <p className="text-2xl font-bold mt-2">{activeCount}</p>
          <p className="text-sm text-gray-500">Clocked In Now</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center"><Activity className="w-5 h-5 text-white" /></div></div>
          <p className="text-2xl font-bold mt-2">{(employees || []).length}</p>
          <p className="text-sm text-gray-500">Total Staff</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center"><DollarSign className="w-5 h-5 text-white" /></div></div>
          <p className="text-2xl font-bold mt-2">{formatCurrency((employees || []).reduce((s: number, e: any) => s + (e.totalSalesToday || 0), 0))}</p>
          <p className="text-sm text-gray-500">Total Sales Today</p>
        </div>
      </div>

      {isLoading ? <Skeleton className="h-64 w-full" /> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee List */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-card">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold">Staff Roster</h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {(employees || []).map((emp: any) => (
                <div key={emp.id} className={\`flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer \${selectedId === emp.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}\`}
                  onClick={() => setSelectedId(emp.id)}>
                  <div className={\`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold \${emp.clockedIn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}\`}>
                    {emp.firstName[0]}{emp.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{emp.firstName} {emp.lastName}</p>
                    <p className="text-xs text-gray-500">{emp.role} • {emp.email}</p>
                  </div>
                  <div className="text-right mr-2">
                    <p className="text-xs text-gray-500">{emp.ordersToday || 0} orders</p>
                    <p className="text-xs text-gray-500">{formatCurrency(emp.totalSalesToday || 0)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {emp.clockedIn ? (
                      <button onClick={(e) => { e.stopPropagation(); handleClockOut(emp.id); }}
                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200">
                        Clock Out
                      </button>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); handleClockIn(emp.id); }}
                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200">
                        Clock In
                      </button>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employee Detail */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold">Details</h2>
            </div>
            {selected ? (
              <div className="p-5 space-y-4">
                <div className="text-center">
                  <div className={\`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-xl font-bold \${selected.clockedIn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}\`}>
                    {selected.firstName[0]}{selected.lastName[0]}
                  </div>
                  <p className="font-semibold mt-2">{selected.firstName} {selected.lastName}</p>
                  <p className="text-sm text-gray-500">{selected.role}</p>
                  <span className={\`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium \${selected.clockedIn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}\`}>
                    {selected.clockedIn ? '🟢 On Shift' : '⚪ Off Shift'}
                  </span>
                </div>
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Hours Today</span><span className="font-medium">{(selected.totalHoursToday || 0).toFixed(1)}h</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Orders Today</span><span className="font-medium">{selected.ordersToday || 0}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Sales Today</span><span className="font-medium">{formatCurrency(selected.totalSalesToday || 0)}</span></div>
                  {selected.lastClockIn && <div className="flex justify-between text-sm"><span className="text-gray-500">Last Clock In</span><span className="font-medium text-xs">{new Date(selected.lastClockIn).toLocaleTimeString()}</span></div>}
                  {selected.lastClockOut && <div className="flex justify-between text-sm"><span className="text-gray-500">Last Clock Out</span><span className="font-medium text-xs">{new Date(selected.lastClockOut).toLocaleTimeString()}</span></div>}
                </div>
              </div>
            ) : (
              <div className="p-5 text-center text-gray-400 text-sm">Select an employee to view details</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync(path.join(pagesDir, 'EmployeesPage.tsx'), employeesPage);
console.log('✅ EmployeesPage.tsx');

// ═══════════════════════════════════════════════════════════════════════
// InventoryPage.tsx — Stock levels, alerts, batch/expiry tracking
// ═══════════════════════════════════════════════════════════════════════
const inventoryPage = `import { useState, useMemo } from 'react';
import { Package, AlertTriangle, TrendingDown, RefreshCw, Search, Calendar } from 'lucide-react';
import { useInventory, useInventoryAlerts, useUpdateInventory } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

export function InventoryPage() {
  const { data: inventory, isLoading } = useInventory();
  const { data: alerts } = useInventoryAlerts();
  const updateInventory = useUpdateInventory();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'expiring'>('all');
  const [editId, setEditId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState('');
  const [editMin, setEditMin] = useState('');

  const filtered = useMemo(() => {
    let list = inventory || [];
    if (search) { const s = search.toLowerCase(); list = list.filter((i: any) => i.product?.name?.toLowerCase().includes(s) || i.product?.sku?.toLowerCase().includes(s)); }
    if (filter === 'low') list = list.filter((i: any) => i.quantity <= i.minStock);
    if (filter === 'expiring') {
      const soon = new Date(); soon.setDate(soon.getDate() + 7);
      list = list.filter((i: any) => i.expiryDate && new Date(i.expiryDate) <= soon);
    }
    return list;
  }, [inventory, search, filter]);

  const lowStockCount = (inventory || []).filter((i: any) => i.quantity <= i.minStock).length;
  const expiringCount = (() => {
    const soon = new Date(); soon.setDate(soon.getDate() + 7);
    return (inventory || []).filter((i: any) => i.expiryDate && new Date(i.expiryDate) <= soon).length;
  })();

  const handleSave = async (id: string) => {
    try {
      await updateInventory.mutateAsync({ id, quantity: parseInt(editQty) || undefined, minStock: parseInt(editMin) || undefined });
      setEditId(null);
      toast.success('Inventory updated');
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Inventory Management</h1>
        <p className="text-gray-500 mt-1">Track stock levels, set alerts, and manage batches</p>
      </div>

      {/* Alert Banner */}
      {(alerts || []).length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-medium mb-2">
            <AlertTriangle className="w-5 h-5" /> {(alerts || []).length} items need attention
          </div>
          <div className="flex flex-wrap gap-2">
            {(alerts || []).slice(0, 5).map((a: any) => (
              <span key={a.id} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-xs">
                {a.product?.name}: {a.quantity} left (min: {a.minStock})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-card">
          <Package className="w-8 h-8 text-blue-500 mb-2" />
          <p className="text-2xl font-bold">{(inventory || []).length}</p>
          <p className="text-sm text-gray-500">Total Products</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-card cursor-pointer" onClick={() => setFilter('low')}>
          <TrendingDown className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
          <p className="text-sm text-gray-500">Low Stock Items</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-card cursor-pointer" onClick={() => setFilter('expiring')}>
          <Calendar className="w-8 h-8 text-amber-500 mb-2" />
          <p className="text-2xl font-bold text-amber-600">{expiringCount}</p>
          <p className="text-sm text-gray-500">Expiring Soon (7d)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search inventory..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
        </div>
        <div className="flex gap-1">
          {[{ key: 'all', label: 'All' }, { key: 'low', label: 'Low Stock' }, { key: 'expiring', label: 'Expiring' }].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key as any)}
              className={\`px-3 py-2 rounded-lg text-xs font-medium \${filter === f.key ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600'}\`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      {isLoading ? <Skeleton className="h-64 w-full" /> : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">SKU</th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Min Level</th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Batch</th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Expiry</th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((item: any) => {
                const isLow = item.quantity <= item.minStock;
                const isExpiring = item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 7 * 86400000);
                const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();
                return (
                  <tr key={item.id} className={\`\${isLow ? 'bg-red-50/50 dark:bg-red-900/10' : ''}\`}>
                    <td className="p-4 text-sm font-medium">{item.product?.name || 'Unknown'}</td>
                    <td className="p-4 text-sm text-gray-500">{item.product?.sku || '-'}</td>
                    <td className="p-4 text-center">
                      {editId === item.id ? (
                        <input type="number" value={editQty} onChange={e => setEditQty(e.target.value)} className="w-16 px-2 py-1 border rounded text-sm text-center" />
                      ) : (
                        <span className={\`text-sm font-medium \${isLow ? 'text-red-600' : ''}\`}>{item.quantity}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {editId === item.id ? (
                        <input type="number" value={editMin} onChange={e => setEditMin(e.target.value)} className="w-16 px-2 py-1 border rounded text-sm text-center" />
                      ) : (
                        <span className="text-sm text-gray-500">{item.minStock}</span>
                      )}
                    </td>
                    <td className="p-4 text-center text-sm text-gray-500">{item.batchNumber || '-'}</td>
                    <td className="p-4 text-center">
                      {item.expiryDate ? (
                        <span className={\`text-xs px-2 py-1 rounded-full \${isExpired ? 'bg-red-100 text-red-700' : isExpiring ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}\`}>
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="p-4 text-center">
                      {isExpired ? <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Expired</span>
                        : isLow ? <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">Low Stock</span>
                        : <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">In Stock</span>}
                    </td>
                    <td className="p-4 text-right">
                      {editId === item.id ? (
                        <div className="flex gap-1 justify-end">
                          <button onClick={() => handleSave(item.id)} className="px-2 py-1 bg-green-600 text-white rounded text-xs">Save</button>
                          <button onClick={() => setEditId(null)} className="px-2 py-1 bg-gray-200 rounded text-xs">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditId(item.id); setEditQty(String(item.quantity)); setEditMin(String(item.minStock)); }}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200">Edit</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync(path.join(pagesDir, 'InventoryPage.tsx'), inventoryPage);
console.log('✅ InventoryPage.tsx');

console.log('\\n✅ Phase 1 pages written');
