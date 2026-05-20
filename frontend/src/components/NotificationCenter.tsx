import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle2, AlertTriangle, Info, ShoppingBag } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'order';
  title: string;
  message: string;
  time: Date;
  read: boolean;
}

const icons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
  order: ShoppingBag,
};

const colors = {
  success: 'text-green-500 bg-green-50 dark:bg-green-900/20',
  warning: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
  info: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
  order: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
};

// Simple in-memory notification store
let _notifications: Notification[] = [
  { id: '1', type: 'order', title: 'New Order', message: 'Order #ORD-001 received from Table 3', time: new Date(Date.now() - 5 * 60000), read: false },
  { id: '2', type: 'warning', title: 'Low Stock Alert', message: 'Espresso beans running low (5 units)', time: new Date(Date.now() - 15 * 60000), read: false },
  { id: '3', type: 'success', title: 'Payment Received', message: '$45.50 payment processed successfully', time: new Date(Date.now() - 30 * 60000), read: true },
  { id: '4', type: 'info', title: 'Staff Check-in', message: 'Sarah Johnson clocked in at 9:00 AM', time: new Date(Date.now() - 60 * 60000), read: true },
];

let _listeners: (() => void)[] = [];
function subscribe(fn: () => void) { _listeners.push(fn); return () => { _listeners = _listeners.filter(l => l !== fn); }; }
function notify() { _listeners.forEach(fn => fn()); }

export function addNotification(n: Omit<Notification, 'id' | 'time' | 'read'>) {
  _notifications = [{ ...n, id: crypto.randomUUID(), time: new Date(), read: false }, ..._notifications];
  notify();
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(_notifications);

  useEffect(() => {
    const unsub = subscribe(() => setNotifications([..._notifications]));
    return unsub;
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    _notifications = _notifications.map(n => ({ ...n, read: true }));
    setNotifications([..._notifications]);
    notify();
  };

  const dismiss = (id: string) => {
    _notifications = _notifications.filter(n => n.id !== id);
    setNotifications([..._notifications]);
    notify();
  };

  const formatTime = (time: Date) => {
    const diff = Math.floor((Date.now() - time.getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 400 }}
              className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-sm">No notifications</div>
                ) : (
                  notifications.map(n => {
                    const Icon = icons[n.type];
                    return (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 transition-all hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
                          !n.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[n.type]}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{n.title}</p>
                            <button onClick={() => dismiss(n.id)} className="text-gray-300 hover:text-gray-500 flex-shrink-0 ml-2">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{formatTime(n.time)}</p>
                        </div>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
