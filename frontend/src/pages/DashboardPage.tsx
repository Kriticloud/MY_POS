import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { useDailySummary, useOrders, useTopProducts, useSalesReport } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: daily, isLoading: loadingDaily } = useDailySummary();
  const { data: salesData } = useSalesReport();
  const { data: ordersData, isLoading: loadingOrders } = useOrders();
  const { data: topProducts, isLoading: loadingTop } = useTopProducts();

  const recentOrders = (ordersData || []).slice(0, 8);
  const topProds = (topProducts || []).slice(0, 5);

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(salesData?.totalRevenue || 0), icon: DollarSign, change: '+12.5%', up: true, color: 'bg-blue-500' },
    { label: "Today's Orders", value: String(daily?.orderCount || 0), icon: ShoppingBag, change: '+8.2%', up: true, color: 'bg-green-500' },
    { label: 'Avg Order Value', value: formatCurrency(salesData?.averageOrderValue || 0), icon: TrendingUp, change: '+5.7%', up: true, color: 'bg-amber-500' },
    { label: 'Total Orders', value: String(salesData?.orderCount || 0), icon: Users, change: '+4.1%', up: true, color: 'bg-purple-500' },
  ];

  const statusColor: Record<string, string> = {
    COMPLETED: 'bg-green-100 text-green-700', CONFIRMED: 'bg-blue-100 text-blue-700',
    PREPARING: 'bg-amber-100 text-amber-700', READY: 'bg-purple-100 text-purple-700',
    PENDING: 'bg-gray-100 text-gray-700', CANCELLED: 'bg-red-100 text-red-700',
    SERVED: 'bg-teal-100 text-teal-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-card">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
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
                  {recentOrders.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No orders yet</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Top Products</h2>
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
    </div>
  );
}
