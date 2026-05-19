import { formatCurrency } from '../utils/helpers';
import { BarChart3, TrendingUp, ShoppingBag, DollarSign } from 'lucide-react';
import { useSalesReport, useTopProducts, useOrders } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';

export function ReportsPage() {
  const { data: sales, isLoading: loadingSales } = useSalesReport();
  const { data: topProducts, isLoading: loadingTop } = useTopProducts();
  const { data: orders } = useOrders();

  const paymentBreakdown = (orders || []).reduce((acc: Record<string, number>, o: any) => {
    (o.payments || []).forEach((p: any) => { acc[p.method] = (acc[p.method] || 0) + p.amount; });
    return acc;
  }, {});
  const totalPayments = Object.values(paymentBreakdown).reduce((s: number, v) => s + (v as number), 0);

  const orderTypeBreakdown = (orders || []).reduce((acc: Record<string, number>, o: any) => {
    acc[o.orderType] = (acc[o.orderType] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(sales?.totalRevenue || 0), icon: DollarSign, color: 'bg-blue-500' },
    { label: 'Total Orders', value: String(sales?.orderCount || 0), icon: ShoppingBag, color: 'bg-green-500' },
    { label: 'Avg Order Value', value: formatCurrency(sales?.averageOrderValue || 0), icon: TrendingUp, color: 'bg-amber-500' },
    { label: 'Total Tax', value: formatCurrency(sales?.totalTax || 0), icon: BarChart3, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Reports</h1>
        <p className="text-gray-500 mt-1">Business analytics and insights</p>
      </div>

      {loadingSales ? <Skeleton className="h-32 w-full" /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Top Selling Products</h2>
          </div>
          {loadingTop ? <div className="p-5"><Skeleton className="h-40 w-full" /></div> : (
            <div className="p-5 space-y-3">
              {(topProducts || []).slice(0, 8).map((item: any, i: number) => {
                const maxQty = (topProducts || [])[0]?.totalQuantity || 1;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{item.product?.name || 'Unknown'}</span>
                      <span className="text-gray-500">{item.totalQuantity} sold</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(item.totalQuantity / maxQty) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
              {(topProducts || []).length === 0 && <p className="text-sm text-gray-400 text-center py-4">No data</p>}
            </div>
          )}
        </div>

        {/* Payment Methods & Order Types */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">Payment Methods</h2>
            </div>
            <div className="p-5 space-y-3">
              {Object.entries(paymentBreakdown).map(([method, amount]) => (
                <div key={method} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium">{method}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(amount as number)}</p>
                    <p className="text-xs text-gray-500">{totalPayments > 0 ? Math.round(((amount as number) / totalPayments) * 100) : 0}%</p>
                  </div>
                </div>
              ))}
              {Object.keys(paymentBreakdown).length === 0 && <p className="text-sm text-gray-400 text-center">No data</p>}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">Order Types</h2>
            </div>
            <div className="p-5 space-y-3">
              {Object.entries(orderTypeBreakdown).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{type.replace('_', ' ')}</span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">{count as number} orders</span>
                </div>
              ))}
              {Object.keys(orderTypeBreakdown).length === 0 && <p className="text-sm text-gray-400 text-center">No data</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
