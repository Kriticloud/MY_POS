import { useState, useMemo } from 'react';
import { formatCurrency } from '../utils/helpers';
import { Clock, UserCheck, UserX, ChevronRight, Activity, DollarSign, ShoppingBag, CalendarDays, Plus, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEmployees, useClockIn, useClockOut, useShiftSchedule, useSaveShiftSchedule } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

export function EmployeesPage() {
  const { data: employees, isLoading } = useEmployees();
  const clockIn = useClockIn();
  const clockOut = useClockOut();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<'roster' | 'schedule'>('roster');

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

      {/* Tab Bar */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        <button onClick={() => setTab('roster')} className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${tab === 'roster' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}>
          <UserCheck className="w-4 h-4" /> Staff Roster
        </button>
        <button onClick={() => setTab('schedule')} className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${tab === 'schedule' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}>
          <CalendarDays className="w-4 h-4" /> Shift Schedule
        </button>
      </div>

      {tab === 'roster' && (<>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Employee List */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-card">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold">Staff Roster</h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {(employees || []).map((emp: any) => (
                <div key={emp.id} className={`flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${selectedId === emp.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  onClick={() => setSelectedId(emp.id)}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden ${emp.clockedIn ? 'bg-green-100 text-green-700 ring-2 ring-green-400' : 'bg-gray-100 text-gray-500'}`}>
                    {emp.avatar ? (
                      <img src={emp.avatar} alt={`${emp.firstName} ${emp.lastName}`} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <>{emp.firstName[0]}{emp.lastName[0]}</>
                    )}
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
      </>)}

      {tab === 'schedule' && <ShiftScheduleTab employees={employees || []} />}
    </div>
  );
}

function ShiftScheduleTab({ employees }: { employees: any[] }) {
  const { data: shifts, isLoading } = useShiftSchedule();
  const saveShifts = useSaveShiftSchedule();
  const [localShifts, setLocalShifts] = useState<any[]>([]);
  const [dirty, setDirty] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  // Sync from server
  useMemo(() => {
    if (shifts && !dirty) setLocalShifts(shifts);
  }, [shifts]);

  const getWeekStart = () => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + 1 + weekOffset * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  };
  const weekStart = getWeekStart();
  const weekLabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(weekStart.getTime() + 6 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const weekKey = weekStart.toISOString().slice(0, 10);
  const weekShifts = localShifts.filter((s: any) => s.weekKey === weekKey);

  const addShift = (dayIndex: number) => {
    const newShift = {
      id: Date.now().toString(),
      weekKey,
      dayIndex,
      employeeId: employees[0]?.id || '',
      startTime: '09:00',
      endTime: '17:00',
    };
    setLocalShifts(prev => [...prev, newShift]);
    setDirty(true);
  };

  const updateShift = (id: string, field: string, val: string) => {
    setLocalShifts(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
    setDirty(true);
  };

  const removeShift = (id: string) => {
    setLocalShifts(prev => prev.filter(s => s.id !== id));
    setDirty(true);
  };

  const handleSave = async () => {
    try {
      await saveShifts.mutateAsync(localShifts);
      setDirty(false);
      toast.success('Shift schedule saved');
    } catch { toast.error('Failed to save schedule'); }
  };

  const getEmployeeName = (id: string) => {
    const emp = employees.find(e => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown';
  };

  const getHoursForEmployee = (empId: string) => {
    return weekShifts.filter((s: any) => s.employeeId === empId).reduce((total: number, s: any) => {
      const [sh, sm] = s.startTime.split(':').map(Number);
      const [eh, em] = s.endTime.split(':').map(Number);
      return total + (eh + em / 60) - (sh + sm / 60);
    }, 0);
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setWeekOffset(w => w - 1)} className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-card text-sm hover:bg-gray-50">← Prev</button>
          <h2 className="text-lg font-bold">{weekLabel}</h2>
          <button onClick={() => setWeekOffset(w => w + 1)} className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-card text-sm hover:bg-gray-50">Next →</button>
          {weekOffset !== 0 && <button onClick={() => setWeekOffset(0)} className="text-xs text-blue-600 hover:underline">Today</button>}
        </div>
        <button onClick={handleSave} disabled={!dirty || saveShifts.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          <Save className="w-4 h-4" /> {saveShifts.isPending ? 'Saving...' : 'Save Schedule'}
        </button>
      </div>

      {/* Weekly Hours Summary */}
      {employees.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {employees.map((emp: any) => {
            const hrs = getHoursForEmployee(emp.id);
            return hrs > 0 ? (
              <span key={emp.id} className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-card text-xs">
                <span className="font-medium">{emp.firstName}</span>: {hrs.toFixed(1)}h
              </span>
            ) : null;
          })}
        </div>
      )}

      {/* Day Columns */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {DAYS.map((day, dayIdx) => {
          const dayDate = new Date(weekStart.getTime() + dayIdx * 86400000);
          const isToday = new Date().toDateString() === dayDate.toDateString();
          const dayShifts = weekShifts.filter((s: any) => s.dayIndex === dayIdx);

          return (
            <div key={day} className={`bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden ${isToday ? 'ring-2 ring-blue-400' : ''}`}>
              <div className={`px-3 py-2 text-center text-xs font-bold ${isToday ? 'bg-blue-600 text-white' : 'bg-gray-50 dark:bg-gray-700'}`}>
                {day.slice(0, 3)} {dayDate.getDate()}
              </div>
              <div className="p-2 space-y-1.5 min-h-[100px]">
                {dayShifts.map((shift: any) => (
                  <div key={shift.id} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-xs space-y-1">
                    <select value={shift.employeeId} onChange={e => updateShift(shift.id, 'employeeId', e.target.value)}
                      className="w-full px-1 py-1 rounded border text-xs dark:bg-gray-700 dark:border-gray-600 truncate">
                      {employees.map((emp: any) => <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName[0]}.</option>)}
                    </select>
                    <div className="flex gap-1">
                      <input type="time" value={shift.startTime} onChange={e => updateShift(shift.id, 'startTime', e.target.value)}
                        className="flex-1 px-1 py-1 rounded border text-xs dark:bg-gray-700 dark:border-gray-600" />
                      <input type="time" value={shift.endTime} onChange={e => updateShift(shift.id, 'endTime', e.target.value)}
                        className="flex-1 px-1 py-1 rounded border text-xs dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <button onClick={() => removeShift(shift.id)} className="text-red-500 hover:text-red-700 flex items-center gap-0.5">
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                ))}
                <button onClick={() => addShift(dayIdx)} className="w-full py-1.5 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-400 text-xs hover:border-blue-300 hover:text-blue-500 flex items-center justify-center gap-1">
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
