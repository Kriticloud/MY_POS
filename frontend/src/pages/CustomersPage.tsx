import { useState } from 'react';
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
