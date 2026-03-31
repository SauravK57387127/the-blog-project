import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';

export const blogService = {
  getBySlug: async (slug) => {
    return apiClient.get(API_ENDPOINTS.PUBLIC.BLOGS.DETAIL(slug));
  },

  getRelated: async (slug, limit = 5) => {
    return apiClient.get(API_ENDPOINTS.PUBLIC.BLOGS.RELATED(slug), {
      params: { limit },
    });
  },

  trackView: async (slug, userId = null) => {
    return apiClient.post(API_ENDPOINTS.PUBLIC.BLOGS.VIEW(slug), {
      userId: userId || undefined,
    });
  },
};
