import { useState, useMemo } from 'react';
import { Calendar, Plus, Clock, User, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppointments, useCreateAppointment, useUpdateAppointmentStatus, useEmployees, useCustomers } from '../hooks/useApi';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import { Skeleton } from '../components/ui/Skeleton';

const statusColors: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  IN_PROGRESS: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  NO_SHOW: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

export function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);
  const { data: appointments, isLoading } = useAppointments({ date: selectedDate });
  const { data: employees } = useEmployees();
  const { data: customers } = useCustomers();
  const createAppointment = useCreateAppointment();
  const updateStatus = useUpdateAppointmentStatus();

  const [form, setForm] = useState({
    service: '', staffId: '', customerId: '', startTime: '', endTime: '', price: '', notes: '',
  });

  const staff = useMemo(() => (employees || []).filter((e: any) => e.isActive), [employees]);

  const navigateDate = (offset: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleCreate = async () => {
    try {
      await createAppointment.mutateAsync({
        ...form,
        startTime: `${selectedDate}T${form.startTime}:00`,
        endTime: `${selectedDate}T${form.endTime}:00`,
        price: form.price ? parseFloat(form.price) : undefined,
        customerId: form.customerId || undefined,
      });
      setShowModal(false);
      setForm({ service: '', staffId: '', customerId: '', startTime: '', endTime: '', price: '', notes: '' });
      toast.success('Appointment created');
    } catch (e: any) { toast.error(e?.response?.data?.message || 'Failed to create'); }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Appointment ${status.toLowerCase()}`);
    } catch { toast.error('Failed to update'); }
  };

  // Build timeline grid
  const appointmentsByStaff = useMemo(() => {
    const map: Record<string, any[]> = {};
    (appointments || []).forEach((a: any) => {
      const key = a.staffId || 'unassigned';
      (map[key] = map[key] || []).push(a);
    });
    return map;
  }, [appointments]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="text-gray-500 mt-1">Schedule and manage appointments</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" /> New Appointment
        </button>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-card">
        <button onClick={() => navigateDate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 border rounded-lg text-sm bg-white dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <button onClick={() => navigateDate(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <ChevronRight className="w-5 h-5" />
        </button>
        <button onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200">Today</button>
        <div className="ml-auto text-sm text-gray-500">
          {(appointments || []).length} appointments
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(statusColors).slice(0, 4).map(([status, cls]) => {
          const count = (appointments || []).filter((a: any) => a.status === status).length;
          return (
            <div key={status} className={`${cls} rounded-xl p-4 text-center`}>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs font-medium">{status.replace('_', ' ')}</p>
            </div>
          );
        })}
      </div>

      {/* Timeline View */}
      {isLoading ? <Skeleton className="h-96 w-full" /> : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Time headers */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <div className="w-40 shrink-0 p-3 text-xs font-semibold text-gray-500 uppercase">Staff</div>
                <div className="flex-1 flex">
                  {hours.map(h => (
                    <div key={h} className="flex-1 p-2 text-center text-xs text-gray-500 border-l border-gray-100 dark:border-gray-700">
                      {h > 12 ? h - 12 : h}{h >= 12 ? 'PM' : 'AM'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Staff rows */}
              {staff.map((s: any) => {
                const staffAppts = appointmentsByStaff[s.id] || [];
                return (
                  <div key={s.id} className="flex border-b border-gray-100 dark:border-gray-700 min-h-[60px]">
                    <div className="w-40 shrink-0 p-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                        {s.firstName?.[0]}{s.lastName?.[0]}
                      </div>
                      <span className="text-sm font-medium truncate">{s.firstName} {s.lastName}</span>
                    </div>
                    <div className="flex-1 relative">
                      {staffAppts.map((appt: any) => {
                        const start = new Date(appt.startTime);
                        const end = new Date(appt.endTime);
                        const startHr = start.getHours() + start.getMinutes() / 60;
                        const endHr = end.getHours() + end.getMinutes() / 60;
                        const left = ((startHr - 8) / 12) * 100;
                        const width = ((endHr - startHr) / 12) * 100;
                        return (
                          <div key={appt.id}
                            className={`absolute top-1 bottom-1 rounded-lg px-2 py-1 text-xs cursor-pointer overflow-hidden ${statusColors[appt.status] || statusColors.SCHEDULED}`}
                            style={{ left: `${left}%`, width: `${Math.max(width, 3)}%` }}
                            title={`${appt.service} - ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                          >
                            <p className="font-medium truncate">{appt.service}</p>
                            <p className="truncate opacity-75">{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold">All Appointments</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {(appointments || []).map((appt: any) => (
            <div key={appt.id} className="p-4 flex items-center gap-4">
              <div className="flex-1">
                <p className="font-medium">{appt.service}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />
                    {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                    {new Date(appt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />
                    {appt.staff ? `${appt.staff.firstName} ${appt.staff.lastName}` : 'Unassigned'}
                  </span>
                  {appt.price && <span>{formatCurrency(appt.price)}</span>}
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[appt.status]}`}>
                {appt.status.replace('_', ' ')}
              </span>
              <div className="flex gap-1">
                {appt.status === 'SCHEDULED' && (
                  <>
                    <button onClick={() => handleStatusChange(appt.id, 'IN_PROGRESS')} className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs hover:bg-amber-200">Start</button>
                    <button onClick={() => handleStatusChange(appt.id, 'CANCELLED')} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200">Cancel</button>
                  </>
                )}
                {appt.status === 'IN_PROGRESS' && (
                  <button onClick={() => handleStatusChange(appt.id, 'COMPLETED')} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200">Complete</button>
                )}
              </div>
            </div>
          ))}
          {(appointments || []).length === 0 && <p className="p-8 text-center text-gray-400">No appointments for this date</p>}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-bold">New Appointment</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Service *</label>
                <input type="text" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. Haircut, Manicure" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Staff *</label>
                <select value={form.staffId} onChange={e => setForm({ ...form, staffId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600">
                  <option value="">Select staff</option>
                  {staff.map((s: any) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Customer</label>
                <select value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600">
                  <option value="">Walk-in</option>
                  {(customers || []).map((c: any) => <option key={c.id} value={c.id}>{c.firstName} {c.lastName || ''}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Start Time *</label>
                  <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">End Time *</label>
                  <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Price</label>
                <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600" rows={2} />
              </div>
            </div>
            <button onClick={handleCreate} disabled={!form.service || !form.staffId || !form.startTime || !form.endTime}
              className="w-full mt-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300">
              Create Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
