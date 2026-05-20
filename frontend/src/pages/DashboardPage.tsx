import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { useDailySummary, useOrders, useTopProducts, useSalesReport } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore, getBusinessConfig, getEntityLabels } from '../store/settingsStore';
import { LiveClock } from '../components/LiveClock';
import { QuickActions } from '../components/QuickActions';
import { ActivityFeed } from '../components/ActivityFeed';
import { SimpleBarChart, SimpleDonutChart } from '../components/Charts';
import { useMemo } from 'react';
import { useI18nStore } from '../store/i18nStore';

export function DashboardPage() {
  const navigate = useNavigate();
  const businessType = useSettingsStore((s) => s.businessType);
  const config = getBusinessConfig(businessType);
  const labels = getEntityLabels(businessType);
  const t = useI18nStore((s) => s.t);
  const { data: daily, isLoading: loadingDaily } = useDailySummary();
  const { data: salesData } = useSalesReport();
  const { data: ordersData, isLoading: loadingOrders } = useOrders();
  const { data: topProducts, isLoading: loadingTop } = useTopProducts();

  const recentOrders = (ordersData || []).slice(0, 8);
  const topProds = (topProducts || []).slice(0, 5);

  // Chart data
  const ordersByDay = useMemo(() => {
    const days: Record<string, number> = {};
    (ordersData || []).forEach((o: any) => {
      const day = new Date(o.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      days[day] = (days[day] || 0) + o.totalAmount;
    });
    const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return dayOrder.map(d => ({ label: d, value: days[d] || 0, color: '#3B82F6' }));
  }, [ordersData]);

  const paymentBreakdown = useMemo(() => {
    const methods: Record<string, number> = {};
    (ordersData || []).forEach((o: any) => {
      (o.payments || []).forEach((p: any) => { methods[p.method] = (methods[p.method] || 0) + p.amount; });
    });
    const colors: Record<string, string> = { CASH: '#10B981', CARD: '#3B82F6', UPI: '#8B5CF6', WALLET: '#F59E0B', MIXED: '#EF4444' };
    return Object.entries(methods).map(([label, value]) => ({ label, value: value as number, color: colors[label] || '#6B7280' }));
  }, [ordersData]);

  const todayOrders = daily?.totalOrders || 0;
  const todayRevenue = daily?.revenue || 0;
  const totalRevenue = salesData?.totalRevenue || 0;
  const totalOrders = salesData?.orderCount || 0;
  const avgOrderValue = salesData?.averageOrderValue || 0;

  const stats = [
    { label: t('revenue'), value: formatCurrency(totalRevenue), icon: DollarSign, change: totalRevenue > 0 ? `${totalOrders} ${t('orders').toLowerCase()}` : t('noData'), up: totalRevenue > 0, color: 'bg-blue-500' },
    { label: `${t('today')} ${labels.orders}`, value: String(todayOrders), icon: ShoppingBag, change: todayRevenue > 0 ? formatCurrency(todayRevenue) : t('noData'), up: todayOrders > 0, color: 'bg-green-500' },
    { label: `${t('total')} ${labels.order}`, value: formatCurrency(avgOrderValue), icon: TrendingUp, change: avgOrderValue > 0 ? 'Per order' : t('noData'), up: avgOrderValue > 0, color: 'bg-amber-500' },
    { label: `${t('total')} ${labels.orders}`, value: String(totalOrders), icon: Users, change: totalOrders > 0 ? 'All time' : t('noData'), up: totalOrders > 0, color: 'bg-purple-500' },
  ];

  const statusColor: Record<string, string> = {
    COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', CONFIRMED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    PREPARING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', READY: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    PENDING: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    SERVED: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  };

  return (
    <div className="space-y-6">
      <LiveClock />

      {/* Quick Actions */}
      <QuickActions />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-card">
            {loadingDaily ? <Skeleton className="h-20 w-full" /> : <>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span className={`flex items-center text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </>}
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Revenue by Day</h2>
          {ordersByDay.some(d => d.value > 0) ? (
            <SimpleBarChart data={ordersByDay} height={180} formatValue={v => formatCurrency(v)} />
          ) : <p className="text-sm text-gray-400 text-center py-12">No revenue data yet</p>}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Payment Methods</h2>
          {paymentBreakdown.length > 0 ? (
            <div className="flex items-center justify-center gap-6">
              <SimpleDonutChart data={paymentBreakdown} centerValue={String(paymentBreakdown.length)} centerLabel="Methods" />
              <div className="space-y-2">
                {paymentBreakdown.map(d => (
                  <div key={d.label} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-gray-600 dark:text-gray-300">{d.label}</span>
                    <span className="font-medium ml-auto">{formatCurrency(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-sm text-gray-400 text-center py-12">No payment data yet</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-card">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent {labels.orders}</h2>
            <button onClick={() => navigate('/orders')} className="text-sm text-blue-600 hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            {loadingOrders ? <div className="p-5"><Skeleton className="h-40 w-full" /></div> : (
              <table className="w-full">
                <thead><tr className="text-xs text-gray-500 uppercase border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left p-4">Order</th><th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Items</th><th className="text-left p-4">Total</th>
                  <th className="text-left p-4">Status</th><th className="text-left p-4">Date</th>
                </tr></thead>
                <tbody>
                  {recentOrders.map((order: any) => (
                    <tr key={order.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="p-4 font-medium text-sm">{order.orderNumber}</td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{order.customer ? `${order.customer.firstName} ${order.customer.lastName || ''}` : 'Walk-in'}</td>
                      <td className="p-4 text-sm text-gray-600">{order.items?.length || 0}</td>
                      <td className="p-4 text-sm font-medium">{formatCurrency(order.totalAmount)}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[order.status] || 'bg-gray-100'}`}>{order.status}</span></td>
                      <td className="p-4 text-sm text-gray-500">{formatDate(new Date(order.createdAt))}</td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No {labels.orders.toLowerCase()} yet</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Top {labels.products}</h2>
          </div>
          <div className="p-5 space-y-4">
            {loadingTop ? <Skeleton className="h-40 w-full" /> : topProds.length > 0 ? topProds.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.product?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{item.totalQuantity} sold</p>
                  </div>
                </div>
                <p className="text-sm font-medium">{formatCurrency(item.product?.price || 0)}</p>
              </div>
            )) : <p className="text-sm text-gray-400 text-center py-4">No data yet</p>}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <ActivityFeed />
    </div>
  );
}
