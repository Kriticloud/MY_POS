import { useState, useMemo } from 'react';
import { formatCurrency } from '../utils/helpers';
import { BarChart3, TrendingUp, ShoppingBag, DollarSign, Download, Users, Calendar, Percent, FileText, Clock, Play, Trash2 } from 'lucide-react';
import { useSalesReport, useTopProducts, useOrders, useStaffPerformance, useMarginReport, useScheduledReports, useCreateScheduledReport, useRunScheduledReport, useDeleteScheduledReport } from '../hooks/useApi';
import { useSettingsStore } from '../store/settingsStore';
import { Skeleton } from '../components/ui/Skeleton';
import { SimpleBarChart, SimpleDonutChart } from '../components/Charts';
import { exportOrdersReport } from '../services/pdfExport';
import toast from 'react-hot-toast';

type ReportTab = 'overview' | 'products' | 'staff' | 'margins' | 'scheduled';

export function ReportsPage() {
  const [tab, setTab] = useState<ReportTab>('overview');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const dateParams = useMemo(() => {
    const now = new Date();
    if (dateRange === 'today') return { startDate: now.toISOString().split('T')[0], endDate: now.toISOString().split('T')[0] };
    if (dateRange === 'week') { const w = new Date(now); w.setDate(w.getDate() - 7); return { startDate: w.toISOString().split('T')[0], endDate: now.toISOString().split('T')[0] }; }
    if (dateRange === 'month') { const m = new Date(now); m.setDate(m.getDate() - 30); return { startDate: m.toISOString().split('T')[0], endDate: now.toISOString().split('T')[0] }; }
    return startDate && endDate ? { startDate, endDate } : {};
  }, [dateRange, startDate, endDate]);

  const { data: sales, isLoading: loadingSales } = useSalesReport(dateParams);
  const { data: topProducts, isLoading: loadingTop } = useTopProducts();
  const { data: orders } = useOrders();
  const { data: staffPerf } = useStaffPerformance();
  const { data: margins } = useMarginReport();
  const businessName = useSettingsStore((s) => s.businessName);

  const paymentBreakdown = (orders || []).reduce((acc: Record<string, number>, o: any) => {
    (o.payments || []).forEach((p: any) => { acc[p.method] = (acc[p.method] || 0) + p.amount; }); return acc;
  }, {});
  const totalPayments = Object.values(paymentBreakdown).reduce((s: number, v) => s + (v as number), 0);
  const orderTypeBreakdown = (orders || []).reduce((acc: Record<string, number>, o: any) => { acc[o.orderType] = (acc[o.orderType] || 0) + 1; return acc; }, {});

  const exportCSV = (data: any[], filename: string) => {
    if (!data.length) return toast.error('No data to export');
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(r => Object.values(r).join(',')).join('\n');
    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename + '.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported');
  };

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(sales?.totalRevenue || 0), icon: DollarSign, color: 'bg-blue-500' },
    { label: 'Total Orders', value: String(sales?.orderCount || 0), icon: ShoppingBag, color: 'bg-green-500' },
    { label: 'Avg Order Value', value: formatCurrency(sales?.averageOrderValue || 0), icon: TrendingUp, color: 'bg-amber-500' },
    { label: 'Total Tax', value: formatCurrency(sales?.totalTax || 0), icon: BarChart3, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-500 mt-1">Business analytics and insights</p>
        </div>
        <div className="flex flex-wrap gap-2">
        <button onClick={() => exportCSV(
          (orders || []).map((o: any) => ({ Order: o.orderNumber, Date: o.createdAt, Total: o.totalAmount, Status: o.status, Type: o.orderType, Customer: o.customer?.firstName || 'Walk-in' })),
          'orders-report'
        )} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
          <Download className="w-4 h-4" /> Export CSV
        </button>
        <button onClick={() => exportOrdersReport(orders || [], businessName)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700">
          <FileText className="w-4 h-4" /> PDF Report
        </button>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-card">
        <Calendar className="w-5 h-5 text-gray-400" />
        {(['today', 'week', 'month', 'custom'] as const).map(d => (
          <button key={d} onClick={() => setDateRange(d)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${dateRange === d ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600'}`}>
            {d === 'today' ? 'Today' : d === 'week' ? 'This Week' : d === 'month' ? 'This Month' : 'Custom'}
          </button>
        ))}
        {dateRange === 'custom' && (
          <>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-2 py-1 border rounded text-sm" />
            <span className="text-gray-400">to</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-2 py-1 border rounded text-sm" />
          </>
        )}
      </div>

      {/* Report Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 overflow-x-auto">
        {([{ key: 'overview', label: 'Overview' }, { key: 'products', label: 'Products' }, { key: 'staff', label: 'Staff Performance' }, { key: 'margins', label: 'Margins' }, { key: 'scheduled', label: 'Scheduled' }] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key as ReportTab)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${tab === t.key ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      {loadingSales ? <Skeleton className="h-32 w-full" /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-2"><div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}><stat.icon className="w-5 h-5 text-white" /></div><p className="text-sm text-gray-500">{stat.label}</p></div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700"><h2 className="font-semibold">Payment Methods</h2></div>
            <div className="p-5">
              {Object.keys(paymentBreakdown).length > 0 ? (
                <div className="flex items-center justify-center gap-6">
                  <SimpleDonutChart
                    data={Object.entries(paymentBreakdown).map(([label, value]) => ({
                      label, value: value as number,
                      color: { CASH: '#10B981', CARD: '#3B82F6', UPI: '#8B5CF6', WALLET: '#F59E0B' }[label] || '#6B7280',
                    }))}
                    centerValue={formatCurrency(totalPayments)}
                    centerLabel="Total"
                  />
                  <div className="space-y-2">
                    {Object.entries(paymentBreakdown).map(([method, amount]) => (
                      <div key={method} className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: { CASH: '#10B981', CARD: '#3B82F6', UPI: '#8B5CF6', WALLET: '#F59E0B' }[method] || '#6B7280' }} />
                        <span className="text-gray-600 dark:text-gray-300">{method}</span>
                        <span className="font-medium ml-auto">{formatCurrency(amount as number)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : <p className="text-sm text-gray-400 text-center py-8">No data</p>}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700"><h2 className="font-semibold">Order Types</h2></div>
            <div className="p-5">
              {Object.keys(orderTypeBreakdown).length > 0 ? (
                <SimpleBarChart
                  data={Object.entries(orderTypeBreakdown).map(([label, value], i) => ({
                    label: label.replace('_', ' '),
                    value: value as number,
                    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][i % 6],
                  }))}
                  height={180}
                />
              ) : <p className="text-sm text-gray-400 text-center py-8">No data</p>}
            </div>
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 className="font-semibold">Top Selling Products</h2>
            <button onClick={() => exportCSV((topProducts || []).map((p: any) => ({ Product: p.product?.name, Sold: p.totalQuantity, Price: p.product?.price })), 'top-products')}
              className="text-xs text-blue-600 hover:text-blue-700"><Download className="w-4 h-4 inline mr-1" />Export</button>
          </div>
          {loadingTop ? <div className="p-5"><Skeleton className="h-40 w-full" /></div> : (
            <div className="p-5 space-y-3">
              {(topProducts || []).map((item: any, i: number) => {
                const maxQty = (topProducts || [])[0]?.totalQuantity || 1;
                return (<div key={i}><div className="flex justify-between text-sm mb-1"><span className="font-medium">{i + 1}. {item.product?.name || 'Unknown'}</span><span className="text-gray-500">{item.totalQuantity} sold • {formatCurrency((item.product?.price || 0) * item.totalQuantity)}</span></div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: (item.totalQuantity / maxQty * 100) + '%' }} /></div></div>);
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'staff' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700"><h2 className="font-semibold flex items-center gap-2"><Users className="w-5 h-5" /> Staff Performance</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                  <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Orders</th>
                  <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                  <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Avg Order</th>
                  <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Hours</th>
                  <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Revenue/Hr</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {(staffPerf || []).map((s: any) => (
                  <tr key={s.id}>
                    <td className="p-4 text-sm font-medium">{s.name}</td>
                    <td className="p-4 text-center text-sm">{s.orders}</td>
                    <td className="p-4 text-center text-sm">{formatCurrency(s.revenue)}</td>
                    <td className="p-4 text-center text-sm">{formatCurrency(s.avgOrder)}</td>
                    <td className="p-4 text-center text-sm">{s.hours}h</td>
                    <td className="p-4 text-center text-sm font-medium text-green-600">{formatCurrency(s.revenuePerHour)}</td>
                  </tr>
                ))}
                {(staffPerf || []).length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No performance data</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'margins' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700"><h2 className="font-semibold flex items-center gap-2"><Percent className="w-5 h-5" /> Profit Margins</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                  <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Sold</th>
                  <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                  <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Cost</th>
                  <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Profit</th>
                  <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {(margins || []).map((m: any) => (
                  <tr key={m.productId}>
                    <td className="p-4 text-sm font-medium">{m.name}</td>
                    <td className="p-4 text-center text-sm">{m.quantity}</td>
                    <td className="p-4 text-center text-sm">{formatCurrency(m.revenue)}</td>
                    <td className="p-4 text-center text-sm">{formatCurrency(m.cost)}</td>
                    <td className="p-4 text-center text-sm text-green-600 font-medium">{formatCurrency(m.profit)}</td>
                    <td className="p-4 text-center"><span className={`px-2 py-1 rounded-full text-xs font-medium ${m.margin > 50 ? 'bg-green-100 text-green-700' : m.margin > 30 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{m.margin.toFixed(1)}%</span></td>
                  </tr>
                ))}
                {(margins || []).length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No margin data</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'scheduled' && <ScheduledReportsTab />}
    </div>
  );
}

function ScheduledReportsTab() {
  const { data: reports } = useScheduledReports();
  const createReport = useCreateScheduledReport();
  const runReport = useRunScheduledReport();
  const deleteReport = useDeleteScheduledReport();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'DAILY_SALES', schedule: '0 8 * * *', recipients: '' });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2"><Clock className="w-5 h-5" /> Scheduled Reports</h2>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
          + New Schedule
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-5 space-y-3">
          <input placeholder="Report Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              className="px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600">
              <option value="DAILY_SALES">Daily Sales</option>
              <option value="WEEKLY_SUMMARY">Weekly Summary</option>
              <option value="MONTHLY_REPORT">Monthly Report</option>
              <option value="LOW_STOCK_ALERT">Low Stock Alert</option>
            </select>
            <input placeholder="Cron (0 8 * * *)" value={form.schedule} onChange={e => setForm({ ...form, schedule: e.target.value })}
              className="px-3 py-2 rounded-lg border text-sm font-mono dark:bg-gray-700 dark:border-gray-600" />
            <input placeholder="email1@test.com, email2@test.com" value={form.recipients} onChange={e => setForm({ ...form, recipients: e.target.value })}
              className="px-3 py-2 rounded-lg border text-sm dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <button onClick={async () => {
            if (!form.name || !form.recipients) return;
            await createReport.mutateAsync({ ...form, recipients: form.recipients.split(',').map(e => e.trim()), enabled: true });
            setForm({ name: '', type: 'DAILY_SALES', schedule: '0 8 * * *', recipients: '' });
            setShowForm(false); toast.success('Scheduled report created');
          }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Create</button>
        </div>
      )}

      <div className="space-y-2">
        {(reports || []).map((r: any) => (
          <div key={r.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{r.name}</p>
              <p className="text-xs text-gray-500">{r.type} • {r.schedule} • {r.recipients?.join(', ')}</p>
              {r.lastRun && <p className="text-xs text-green-600">Last run: {new Date(r.lastRun).toLocaleString()}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={async () => { await runReport.mutateAsync(r.id); toast.success('Report sent'); }}
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="Run now"><Play className="w-4 h-4" /></button>
              <button onClick={async () => { await deleteReport.mutateAsync(r.id); toast.success('Deleted'); }}
                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Delete"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {(reports || []).length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>No scheduled reports yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
