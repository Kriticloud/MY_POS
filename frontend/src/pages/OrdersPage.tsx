import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatDate } from '../utils/helpers';
import { useOrders, useUpdateOrderStatus, useVoidOrder } from '../hooks/useApi';
import { Search, Filter, Eye, X, ChevronDown, Ban, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { Skeleton } from '../components/ui/Skeleton';
import { useSettingsStore, getPageTitle, getEntityLabels } from '../store/settingsStore';
import { OrderStatusTimeline } from '../components/OrderStatusTimeline';

const statusOptions = ['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED', 'VOIDED', 'REFUNDED'];
const statusColor: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-700', CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-amber-100 text-amber-700', READY: 'bg-purple-100 text-purple-700',
  PENDING: 'bg-gray-100 text-gray-700', CANCELLED: 'bg-red-100 text-red-700',
  SERVED: 'bg-teal-100 text-teal-700', VOIDED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-orange-100 text-orange-700', PARTIALLY_REFUNDED: 'bg-orange-100 text-orange-600',
};
const nextStatus: Record<string, string> = {
  PENDING: 'CONFIRMED', CONFIRMED: 'PREPARING', PREPARING: 'READY', READY: 'SERVED', SERVED: 'COMPLETED',
};

export function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const businessType = useSettingsStore((s) => s.businessType);
  const pageInfo = getPageTitle('/orders', businessType);
  const labels = getEntityLabels(businessType);
  const { data: orders, isLoading } = useOrders(statusFilter !== 'ALL' ? { status: statusFilter } : undefined);
  const updateStatus = useUpdateOrderStatus();
  const voidOrder = useVoidOrder();

  const handleVoid = async (orderId: string) => {
    const reason = prompt('Enter reason for voiding this order:');
    if (!reason) return;
    try {
      await voidOrder.mutateAsync({ id: orderId, reason });
      toast.success('Order voided');
      setSelectedOrder(null);
    } catch { toast.error('Failed to void order'); }
  };

  const handleRefund = async (orderId: string, totalAmount: number) => {
    const reason = prompt('Enter reason for refund:');
    if (!reason) return;
    const amountStr = prompt(`Enter refund amount (max ${formatCurrency(totalAmount)}):`, totalAmount.toFixed(2));
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0 || amount > totalAmount) {
      toast.error('Invalid refund amount');
      return;
    }
    try {
      const { data } = await (await import('../services/api')).default.put(`/orders/${orderId}/refund`, { reason, amount });
      if (data.success) toast.success(data.message || 'Refund processed');
      setSelectedOrder(null);
    } catch { toast.error('Failed to process refund'); }
  };

  const filteredOrders = (orders || []).filter((o: any) => {
    if (search) {
      const s = search.toLowerCase();
      return o.orderNumber?.toLowerCase().includes(s) || o.customer?.firstName?.toLowerCase().includes(s);
    }
    return true;
  });

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status });
      toast.success(`Order updated to ${status}`);
      if (selectedOrder?.id === orderId) setSelectedOrder((prev: any) => prev ? { ...prev, status } : null);
    } catch { toast.error('Failed to update order'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{pageInfo.title}</h1>
          <p className="text-gray-500 mt-1">{pageInfo.subtitle}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder={`Search ${labels.orders.toLowerCase()}...`} value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {statusOptions.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 hover:bg-gray-50'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden">
        {isLoading ? <div className="p-6"><Skeleton className="h-60 w-full" /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-xs text-gray-500 uppercase border-b border-gray-100 dark:border-gray-700">
                <th className="text-left p-4">Order</th><th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Type</th><th className="text-left p-4">Items</th>
                <th className="text-left p-4">Total</th><th className="text-left p-4">Status</th>
                <th className="text-left p-4">Date</th><th className="text-left p-4">Actions</th>
              </tr></thead>
              <tbody>
                {filteredOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="p-4 font-medium text-sm">{order.orderNumber}</td>
                    <td className="p-4 text-sm text-gray-600">{order.customer ? `${order.customer.firstName} ${order.customer.lastName || ''}` : 'Walk-in'}</td>
                    <td className="p-4"><span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs">{order.orderType?.replace('_', ' ')}</span></td>
                    <td className="p-4 text-sm">{order.items?.length || 0}</td>
                    <td className="p-4 text-sm font-medium">{formatCurrency(order.totalAmount)}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[order.status] || ''}`}>{order.status}</span></td>
                    <td className="p-4 text-sm text-gray-500">{formatDate(new Date(order.createdAt))}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedOrder(order)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><Eye className="w-4 h-4 text-gray-500" /></button>
                        {nextStatus[order.status] && (
                          <button onClick={() => handleStatusUpdate(order.id, nextStatus[order.status])}
                            className="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">
                            {nextStatus[order.status]}
                          </button>
                        )}
                        {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                          <button onClick={() => handleStatusUpdate(order.id, 'CANCELLED')} className="px-2 py-1 bg-red-100 text-red-600 rounded-lg text-xs hover:bg-red-200">Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-gray-400">No {labels.orders.toLowerCase()} found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedOrder(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Order {selectedOrder.orderNumber}</h2>
                <button onClick={() => setSelectedOrder(null)}><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                {/* Status Timeline */}
                <OrderStatusTimeline currentStatus={selectedOrder.status} />

                <div className="flex gap-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[selectedOrder.status]}`}>{selectedOrder.status}</span>
                  <span className="text-gray-500">{selectedOrder.orderType?.replace('_', ' ')}</span>
                  <span className="text-gray-500">{formatDate(new Date(selectedOrder.createdAt))}</span>
                </div>
                {selectedOrder.customer && <p className="text-sm"><span className="text-gray-500">Customer:</span> {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>}
                {selectedOrder.notes && <p className="text-sm bg-amber-50 p-2 rounded-lg"><span className="font-medium">Note:</span> {selectedOrder.notes}</p>}
                <div className="border-t pt-3">
                  <h3 className="font-medium mb-2">Items</h3>
                  {(selectedOrder.items || []).map((item: any, i: number) => (
                    <div key={i} className="flex justify-between py-2 text-sm border-b border-gray-50">
                      <div><span className="font-medium">{item.product?.name || 'Item'}</span> <span className="text-gray-500">x{item.quantity}</span></div>
                      <span>{formatCurrency(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatCurrency(selectedOrder.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{formatCurrency(selectedOrder.taxAmount)}</span></div>
                  {selectedOrder.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(selectedOrder.discountAmount)}</span></div>}
                  <div className="flex justify-between font-bold text-lg pt-2"><span>Total</span><span>{formatCurrency(selectedOrder.totalAmount)}</span></div>
                </div>
                {nextStatus[selectedOrder.status] && (
                  <button onClick={() => handleStatusUpdate(selectedOrder.id, nextStatus[selectedOrder.status])}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
                    Move to {nextStatus[selectedOrder.status]}
                  </button>
                )}
                {/* Void & Refund Actions */}
                <div className="flex gap-2">
                  {!['VOIDED', 'REFUNDED', 'CANCELLED'].includes(selectedOrder.status) && (
                    <button onClick={() => handleVoid(selectedOrder.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 border border-red-200">
                      <Ban className="w-4 h-4" /> Void Order
                    </button>
                  )}
                  {selectedOrder.status === 'COMPLETED' && (
                    <button onClick={() => handleRefund(selectedOrder.id, selectedOrder.totalAmount)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-orange-50 text-orange-600 rounded-xl font-medium hover:bg-orange-100 border border-orange-200">
                      <RotateCcw className="w-4 h-4" /> Refund
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
