import {  models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';

const { BlogView, Blog } = models;

const ViewTrackingService ={
  trackViewBySlug: async ({ slug, sessionId, userId, referrer, device }) => {
    try {
      const blog = await Blog.findOne({ slug, status: 'published' }).select('_id').lean();
      if (!blog) return { success: false, message: 'Blog not found', data: null };

      return ViewTrackingService.trackView({ // ✅ now defined
        blogId: blog._id,
        sessionId,
        userId,
        referrer,
        device,
      });
    } catch (error) {
      console.error('trackViewBySlug actual error:', error);
      logger.error('trackViewBySlug failed', { error: error.message, slug });
      return { success: false, message: 'Failed to track view', data: null };
    }
  },
  
  /**
   * Track initial view
   */
  trackView: async ({ blogId, sessionId, userId, referrer, device }) => {
    try {
      // Check if view already exists for this session
      const existingView = await BlogView.findOne({ blogId, sessionId });

      if (existingView) {
        logger.debug('View already tracked', { blogId, sessionId });
        return {
          success: true,
          message: 'View already tracked',
          data: existingView,
        };
      }

      // Create new view
      const view = await BlogView.create({
        blogId,
        sessionId,
        userId: userId || null,
        referrer: referrer || null,
        device: device || 'unknown',
        viewedAt: new Date(),
      });

      logger.info('View tracked', { blogId, sessionId });

      return {
        success: true,
        message: 'View tracked',
        data: view,
      };
    } catch (error) {
      logger.error('Track view failed', { error: error.message, blogId, sessionId });
      return {
        success: false,
        message: 'Failed to track view',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Update view metrics (on page exit)
   */
  updateView: async ({ blogId, sessionId, timeSpent, scrollDepth, completed }) => {
    try {
      const view = await BlogView.findOneAndUpdate(
        { blogId, sessionId },
        {
          timeSpent: timeSpent || 0,
          scrollDepth: scrollDepth || 0,
          completed: completed || false,
        },
        { new: true }
      );

      if (!view) {
        logger.warn('View not found for update', { blogId, sessionId });
        return {
          success: false,
          message: 'View not found',
          data: null,
        };
      }

      logger.info('View updated', { blogId, sessionId, timeSpent, scrollDepth });

      return {
        success: true,
        message: 'View updated',
        data: view,
      };
    } catch (error) {
      logger.error('Update view failed', { error: error.message, blogId, sessionId });
      return {
        success: false,
        message: 'Failed to update view',
        data: null,
        error: error.message,
      };
    }
  },
};

export default ViewTrackingService;  // ← export the named const, not an anonymous object
