import { useState, useMemo } from 'react';
import { Search, Plus, Star, Award, History, X, Gift } from 'lucide-react';
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer, useRedeemLoyalty, useLoyaltyHistory } from '../hooks/useApi';
import { formatCurrency } from '../utils/helpers';
import { useSettingsStore, getPageTitle, getEntityLabels } from '../store/settingsStore';
import toast from 'react-hot-toast';
import { Skeleton } from '../components/ui/Skeleton';

const tierColors: Record<string, string> = { BRONZE: 'bg-orange-100 text-orange-700', SILVER: 'bg-gray-100 text-gray-700', GOLD: 'bg-amber-100 text-amber-700', PLATINUM: 'bg-purple-100 text-purple-700' };
const tierThresholds = [{ tier: 'PLATINUM', min: 5000 }, { tier: 'GOLD', min: 2000 }, { tier: 'SILVER', min: 500 }, { tier: 'BRONZE', min: 0 }];

function getTier(points: number) { return tierThresholds.find(t => points >= t.min)?.tier || 'BRONZE'; }

export function CustomersPage() {
  const [search, setSearch] = useState('');
  const { data: customers, isLoading } = useCustomers({ search: search || undefined });
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();
  const redeemLoyalty = useRedeemLoyalty();
  const businessType = useSettingsStore((s) => s.businessType);
  const pageInfo = getPageTitle('/customers', businessType);
  const labels = getEntityLabels(businessType);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [showDelete, setShowDelete] = useState<string | null>(null);
  const [showLoyalty, setShowLoyalty] = useState<string | null>(null);
  const [redeemPoints, setRedeemPoints] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '' });

  const { data: loyaltyHistory } = useLoyaltyHistory(showLoyalty || undefined);
  const loyaltyCustomer = showLoyalty ? (customers || []).find((c: any) => c.id === showLoyalty) : null;

  const openAdd = () => { setForm({ firstName: '', lastName: '', email: '', phone: '', address: '' }); setEditing(null); setShowModal(true); };
  const openEdit = (c: any) => { setForm({ firstName: c.firstName, lastName: c.lastName || '', email: c.email || '', phone: c.phone || '', address: c.address || '' }); setEditing(c); setShowModal(true); };

  const handleSave = async () => {
    try {
      if (editing) { await updateCustomer.mutateAsync({ id: editing.id, ...form }); toast.success('Customer updated'); }
      else { await createCustomer.mutateAsync(form as any); toast.success('Customer created'); }
      setShowModal(false);
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteCustomer.mutateAsync(id); setShowDelete(null); toast.success('Customer deleted'); } catch { toast.error('Failed to delete'); }
  };

  const handleRedeem = async () => {
    if (!showLoyalty || !redeemPoints) return;
    try { await redeemLoyalty.mutateAsync({ customerId: showLoyalty, points: parseInt(redeemPoints) }); setRedeemPoints(''); toast.success('Points redeemed!'); } catch { toast.error('Failed to redeem'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{pageInfo.title}</h1><p className="text-gray-500 mt-1">{pageInfo.subtitle}</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"><Plus className="w-4 h-4" /> Add {labels.customer}</button>
      </div>

      <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder={`Search ${labels.customers.toLowerCase()}...`} value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" /></div>

      {isLoading ? <Skeleton className="h-64 w-full" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(customers || []).map((c: any) => {
            const tier = getTier(c.loyaltyPoints);
            return (
              <div key={c.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-lg font-bold text-blue-600">
                    {c.firstName[0]}{(c.lastName || '')[0] || ''}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{c.firstName} {c.lastName || ''}</p>
                    <p className="text-xs text-gray-500">{c.email || c.phone || 'No contact'}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${tierColors[tier] || tierColors.BRONZE}`}>
                      <Award className="w-3 h-3 inline mr-1" />{tier}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center mb-4">
                  <div><p className="text-lg font-bold text-amber-500">{c.loyaltyPoints}</p><p className="text-xs text-gray-500">Points</p></div>
                  <div><p className="text-lg font-bold">{formatCurrency(c.totalSpent)}</p><p className="text-xs text-gray-500">Spent</p></div>
                  <div><p className="text-lg font-bold">{formatCurrency(c.storeCredit || 0)}</p><p className="text-xs text-gray-500">Credit</p></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowLoyalty(c.id)} className="flex-1 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 flex items-center justify-center gap-1"><Star className="w-3 h-3" /> Loyalty</button>
                  <button onClick={() => openEdit(c)} className="flex-1 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200">Edit</button>
                  <button onClick={() => setShowDelete(c.id)} className="py-1.5 px-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex justify-between mb-4"><h2 className="text-lg font-bold">{editing ? 'Edit' : 'Add'} {labels.customer}</h2><button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button></div>
            <div className="space-y-3">
              {[{ key: 'firstName', label: 'First Name *' }, { key: 'lastName', label: 'Last Name' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }, { key: 'address', label: 'Address' }].map(f => (
                <div key={f.key}><label className="text-xs font-medium text-gray-500">{f.label}</label>
                  <input type="text" value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              ))}
            </div>
            <button onClick={handleSave} className="w-full mt-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
              {editing ? 'Update' : 'Create'} {labels.customer}
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl text-center">
            <p className="text-lg font-bold mb-2">Delete {labels.customer}?</p><p className="text-sm text-gray-500 mb-4">This action cannot be undone.</p>
            <div className="flex gap-3"><button onClick={() => setShowDelete(null)} className="flex-1 py-2 bg-gray-100 rounded-xl text-sm">Cancel</button>
              <button onClick={() => handleDelete(showDelete)} className="flex-1 py-2 bg-red-600 text-white rounded-xl text-sm">Delete</button></div>
          </div>
        </div>
      )}

      {/* Loyalty Modal */}
      {showLoyalty && loyaltyCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between mb-4"><h2 className="text-lg font-bold flex items-center gap-2"><Star className="w-5 h-5 text-amber-500" /> Loyalty Program</h2><button onClick={() => setShowLoyalty(null)}><X className="w-5 h-5" /></button></div>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-amber-500">{loyaltyCustomer.loyaltyPoints}</p>
              <p className="text-sm text-gray-500">Available Points</p>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${tierColors[getTier(loyaltyCustomer.loyaltyPoints)]}`}>{getTier(loyaltyCustomer.loyaltyPoints)} Member</span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-1"><Gift className="w-4 h-4" /> Redeem Points</p>
              <p className="text-xs text-amber-600 mb-2">100 points = $1.00 discount</p>
              <div className="flex gap-2">
                <input type="number" value={redeemPoints} onChange={e => setRedeemPoints(e.target.value)} max={loyaltyCustomer.loyaltyPoints}
                  placeholder="Points to redeem" className="flex-1 px-3 py-2 rounded-lg border text-sm" />
                <button onClick={handleRedeem} disabled={!redeemPoints || parseInt(redeemPoints) > loyaltyCustomer.loyaltyPoints}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:bg-gray-300">Redeem</button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-1"><History className="w-4 h-4" /> Points History</h3>
              <div className="space-y-2">
                {(loyaltyHistory || []).map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div><p className="font-medium">{t.description}</p><p className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</p></div>
                    <span className={`font-bold ${t.type === 'EARNED' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'EARNED' ? '+' : '-'}{t.points}</span>
                  </div>
                ))}
                {(loyaltyHistory || []).length === 0 && <p className="text-sm text-gray-400 text-center py-4">No history yet</p>}
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-xs font-medium text-gray-500 mb-1">Tier Progress</p>
              <div className="flex items-center gap-2 text-xs">
                {tierThresholds.slice().reverse().map(t => (
                  <div key={t.tier} className={`flex-1 text-center py-1 rounded ${loyaltyCustomer.loyaltyPoints >= t.min ? tierColors[t.tier] : 'bg-gray-100 text-gray-400'}`}>{t.tier}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
