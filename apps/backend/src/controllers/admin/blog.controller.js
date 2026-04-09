import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendResponse } from '../../utils/sendResponse.js';
import AdminBlogService from '../../services/admin/blog.service.js';

export default ({ blogQueue } = {}) => ({
  /**
 * GET /api/admin/blogs/published?status=published&category=tech&page=1&limit=15
 */
getPublishedBlogs: asyncHandler(async (req, res) => {
  const { status, category, page = 1, limit = 15 } = req.query;

  const result = await AdminBlogService.getPublishedBlogs({
    status,
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
 * GET /api/admin/blogs/drafts?page=1&limit=15
 */
getDrafts: asyncHandler(async (req, res) => {
  const { page = 1, limit = 15 } = req.query;

  const result = await AdminBlogService.getDrafts({
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
   * GET /api/admin/blogs
   */
  listBlogs: asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20, search } = req.query;

    const result = await AdminBlogService.listBlogs({
      status,
      search,
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
   * GET /api/admin/blogs/:id
   */
  getBlogById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await AdminBlogService.getBlogById(id);

    sendResponse({
      res,
      statusCode: result.success ? 200 : 404,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

/**
 * GET /api/admin/blogs/draft/:draftSlug
 * Get blog by draft slug (for editor)
 */
getBlogByDraftSlug: asyncHandler(async (req, res) => {
  const { draftSlug } = req.params;

  const result = await AdminBlogService.getBlogByDraftSlug(draftSlug);

  sendResponse({
    res,
    statusCode: result.success ? 200 : 404,
    success: result.success,
    message: result.message,
    data: result.data,
  });
}),

  /**
   * POST /api/admin/blogs
   */
  createBlog: asyncHandler(async (req, res) => {
    const blogData = req.sanitizedBody || req.body;

    const result = await AdminBlogService.createBlog(blogData);

    sendResponse({
      res,
      statusCode: result.success ? 201 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  /**
   * PUT /api/admin/blogs/:id
   */
  updateBlog: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.sanitizedBody || req.body;

    const result = await AdminBlogService.updateBlog(id, updates);

    sendResponse({
      res,
      statusCode: result.success ? 200 : 404,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  /**
   * DELETE /api/admin/blogs/:id
   */
  deleteBlog: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await AdminBlogService.deleteBlog(id, { blogQueue });

    sendResponse({
      res,
      statusCode: result.success ? 200 : 404,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  /**
   * POST /api/admin/blogs/:id/autosave
   */
  autosaveBlog: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const result = await AdminBlogService.autosaveBlog(id, updates);

    sendResponse({
      res,
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  /**
   * POST /api/admin/blogs/:id/publish
   */
  publishBlog: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await AdminBlogService.publishBlog(id, { blogQueue });

    sendResponse({
      res,
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  /**
   * POST /api/admin/blogs/:id/schedule
   */
  scheduleBlog: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { scheduledAt } = req.body;

    if (!scheduledAt) {
      return sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: 'scheduledAt is required',
        data: null,
      });
    }

    const result = await AdminBlogService.scheduleBlog(id, scheduledAt, { blogQueue });

    sendResponse({
      res,
      statusCode: result.success ? 200 : 400,
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }),

  /**
   * POST /api/admin/blogs/:id/unpublish
   */
  unpublishBlog: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await AdminBlogService.unpublishBlog(id, { blogQueue });

    sendResponse({
      res,
      statusCode: result.success ? 200 : 404,
      success: result.success,
      message: result.message,
      data: result.data
    });
  }),

  toggleEditorsPick: asyncHandler(async (req, res) => {
  const { isEditorsPick, annotation } = req.body;
  const result = await AdminBlogService.toggleEditorsPick(req.params.id, { isEditorsPick, annotation });
  
sendResponse({
      res,
      statusCode: result.success ? 200 : 404,
      success: result.success,
      message: result.message,
      data: result.data
    });

  }),
});
