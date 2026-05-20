import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Plus, Edit, Trash2, X, Users, Star, Percent } from 'lucide-react';
import { useMemberships, useCreateMembership, useUpdateMembership, useDeleteMembership, useCustomers, useAssignMembership } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const tierColors = ['from-gray-400 to-gray-500', 'from-amber-500 to-yellow-400', 'from-blue-500 to-cyan-400', 'from-purple-500 to-pink-500', 'from-emerald-500 to-teal-400'];

export function MembershipsPage() {
  const { data: memberships, isLoading } = useMemberships();
  const { data: customers } = useCustomers();
  const createMembership = useCreateMembership();
  const updateMembership = useUpdateMembership();
  const deleteMembership = useDeleteMembership();
  const assignMembership = useAssignMembership();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', discount: '', pointsMultiplier: '1', benefits: '' });
  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState('');

  const openEdit = (m: any) => {
    setForm({ name: m.name, discount: String(m.discount), pointsMultiplier: String(m.pointsMultiplier), benefits: m.benefits || '' });
    setEditing(m); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name: form.name, discount: parseFloat(form.discount) || 0, pointsMultiplier: parseFloat(form.pointsMultiplier) || 1, benefits: form.benefits || undefined };
    try {
      if (editing) { await updateMembership.mutateAsync({ id: editing.id, ...data }); toast.success('Tier updated'); }
      else { await createMembership.mutateAsync(data); toast.success('Tier created'); }
      setShowForm(false); setEditing(null); setForm({ name: '', discount: '', pointsMultiplier: '1', benefits: '' });
    } catch { toast.error('Failed to save tier'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Membership Tiers</h1>
          <p className="text-gray-500 mt-1">Manage loyalty tiers and assign customers</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', discount: '', pointsMultiplier: '1', benefits: '' }); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Tier
        </button>
      </div>

      {isLoading ? <Skeleton className="h-60 w-full" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(memberships || []).map((tier: any, i: number) => (
            <motion.div key={tier.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden">
              <div className={`bg-gradient-to-r ${tierColors[i % tierColors.length]} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <Crown className="w-6 h-6" />
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(tier)} className="p-1 rounded-lg hover:bg-white/20"><Edit className="w-4 h-4" /></button>
                    <button onClick={async () => { await deleteMembership.mutateAsync(tier.id); toast.success('Deleted'); }} className="p-1 rounded-lg hover:bg-white/20"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <h3 className="text-lg font-bold mt-2">{tier.name}</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Percent className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">{tier.discount}% discount</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-300">{tier.pointsMultiplier}x points multiplier</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-300">{tier._count?.customers || 0} members</span>
                </div>
                {tier.benefits && <p className="text-xs text-gray-500 mt-2">{tier.benefits}</p>}
                <button onClick={() => { setAssignModal(tier.id); setSelectedCustomer(''); }}
                  className="w-full py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600">
                  Assign Customer
                </button>
              </div>
            </motion.div>
          ))}
          {(memberships || []).length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              <Crown className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No membership tiers yet</p>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">{editing ? 'Edit' : 'Create'} Tier</h2>
                <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input placeholder="Tier Name (e.g. Gold)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" required />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Discount %</label>
                    <input type="number" step="0.5" min="0" max="100" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Points Multiplier</label>
                    <input type="number" step="0.1" min="0" value={form.pointsMultiplier} onChange={e => setForm({ ...form, pointsMultiplier: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                </div>
                <textarea placeholder="Benefits description..." rows={2} value={form.benefits} onChange={e => setForm({ ...form, benefits: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
                <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
                  {editing ? 'Update' : 'Create'} Tier
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assign Customer Modal */}
      <AnimatePresence>
        {assignModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Assign Customer</h2>
                <button onClick={() => setAssignModal(null)}><X className="w-5 h-5" /></button>
              </div>
              <select value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm mb-3 dark:bg-gray-700 dark:border-gray-600">
                <option value="">Select customer...</option>
                {(customers || []).map((c: any) => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName || ''} ({c.email || c.phone})</option>
                ))}
              </select>
              <button onClick={async () => {
                if (!selectedCustomer || !assignModal) return;
                try { await assignMembership.mutateAsync({ membershipId: assignModal, customerId: selectedCustomer }); toast.success('Membership assigned'); setAssignModal(null); }
                catch { toast.error('Failed to assign'); }
              }} disabled={!selectedCustomer} className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium disabled:opacity-50">
                Assign
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
