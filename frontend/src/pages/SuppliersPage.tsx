import { useState } from 'react';
import { Truck, Plus, X, Package, ClipboardList, CheckCircle } from 'lucide-react';
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier, usePurchaseOrders, useCreatePurchaseOrder, useReceivePurchaseOrder, useProducts } from '../hooks/useApi';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import { Skeleton } from '../components/ui/Skeleton';

type Tab = 'suppliers' | 'purchase-orders';

export function SuppliersPage() {
  const [tab, setTab] = useState<Tab>('suppliers');
  const { data: suppliers, isLoading } = useSuppliers();
  const { data: purchaseOrders } = usePurchaseOrders();
  const { data: products } = useProducts();
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();
  const createPO = useCreatePurchaseOrder();
  const receivePO = useReceivePurchaseOrder();

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', company: '' });
  const [poForm, setPOForm] = useState({ supplierId: '', items: [{ productId: '', quantity: 1, unitCost: 0 }], notes: '' });

  const openAdd = () => { setForm({ name: '', email: '', phone: '', address: '', company: '' }); setEditing(null); setShowSupplierModal(true); };
  const openEdit = (s: any) => { setForm({ name: s.name, email: s.email || '', phone: s.phone || '', address: s.address || '', company: s.company || '' }); setEditing(s); setShowSupplierModal(true); };

  const handleSaveSupplier = async () => {
    try {
      if (editing) { await updateSupplier.mutateAsync({ id: editing.id, ...form }); toast.success('Supplier updated'); }
      else { await createSupplier.mutateAsync(form); toast.success('Supplier created'); }
      setShowSupplierModal(false);
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteSupplier.mutateAsync(id); toast.success('Supplier deleted'); } catch { toast.error('Failed to delete'); }
  };

  const addPOItem = () => setPOForm({ ...poForm, items: [...poForm.items, { productId: '', quantity: 1, unitCost: 0 }] });
  const removePOItem = (i: number) => setPOForm({ ...poForm, items: poForm.items.filter((_, idx) => idx !== i) });
  const updatePOItem = (i: number, field: string, value: any) => {
    const items = [...poForm.items];
    (items[i] as any)[field] = value;
    setPOForm({ ...poForm, items });
  };

  const handleCreatePO = async () => {
    try {
      await createPO.mutateAsync({ supplierId: poForm.supplierId, items: poForm.items.filter(i => i.productId), notes: poForm.notes });
      setShowPOModal(false);
      setPOForm({ supplierId: '', items: [{ productId: '', quantity: 1, unitCost: 0 }], notes: '' });
      toast.success('Purchase order created');
    } catch { toast.error('Failed to create PO'); }
  };

  const handleReceive = async (id: string) => {
    try { await receivePO.mutateAsync(id); toast.success('PO received & inventory updated'); } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Suppliers</h1>
          <p className="text-gray-500 mt-1">Manage suppliers and purchase orders</p>
        </div>
        <div className="flex gap-2">
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add Supplier
          </button>
          <button onClick={() => setShowPOModal(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700">
            <ClipboardList className="w-4 h-4" /> New PO
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {[{ key: 'suppliers', label: 'Suppliers', icon: Truck }, { key: 'purchase-orders', label: 'Purchase Orders', icon: Package }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as Tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium ${tab === t.key ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'suppliers' && (
        isLoading ? <Skeleton className="h-64 w-full" /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(suppliers || []).map((s: any) => (
              <div key={s.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.company || 'No company'}</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-500 mb-3">
                  {s.email && <p>{s.email}</p>}
                  {s.phone && <p>{s.phone}</p>}
                  {s.address && <p className="truncate">{s.address}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(s)} className="flex-1 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="py-1.5 px-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100">Delete</button>
                </div>
              </div>
            ))}
            {(suppliers || []).length === 0 && <p className="col-span-3 text-center text-gray-400 py-8">No suppliers yet</p>}
          </div>
        )
      )}

      {tab === 'purchase-orders' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">PO #</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Supplier</th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Items</th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {(purchaseOrders || []).map((po: any) => (
                <tr key={po.id}>
                  <td className="p-4 text-sm font-medium">{po.orderNumber}</td>
                  <td className="p-4 text-sm">{po.supplier?.name || '-'}</td>
                  <td className="p-4 text-center text-sm">{po.items?.length || 0}</td>
                  <td className="p-4 text-center text-sm font-medium">{formatCurrency(po.totalAmount)}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${po.status === 'RECEIVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="p-4 text-center text-sm text-gray-500">{new Date(po.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    {po.status === 'PENDING' && (
                      <button onClick={() => handleReceive(po.id)} className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 ml-auto">
                        <CheckCircle className="w-3 h-3" /> Receive
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {(purchaseOrders || []).length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-400">No purchase orders</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Supplier Modal */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex justify-between mb-4"><h2 className="text-lg font-bold">{editing ? 'Edit' : 'Add'} Supplier</h2><button onClick={() => setShowSupplierModal(false)}><X className="w-5 h-5" /></button></div>
            <div className="space-y-3">
              {[{ key: 'name', label: 'Name *' }, { key: 'company', label: 'Company' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }, { key: 'address', label: 'Address' }].map(f => (
                <div key={f.key}><label className="text-xs font-medium text-gray-500">{f.label}</label>
                  <input type="text" value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600" /></div>
              ))}
            </div>
            <button onClick={handleSaveSupplier} className="w-full mt-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
              {editing ? 'Update' : 'Create'} Supplier
            </button>
          </div>
        </div>
      )}

      {/* Purchase Order Modal */}
      {showPOModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between mb-4"><h2 className="text-lg font-bold">New Purchase Order</h2><button onClick={() => setShowPOModal(false)}><X className="w-5 h-5" /></button></div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Supplier *</label>
                <select value={poForm.supplierId} onChange={e => setPOForm({ ...poForm, supplierId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600">
                  <option value="">Select supplier</option>
                  {(suppliers || []).map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Items</label>
                {poForm.items.map((item, i) => (
                  <div key={i} className="flex gap-2 mt-2">
                    <select value={item.productId} onChange={e => updatePOItem(i, 'productId', e.target.value)} className="flex-1 px-2 py-1.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600">
                      <option value="">Select product</option>
                      {(products || []).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input type="number" value={item.quantity} onChange={e => updatePOItem(i, 'quantity', parseInt(e.target.value) || 1)} className="w-16 px-2 py-1.5 border rounded text-sm text-center dark:bg-gray-700 dark:border-gray-600" placeholder="Qty" />
                    <input type="number" step="0.01" value={item.unitCost} onChange={e => updatePOItem(i, 'unitCost', parseFloat(e.target.value) || 0)} className="w-24 px-2 py-1.5 border rounded text-sm dark:bg-gray-700 dark:border-gray-600" placeholder="Cost" />
                    {poForm.items.length > 1 && <button onClick={() => removePOItem(i)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>}
                  </div>
                ))}
                <button onClick={addPOItem} className="mt-2 text-xs text-blue-600 hover:text-blue-700">+ Add Item</button>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Notes</label>
                <textarea value={poForm.notes} onChange={e => setPOForm({ ...poForm, notes: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600" rows={2} />
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-sm font-medium">Total: {formatCurrency(poForm.items.reduce((s, i) => s + i.quantity * i.unitCost, 0))}</p>
              </div>
            </div>
            <button onClick={handleCreatePO} disabled={!poForm.supplierId || !poForm.items.some(i => i.productId)}
              className="w-full mt-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:bg-gray-300">
              Create Purchase Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
