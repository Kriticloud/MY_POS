import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Product, Category, Order, Customer, Table, ApiResponse } from '../types';

// Products
export function useProducts(params?: { search?: string; categoryId?: string }) {
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
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>('/categories');
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
