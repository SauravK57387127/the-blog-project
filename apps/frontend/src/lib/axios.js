import axios from 'axios';
import { getAuthToken, getAdminToken, setAdminToken, clearAdminToken } from './auth-token';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
  withCredentials: true, // send httpOnly refresh token cookie automatically
});

// ── Token refresh state ───────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue  = [];

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
}

// ── Request interceptor ───────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    const url = config.url ?? '';

    // User endpoints → Clerk JWT
    if (url.includes('/api/user')) {
      const token = await getAuthToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }

    // Admin endpoints → local JWT
    if (url.includes('/api/admin')) {
      const adminToken = getAdminToken();
      if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  // Unwrap response.data — services receive { success, message, data } directly
  (response) => response.data,

  async (error) => {
    const status        = error.response?.status;
    const originalConfig = error.config;

    // ── User 401 → redirect to sign-in (Clerk handles its own refresh)
    if (status === 401 && originalConfig?.url?.includes('/api/user')) {
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
      return Promise.reject(error.response?.data ?? { message: error.message });
    }

    // ── Admin 401 → attempt silent token refresh before giving up
    if (status === 401 && originalConfig?.url?.includes('/api/admin')) {

      // Do not retry the refresh endpoint itself — would cause infinite loop
      if (originalConfig?.url?.includes('/auth/refresh')) {
        clearAdminToken();
        if (typeof window !== 'undefined') window.location.href = '/admin/login';
        return Promise.reject(error.response?.data ?? { message: error.message });
      }

      // Do not retry requests already marked as retried
      if (originalConfig?._retry) {
        clearAdminToken();
        if (typeof window !== 'undefined') window.location.href = '/admin/login';
        return Promise.reject(error.response?.data ?? { message: error.message });
      }

      // If a refresh is already in flight, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalConfig.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalConfig);
          })
          .catch((err) => Promise.reject(err));
      }

      // Start refresh
      isRefreshing = true;
      originalConfig._retry = true;

      try {
        // httpOnly refresh token cookie is sent automatically via withCredentials
        const data     = await apiClient.post('/api/admin/auth/refresh');
        const newToken = data?.data?.accessToken;

        if (!newToken) throw new Error('No token in refresh response');

        setAdminToken(newToken);
        processQueue(null, newToken);

        // Retry the original request with the new token
        originalConfig.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalConfig);

      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAdminToken();
        if (typeof window !== 'undefined') window.location.href = '/admin/login';
        return Promise.reject(refreshError?.response?.data ?? { message: 'Session expired' });

      } finally {
        isRefreshing = false;
      }
    }

    // All other errors — reject with backend error shape
    return Promise.reject(error.response?.data ?? { message: error.message });
  }
);
