import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { setAdminToken, clearAdminToken } from '@/lib/auth-token';

export const adminAuthService = {
  login: async (username, password) => {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.AUTH.LOGIN, {
      username,
      password,
    });
    // Store token after successful login
    if (response?.data?.accessToken) {
      setAdminToken(response.data.accessToken);
    }
    return response;
  },

  logout: async () => {
    try {
      await apiClient.post(API_ENDPOINTS.ADMIN.AUTH.LOGOUT);
    } finally {
      clearAdminToken();
    }
  },

  getMe: async () => {
    return apiClient.get(API_ENDPOINTS.ADMIN.AUTH.ME);
  },
};
