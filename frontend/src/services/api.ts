import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('auth-storage');
  if (stored) {
    const { state } = JSON.parse(stored);
    if (state?.accessToken) {
      config.headers.Authorization = `Bearer ${state.accessToken}`;
    }
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const stored = localStorage.getItem('auth-storage');
      if (stored) {
        const { state } = JSON.parse(stored);
        if (state?.refreshToken) {
          try {
            const { data } = await axios.post('/api/auth/refresh', {
              refreshToken: state.refreshToken,
            });
            const { accessToken, refreshToken } = data.data;
            const newState = { ...state, accessToken, refreshToken };
            localStorage.setItem('auth-storage', JSON.stringify({ state: newState }));
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          } catch {
            localStorage.removeItem('auth-storage');
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);
