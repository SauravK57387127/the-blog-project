import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import PublicBlogService from '../../services/public/blog.service.js';

export default {
  /**
   * GET /api/public/blogs
   * List all published blogs
   */
  listBlogs: asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 20,
      tags,
      category,
      sort = 'latest',  // latest, popular, trending
    } = req.query;

    const result = await PublicBlogService.listBlogs({
      page: parseInt(page),
      limit: parseInt(limit),
      tags: tags ? tags.split(',') : undefined,
      category,
      sort,
    });

     return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: 'Search query required',
        data: null,
      });
  }),

  /**
   * GET /api/public/blogs/search
   * Search blogs
   */
  searchBlogs: asyncHandler(async (req, res) => {
    const { q, tags, category, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length === 0) {
     sendResponse({
      res,
      statusCode: 200,
      success: true,
      message: 'Search results',
      data: result,
    });
    }

    const result = await PublicBlogService.searchBlogs({
      query: q,
      tags: tags ? tags.split(',') : undefined,
      category,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    sendResponse({
  res,
  statusCode: result.success ? 200 : 400,
  success: result.success,
  message: result.message,
  data: result.data,
});
  }),

  /**
   * GET /api/public/blogs/popular
   * Get popular blogs
   */
  getPopularBlogs: asyncHandler(async (req, res) => {
    const { limit = 10, period = 'month' } = req.query;  // week, month, all-time

    const result = await PublicBlogService.getPopularBlogs({
      limit: parseInt(limit),
      period,
    });

    sendResponse({
  res,
  statusCode: result.success ? 200 : 400,
  success: result.success,
  message: result.message,
  data: result.data,
});
}),
  /**
   * GET /api/public/blogs/:slug
   * Get single blog
   */
  getBlogBySlug: asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const result = await PublicBlogService.getBlogBySlug(slug);

    if (!result.success) {
      return sendResponse({
        res,
        statusCode: 404,
        success: false,
        message: result.message,
        data: null,
      });
    }

    sendResponse({
  res,
  statusCode: result.success ? 200 : 400,
  success: result.success,
  message: result.message,
  data: result.data,
});
}),

  /**
   * GET /api/public/blogs/:slug/related
   * Get related blogs
   */
  getRelatedBlogs: asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { limit = 4 } = req.query;

    const result = await PublicBlogService.getRelatedBlogs({
      slug,
      limit: parseInt(limit),
    });

    sendResponse({
  res,
  statusCode: result.success ? 200 : 400,
  success: result.success,
  message: result.message,
  data: result.data,
});
}),
};
