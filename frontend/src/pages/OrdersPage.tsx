import { formatCurrency, formatDate } from '../utils/helpers';

const orders = [
  { id: 'ORD-A7F2B1', customer: 'John Doe', items: 4, total: 45.99, status: 'COMPLETED', type: 'DINE_IN', createdAt: '2026-05-18T10:30:00' },
  { id: 'ORD-C3D4E5', customer: 'Jane Smith', items: 2, total: 23.50, status: 'PREPARING', type: 'TAKEAWAY', createdAt: '2026-05-18T10:25:00' },
  { id: 'ORD-F6G7H8', customer: 'Walk-in', items: 6, total: 78.00, status: 'PENDING', type: 'DINE_IN', createdAt: '2026-05-18T10:20:00' },
  { id: 'ORD-I9J0K1', customer: 'Mike Johnson', items: 3, total: 34.50, status: 'COMPLETED', type: 'DELIVERY', createdAt: '2026-05-18T10:15:00' },
  { id: 'ORD-L2M3N4', customer: 'Sarah Williams', items: 1, total: 12.99, status: 'SERVED', type: 'DINE_IN', createdAt: '2026-05-18T10:10:00' },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-orange-100 text-orange-700',
  READY: 'bg-teal-100 text-teal-700',
  SERVED: 'bg-indigo-100 text-indigo-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export function OrdersPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-white">Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track all orders</p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 text-sm">
            <option>All Status</option>
            <option>Pending</option>
            <option>Preparing</option>
            <option>Completed</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 text-sm"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50 dark:bg-dark-700">
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Items</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-primary">{order.id}</td>
                <td className="px-6 py-4 text-sm text-dark-900 dark:text-white">{order.customer}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.items} items</td>
                <td className="px-6 py-4 text-sm font-semibold text-dark-900 dark:text-white">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-dark-600 px-2 py-1 rounded-lg">
                    {order.type.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
