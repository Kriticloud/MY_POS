import { useState } from 'react';
import { formatCurrency } from '../utils/helpers';
import { Clock, UserCheck, UserX, ChevronRight, Activity, DollarSign, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEmployees, useClockIn, useClockOut } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';

export function EmployeesPage() {
  const { data: employees, isLoading } = useEmployees();
  const clockIn = useClockIn();
  const clockOut = useClockOut();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleClockIn = async (id: string) => {
    try { await clockIn.mutateAsync(id); toast.success('Clocked in successfully'); } catch { toast.error('Failed to clock in'); }
  };
  const handleClockOut = async (id: string) => {
    try { await clockOut.mutateAsync(id); toast.success('Clocked out successfully'); } catch { toast.error('Failed to clock out'); }
  };

  const selected = (employees || []).find((e: any) => e.id === selectedId);
  const activeCount = (employees || []).filter((e: any) => e.clockedIn).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Employee Management</h1>
        <p className="text-gray-500 mt-1">Track shifts, clock in/out, and performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center"><UserCheck className="w-5 h-5 text-white" /></div></div>
          <p className="text-2xl font-bold mt-2">{activeCount}</p>
          <p className="text-sm text-gray-500">Clocked In Now</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center"><Activity className="w-5 h-5 text-white" /></div></div>
          <p className="text-2xl font-bold mt-2">{(employees || []).length}</p>
          <p className="text-sm text-gray-500">Total Staff</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center"><DollarSign className="w-5 h-5 text-white" /></div></div>
          <p className="text-2xl font-bold mt-2">{formatCurrency((employees || []).reduce((s: number, e: any) => s + (e.totalSalesToday || 0), 0))}</p>
          <p className="text-sm text-gray-500">Total Sales Today</p>
        </div>
      </div>

      {isLoading ? <Skeleton className="h-64 w-full" /> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee List */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-card">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold">Staff Roster</h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {(employees || []).map((emp: any) => (
                <div key={emp.id} className={`flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${selectedId === emp.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  onClick={() => setSelectedId(emp.id)}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${emp.clockedIn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {emp.firstName[0]}{emp.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{emp.firstName} {emp.lastName}</p>
                    <p className="text-xs text-gray-500">{emp.role} • {emp.email}</p>
                  </div>
                  <div className="text-right mr-2">
                    <p className="text-xs text-gray-500">{emp.ordersToday || 0} orders</p>
                    <p className="text-xs text-gray-500">{formatCurrency(emp.totalSalesToday || 0)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {emp.clockedIn ? (
                      <button onClick={(e) => { e.stopPropagation(); handleClockOut(emp.id); }}
                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200">
                        Clock Out
                      </button>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); handleClockIn(emp.id); }}
                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200">
                        Clock In
                      </button>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employee Detail */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold">Details</h2>
            </div>
            {selected ? (
              <div className="p-5 space-y-4">
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-xl font-bold ${selected.clockedIn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {selected.firstName[0]}{selected.lastName[0]}
                  </div>
                  <p className="font-semibold mt-2">{selected.firstName} {selected.lastName}</p>
                  <p className="text-sm text-gray-500">{selected.role}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${selected.clockedIn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {selected.clockedIn ? '🟢 On Shift' : '⚪ Off Shift'}
                  </span>
                </div>
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Hours Today</span><span className="font-medium">{(selected.totalHoursToday || 0).toFixed(1)}h</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Orders Today</span><span className="font-medium">{selected.ordersToday || 0}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Sales Today</span><span className="font-medium">{formatCurrency(selected.totalSalesToday || 0)}</span></div>
                  {selected.lastClockIn && <div className="flex justify-between text-sm"><span className="text-gray-500">Last Clock In</span><span className="font-medium text-xs">{new Date(selected.lastClockIn).toLocaleTimeString()}</span></div>}
                  {selected.lastClockOut && <div className="flex justify-between text-sm"><span className="text-gray-500">Last Clock Out</span><span className="font-medium text-xs">{new Date(selected.lastClockOut).toLocaleTimeString()}</span></div>}
                </div>
              </div>
            ) : (
              <div className="p-5 text-center text-gray-400 text-sm">Select an employee to view details</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
