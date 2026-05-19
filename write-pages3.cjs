const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, 'frontend', 'src', 'pages');

// ═══════════════════════════════════════════════════════════════════════
// ReportsPage.tsx — Date range, margins, staff performance, CSV export
// ═══════════════════════════════════════════════════════════════════════
const reportsPage = `import { useState, useMemo } from 'react';
import { formatCurrency } from '../utils/helpers';
import { BarChart3, TrendingUp, ShoppingBag, DollarSign, Download, Users, Calendar, Percent } from 'lucide-react';
import { useSalesReport, useTopProducts, useOrders, useStaffPerformance, useMarginReport } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

type ReportTab = 'overview' | 'products' | 'staff' | 'margins';

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

  const paymentBreakdown = (orders || []).reduce((acc: Record<string, number>, o: any) => {
    (o.payments || []).forEach((p: any) => { acc[p.method] = (acc[p.method] || 0) + p.amount; }); return acc;
  }, {});
  const totalPayments = Object.values(paymentBreakdown).reduce((s: number, v) => s + (v as number), 0);
  const orderTypeBreakdown = (orders || []).reduce((acc: Record<string, number>, o: any) => { acc[o.orderType] = (acc[o.orderType] || 0) + 1; return acc; }, {});

  const exportCSV = (data: any[], filename: string) => {
    if (!data.length) return toast.error('No data to export');
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(r => Object.values(r).join(',')).join('\\n');
    const blob = new Blob([headers + '\\n' + rows], { type: 'text/csv' });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-500 mt-1">Business analytics and insights</p>
        </div>
        <button onClick={() => exportCSV(
          (orders || []).map((o: any) => ({ Order: o.orderNumber, Date: o.createdAt, Total: o.totalAmount, Status: o.status, Type: o.orderType, Customer: o.customer?.firstName || 'Walk-in' })),
          'orders-report'
        )} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Date Range Picker */}
      <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-card">
        <Calendar className="w-5 h-5 text-gray-400" />
        {(['today', 'week', 'month', 'custom'] as const).map(d => (
          <button key={d} onClick={() => setDateRange(d)}
            className={\`px-3 py-1.5 rounded-lg text-xs font-medium \${dateRange === d ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600'}\`}>
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
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {([{ key: 'overview', label: 'Overview' }, { key: 'products', label: 'Products' }, { key: 'staff', label: 'Staff Performance' }, { key: 'margins', label: 'Margins' }] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key as ReportTab)}
            className={\`flex-1 py-2 rounded-lg text-sm font-medium \${tab === t.key ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}\`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      {loadingSales ? <Skeleton className="h-32 w-full" /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-2"><div className={\`w-10 h-10 \${stat.color} rounded-lg flex items-center justify-center\`}><stat.icon className="w-5 h-5 text-white" /></div><p className="text-sm text-gray-500">{stat.label}</p></div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700"><h2 className="font-semibold">Payment Methods</h2></div>
            <div className="p-5 space-y-3">
              {Object.entries(paymentBreakdown).map(([method, amount]) => (
                <div key={method} className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-sm font-medium">{method}</span></div>
                  <div className="text-right"><p className="text-sm font-medium">{formatCurrency(amount as number)}</p><p className="text-xs text-gray-500">{totalPayments > 0 ? Math.round(((amount as number) / totalPayments) * 100) : 0}%</p></div>
                </div>
              ))}
              {Object.keys(paymentBreakdown).length === 0 && <p className="text-sm text-gray-400 text-center">No data</p>}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700"><h2 className="font-semibold">Order Types</h2></div>
            <div className="p-5 space-y-3">
              {Object.entries(orderTypeBreakdown).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between"><span className="text-sm font-medium">{type.replace('_', ' ')}</span><span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">{count as number} orders</span></div>
              ))}
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
                    <td className="p-4 text-center"><span className={\`px-2 py-1 rounded-full text-xs font-medium \${m.margin > 50 ? 'bg-green-100 text-green-700' : m.margin > 30 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}\`}>{m.margin.toFixed(1)}%</span></td>
                  </tr>
                ))}
                {(margins || []).length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No margin data</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync(path.join(pagesDir, 'ReportsPage.tsx'), reportsPage);
console.log('✅ ReportsPage.tsx');

// ═══════════════════════════════════════════════════════════════════════
// CustomersPage.tsx — Enhanced with loyalty tiers, points history, redeem
// ═══════════════════════════════════════════════════════════════════════
const customersPage = `import { useState, useMemo } from 'react';
import { Search, Plus, Star, Award, History, X, Gift } from 'lucide-react';
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer, useRedeemLoyalty, useLoyaltyHistory } from '../hooks/useApi';
import { formatCurrency } from '../utils/helpers';
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
        <div><h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Customers</h1><p className="text-gray-500 mt-1">Manage customers & loyalty programs</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"><Plus className="w-4 h-4" /> Add Customer</button>
      </div>

      <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)}
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
                    <span className={\`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium \${tierColors[tier] || tierColors.BRONZE}\`}>
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
            <div className="flex justify-between mb-4"><h2 className="text-lg font-bold">{editing ? 'Edit' : 'Add'} Customer</h2><button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button></div>
            <div className="space-y-3">
              {[{ key: 'firstName', label: 'First Name *' }, { key: 'lastName', label: 'Last Name' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }, { key: 'address', label: 'Address' }].map(f => (
                <div key={f.key}><label className="text-xs font-medium text-gray-500">{f.label}</label>
                  <input type="text" value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              ))}
            </div>
            <button onClick={handleSave} className="w-full mt-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
              {editing ? 'Update' : 'Create'} Customer
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl text-center">
            <p className="text-lg font-bold mb-2">Delete Customer?</p><p className="text-sm text-gray-500 mb-4">This action cannot be undone.</p>
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
              <span className={\`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium \${tierColors[getTier(loyaltyCustomer.loyaltyPoints)]}\`}>{getTier(loyaltyCustomer.loyaltyPoints)} Member</span>
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
                    <span className={\`font-bold \${t.type === 'EARNED' ? 'text-green-600' : 'text-red-600'}\`}>{t.type === 'EARNED' ? '+' : '-'}{t.points}</span>
                  </div>
                ))}
                {(loyaltyHistory || []).length === 0 && <p className="text-sm text-gray-400 text-center py-4">No history yet</p>}
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-xs font-medium text-gray-500 mb-1">Tier Progress</p>
              <div className="flex items-center gap-2 text-xs">
                {tierThresholds.slice().reverse().map(t => (
                  <div key={t.tier} className={\`flex-1 text-center py-1 rounded \${loyaltyCustomer.loyaltyPoints >= t.min ? tierColors[t.tier] : 'bg-gray-100 text-gray-400'}\`}>{t.tier}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync(path.join(pagesDir, 'CustomersPage.tsx'), customersPage);
console.log('✅ CustomersPage.tsx');

console.log('\\n✅ Phase 2 pages written');
