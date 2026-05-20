import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChefHat, CheckCircle2, AlertCircle, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { useKitchenQueue, useUpdateOrderStatus } from '../hooks/useApi';
import { Skeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

export function KitchenPage() {
  const { data: orders, isLoading, dataUpdatedAt } = useKitchenQueue();
  const updateStatus = useUpdateOrderStatus();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastCount, setLastCount] = useState(0);
  const [refreshCountdown, setRefreshCountdown] = useState(10);

  // Auto-refresh countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - dataUpdatedAt) / 1000);
      setRefreshCountdown(Math.max(0, 10 - elapsed));
    }, 1000);
    return () => clearInterval(interval);
  }, [dataUpdatedAt]);

  // Sound notification on new orders
  useEffect(() => {
    if (!orders) return;
    if (orders.length > lastCount && lastCount > 0 && soundEnabled) {
      // Play a brief notification tone
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      } catch { /* Audio not supported */ }
      toast('🔔 New order in kitchen!', { icon: '🍳' });
    }
    setLastCount(orders.length);
  }, [orders?.length]);

  const handleStatus = async (orderId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status });
      toast.success(`Order moved to ${status}`);
    } catch { toast.error('Failed to update order'); }
  };

  const getElapsed = (createdAt: string) => {
    const mins = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
    return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Kitchen Display</h1>
          <p className="text-gray-500 mt-1">Active orders in the kitchen • {(orders || []).length} orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl transition-all ${soundEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}
            title={soundEnabled ? 'Sound on' : 'Sound off'}>
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live
            <span className="text-xs text-green-600 ml-1">
              <RefreshCw className={`w-3 h-3 inline ${refreshCountdown === 0 ? 'animate-spin' : ''}`} /> {refreshCountdown}s
            </span>
          </div>
        </div>
      </div>

      {isLoading ? <Skeleton className="h-60 w-full" /> : (orders || []).length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <ChefHat className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg">No active orders</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(orders || []).map((order: any) => {
            const elapsed = getElapsed(order.createdAt);
            const isPriority = parseInt(elapsed) > 15;
            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden ${isPriority ? 'ring-2 ring-red-400' : ''}`}>
                <div className={`px-4 py-3 flex items-center justify-between ${order.status === 'CONFIRMED' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{order.orderNumber}</span>
                    {order.table && <span className="text-xs bg-white dark:bg-gray-700 px-2 py-0.5 rounded-full">{order.table.name}</span>}
                    {isPriority && <AlertCircle className="w-4 h-4 text-red-500" />}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Clock className="w-3.5 h-3.5" /> {elapsed}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {(order.items || []).map((item: any, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-bold text-blue-600 text-sm">{item.quantity}x</span>
                      <div>
                        <p className="text-sm font-medium">{item.product?.name || 'Item'}</p>
                        {item.notes && <p className="text-xs text-amber-600 mt-0.5">Note: {item.notes}</p>}
                      </div>
                    </div>
                  ))}
                  {order.notes && <p className="text-xs bg-amber-50 text-amber-700 p-2 rounded-lg mt-2">Order note: {order.notes}</p>}
                </div>
                <div className="px-4 pb-4">
                  {order.status === 'CONFIRMED' ? (
                    <button onClick={() => handleStatus(order.id, 'PREPARING')}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium flex items-center justify-center gap-2">
                      <ChefHat className="w-4 h-4" /> Start Preparing
                    </button>
                  ) : (
                    <button onClick={() => handleStatus(order.id, 'READY')}
                      className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Mark Ready
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
