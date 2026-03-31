import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';

export const historyService = {
  getHistory: async ({ page = 1, limit = 10 } = {}) => {
    return apiClient.get(API_ENDPOINTS.USER.HISTORY, {
      params: { page, limit },
    });
  },
};
