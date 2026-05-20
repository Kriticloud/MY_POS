import { motion } from 'framer-motion';
import { ShoppingBag, User, CreditCard, Package, Clock } from 'lucide-react';

interface Activity {
  id: string;
  type: 'order' | 'payment' | 'customer' | 'product';
  description: string;
  time: string;
}

const typeConfig = {
  order: { icon: ShoppingBag, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  payment: { icon: CreditCard, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  customer: { icon: User, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  product: { icon: Package, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
};

// Mock activities (in production, these would come from the API)
const activities: Activity[] = [
  { id: '1', type: 'order', description: 'New order #ORD-045 placed', time: '2 min ago' },
  { id: '2', type: 'payment', description: 'Payment of $32.50 received', time: '5 min ago' },
  { id: '3', type: 'customer', description: 'New customer registered: Mike Lee', time: '12 min ago' },
  { id: '4', type: 'order', description: 'Order #ORD-044 completed', time: '18 min ago' },
  { id: '5', type: 'product', description: 'Stock updated: Cappuccino +20', time: '25 min ago' },
  { id: '6', type: 'payment', description: 'Refund of $12.00 processed', time: '30 min ago' },
];

export function ActivityFeed() {
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
        {activities.map((activity, i) => {
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
        })}
      </div>
    </div>
  );
}
