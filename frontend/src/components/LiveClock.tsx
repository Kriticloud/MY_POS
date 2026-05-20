import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function LiveClock() {
  const [time, setTime] = useState(new Date());
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  let greeting = 'Good evening';
  let GIcon = Moon;
  if (hours < 6) { greeting = 'Good night'; GIcon = Moon; }
  else if (hours < 12) { greeting = 'Good morning'; GIcon = Sunrise; }
  else if (hours < 17) { greeting = 'Good afternoon'; GIcon = Sun; }
  else if (hours < 20) { greeting = 'Good evening'; GIcon = Sunset; }

  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <GIcon className="w-5 h-5 text-amber-500" />
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            {greeting}, {user?.firstName || 'there'}!
          </h1>
        </div>
        <p className="text-gray-500">Here's what's happening with your business today.</p>
      </div>
      <div className="hidden sm:flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 shadow-card">
        <Clock className="w-4 h-4 text-blue-500" />
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900 dark:text-white font-mono">{timeStr}</p>
          <p className="text-xs text-gray-500">{dateStr}</p>
        </div>
      </div>
    </motion.div>
  );
}
