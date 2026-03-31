import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';

export const adminBlogsService = {
  getPublished: ({ status, category, page = 1, limit = 20 } = {}) =>
    apiClient.get(API_ENDPOINTS.ADMIN.BLOGS.PUBLISHED, {
      params: { status, category, page, limit },
    }),

  delete: (blogId) =>
    apiClient.delete(API_ENDPOINTS.ADMIN.BLOGS.DELETE(blogId)),

  publishNow: (blogId) =>
    apiClient.post(API_ENDPOINTS.ADMIN.BLOGS.PUBLISH(blogId)),

  getBlogByDraftSlug: (draftSlug) =>
    apiClient.get(API_ENDPOINTS.ADMIN.BLOGS.BY_DRAFT_SLUG(draftSlug)),
};
