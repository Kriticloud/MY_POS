import { useState, useMemo, useEffect, useRef } from 'react';
import { Package, AlertTriangle, TrendingDown, RefreshCw, Search, Calendar, Bell } from 'lucide-react';
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
              className={`px-3 py-2 rounded-lg text-xs font-medium ${filter === f.key ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600'}`}>
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
      )}
    </div>
  );
}
