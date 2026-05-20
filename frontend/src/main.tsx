import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '16px',
              padding: '14px 20px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.05)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
              style: { background: '#ecfdf5', color: '#065f46' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
              style: { background: '#fef2f2', color: '#991b1b' },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

// Register service worker for offline support
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
