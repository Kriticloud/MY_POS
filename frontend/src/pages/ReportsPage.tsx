import { formatCurrency } from '../utils/helpers';
import { BarChart3, TrendingUp, Download, Calendar } from 'lucide-react';

const salesData = [
  { day: 'Mon', revenue: 2450 },
  { day: 'Tue', revenue: 3200 },
  { day: 'Wed', revenue: 2890 },
  { day: 'Thu', revenue: 3560 },
  { day: 'Fri', revenue: 4120 },
  { day: 'Sat', revenue: 5200 },
  { day: 'Sun', revenue: 4800 },
];

const maxRevenue = Math.max(...salesData.map((d) => d.revenue));

export function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-white">Reports</h1>
          <p className="text-gray-500 mt-1">Business analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-xl text-sm font-medium hover:bg-gray-50">
            <Calendar className="w-4 h-4" />
            This Week
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium shadow-lg shadow-primary/25">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-card p-5">
          <p className="text-sm text-gray-500">Weekly Revenue</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white mt-1">{formatCurrency(26220)}</p>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12.5% vs last week
          </p>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-card p-5">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white mt-1">342</p>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +8.3% vs last week
          </p>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-card p-5">
          <p className="text-sm text-gray-500">Avg Order Value</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white mt-1">{formatCurrency(76.67)}</p>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +3.8% vs last week
          </p>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-card p-5">
          <p className="text-sm text-gray-500">Net Profit</p>
          <p className="text-2xl font-bold text-dark-900 dark:text-white mt-1">{formatCurrency(8450)}</p>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +5.2% vs last week
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-lg text-dark-900 dark:text-white">Daily Revenue</h2>
        </div>
        <div className="flex items-end gap-4 h-48">
          {salesData.map((item) => (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {formatCurrency(item.revenue)}
              </span>
              <div
                className="w-full bg-primary/20 rounded-t-lg relative overflow-hidden"
                style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-primary to-primary/60 rounded-t-lg" />
              </div>
              <span className="text-xs text-gray-500">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-card p-6">
          <h2 className="font-semibold text-lg text-dark-900 dark:text-white mb-4">Sales by Category</h2>
          <div className="space-y-3">
            {[
              { name: 'Food', percent: 45, color: 'bg-red-500' },
              { name: 'Beverages', percent: 28, color: 'bg-blue-500' },
              { name: 'Desserts', percent: 15, color: 'bg-amber-500' },
              { name: 'Snacks', percent: 8, color: 'bg-green-500' },
              { name: 'Combos', percent: 4, color: 'bg-purple-500' },
            ].map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{cat.name}</span>
                  <span className="font-medium text-dark-900 dark:text-white">{cat.percent}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-dark-600 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-card p-6">
          <h2 className="font-semibold text-lg text-dark-900 dark:text-white mb-4">Payment Methods</h2>
          <div className="space-y-3">
            {[
              { name: 'Cash', percent: 38, amount: 9963 },
              { name: 'Card', percent: 35, amount: 9177 },
              { name: 'UPI', percent: 22, amount: 5768 },
              { name: 'Wallet', percent: 5, amount: 1311 },
            ].map((method) => (
              <div key={method.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-dark-900 dark:text-white">{method.name}</p>
                  <p className="text-xs text-gray-500">{method.percent}% of total</p>
                </div>
                <span className="font-semibold text-dark-900 dark:text-white">{formatCurrency(method.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
