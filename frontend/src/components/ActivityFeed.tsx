import { motion } from 'framer-motion';
import { ShoppingBag, User, CreditCard, Package, Clock, RefreshCw } from 'lucide-react';
import { useOrders } from '../hooks/useApi';
import { formatCurrency } from '../utils/helpers';

const typeConfig = {
  order: { icon: ShoppingBag, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  payment: { icon: CreditCard, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  customer: { icon: User, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  product: { icon: Package, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  status: { icon: RefreshCw, color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function ActivityFeed() {
  const { data: orders } = useOrders();
  const recentOrders = (orders || []).slice(0, 6);

  const activities = recentOrders.map((order: any) => {
    const customer = order.customer ? `${order.customer.firstName} ${order.customer.lastName || ''}`.trim() : 'Walk-in';
    const amount = formatCurrency(order.totalAmount);
    const type = order.status === 'COMPLETED' || order.status === 'SERVED' ? 'payment'
      : order.status === 'CANCELLED' ? 'status'
      : 'order';

    let description = '';
    if (order.status === 'PENDING') description = `New order ${order.orderNumber} — ${customer} (${amount})`;
    else if (order.status === 'CONFIRMED') description = `Order ${order.orderNumber} confirmed (${amount})`;
    else if (order.status === 'PREPARING') description = `Preparing ${order.orderNumber} — ${order.items?.length || 0} items`;
    else if (order.status === 'READY') description = `Order ${order.orderNumber} ready for pickup`;
    else if (order.status === 'COMPLETED' || order.status === 'SERVED') description = `Payment of ${amount} received — ${customer}`;
    else if (order.status === 'CANCELLED') description = `Order ${order.orderNumber} cancelled`;
    else description = `Order ${order.orderNumber} — ${order.status}`;

    return {
      id: order.id,
      type: type as keyof typeof typeConfig,
      description,
      time: timeAgo(order.updatedAt || order.createdAt),
    };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card">
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          Recent Activity
        </h2>
        <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          Live
        </span>
      </div>
      <div className="p-4 space-y-1">
        {activities.length > 0 ? activities.map((activity, i) => {
          const config = typeConfig[activity.type];
          const Icon = config.icon;
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{activity.description}</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
            </motion.div>
          );
        }) : (
          <p className="text-sm text-gray-400 text-center py-8">No recent activity</p>
        )}
      </div>
    </div>
  );
}
