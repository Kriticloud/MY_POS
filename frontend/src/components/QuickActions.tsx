import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ClipboardList, Users, Package, Plus, ArrowRight } from 'lucide-react';
import { useSettingsStore, getEntityLabels } from '../store/settingsStore';

export function QuickActions() {
  const navigate = useNavigate();
  const businessType = useSettingsStore((s) => s.businessType);
  const labels = getEntityLabels(businessType);

  const actions = [
    { label: `New ${labels.order}`, description: 'Start taking an order', icon: ShoppingCart, color: 'from-blue-500 to-blue-600', path: '/pos' },
    { label: `View ${labels.orders}`, description: 'Check active orders', icon: ClipboardList, color: 'from-amber-500 to-orange-500', path: '/orders' },
    { label: 'Add Customer', description: 'Register new customer', icon: Users, color: 'from-green-500 to-emerald-500', path: '/customers' },
    { label: `Add ${labels.product}`, description: 'Add to catalog', icon: Package, color: 'from-purple-500 to-violet-500', path: '/products' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.08 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(action.path)}
          className="group relative overflow-hidden rounded-xl p-4 text-left bg-white dark:bg-gray-800 shadow-card hover:shadow-lg transition-shadow"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-lg`}>
            <action.icon className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{action.label}</p>
          <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
          <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors" />
        </motion.button>
      ))}
    </div>
  );
}
