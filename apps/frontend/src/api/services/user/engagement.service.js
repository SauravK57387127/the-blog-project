import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';

export const engagementService = {
  /**
   * Get isLiked + isBookmarked status for a blog (authenticated).
   */
  getStatus: async (blogId) => {
    return apiClient.get(API_ENDPOINTS.USER.ENGAGEMENT.STATUS(blogId));
  },

  toggleLike: async (blogId) => {
    return apiClient.post(API_ENDPOINTS.USER.LIKES.TOGGLE(blogId));
  },

  toggleBookmark: async (blogId) => {
    return apiClient.post(API_ENDPOINTS.USER.BOOKMARKS.TOGGLE(blogId));
  },
};
