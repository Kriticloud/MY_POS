import { motion } from 'framer-motion';
import { Users, Clock, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useTables, useUpdateTableStatus } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useSettingsStore, getPageTitle, getEntityLabels } from '../store/settingsStore';

const statusConfig: Record<string, { bg: string; text: string; icon: any; dot: string }> = {
  AVAILABLE: { bg: 'bg-green-50 dark:bg-green-900/20 border-green-200', text: 'text-green-700', icon: CheckCircle, dot: 'bg-green-500' },
  OCCUPIED: { bg: 'bg-red-50 dark:bg-red-900/20 border-red-200', text: 'text-red-700', icon: Users, dot: 'bg-red-500' },
  RESERVED: { bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200', text: 'text-amber-700', icon: Clock, dot: 'bg-amber-500' },
  CLEANING: { bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200', text: 'text-blue-700', icon: AlertCircle, dot: 'bg-blue-500' },
};

export function TablesPage() {
  const { data: tables, isLoading } = useTables();
  const updateStatus = useUpdateTableStatus();
  const [selected, setSelected] = useState<any>(null);
  const businessType = useSettingsStore((s) => s.businessType);
  const pageInfo = getPageTitle('/tables', businessType);
  const labels = getEntityLabels(businessType);

  const handleStatus = async (tableId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id: tableId, status });
      toast.success(`${labels.table} updated to ${status}`);
      setSelected(null);
    } catch { toast.error('Failed to update table'); }
  };

  const floors = (tables || []).reduce((acc: Record<string, any[]>, t: any) => {
    const floor = t.floor || 'Main';
    (acc[floor] = acc[floor] || []).push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{pageInfo.title}</h1>
          <p className="text-gray-500 mt-1">{pageInfo.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          {Object.entries(statusConfig).map(([status, cfg]) => (
            <div key={status} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} /> {status}
            </div>
          ))}
        </div>
      </div>

      {isLoading ? <Skeleton className="h-60 w-full" /> : Object.entries(floors).map(([floor, floorTables]) => (
        <div key={floor}>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{floor}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {(floorTables as any[]).map((table: any) => {
              const cfg = statusConfig[table.status] || statusConfig.AVAILABLE;
              const Icon = cfg.icon;
              const activeOrder = (table.orders || [])[0];
              return (
                <motion.button key={table.id} whileTap={{ scale: 0.97 }} onClick={() => setSelected(table)}
                  className={`${cfg.bg} border rounded-xl p-4 text-left transition-all hover:shadow-md`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${cfg.text}`} />
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${cfg.text} bg-white/50`}>{table.status}</span>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">{table.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{table.capacity} seats</p>
                  {activeOrder && <p className="text-xs text-blue-600 mt-1 font-medium">{activeOrder.orderNumber}</p>}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Table Detail Modal */}
      {selected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{selected.name}</h2>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 mb-4">
              <p className="text-sm"><span className="text-gray-500">Capacity:</span> {selected.capacity} seats</p>
              <p className="text-sm"><span className="text-gray-500">Floor:</span> {selected.floor}</p>
              <p className="text-sm"><span className="text-gray-500">Status:</span> <span className={`font-medium ${statusConfig[selected.status]?.text}`}>{selected.status}</span></p>
              {(selected.orders || []).length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Active Order</p>
                  <p className="text-sm font-medium">{selected.orders[0].orderNumber} - {formatCurrency(selected.orders[0].totalAmount)}</p>
                </div>
              )}
            </div>
            <p className="text-xs font-medium text-gray-500 mb-2">Change Status</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(statusConfig).map(status => (
                <button key={status} onClick={() => handleStatus(selected.id, status)} disabled={selected.status === status}
                  className={`py-2 rounded-lg text-xs font-medium transition-all ${selected.status === status ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                  {status}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
