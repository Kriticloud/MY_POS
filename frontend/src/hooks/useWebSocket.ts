import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:4000';

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      // Join the branch room
      if (user.branchId) {
        socket.emit('join-branch', user.branchId);
      }
    });

    // Real-time order updates
    socket.on('order-created', (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast(`New order: ${data.order?.orderNumber}`, { icon: '🆕' });
    });

    socket.on('order-updated', (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['kitchen'] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    });

    socket.on('kitchen-updated', () => {
      queryClient.invalidateQueries({ queryKey: ['kitchen'] });
    });

    socket.on('table-updated', () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, queryClient]);

  return socketRef;
}
