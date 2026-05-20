import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Plus, Search, X, CreditCard, ArrowUpCircle, ToggleLeft, ToggleRight, Trash2, Copy } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import { Skeleton } from '../components/ui/Skeleton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export function GiftCardsPage() {
  const qc = useQueryClient();
  const { data: cards, isLoading } = useQuery({ queryKey: ['gift-cards'], queryFn: async () => { const { data } = await api.get('/gift-cards'); return data; } });
  const createCard = useMutation({ mutationFn: async (d: any) => { const { data } = await api.post('/gift-cards', d); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['gift-cards'] }) });
  const toggleCard = useMutation({ mutationFn: async (id: string) => { const { data } = await api.put(`/gift-cards/${id}/toggle`); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['gift-cards'] }) });
  const deleteCard = useMutation({ mutationFn: async (id: string) => { await api.delete(`/gift-cards/${id}`); }, onSuccess: () => qc.invalidateQueries({ queryKey: ['gift-cards'] }) });
  const topUp = useMutation({ mutationFn: async ({ code, amount }: { code: string; amount: number }) => { const { data } = await api.post(`/gift-cards/${code}/topup`, { amount }); return data; }, onSuccess: () => qc.invalidateQueries({ queryKey: ['gift-cards'] }) });

  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ initialValue: '50', expiresAt: '' });
  const [topUpCode, setTopUpCode] = useState<string | null>(null);
  const [topUpAmount, setTopUpAmount] = useState('');

  const filtered = (cards || []).filter((c: any) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!createForm.initialValue || parseFloat(createForm.initialValue) <= 0) { toast.error('Enter a valid amount'); return; }
    try {
      const card = await createCard.mutateAsync({
        initialValue: parseFloat(createForm.initialValue),
        expiresAt: createForm.expiresAt || undefined,
      });
      toast.success(`Gift card created: ${card.code}`);
      setShowCreate(false);
      setCreateForm({ initialValue: '50', expiresAt: '' });
    } catch { toast.error('Failed to create gift card'); }
  };

  const handleTopUp = async () => {
    if (!topUpCode || !topUpAmount || parseFloat(topUpAmount) <= 0) return;
    try {
      await topUp.mutateAsync({ code: topUpCode, amount: parseFloat(topUpAmount) });
      toast.success('Balance topped up');
      setTopUpCode(null);
      setTopUpAmount('');
    } catch { toast.error('Failed to top up'); }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Gift Cards</h1>
          <p className="text-gray-500 mt-1">Issue and manage gift cards</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium">
          <Plus className="w-4 h-4" /> Issue Gift Card
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by code..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
      </div>

      {isLoading ? <Skeleton className="h-64 w-full" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((card: any) => {
            const usedPercent = ((card.initialValue - card.balance) / card.initialValue) * 100;
            const expired = card.expiresAt && new Date(card.expiresAt) < new Date();
            return (
              <motion.div key={card.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-card overflow-hidden ${!card.isActive || expired ? 'opacity-60' : ''}`}>
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-4 text-white">
                  <div className="flex justify-between items-start">
                    <Gift className="w-8 h-8 opacity-80" />
                    <span className={`text-xs px-2 py-0.5 rounded-full ${card.isActive && !expired ? 'bg-white/20' : 'bg-red-500/50'}`}>
                      {expired ? 'Expired' : card.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-bold tracking-wider font-mono">{card.code}</p>
                  <button onClick={() => copyCode(card.code)} className="mt-1 text-xs opacity-70 hover:opacity-100 flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Balance</span>
                    <span className="font-bold text-lg">{formatCurrency(card.balance)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${100 - usedPercent}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Initial: {formatCurrency(card.initialValue)}</span>
                    <span>Used: {formatCurrency(card.initialValue - card.balance)}</span>
                  </div>
                  {card.expiresAt && (
                    <p className="text-xs text-gray-400">Expires: {new Date(card.expiresAt).toLocaleDateString()}</p>
                  )}
                  <div className="flex gap-2 pt-2 border-t dark:border-gray-700">
                    <button onClick={() => { setTopUpCode(card.code); setTopUpAmount(''); }}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100">
                      <ArrowUpCircle className="w-3 h-3" /> Top Up
                    </button>
                    <button onClick={() => toggleCard.mutateAsync(card.id)}
                      className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      {card.isActive ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>
                    <button onClick={() => { if (confirm('Delete this gift card?')) deleteCard.mutateAsync(card.id); }}
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {filtered.length === 0 && !isLoading && (
            <div className="col-span-full text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No gift cards found</p>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
              <div className="flex justify-between mb-4"><h2 className="text-lg font-bold">Issue Gift Card</h2><button onClick={() => setShowCreate(false)}><X className="w-5 h-5" /></button></div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Value ($)</label>
                  <input type="number" min="1" value={createForm.initialValue} onChange={e => setCreateForm({ ...createForm, initialValue: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border dark:bg-gray-700 dark:border-gray-600 text-sm" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 100, 200].map(v => (
                    <button key={v} onClick={() => setCreateForm({ ...createForm, initialValue: String(v) })}
                      className={`py-2 rounded-xl text-sm font-medium ${createForm.initialValue === String(v) ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                      ${v}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Expiry Date (optional)</label>
                  <input type="date" value={createForm.expiresAt} onChange={e => setCreateForm({ ...createForm, expiresAt: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border dark:bg-gray-700 dark:border-gray-600 text-sm" />
                </div>
              </div>
              <button onClick={handleCreate} disabled={createCard.isPending}
                className="w-full mt-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 disabled:opacity-50">
                {createCard.isPending ? 'Creating...' : 'Issue Gift Card'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Up Modal */}
      <AnimatePresence>
        {topUpCode && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
              <div className="flex justify-between mb-4"><h2 className="text-lg font-bold">Top Up: {topUpCode}</h2><button onClick={() => setTopUpCode(null)}><X className="w-5 h-5" /></button></div>
              <input type="number" min="1" value={topUpAmount} onChange={e => setTopUpAmount(e.target.value)} placeholder="Amount to add"
                className="w-full px-3 py-2.5 rounded-xl border dark:bg-gray-700 dark:border-gray-600 text-sm" />
              <button onClick={handleTopUp} disabled={topUp.isPending}
                className="w-full mt-3 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                {topUp.isPending ? 'Processing...' : 'Top Up'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
