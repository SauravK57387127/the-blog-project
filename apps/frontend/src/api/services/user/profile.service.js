import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';

export const profileService = {
  getProfile: async () => {
    return apiClient.get(API_ENDPOINTS.USER.PROFILE);
  },
};
