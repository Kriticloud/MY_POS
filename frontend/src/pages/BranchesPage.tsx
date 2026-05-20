import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, Edit, Trash2, X, MapPin, Phone, Mail, Users } from 'lucide-react';
import { useBranches, useCreateBranch, useUpdateBranch, useDeleteBranch } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const emptyForm = { name: '', address: '', phone: '', email: '', businessType: 'GENERAL' };

export function BranchesPage() {
  const { data: branches, isLoading } = useBranches();
  const createBranch = useCreateBranch();
  const updateBranch = useUpdateBranch();
  const deleteBranch = useDeleteBranch();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);

  const openEdit = (b: any) => {
    setForm({ name: b.name, address: b.address || '', phone: b.phone || '', email: b.email || '', businessType: b.businessType || 'GENERAL' });
    setEditing(b); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, address: form.address || undefined, phone: form.phone || undefined, email: form.email || undefined };
    try {
      if (editing) { await updateBranch.mutateAsync({ id: editing.id, ...data }); toast.success('Updated'); }
      else { await createBranch.mutateAsync(data); toast.success('Created'); }
      setShowForm(false); setEditing(null); setForm(emptyForm);
    } catch { toast.error('Failed to save branch'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Branches</h1>
          <p className="text-gray-500 mt-1">Manage store locations</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Branch
        </button>
      </div>

      {isLoading ? <Skeleton className="h-60 w-full" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(branches || []).map((b: any, i: number) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <Building2 className="w-6 h-6" />
                  <span className={`text-xs px-2 py-1 rounded-full ${b.isActive ? 'bg-white/20' : 'bg-red-500/50'}`}>
                    {b.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h3 className="text-lg font-bold mt-2">{b.name}</h3>
                <p className="text-xs opacity-70">{b.businessType}</p>
              </div>
              <div className="p-4 space-y-2">
                {b.address && <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {b.address}</p>}
                {b.phone && <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {b.phone}</p>}
                {b.email && <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {b.email}</p>}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" /> {b._count?.users || 0} staff • {b._count?.products || 0} products • {b._count?.orders || 0} orders
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button onClick={() => openEdit(b)} className="flex-1 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center gap-1">
                    <Edit className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={async () => { await updateBranch.mutateAsync({ id: b.id, isActive: !b.isActive }); }}
                    className="flex-1 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                    {b.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={async () => { await deleteBranch.mutateAsync(b.id); toast.success('Deleted'); }}
                    className="py-1.5 px-2 text-xs bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg hover:bg-red-100"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            </motion.div>
          ))}
          {(branches || []).length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No branches configured</p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">{editing ? 'Edit' : 'Create'} Branch</h2>
                <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input placeholder="Branch name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" required />
                <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
                  <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <select value={form.businessType} onChange={e => setForm({ ...form, businessType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600">
                  <option value="GENERAL">General Retail</option>
                  <option value="RESTAURANT">Restaurant</option>
                  <option value="CAFE">Cafe</option>
                  <option value="SALON">Salon & Spa</option>
                  <option value="GROCERY">Grocery</option>
                </select>
                <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
                  {editing ? 'Update' : 'Create'} Branch
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
