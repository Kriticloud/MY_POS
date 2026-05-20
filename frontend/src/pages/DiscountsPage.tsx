import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Plus, Edit, Trash2, X, Percent, DollarSign, Calendar } from 'lucide-react';
import { useDiscounts, useCreateDiscount, useUpdateDiscount, useDeleteDiscount } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

const emptyForm = { name: '', type: 'PERCENTAGE', value: '', minOrder: '', maxDiscount: '', startDate: '', endDate: '' };

export function DiscountsPage() {
  const { data: discounts, isLoading } = useDiscounts();
  const createDiscount = useCreateDiscount();
  const updateDiscount = useUpdateDiscount();
  const deleteDiscount = useDeleteDiscount();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);

  const openEdit = (d: any) => {
    setForm({
      name: d.name, type: d.type, value: String(d.value),
      minOrder: d.minOrder ? String(d.minOrder) : '', maxDiscount: d.maxDiscount ? String(d.maxDiscount) : '',
      startDate: d.startDate ? d.startDate.split('T')[0] : '', endDate: d.endDate ? d.endDate.split('T')[0] : '',
    });
    setEditing(d); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name, type: form.type, value: parseFloat(form.value),
      minOrder: form.minOrder ? parseFloat(form.minOrder) : undefined,
      maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : undefined,
      startDate: form.startDate || undefined, endDate: form.endDate || undefined,
    };
    try {
      if (editing) { await updateDiscount.mutateAsync({ id: editing.id, ...data }); toast.success('Updated'); }
      else { await createDiscount.mutateAsync(data); toast.success('Created'); }
      setShowForm(false); setEditing(null); setForm(emptyForm);
    } catch { toast.error('Failed to save discount'); }
  };

  const isActive = (d: any) => {
    if (!d.isActive) return false;
    const now = new Date();
    if (d.startDate && new Date(d.startDate) > now) return false;
    if (d.endDate && new Date(d.endDate) < now) return false;
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Discounts & Promotions</h1>
          <p className="text-gray-500 mt-1">Manage discount codes and promotions</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Discount
        </button>
      </div>

      {isLoading ? <Skeleton className="h-60 w-full" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(discounts || []).map((d: any, i: number) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-card border-l-4 ${isActive(d) ? 'border-green-500' : 'border-gray-300'}`}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {d.type === 'PERCENTAGE' ? <Percent className="w-5 h-5 text-blue-500" /> : <DollarSign className="w-5 h-5 text-green-500" />}
                    <h3 className="font-bold text-gray-900 dark:text-white">{d.name}</h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${isActive(d) ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                    {isActive(d) ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {d.type === 'PERCENTAGE' ? `${d.value}%` : formatCurrency(d.value)} <span className="text-sm font-normal text-gray-500">off</span>
                </div>
                <div className="space-y-1 text-xs text-gray-500">
                  {d.minOrder && <p>Min order: {formatCurrency(d.minOrder)}</p>}
                  {d.maxDiscount && <p>Max discount: {formatCurrency(d.maxDiscount)}</p>}
                  {(d.startDate || d.endDate) && (
                    <p className="flex items-center gap-1"><Calendar className="w-3 h-3" />
                      {d.startDate ? new Date(d.startDate).toLocaleDateString() : '∞'} — {d.endDate ? new Date(d.endDate).toLocaleDateString() : '∞'}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button onClick={() => openEdit(d)} className="flex-1 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center gap-1">
                    <Edit className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={async () => { await updateDiscount.mutateAsync({ id: d.id, isActive: !d.isActive }); }}
                    className="flex-1 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                    {d.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={async () => { await deleteDiscount.mutateAsync(d.id); toast.success('Deleted'); }}
                    className="py-1.5 px-2 text-xs bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg hover:bg-red-100"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            </motion.div>
          ))}
          {(discounts || []).length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No discounts yet</p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">{editing ? 'Edit' : 'Create'} Discount</h2>
                <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input placeholder="Discount name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" required />
                <div className="grid grid-cols-2 gap-3">
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600">
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                  <input type="number" step="0.01" placeholder="Value" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}
                    className="px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" step="0.01" placeholder="Min order amount" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })}
                    className="px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
                  <input type="number" step="0.01" placeholder="Max discount cap" value={form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: e.target.value })}
                    className="px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500">Start Date</label>
                    <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" /></div>
                  <div><label className="text-xs text-gray-500">End Date</label>
                    <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" /></div>
                </div>
                <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
                  {editing ? 'Update' : 'Create'} Discount
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
