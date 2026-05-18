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
