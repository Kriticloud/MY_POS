import { useState } from 'react';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Clock, Lock, Unlock, History } from 'lucide-react';
import { useCashDrawerCurrent, useCashDrawerSessions, useOpenDrawer, useCloseDrawer, useCashTransaction } from '../hooks/useApi';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import { Skeleton } from '../components/ui/Skeleton';

export function CashDrawerPage() {
  const { data: currentSession, isLoading } = useCashDrawerCurrent();
  const { data: sessions } = useCashDrawerSessions();
  const openDrawer = useOpenDrawer();
  const closeDrawer = useCloseDrawer();
  const cashTx = useCashTransaction();

  const [openingBalance, setOpeningBalance] = useState('');
  const [closingBalance, setClosingBalance] = useState('');
  const [txType, setTxType] = useState('CASH_IN');
  const [txAmount, setTxAmount] = useState('');
  const [txReason, setTxReason] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleOpen = async () => {
    try {
      await openDrawer.mutateAsync({ openingBalance: parseFloat(openingBalance) || 0 });
      setOpeningBalance('');
      toast.success('Cash drawer opened');
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Failed'); }
  };

  const handleClose = async () => {
    try {
      await closeDrawer.mutateAsync({ closingBalance: parseFloat(closingBalance) || 0 });
      setClosingBalance('');
      toast.success('Cash drawer closed');
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Failed'); }
  };

  const handleTransaction = async () => {
    try {
      await cashTx.mutateAsync({ type: txType, amount: parseFloat(txAmount) || 0, reason: txReason });
      setTxAmount('');
      setTxReason('');
      toast.success('Transaction recorded');
    } catch { toast.error('Failed'); }
  };

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Cash Drawer</h1>
          <p className="text-gray-500 mt-1">Manage cash flow and drawer sessions</p>
        </div>
        <button onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-medium hover:bg-gray-200">
          <History className="w-4 h-4" /> {showHistory ? 'Current' : 'History'}
        </button>
      </div>

      {!showHistory ? (
        <>
          {/* Current Session Status */}
          <div className={`rounded-2xl p-6 shadow-card ${currentSession ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200' : 'bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'}`}>
            <div className="flex items-center gap-3 mb-4">
              {currentSession ? <Unlock className="w-8 h-8 text-green-600" /> : <Lock className="w-8 h-8 text-gray-400" />}
              <div>
                <h2 className="text-xl font-bold">{currentSession ? 'Drawer is OPEN' : 'Drawer is CLOSED'}</h2>
                {currentSession && (
                  <p className="text-sm text-gray-500">
                    Opened by {currentSession.user?.firstName} {currentSession.user?.lastName} at {new Date(currentSession.openedAt).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
            {currentSession && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Opening Balance</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(currentSession.openingBalance)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Session Duration</p>
                  <p className="text-2xl font-bold">{Math.round((Date.now() - new Date(currentSession.openedAt).getTime()) / 60000)}m</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Session Started</p>
                  <p className="text-lg font-bold">{new Date(currentSession.openedAt).toLocaleTimeString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Open/Close Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!currentSession ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Unlock className="w-5 h-5 text-green-600" /> Open Drawer</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">Opening Balance (Starting Cash)</label>
                    <div className="flex items-center gap-2 mt-1">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <input type="number" step="0.01" value={openingBalance} onChange={e => setOpeningBalance(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600" placeholder="0.00" />
                    </div>
                  </div>
                  <button onClick={handleOpen} className="w-full py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700">
                    Open Cash Drawer
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-red-600" /> Close Drawer</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">Closing Balance (Count Cash)</label>
                    <div className="flex items-center gap-2 mt-1">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <input type="number" step="0.01" value={closingBalance} onChange={e => setClosingBalance(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600" placeholder="0.00" />
                    </div>
                  </div>
                  <button onClick={handleClose} className="w-full py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">
                    Close Cash Drawer
                  </button>
                </div>
              </div>
            )}

            {/* Cash In/Out */}
            {currentSession && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5 text-blue-600" /> Cash In/Out</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {['CASH_IN', 'CASH_OUT', 'PAID_IN', 'PAID_OUT'].map(t => (
                      <button key={t} onClick={() => setTxType(t)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium ${txType === t ? (t.includes('IN') ? 'bg-green-600 text-white' : 'bg-red-600 text-white') : 'bg-gray-100 dark:bg-gray-700'}`}>
                        {t.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                  <input type="number" step="0.01" value={txAmount} onChange={e => setTxAmount(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600" placeholder="Amount" />
                  <input type="text" value={txReason} onChange={e => setTxReason(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600" placeholder="Reason (optional)" />
                  <button onClick={handleTransaction} disabled={!txAmount}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300">
                    Record Transaction
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Session History */
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Cashier</th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Opening</th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Closing</th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Expected</th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Difference</th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {(sessions || []).map((s: any) => (
                <tr key={s.id}>
                  <td className="p-4 text-sm">{new Date(s.openedAt).toLocaleDateString()} {new Date(s.openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="p-4 text-sm">{s.user?.firstName} {s.user?.lastName}</td>
                  <td className="p-4 text-center text-sm">{formatCurrency(s.openingBalance)}</td>
                  <td className="p-4 text-center text-sm">{s.closingBalance != null ? formatCurrency(s.closingBalance) : '-'}</td>
                  <td className="p-4 text-center text-sm">{s.expectedBalance != null ? formatCurrency(s.expectedBalance) : '-'}</td>
                  <td className="p-4 text-center">
                    {s.difference != null ? (
                      <span className={`text-sm font-medium ${s.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {s.difference >= 0 ? '+' : ''}{formatCurrency(s.difference)}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.closedAt ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                      {s.closedAt ? 'Closed' : 'Open'}
                    </span>
                  </td>
                </tr>
              ))}
              {(sessions || []).length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-400">No sessions yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
