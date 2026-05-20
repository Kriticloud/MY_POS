import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Package, X, Barcode } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { useProducts, useCategories, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useApi';
import { useSettingsStore, getPageTitle, getBusinessConfig, getEntityLabels } from '../store/settingsStore';
import { Skeleton } from '../components/ui/Skeleton';
import { printBarcodeLabel } from '../services/escpos';
import toast from 'react-hot-toast';

const emptyForm = { name: '', slug: '', price: '', costPrice: '', sku: '', barcode: '', description: '', categoryId: '', taxRate: '8.5', unit: 'piece', duration: '', image: '', modifiers: '', variants: '' };

export function ProductsPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const businessType = useSettingsStore((s) => s.businessType);
  const { data: products, isLoading } = useProducts({ search: search || undefined, businessType });
  const { data: categories } = useCategories({ businessType });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const config = getBusinessConfig(businessType);
  const pageInfo = getPageTitle('/products', businessType);
  const labels = getEntityLabels(businessType);
  const isSalon = businessType === 'SALON';

  const openNew = () => { setForm(emptyForm); setEditing(null); setShowForm(true); };
  const openEdit = (p: any) => {
    setForm({ name: p.name, slug: p.slug, price: String(p.price), costPrice: String(p.costPrice || ''), sku: p.sku || '', barcode: p.barcode || '', description: p.description || '', categoryId: p.categoryId || '', taxRate: String(p.taxRate || 8.5), unit: p.unit || 'piece', duration: String(p.duration || ''), image: p.image || '', modifiers: p.modifiers ? JSON.stringify(p.modifiers) : '', variants: p.variants ? JSON.stringify(p.variants) : '' });
    setEditing(p); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let modifiers, variants;
    try { modifiers = form.modifiers ? JSON.parse(form.modifiers) : undefined; } catch { toast.error('Invalid modifiers JSON'); return; }
    try { variants = form.variants ? JSON.parse(form.variants) : undefined; } catch { toast.error('Invalid variants JSON'); return; }
    const data = { ...form, price: parseFloat(form.price), costPrice: form.costPrice ? parseFloat(form.costPrice) : undefined, taxRate: parseFloat(form.taxRate), slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'), businessType, duration: form.duration ? parseInt(form.duration) : undefined, image: form.image || undefined, modifiers, variants };
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
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{pageInfo.title}</h1>
          <p className="text-gray-500 mt-1">{pageInfo.subtitle}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium">
          <Plus className="w-4 h-4" /> Add {labels.product}
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
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-lg overflow-hidden">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            p.category?.icon || '📦'
                          )}
                        </div>
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
                        <button onClick={() => printBarcodeLabel({ name: p.name, barcode: p.barcode, sku: p.sku, price: p.price })} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" title="Print barcode"><Barcode className="w-4 h-4 text-gray-500" /></button>
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><Edit className="w-4 h-4 text-gray-500" /></button>
                        <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(products || []).length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No {labels.products.toLowerCase()} found</td></tr>}
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
                <h2 className="text-lg font-bold">{editing ? `Edit ${labels.product}` : `New ${labels.product}`}</h2>
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
                  {isSalon && (
                    <div><label className="block text-xs font-medium text-gray-500 mb-1">Duration (minutes)</label>
                      <input type="number" min="1" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="e.g. 30" className="w-full px-3 py-2 rounded-lg border text-sm" /></div>
                  )}
                  <div className="col-span-2"><label className="block text-xs font-medium text-gray-500 mb-1">Image</label>
                    <div className="flex gap-2">
                      <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="URL or upload below" className="flex-1 px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
                      <label className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1">
                        📁 Upload
                        <input type="file" accept="image/*" className="hidden" onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 5 * 1024 * 1024) { toast.error('Max 5MB'); return; }
                          const reader = new FileReader();
                          reader.onload = () => setForm({...form, image: reader.result as string});
                          reader.readAsDataURL(file);
                        }} />
                      </label>
                    </div>
                    {form.image && <img src={form.image} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-lg" />}
                  </div>
                  <div className="col-span-2"><label className="block text-xs font-medium text-gray-500 mb-1">Modifiers (JSON)</label>
                    <textarea rows={2} value={form.modifiers} onChange={e => setForm({...form, modifiers: e.target.value})} placeholder='[{"name":"Size","options":[{"label":"Small","price":0},{"label":"Large","price":2}]}]' className="w-full px-3 py-2 rounded-lg border text-sm font-mono text-xs" /></div>
                  <div className="col-span-2"><label className="block text-xs font-medium text-gray-500 mb-1">Variants (JSON)</label>
                    <textarea rows={2} value={form.variants} onChange={e => setForm({...form, variants: e.target.value})} placeholder='[{"name":"Red","sku":"PROD-RED","price":15.99}]' className="w-full px-3 py-2 rounded-lg border text-sm font-mono text-xs" /></div>
                </div>
                <button type="submit" disabled={createProduct.isPending || updateProduct.isPending}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">
                  {editing ? `Update ${labels.product}` : `Create ${labels.product}`}
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
              <h2 className="text-lg font-bold mb-2">Delete {labels.product}?</h2>
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
