import { useState } from 'react';
import { Shield, Search, Filter, Clock, User, Activity } from 'lucide-react';
import { useAuditLogs } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';
import { formatDate } from '../utils/helpers';

const actionColors: Record<string, string> = {
  CREATE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  UPDATE: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  LOGIN: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  LOGOUT: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  VOID: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  REFUND: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  STATUS_CHANGE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export function AuditLogPage() {
  const { data: logs, isLoading } = useAuditLogs();
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');

  const entities = [...new Set((logs || []).map((l: any) => l.entity).filter(Boolean))];
  const actions = [...new Set((logs || []).map((l: any) => l.action).filter(Boolean))];

  const filtered = (logs || []).filter((l: any) => {
    if (entityFilter !== 'ALL' && l.entity !== entityFilter) return false;
    if (actionFilter !== 'ALL' && l.action !== actionFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (l.action?.toLowerCase().includes(s) || l.entity?.toLowerCase().includes(s) ||
        l.details?.toLowerCase().includes(s) || l.user?.firstName?.toLowerCase().includes(s));
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-blue-600" /> Audit Log
          </h1>
          <p className="text-gray-500 mt-1">Track all system activities and changes</p>
        </div>
        <p className="text-sm text-gray-400">{filtered.length} entries</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <select value={entityFilter} onChange={e => setEntityFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border text-sm dark:bg-gray-800 dark:border-gray-700" aria-label="Filter by entity">
          <option value="ALL">All Entities</option>
          {entities.map(e => <option key={e as string} value={e as string}>{e as string}</option>)}
        </select>
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border text-sm dark:bg-gray-800 dark:border-gray-700" aria-label="Filter by action">
          <option value="ALL">All Actions</option>
          {actions.map(a => <option key={a as string} value={a as string}>{a as string}</option>)}
        </select>
      </div>

      {isLoading ? <Skeleton className="h-60 w-full" /> : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Time</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Action</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Entity</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Details</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.slice(0, 100).map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(log.createdAt)}</div>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{log.user?.firstName || 'System'} {log.user?.lastName || ''}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${actionColors[log.action] || 'bg-gray-100 text-gray-600'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{log.entity || '-'}</td>
                    <td className="p-4 text-xs text-gray-500 max-w-xs truncate">{log.details || '-'}</td>
                    <td className="p-4 text-xs text-gray-400 font-mono">{log.ipAddress || '-'}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-400">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No audit logs found
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
          {filtered.length > 100 && (
            <div className="p-4 text-center text-xs text-gray-400 border-t border-gray-100 dark:border-gray-700">
              Showing first 100 of {filtered.length} entries
            </div>
          )}
        </div>
      )}
    </div>
  );
}
