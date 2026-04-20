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
      sort = 'latest',
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
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  /**
   * GET /api/public/blogs/search
   * Search blogs by query and/or tags.
   * 
   * Rules:
   * - query alone: min 3 chars, searches title first then tags then content
   * - tags alone: valid, returns blogs matching any selected tag
   * - query + tags: both applied together
   * - neither: return empty early
   */
  searchBlogs: asyncHandler(async (req, res) => {
    const { q, tags, category, page = 1, limit = 9 } = req.query;

    const hasQuery = q && q.trim().length >= 3; // min 3 chars — prevents noise from 'e', 'th' etc.
    const hasTags  = tags && tags.trim().length > 0;

    // FIX: return empty only when BOTH query and tags are absent/invalid
    // Previously returned empty when q was missing — blocked tags-only search
    if (!hasQuery && !hasTags) {
      return sendResponse({
        res,
        statusCode: 200,
        success: true,
        message: 'Search results',
        data: { blogs: [], pagination: { hasMore: false, totalBlogs: 0 } },
      });
    }

    const result = await PublicBlogService.searchBlogs({
      query: hasQuery ? q.trim() : undefined, // only pass query if 3+ chars
      tags: hasTags ? tags.split(',') : undefined,
      category,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    return sendResponse({
      res,
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  /**
   * GET /api/public/blogs/popular
   */
  getPopularBlogs: asyncHandler(async (req, res) => {
    const { limit = 10, period = 'month' } = req.query;

    const result = await PublicBlogService.getPopularBlogs({
      limit: parseInt(limit),
      period,
    });

    return sendResponse({
      res,
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  /**
   * GET /api/public/blogs/:slug
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

    return sendResponse({
      res,
      statusCode: 200,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  /**
   * GET /api/public/blogs/:slug/related
   */
  getRelatedBlogs: asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { limit = 4 } = req.query;

    const result = await PublicBlogService.getRelatedBlogs({
      slug,
      limit: parseInt(limit),
    });

    return sendResponse({
      res,
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),
};
