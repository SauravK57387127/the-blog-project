import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';

export const newsletterService = {
  /**
   * Subscribe to newsletter (public — no auth needed)
   */
  subscribe: async (email) => {
    return apiClient.post(API_ENDPOINTS.PUBLIC.NEWSLETTER.SUBSCRIBE, {
      email,
      source: 'newsletter_page',
    });
  },
};
