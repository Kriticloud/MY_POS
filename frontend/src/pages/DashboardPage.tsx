import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const stats = [
  {
    label: 'Total Revenue',
    value: 48750.0,
    change: 12.5,
    icon: DollarSign,
    color: 'bg-blue-500',
  },
  {
    label: "Today's Orders",
    value: 156,
    change: 8.2,
    icon: ShoppingBag,
    color: 'bg-green-500',
    isCurrency: false,
  },
  {
    label: 'Active Customers',
    value: 2340,
    change: -2.4,
    icon: Users,
    color: 'bg-purple-500',
    isCurrency: false,
  },
  {
    label: 'Avg Order Value',
    value: 32.5,
    change: 5.7,
    icon: TrendingUp,
    color: 'bg-amber-500',
  },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', amount: 45.99, status: 'Completed', time: '2 min ago' },
  { id: 'ORD-002', customer: 'Jane Smith', amount: 78.5, status: 'Preparing', time: '5 min ago' },
  { id: 'ORD-003', customer: 'Walk-in', amount: 23.0, status: 'Completed', time: '12 min ago' },
  { id: 'ORD-004', customer: 'Mike Johnson', amount: 156.0, status: 'Pending', time: '15 min ago' },
  { id: 'ORD-005', customer: 'Sarah Williams', amount: 67.25, status: 'Completed', time: '20 min ago' },
];

const topProducts = [
  { name: 'Classic Burger', sold: 89, revenue: 889.11 },
  { name: 'Cappuccino', sold: 76, revenue: 379.24 },
  { name: 'Margherita Pizza', sold: 54, revenue: 701.46 },
  { name: 'Caesar Salad', sold: 43, revenue: 343.57 },
  { name: 'Iced Tea', sold: 38, revenue: 132.62 },
];

export function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your business overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-dark-800 rounded-2xl p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  stat.change >= 0 ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {stat.change >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {Math.abs(stat.change)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-dark-900 dark:text-white">
              {stat.isCurrency === false
                ? stat.value.toLocaleString()
                : formatCurrency(stat.value)}
            </p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg text-dark-900 dark:text-white">Recent Orders</h2>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100 dark:border-dark-700">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-dark-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="text-sm">
                    <td className="py-3 font-medium text-dark-900 dark:text-white">{order.id}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">{order.customer}</td>
                    <td className="py-3 font-medium text-dark-900 dark:text-white">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'Preparing'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-card p-6">
          <h2 className="font-semibold text-lg text-dark-900 dark:text-white mb-4">
            Top Products
          </h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark-900 dark:text-white truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">{product.sold} sold</p>
                </div>
                <span className="text-sm font-semibold text-dark-900 dark:text-white">
                  {formatCurrency(product.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
