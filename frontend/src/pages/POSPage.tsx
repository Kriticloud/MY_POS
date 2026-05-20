import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../utils/helpers';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, ShoppingBag, X, Percent, ScanBarcode, User, Wallet, Star, Printer, Receipt, CheckCircle2, PauseCircle, PlayCircle, MessageSquare, Heart, Zap, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProducts, useCategories, useCreateOrder, useCustomers, useProductByBarcode } from '../hooks/useApi';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore, getBusinessConfig, getEntityLabels } from '../store/settingsStore';
import { printReceipt } from '../services/receipt';
import { useBarcodeScanner } from '../hooks/useBarcodeScanner';
import { openCustomerDisplay } from '../services/customerDisplay';

interface SplitPayment { method: string; amount: number; }
interface HeldOrder { id: string; items: any[]; customerId: string | null; orderType: string; discount: number; notes: string; heldAt: Date; label: string; }

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
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [lastOrderData, setLastOrderData] = useState<any>(null);
  const [showCardEntry, setShowCardEntry] = useState(false);
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [cardProcessing, setCardProcessing] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);
  const [showHeldOrders, setShowHeldOrders] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('pos-favorites') || '[]'); } catch { return []; }
  });

  // Split payment state
  const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([{ method: 'CASH', amount: 0 }]);
  const [loyaltyRedeem, setLoyaltyRedeem] = useState(0);

  const barcodeRef = useRef<HTMLInputElement>(null);
  const businessType = useSettingsStore((s) => s.businessType);
  const { data: apiProducts } = useProducts({ businessType });
  const { data: apiCategories } = useCategories({ businessType });
  const { data: customers } = useCustomers({ search: customerSearch || undefined });
  const orderTypes = getBusinessConfig(businessType).orderTypes;
  const createOrder = useCreateOrder();
  const user = useAuthStore(s => s.user);

  const config = getBusinessConfig(businessType);
  const labels = getEntityLabels(businessType);
  const isSalon = businessType === 'SALON';

  const allCategories = useMemo(() => {
    const cats = (apiCategories || []).map((c: any) => ({ id: c.id, name: c.name, icon: c.icon || '📦' }));
    return [{ id: 'all', name: 'All', icon: config.icon || '🍽️' }, ...cats];
  }, [apiCategories, config.icon]);

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

  // Sync cart orderType with current business config
  useEffect(() => {
    if (!orderTypes.includes(cart.orderType)) {
      cart.setOrderType(orderTypes[0] || 'DINE_IN');
    }
  }, [businessType, orderTypes]);

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
      if (product) { cart.addItem({ productId: product.id, name: product.name, price: product.price }); toast.success(`Added ${product.name}`); }
      else toast.error(`No product for barcode ${barcode}`);
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
    if (product) { cart.addItem({ productId: product.id, name: product.name, price: product.price }); toast.success(`Added ${product.name}`); setBarcodeInput(''); setShowBarcode(false); }
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
      toast.error(`Split payments (${formatCurrency(splitTotal)}) must equal total (${formatCurrency(finalTotal)})`);
      return;
    }
    const hasCard = splitPayments.some(p => p.method === 'CARD');
    if (hasCard && !showCardEntry) { setShowCardEntry(true); return; }
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
        cashierName: user ? `${user.firstName} ${user.lastName}` : 'Staff',
        businessName: useSettingsStore.getState().businessName || 'MyPOS',
        loyaltyPointsEarned: Math.floor(finalTotal),
        customerName: selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName || ''}` : undefined,
      };
      setLastOrderData(receiptData);
      cart.clearCart();
      setShowPayment(false);
      setShowReceiptPreview(true);
    } catch { toast.error('Failed to place order'); }
  };

  const applyDiscount = () => {
    const val = parseFloat(discountInput);
    if (!isNaN(val) && val >= 0) { cart.setDiscount(val); setShowDiscount(false); setDiscountInput(''); toast.success(`Discount of ${formatCurrency(val)} applied`); }
  };

  const processCardPayment = async () => {
    if (!cardForm.number || !cardForm.expiry || !cardForm.cvv) { toast.error('Fill all card fields'); return; }
    setCardProcessing(true);
    // Simulate payment gateway processing
    await new Promise(r => setTimeout(r, 2000));
    setCardProcessing(false);
    setShowCardEntry(false);
    toast.success('Card payment authorized');
    handleCheckout();
  };

  // Hold/Park order
  const holdOrder = () => {
    if (cart.items.length === 0) return;
    const held: HeldOrder = {
      id: crypto.randomUUID(),
      items: [...cart.items],
      customerId: cart.customerId,
      orderType: cart.orderType,
      discount: cart.discount,
      notes: cart.notes,
      heldAt: new Date(),
      label: selectedCustomer ? `${selectedCustomer.firstName}'s order` : `Order (${cart.items.length} items)`,
    };
    setHeldOrders(prev => [...prev, held]);
    cart.clearCart();
    toast.success('Order held — you can recall it anytime');
  };

  const recallOrder = (held: HeldOrder) => {
    if (cart.items.length > 0) {
      // Park current cart first
      holdOrder();
    }
    held.items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        cart.addItem({ productId: item.productId, name: item.name, price: item.price });
      }
    });
    if (held.customerId) cart.setCustomer(held.customerId);
    cart.setOrderType(held.orderType);
    cart.setDiscount(held.discount);
    cart.setOrderNotes(held.notes);
    setHeldOrders(prev => prev.filter(h => h.id !== held.id));
    setShowHeldOrders(false);
    toast.success('Order recalled');
  };

  // Favorites
  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const updated = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId];
      localStorage.setItem('pos-favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const favoriteProducts = useMemo(() => {
    return (apiProducts || []).filter((p: any) => favorites.includes(p.id));
  }, [apiProducts, favorites]);

  // Item note save
  const saveItemNote = (itemId: string) => {
    cart.updateNotes(itemId, noteInput);
    setEditingNoteId(null);
    setNoteInput('');
    toast.success('Note added');
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] gap-4">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder={`Search ${labels.products.toLowerCase()}...`} value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
          </div>
          <button onClick={() => { setShowBarcode(!showBarcode); setTimeout(() => barcodeRef.current?.focus(), 100); }}
            className={`p-2.5 rounded-xl border transition-all ${showBarcode ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600'}`}>
            <ScanBarcode className="w-5 h-5" />
          </button>
          <button onClick={openCustomerDisplay} title="Customer Display"
            className="p-2.5 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
            <Monitor className="w-5 h-5" />
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
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50'}`}>
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* Favorites Quick Access */}
        {favoriteProducts.length > 0 && selectedCategory === 'all' && !search && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick Add</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {favoriteProducts.map((product: any) => (
                <motion.button key={product.id} whileTap={{ scale: 0.95 }}
                  onClick={() => { cart.addItem({ productId: product.id, name: product.name, price: product.price }); toast.success(`Added ${product.name}`, { duration: 1500 }); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm whitespace-nowrap hover:bg-amber-100 transition-all">
                  <span className="text-xs">{product.category?.icon || '⭐'}</span>
                  <span className="font-medium text-amber-800 dark:text-amber-200">{product.name}</span>
                  <span className="text-xs text-amber-600">{formatCurrency(product.price)}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3 content-start">
          {products.map((product: any) => (
            <motion.button key={product.id} whileTap={{ scale: 0.97 }}
              onClick={() => cart.addItem({ productId: product.id, name: product.name, price: product.price })}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 text-left shadow-card hover:shadow-md transition-all border border-transparent hover:border-blue-200 relative group">
              {product.stockQuantity !== undefined && product.stockQuantity <= (product.minStockLevel || 5) && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" title="Low stock" />
              )}
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                className={`absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all ${
                  favorites.includes(product.id) ? 'opacity-100 text-red-500 bg-red-50' : 'text-gray-300 hover:text-red-400 bg-white/80'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
              </button>
              <div className="w-full h-20 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-lg mb-3 flex items-center justify-center text-2xl overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  product.category?.icon || '📦'
                )}
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm font-bold text-blue-600">{formatCurrency(product.price)}</p>
                {product.duration ? (
                  <p className="text-xs text-gray-400">{product.duration} min</p>
                ) : product.stockQuantity !== undefined ? (
                  <p className="text-xs text-gray-400">{product.stockQuantity} left</p>
                ) : null}
              </div>
            </motion.button>
          ))}
          {products.length === 0 && <div className="col-span-full text-center py-12 text-gray-400">No {labels.products.toLowerCase()} found</div>}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full lg:w-80 xl:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-card flex flex-col max-h-[50vh] lg:max-h-full">
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
            {orderTypes.map(t => (
              <button key={t} onClick={() => cart.setOrderType(t as any)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${cart.orderType === t ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
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
                className="flex flex-col gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatCurrency(item.price)} each</p>
                    {item.notes && !editingNoteId && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 italic">📝 {item.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => cart.updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-md bg-white dark:bg-gray-600 flex items-center justify-center shadow-sm"><Minus className="w-3 h-3" /></button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button onClick={() => cart.updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-md bg-white dark:bg-gray-600 flex items-center justify-center shadow-sm"><Plus className="w-3 h-3" /></button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <button onClick={() => { setEditingNoteId(editingNoteId === item.id ? null : item.id); setNoteInput(item.notes || ''); }}
                        className={`p-0.5 rounded ${editingNoteId === item.id ? 'text-blue-500' : 'text-gray-400 hover:text-blue-400'}`}><MessageSquare className="w-3.5 h-3.5" /></button>
                      <button onClick={() => cart.removeItem(item.id)} className="text-red-400 hover:text-red-500 p-0.5"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
                {/* Inline note editor */}
                {editingNoteId === item.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex gap-2">
                    <input type="text" value={noteInput} onChange={e => setNoteInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveItemNote(item.id)}
                      placeholder="Add note (e.g. no onions)..." autoFocus
                      className="flex-1 px-2 py-1.5 rounded-md border text-xs bg-white dark:bg-gray-600" />
                    <button onClick={() => saveItemNote(item.id)} className="px-2 py-1.5 bg-blue-600 text-white rounded-md text-xs">Save</button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {cart.items.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">Cart is empty</div>}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
          <div className="flex gap-2">
            <button onClick={() => setShowDiscount(!showDiscount)} className="flex items-center justify-center gap-1 flex-1 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200"><Percent className="w-3.5 h-3.5" /> Discount</button>
            <button onClick={holdOrder} disabled={cart.items.length === 0}
              className="flex items-center justify-center gap-1 flex-1 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-sm text-amber-700 dark:text-amber-300 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed">
              <PauseCircle className="w-3.5 h-3.5" /> Hold
            </button>
            {heldOrders.length > 0 && (
              <button onClick={() => setShowHeldOrders(!showHeldOrders)}
                className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-sm text-green-700 dark:text-green-300 hover:bg-green-100 relative">
                <PlayCircle className="w-3.5 h-3.5" /> Recall
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 text-white text-[10px] rounded-full flex items-center justify-center">{heldOrders.length}</span>
              </button>
            )}
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
          <button onClick={openPayment} disabled={cart.items.length === 0}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all mt-2">
            Charge {formatCurrency(total)}
          </button>
        </div>
      </div>

      {/* Held Orders Modal */}
      <AnimatePresence>
        {showHeldOrders && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2"><PauseCircle className="w-5 h-5 text-amber-500" /> Held Orders ({heldOrders.length})</h2>
                <button onClick={() => setShowHeldOrders(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {heldOrders.map(held => (
                  <div key={held.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{held.label}</p>
                      <p className="text-xs text-gray-500">{held.items.length} items • {new Date(held.heldAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <button onClick={() => recallOrder(held)}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                      Recall
                    </button>
                    <button onClick={() => setHeldOrders(prev => prev.filter(h => h.id !== held.id))}
                      className="p-1.5 text-red-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {heldOrders.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">No held orders</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <div className={`text-xs text-right ${Math.abs(splitTotal - (total - loyaltyDiscount)) > 0.01 ? 'text-red-500' : 'text-green-600'}`}>
                    Split total: {formatCurrency(splitTotal)} / {formatCurrency(total - loyaltyDiscount)}
                  </div>
                )}
              </div>

              <button onClick={handleCheckout} disabled={createOrder.isPending}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition-all">
                {createOrder.isPending ? 'Processing...' : `Complete Payment - ${formatCurrency(total - loyaltyDiscount)}`}
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
                    className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 ${cart.customerId === c.id ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200' : ''}`}>
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

      {/* Receipt Preview Modal */}
      <AnimatePresence>
        {showReceiptPreview && lastOrderData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 flex flex-col max-h-[92vh] overflow-hidden">
              {/* Success Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-5 text-center text-white">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
                </motion.div>
                <h3 className="text-lg font-bold">Payment Successful!</h3>
                <p className="text-green-100 text-sm mt-1">Order has been placed</p>
              </div>

              {/* Receipt Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* Receipt Card */}
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-5 bg-gray-50/50 dark:bg-gray-900/30">
                  {/* Business Header */}
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Receipt className="w-5 h-5 text-gray-400" />
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">{lastOrderData.businessName}</h4>
                    </div>
                    <p className="text-xs text-gray-400 font-mono">{lastOrderData.orderNumber}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(lastOrderData.date).toLocaleString()}</p>
                  </div>

                  <div className="border-t border-dashed border-gray-300 dark:border-gray-600 my-3" />

                  {/* Items */}
                  <div className="space-y-2">
                    {lastOrderData.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <div className="flex-1 min-w-0">
                          <span className="text-gray-800 dark:text-gray-200">{item.name}</span>
                          <span className="text-gray-400 ml-1">×{item.quantity}</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white ml-3">{formatCurrency(item.totalPrice)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-dashed border-gray-300 dark:border-gray-600 my-3" />

                  {/* Totals */}
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatCurrency(lastOrderData.subtotal)}</span></div>
                    <div className="flex justify-between text-gray-500"><span>Tax</span><span>{formatCurrency(lastOrderData.tax)}</span></div>
                    {lastOrderData.discount > 0 && (
                      <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(lastOrderData.discount)}</span></div>
                    )}
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                      <span>Total</span><span>{formatCurrency(lastOrderData.total)}</span>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-gray-300 dark:border-gray-600 my-3" />

                  {/* Payment & Cashier Info */}
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Payment: {lastOrderData.paymentMethod?.replace('_', ' ')}</span>
                    <span>Cashier: {lastOrderData.cashierName}</span>
                  </div>
                  {lastOrderData.customerName && (
                    <p className="text-xs text-gray-400 mt-1">Customer: {lastOrderData.customerName}</p>
                  )}

                  {/* Footer */}
                  <p className="text-center text-xs text-gray-400 mt-4">Thank you for your visit! 🙏</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-5 pt-2 flex gap-3">
                <button onClick={() => { setShowReceiptPreview(false); setLastOrderData(null); }}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-all text-sm">
                  Skip
                </button>
                <button onClick={() => { printReceipt(lastOrderData); setShowReceiptPreview(false); setLastOrderData(null); }}
                  className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2">
                  <Printer className="w-4 h-4" /> Print Receipt
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Payment Modal */}
      <AnimatePresence>
        {showCardEntry && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2"><CreditCard className="w-5 h-5 text-blue-600" /> Card Payment</h2>
                <button onClick={() => setShowCardEntry(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-4 mb-4 text-white">
                <p className="text-xs opacity-70">Amount to charge</p>
                <p className="text-2xl font-bold">{formatCurrency(total - loyaltyDiscount)}</p>
                <p className="text-xs mt-2 font-mono tracking-wider">{cardForm.number || '•••• •••• •••• ••••'}</p>
              </div>
              <div className="space-y-3">
                <input placeholder="Card Number" maxLength={19} value={cardForm.number}
                  onChange={e => setCardForm({ ...cardForm, number: e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim() })}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm font-mono dark:bg-gray-700 dark:border-gray-600" />
                <div className="flex gap-3">
                  <input placeholder="MM/YY" maxLength={5} value={cardForm.expiry}
                    onChange={e => { let v = e.target.value.replace(/\D/g, ''); if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2); setCardForm({ ...cardForm, expiry: v }); }}
                    className="flex-1 px-3 py-2.5 rounded-lg border text-sm font-mono dark:bg-gray-700 dark:border-gray-600" />
                  <input placeholder="CVV" maxLength={4} type="password" value={cardForm.cvv}
                    onChange={e => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '') })}
                    className="w-24 px-3 py-2.5 rounded-lg border text-sm font-mono dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <input placeholder="Cardholder Name" value={cardForm.name}
                  onChange={e => setCardForm({ ...cardForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
                <button onClick={processCardPayment} disabled={cardProcessing}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {cardProcessing ? (
                    <><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Processing...</>
                  ) : (
                    <><CreditCard className="w-4 h-4" /> Pay {formatCurrency(total - loyaltyDiscount)}</>
                  )}
                </button>
                <p className="text-xs text-center text-gray-400">🔒 Secure payment processed by Stripe (Mock)</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
