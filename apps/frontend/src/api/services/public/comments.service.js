import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';

export const publicCommentsService = {
  /**
   * Get comments for a blog — returns flat list, hook nests them.
   */
  getByBlog: async (blogId, { page = 1, limit = 50 } = {}) => {
    return apiClient.get(API_ENDPOINTS.PUBLIC.COMMENTS.BY_BLOG(blogId), {
      params: { page, limit },
    });
  },
};
