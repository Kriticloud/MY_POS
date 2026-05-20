import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Product, Category, Order, Customer, Table, Employee, InventoryItem, AuditLog, LoyaltyTransaction, ApiResponse } from '../types';

// Products
export function useProducts(params?: { search?: string; categoryId?: string; businessType?: string }) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Product[]>>('/products', { params });
      return data.data;
    },
  });
}

export function useProductByBarcode(barcode: string) {
  return useQuery({
    queryKey: ['product-barcode', barcode],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Product>>(`/products/barcode/${barcode}`);
      return data.data;
    },
    enabled: !!barcode,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData: Partial<Product>) => {
      const { data } = await api.post<ApiResponse<Product>>('/products', productData);
      return data.data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['products'] }); },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...productData }: Partial<Product> & { id: string }) => {
      const { data } = await api.put<ApiResponse<Product>>(`/products/${id}`, productData);
      return data.data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['products'] }); },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/products/${id}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['products'] }); },
  });
}

// Categories
export function useCategories(params?: { businessType?: string }) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>('/categories', { params });
      return data.data;
    },
  });
}

// Orders
export function useOrders(params?: { status?: string; date?: string }) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Order[]>>('/orders', { params });
      return data.data;
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData: any) => {
      const { data } = await api.post<ApiResponse<Order>>('/orders', orderData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.put<ApiResponse<Order>>(`/orders/${id}/status`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen'] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}

export function useVoidOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data } = await api.put<ApiResponse<Order>>(`/orders/${id}/void`, { reason });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['audit-log'] });
    },
  });
}

// Kitchen
export function useKitchenQueue() {
  return useQuery({
    queryKey: ['kitchen'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Order[]>>('/orders/kitchen/queue');
      return data.data;
    },
    refetchInterval: 10000,
  });
}

// Customers
export function useCustomers(params?: { search?: string }) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Customer[]>>('/customers', { params });
      return data.data;
    },
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (customerData: Partial<Customer>) => {
      const { data } = await api.post<ApiResponse<Customer>>('/customers', customerData);
      return data.data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['customers'] }); },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...customerData }: Partial<Customer> & { id: string }) => {
      const { data } = await api.put<ApiResponse<Customer>>(`/customers/${id}`, customerData);
      return data.data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['customers'] }); },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/customers/${id}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['customers'] }); },
  });
}

// Tables
export function useTables() {
  return useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Table[]>>('/tables');
      return data.data;
    },
    refetchInterval: 15000,
  });
}

export function useUpdateTableStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.put<ApiResponse<Table>>(`/tables/${id}/status`, { status });
      return data.data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tables'] }); },
  });
}

// Reports
export function useSalesReport(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['reports', 'sales', params],
    queryFn: async () => {
      const { data } = await api.get('/reports/sales', { params });
      return data.data;
    },
  });
}

export function useDailySummary() {
  return useQuery({
    queryKey: ['reports', 'daily'],
    queryFn: async () => {
      const { data } = await api.get('/reports/daily');
      return data.data;
    },
  });
}

export function useTopProducts() {
  return useQuery({
    queryKey: ['reports', 'top-products'],
    queryFn: async () => {
      const { data } = await api.get('/reports/top-products');
      return data.data;
    },
  });
}

// Settings
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get('/settings');
      return data.data;
    },
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value, group }: { key: string; value: string; group?: string }) => {
      const { data } = await api.put(`/settings/${key}`, { value, group });
      return data.data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['settings'] }); },
  });
}

// Loyalty
export function useRedeemLoyalty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ customerId, points }: { customerId: string; points: number }) => {
      const { data } = await api.post<ApiResponse<Customer>>(`/customers/${customerId}/redeem`, { points });
      return data.data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['customers'] }); queryClient.invalidateQueries({ queryKey: ['loyalty-history'] }); },
  });
}
export function useLoyaltyHistory(customerId?: string) {
  return useQuery({
    queryKey: ['loyalty-history', customerId],
    queryFn: async () => { const { data } = await api.get<ApiResponse<LoyaltyTransaction[]>>(`/customers/${customerId}/loyalty`); return data.data; },
    enabled: !!customerId,
  });
}

// Inventory
export function useInventory() {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: async () => { const { data } = await api.get<ApiResponse<InventoryItem[]>>('/inventory'); return data.data; },
  });
}
export function useInventoryAlerts() {
  return useQuery({
    queryKey: ['inventory', 'alerts'],
    queryFn: async () => { const { data } = await api.get<ApiResponse<InventoryItem[]>>('/inventory/alerts'); return data.data; },
    refetchInterval: 60000,
  });
}
export function useUpdateInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...d }: { id: string; quantity?: number; minStock?: number }) => {
      const { data } = await api.put<ApiResponse<InventoryItem>>(`/inventory/${id}`, d);
      return data.data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['inventory'] }); },
  });
}

// Employees
export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => { const { data } = await api.get<ApiResponse<Employee[]>>('/employees'); return data.data; },
    refetchInterval: 30000,
  });
}
export function useClockIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (employeeId: string) => { const { data } = await api.post<ApiResponse<Employee>>(`/employees/${employeeId}/clock-in`); return data.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['employees'] }); },
  });
}
export function useClockOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (employeeId: string) => { const { data } = await api.post<ApiResponse<Employee>>(`/employees/${employeeId}/clock-out`); return data.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['employees'] }); },
  });
}

// Additional Reports
export function useStaffPerformance() {
  return useQuery({
    queryKey: ['reports', 'staff-performance'],
    queryFn: async () => { const { data } = await api.get('/reports/staff-performance'); return data.data; },
  });
}
export function useMarginReport() {
  return useQuery({
    queryKey: ['reports', 'margins'],
    queryFn: async () => { const { data } = await api.get('/reports/margins'); return data.data; },
  });
}

// Audit Log
export function useAuditLog(params?: { limit?: number }) {
  return useQuery({
    queryKey: ['audit-log', params],
    queryFn: async () => { const { data } = await api.get<ApiResponse<AuditLog[]>>('/audit-log', { params }); return data.data; },
  });
}

// Cash Drawer
export function useCashDrawerCurrent() {
  return useQuery({
    queryKey: ['cash-drawer', 'current'],
    queryFn: async () => { const { data } = await api.get('/cash-drawer/current'); return data.data; },
    refetchInterval: 30000,
  });
}
export function useCashDrawerSessions() {
  return useQuery({
    queryKey: ['cash-drawer', 'sessions'],
    queryFn: async () => { const { data } = await api.get('/cash-drawer/sessions'); return data.data; },
  });
}
export function useOpenDrawer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (d: { openingBalance: number; notes?: string }) => { const { data } = await api.post('/cash-drawer/open', d); return data.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['cash-drawer'] }); },
  });
}
export function useCloseDrawer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (d: { closingBalance: number; notes?: string }) => { const { data } = await api.post('/cash-drawer/close', d); return data.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['cash-drawer'] }); },
  });
}
export function useCashTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (d: { type: string; amount: number; reason?: string }) => { const { data } = await api.post('/cash-drawer/transaction', d); return data.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['cash-drawer'] }); },
  });
}

// Suppliers
export function useSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => { const { data } = await api.get('/suppliers'); return data.data; },
  });
}
export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (d: any) => { const { data } = await api.post('/suppliers', d); return data.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['suppliers'] }); },
  });
}
export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...d }: any) => { const { data } = await api.put(`/suppliers/${id}`, d); return data.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['suppliers'] }); },
  });
}
export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/suppliers/${id}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['suppliers'] }); },
  });
}
export function usePurchaseOrders() {
  return useQuery({
    queryKey: ['purchase-orders'],
    queryFn: async () => { const { data } = await api.get('/suppliers/purchase-orders'); return data.data; },
  });
}
export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (d: any) => { const { data } = await api.post('/suppliers/purchase-orders', d); return data.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['purchase-orders'] }); queryClient.invalidateQueries({ queryKey: ['inventory'] }); },
  });
}
export function useReceivePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { const { data } = await api.put(`/suppliers/purchase-orders/${id}/receive`); return data.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['purchase-orders'] }); queryClient.invalidateQueries({ queryKey: ['inventory'] }); },
  });
}

// Appointments
export function useAppointments(params?: { date?: string; staffId?: string; status?: string }) {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: async () => { const { data } = await api.get('/appointments', { params }); return data.data; },
    refetchInterval: 30000,
  });
}
export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (d: any) => { const { data } = await api.post('/appointments', d); return data.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['appointments'] }); },
  });
}
export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...d }: any) => { const { data } = await api.put(`/appointments/${id}`, d); return data.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['appointments'] }); },
  });
}
export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => { const { data } = await api.put(`/appointments/${id}/status`, { status }); return data.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['appointments'] }); },
  });
}

// Table operations
export function useTransferTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, targetTableId }: { id: string; targetTableId: string }) => { const { data } = await api.put(`/tables/${id}/transfer`, { targetTableId }); return data.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tables'] }); },
  });
}
export function useMergeTables() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, sourceTableId }: { id: string; sourceTableId: string }) => { const { data } = await api.put(`/tables/${id}/merge`, { sourceTableId }); return data.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tables'] }); },
  });
}

// Split bill
export function useSplitBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, splits }: { id: string; splits: any[] }) => { const { data } = await api.post(`/orders/${id}/split`, { splits }); return data.data; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['orders'] }); },
  });
}

// Password
export function useChangePassword() {
  return useMutation({
    mutationFn: async (d: { currentPassword: string; newPassword: string }) => { const { data } = await api.post('/auth/change-password', d); return data.data; },
  });
}
export function useResetPassword() {
  return useMutation({
    mutationFn: async (email: string) => { const { data } = await api.post('/auth/reset-password', { email }); return data.data; },
  });
}

// Memberships
export function useMemberships() {
  return useQuery({ queryKey: ['memberships'], queryFn: async () => { const { data } = await api.get('/memberships'); return data; } });
}
export function useCreateMembership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (d: any) => { const { data } = await api.post('/memberships', d); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['memberships'] }),
  });
}
export function useUpdateMembership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...d }: any) => { const { data } = await api.put(`/memberships/${id}`, d); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['memberships'] }),
  });
}
export function useDeleteMembership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { const { data } = await api.delete(`/memberships/${id}`); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['memberships'] }),
  });
}
export function useAssignMembership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ membershipId, customerId }: { membershipId: string; customerId: string }) => { const { data } = await api.post(`/memberships/${membershipId}/assign`, { customerId }); return data; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['memberships'] }); qc.invalidateQueries({ queryKey: ['customers'] }); },
  });
}

// Taxes
export function useTaxes() {
  return useQuery({ queryKey: ['taxes'], queryFn: async () => { const { data } = await api.get('/taxes'); return data; } });
}
export function useCreateTax() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (d: any) => { const { data } = await api.post('/taxes', d); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['taxes'] }),
  });
}
export function useUpdateTax() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...d }: any) => { const { data } = await api.put(`/taxes/${id}`, d); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['taxes'] }),
  });
}
export function useDeleteTax() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { const { data } = await api.delete(`/taxes/${id}`); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['taxes'] }),
  });
}

// Scheduled Reports
export function useScheduledReports() {
  return useQuery({ queryKey: ['scheduled-reports'], queryFn: async () => { const { data } = await api.get('/reports/scheduled'); return data; } });
}
export function useCreateScheduledReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (d: any) => { const { data } = await api.post('/reports/scheduled', d); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['scheduled-reports'] }),
  });
}
export function useRunScheduledReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { const { data } = await api.post(`/reports/scheduled/${id}/run`); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['scheduled-reports'] }),
  });
}
export function useDeleteScheduledReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { const { data } = await api.delete(`/reports/scheduled/${id}`); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['scheduled-reports'] }),
  });
}
