import { Router } from 'express';
import { invalidateCache } from '../../middlewares/cache.middleware.js';
import { sanitizeFields } from '../../middlewares/sanitize.middleware.js';
import { sanitizeHTML, sanitizePlainText, sanitizeArray } from '../../utils/sanitize.js';
import AdminBlogController from '../../controllers/admin/blog.controller.js';

export default ({ blogQueue } = {}) => {
  const router = Router();
  const blogController = AdminBlogController({ blogQueue });

  // ===== SPECIFIC ROUTES FIRST =====
  
  /**
   * GET /api/admin/blogs/published?status=published&category=tech&page=1&limit=15
   */
  router.get('/published', blogController.getPublishedBlogs);

  /**
   * GET /api/admin/blogs/drafts?page=1&limit=15
   */
  router.get('/drafts', blogController.getDrafts);

/**
 * GET /api/admin/blogs/draft/:draftSlug
 * Get blog by draft slug (for editor)
 */
router.get('/draft/:draftSlug', blogController.getBlogByDraftSlug);

  // ===== GENERIC ROUTES AFTER =====
  
  /**
   * GET /api/admin/blogs?status=draft&page=1&limit=20
   */
  router.get('/', blogController.listBlogs);

  /**
   * GET /api/admin/blogs/:id
   */
  router.get('/:id', blogController.getBlogById);

  /**
   * POST /api/admin/blogs
   */
  router.post(
    '/',
    sanitizeFields({
      title: sanitizePlainText,
      content: sanitizeHTML,
      coverImage: sanitizePlainText,
      excerpt: sanitizePlainText,
      tags: sanitizeArray,
    }),
    blogController.createBlog
  );

  /**
   * PUT /api/admin/blogs/:id
   */
  router.put(
    '/:id',
    sanitizeFields({
      title: sanitizePlainText,
      content: sanitizeHTML,
      coverImage: sanitizePlainText,
      excerpt: sanitizePlainText,
      tags: sanitizeArray,
    }),
    invalidateCache('cache:/api/public/blogs*'),
    blogController.updateBlog
  );

  /**
   * DELETE /api/admin/blogs/:id (SINGLE - Remove duplicate)
   */
  router.delete(
    '/:id',
    invalidateCache('cache:/api/public/blogs*'),
    blogController.deleteBlog
  );


  // ===== ACTION ROUTES =====
  router.post('/:id/autosave', blogController.autosaveBlog); 

  /**
   * POST /api/admin/blogs/:id/publish
   */
  router.post('/:id/publish', invalidateCache('cache:/api/public/blogs*'), blogController.publishBlog);

  /**
   * POST /api/admin/blogs/:id/schedule
   */
  router.post('/:id/schedule', invalidateCache('cache:/api/public/blogs*'), blogController.scheduleBlog);

  /**
   * POST /api/admin/blogs/:id/unpublish
   */
  router.post('/:id/unpublish', invalidateCache('cache:/api/public/blogs*'), blogController.unpublishBlog);


router.post('/:id/editors-choice', blogController.toggleEditorsPick);

  return router;
};
