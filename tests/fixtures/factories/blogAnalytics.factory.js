import { models } from '../../../database/index.js';

const { BlogAnalytics } = models;

export async function createBlogAnalytics(blogId, overrides = {}) {
  return BlogAnalytics.create({
    blogId,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalBookmarks: 0,
    views7d: 0,
    views30d: 0,
    views180d: 0,
    ...overrides,
  });
}
