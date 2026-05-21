import { useState, useMemo, useEffect, useRef } from 'react';
import { Package, AlertTriangle, TrendingDown, RefreshCw, Search, Calendar, Bell, ClipboardList, Plus, Truck, CheckCircle, Download } from 'lucide-react';
import { useInventory, useInventoryAlerts, useUpdateInventory, usePurchaseOrders, useCreatePurchaseOrder, useReceivePurchaseOrder, useSuppliers } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/helpers';

export function InventoryPage() {
  const { data: inventory, isLoading } = useInventory();
  const { data: alerts } = useInventoryAlerts();
  const updateInventory = useUpdateInventory();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'expiring'>('all');
  const [editId, setEditId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState('');
  const [editMin, setEditMin] = useState('');
  const [tab, setTab] = useState<'stock' | 'orders'>('stock');
  const notifiedRef = useRef(false);

  // Low stock auto-notifications
  useEffect(() => {
    if (!inventory || notifiedRef.current) return;
    const lowItems = (inventory as any[]).filter((i: any) => i.quantity <= (i.reorderPoint || i.minStock || 0) && i.quantity >= 0);
    if (lowItems.length > 0) {
      notifiedRef.current = true;
      toast(`⚠️ ${lowItems.length} item${lowItems.length > 1 ? 's' : ''} below reorder point`, {
        duration: 6000,
        icon: '📦',
        style: { background: '#FEF3C7', color: '#92400E', fontWeight: 500 },
      });
      // Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Low Stock Alert', { body: `${lowItems.length} items need reordering`, icon: '/favicon.ico' });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }, [inventory]);

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

      {/* Tab Bar */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        <button onClick={() => setTab('stock')} className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${tab === 'stock' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}>
          <Package className="w-4 h-4" /> Stock Levels
        </button>
        <button onClick={() => setTab('orders')} className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${tab === 'orders' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}>
          <ClipboardList className="w-4 h-4" /> Purchase Orders
        </button>
      </div>

      {/* Alert Banner */}
      {tab === 'stock' && (alerts || []).length > 0 && (
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
      {tab === 'stock' && (<>
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search inventory..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
        </div>
        <div className="flex gap-1">
          {[{ key: 'all', label: 'All' }, { key: 'low', label: 'Low Stock' }, { key: 'expiring', label: 'Expiring' }].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key as any)}
              className={`px-3 py-2 rounded-lg text-xs font-medium ${filter === f.key ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      {isLoading ? <Skeleton className="h-64 w-full" /> : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left p-3 md:p-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="text-left p-3 md:p-4 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">SKU</th>
                <th className="text-center p-3 md:p-4 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                <th className="text-center p-3 md:p-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Min Level</th>
                <th className="text-center p-3 md:p-4 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Batch</th>
                <th className="text-center p-3 md:p-4 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Expiry</th>
                <th className="text-center p-3 md:p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right p-3 md:p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((item: any) => {
                const isLow = item.quantity <= item.minStock;
                const isExpiring = item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 7 * 86400000);
                const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();
                return (
                  <tr key={item.id} className={`${isLow ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                    <td className="p-4 text-sm font-medium">{item.product?.name || 'Unknown'}</td>
                    <td className="p-4 text-sm text-gray-500">{item.product?.sku || '-'}</td>
                    <td className="p-4 text-center">
                      {editId === item.id ? (
                        <input type="number" value={editQty} onChange={e => setEditQty(e.target.value)} className="w-16 px-2 py-1 border rounded text-sm text-center" />
                      ) : (
                        <span className={`text-sm font-medium ${isLow ? 'text-red-600' : ''}`}>{item.quantity}</span>
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
                        <span className={`text-xs px-2 py-1 rounded-full ${isExpired ? 'bg-red-100 text-red-700' : isExpiring ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
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
        </div>
      )}
      </>)}

      {tab === 'orders' && <PurchaseOrdersTab />}
    </div>
  );
}

function PurchaseOrdersTab() {
  const { data: purchaseOrders, isLoading } = usePurchaseOrders();
  const { data: suppliers } = useSuppliers();
  const { data: inventory } = useInventory();
  const createPO = useCreatePurchaseOrder();
  const receivePO = useReceivePurchaseOrder();
  const [showCreate, setShowCreate] = useState(false);
  const [poForm, setPoForm] = useState({ supplierId: '', items: [{ productId: '', quantity: 1, unitCost: 0 }], notes: '' });

  const addItem = () => setPoForm(f => ({ ...f, items: [...f.items, { productId: '', quantity: 1, unitCost: 0 }] }));
  const removeItem = (i: number) => setPoForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const updateItem = (i: number, field: string, val: any) => setPoForm(f => {
    const items = [...f.items];
    (items[i] as any)[field] = val;
    return { ...f, items };
  });

  const handleCreate = async () => {
    if (!poForm.supplierId) { toast.error('Select a supplier'); return; }
    if (poForm.items.some(i => !i.productId || i.quantity <= 0)) { toast.error('Fill all item fields'); return; }
    try {
      await createPO.mutateAsync(poForm);
      toast.success('Purchase order created');
      setShowCreate(false);
      setPoForm({ supplierId: '', items: [{ productId: '', quantity: 1, unitCost: 0 }], notes: '' });
    } catch { toast.error('Failed to create PO'); }
  };

  const handleReceive = async (id: string) => {
    if (!confirm('Mark this purchase order as received? Stock will be updated.')) return;
    try {
      await receivePO.mutateAsync(id);
      toast.success('Purchase order received — stock updated');
    } catch { toast.error('Failed to receive PO'); }
  };

  const poTotal = (items: any[]) => items.reduce((s: number, i: any) => s + (i.quantity * i.unitCost), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2"><Truck className="w-5 h-5 text-blue-500" /> Purchase Orders</h2>
        <button onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" /> New PO
        </button>
      </div>

      {/* Create PO Form */}
      {showCreate && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-5 space-y-4">
          <h3 className="font-semibold">Create Purchase Order</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Supplier</label>
              <select value={poForm.supplierId} onChange={e => setPoForm(f => ({ ...f, supplierId: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600">
                <option value="">Select supplier...</option>
                {(suppliers || []).map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
              <input type="text" value={poForm.notes} onChange={e => setPoForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Optional notes" className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-500">Items</label>
              <button onClick={addItem} className="text-xs text-blue-600 hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> Add Item</button>
            </div>
            <div className="space-y-2">
              {poForm.items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <select value={item.productId} onChange={e => updateItem(i, 'productId', e.target.value)}
                      className="w-full px-2 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600">
                      <option value="">Product...</option>
                      {(inventory || []).map((inv: any) => <option key={inv.id} value={inv.productId}>{inv.product?.name || inv.productId}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input type="number" value={item.quantity} onChange={e => updateItem(i, 'quantity', parseInt(e.target.value) || 0)}
                      placeholder="Qty" min="1" className="w-full px-2 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  <div className="col-span-3">
                    <input type="number" value={item.unitCost || ''} onChange={e => updateItem(i, 'unitCost', parseFloat(e.target.value) || 0)}
                      placeholder="Unit cost" step="0.01" className="w-full px-2 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    {poForm.items.length > 1 && (
                      <button onClick={() => removeItem(i)} className="px-2 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-xs">Remove</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-right text-sm font-bold">Total: {formatCurrency(poTotal(poForm.items))}</div>
          </div>

          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm">Cancel</button>
            <button onClick={handleCreate} disabled={createPO.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {createPO.isPending ? 'Creating...' : 'Create PO'}
            </button>
          </div>
        </div>
      )}

      {/* PO List */}
      {isLoading ? <Skeleton className="h-40 w-full" /> : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">PO #</th>
                  <th className="text-left px-4 py-3 font-medium">Supplier</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-right px-4 py-3 font-medium">Items</th>
                  <th className="text-right px-4 py-3 font-medium">Total</th>
                  <th className="text-center px-4 py-3 font-medium">Status</th>
                  <th className="text-center px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {(purchaseOrders || []).map((po: any) => (
                  <tr key={po.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 font-mono font-medium">{po.poNumber || po.id.slice(0, 8)}</td>
                    <td className="px-4 py-3">{po.supplier?.name || '-'}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(po.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">{po.items?.length || 0}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatCurrency(po.totalCost || poTotal(po.items || []))}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        po.status === 'RECEIVED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        po.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>{po.status}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {po.status !== 'RECEIVED' && (
                        <button onClick={() => handleReceive(po.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 mx-auto">
                          <CheckCircle className="w-3 h-3" /> Receive
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {(!purchaseOrders || purchaseOrders.length === 0) && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No purchase orders yet. Create one to restock inventory.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
