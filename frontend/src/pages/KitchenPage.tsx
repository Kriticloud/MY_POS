import { motion } from 'framer-motion';
import { Clock, ChefHat, CheckCircle2 } from 'lucide-react';

const kitchenOrders = [
  {
    id: 'ORD-A7F2B1',
    table: 'Table 2',
    time: '5 min ago',
    status: 'PREPARING',
    items: [
      { name: 'Classic Burger', qty: 2, notes: 'No onions' },
      { name: 'French Fries', qty: 2 },
      { name: 'Cappuccino', qty: 1 },
    ],
  },
  {
    id: 'ORD-C3D4E5',
    table: 'Table 3',
    time: '8 min ago',
    status: 'CONFIRMED',
    priority: true,
    items: [
      { name: 'Margherita Pizza', qty: 1 },
      { name: 'Caesar Salad', qty: 2 },
      { name: 'Iced Tea', qty: 3 },
    ],
  },
  {
    id: 'ORD-F6G7H8',
    table: 'Takeaway',
    time: '12 min ago',
    status: 'PREPARING',
    items: [
      { name: 'Grilled Salmon', qty: 1 },
      { name: 'Cheesecake', qty: 1 },
    ],
  },
  {
    id: 'ORD-I9J0K1',
    table: 'Table 8',
    time: '3 min ago',
    status: 'CONFIRMED',
    items: [
      { name: 'Chicken Sandwich', qty: 3 },
      { name: 'Onion Rings', qty: 2 },
      { name: 'Orange Juice', qty: 3 },
    ],
  },
];

export function KitchenPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChefHat className="w-7 h-7 text-primary" />
          <div>
            <h1 className="font-display text-2xl font-bold text-dark-900 dark:text-white">
              Kitchen Display
            </h1>
            <p className="text-gray-500 mt-0.5">Real-time order queue</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-xl">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {kitchenOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white dark:bg-dark-800 rounded-2xl shadow-card overflow-hidden ${
              order.priority ? 'ring-2 ring-red-400' : ''
            }`}
          >
            {/* Header */}
            <div className={`px-4 py-3 flex items-center justify-between ${
              order.status === 'PREPARING' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-blue-50 dark:bg-blue-900/20'
            }`}>
              <div>
                <p className="font-semibold text-sm text-dark-900 dark:text-white">{order.id}</p>
                <p className="text-xs text-gray-500">{order.table}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-500">{order.time}</span>
              </div>
            </div>

            {order.priority && (
              <div className="bg-red-500 text-white text-center py-1 text-xs font-bold">
                ⚡ PRIORITY
              </div>
            )}

            {/* Items */}
            <div className="p-4 space-y-2.5">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center text-xs font-bold shrink-0">
                    {item.qty}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-dark-900 dark:text-white">{item.name}</p>
                    {item.notes && (
                      <p className="text-xs text-amber-600 mt-0.5">⚠️ {item.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 flex gap-2">
              {order.status === 'CONFIRMED' ? (
                <button className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl text-sm transition-colors">
                  Start Preparing
                </button>
              ) : (
                <button className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Ready
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
