import axios from 'axios';
import { getAuthToken, getAdminToken, clearAdminToken } from './auth-token';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// ── Request interceptor ──────────────────────────────────────────────────────
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

// ── Response interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  // Return response.data directly — no need to unwrap in services
  (response) => response.data,

  (error) => {
    const status = error.response?.status;

    // User session expired → redirect to sign-in
    if (status === 401 && error.config?.url?.includes('/api/user')) {
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
    }

    // Admin session expired → clear token + redirect to admin login
    if (status === 401 && error.config?.url?.includes('/api/admin')) {
      clearAdminToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }

    // Reject with backend error shape so hooks can read .message
    return Promise.reject(error.response?.data ?? { message: error.message });
  }
);
