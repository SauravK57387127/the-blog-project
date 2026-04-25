import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';

const { BlogView, Blog, BlogAnalytics } = models;

const ViewTrackingService = {
  trackViewBySlug: async ({ slug, sessionId, userId, referrer, device }) => {
    try {
      const blog = await Blog.findOne({ slug, status: 'published' }).select('_id').lean();
      if (!blog) return { success: false, message: 'Blog not found', data: null };

      return ViewTrackingService.trackView({
        blogId: blog._id,
        sessionId,
        userId,
        referrer,
        device,
      });
    } catch (error) {
      logger.error('trackViewBySlug failed', { error: error.message, slug });
      return { success: false, message: 'Failed to track view', data: null };
    }
  },

  /**
   * Track initial view.
   * FIX: now increments BlogAnalytics.totalViews on new (non-duplicate) views.
   * Returns sessionId so frontend can use it for the later /views/update call.
   */
  trackView: async ({ blogId, sessionId, userId, referrer, device }) => {
    try {
      // Dedup — one view per sessionId per blog
      const existingView = await BlogView.findOne({ blogId, sessionId });

      if (existingView) {
        logger.debug('View already tracked', { blogId, sessionId });
        return {
          success: true,
          message: 'View already tracked',
          data: { sessionId: existingView.sessionId, alreadyTracked: true },
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

      // FIX: increment BlogAnalytics — this is what was missing.
      // totalViews drives what users see on blog cards + what analytics shows.
      // views7d + views180d drive trending + popular sections on homepage.
      await BlogAnalytics.findOneAndUpdate(
        { blogId },
        {
          $inc: {
            totalViews: 1,
            views7d:    1,
            views30d:   1,
            views180d:  1,
          },
        },
        { upsert: true }
      );

      logger.info('View tracked', { blogId, sessionId, userId: userId || 'anon' });

      return {
        success: true,
        message: 'View tracked',
        // Return sessionId — frontend stores it to send with /views/update on exit
        data: { sessionId: view.sessionId, blogId: view.blogId },
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
   * Update view metrics on page exit.
   * Called by frontend via sendBeacon when user leaves the blog page.
   */
  updateView: async ({ blogId, sessionId, timeSpent, scrollDepth, completed }) => {
    try {
      const view = await BlogView.findOneAndUpdate(
        { blogId, sessionId },
        {
          timeSpent:   timeSpent   || 0,
          scrollDepth: scrollDepth || 0,
          completed:   completed   || false,
          exitedAt:    new Date(),
        },
        { new: true }
      );

      if (!view) {
        logger.warn('View not found for update', { blogId, sessionId });
        return { success: false, message: 'View not found', data: null };
      }

      // Update completionRate on BlogAnalytics if read was meaningful
      if (scrollDepth >= 50 || completed) {
        const totalViews = await BlogView.countDocuments({ blogId });
        const completedViews = await BlogView.countDocuments({
          blogId,
          $or: [{ scrollDepth: { $gte: 50 } }, { completed: true }],
        });

        const completionRate = totalViews > 0
          ? Math.round((completedViews / totalViews) * 100)
          : 0;

        await BlogAnalytics.findOneAndUpdate(
          { blogId },
          { $set: { completionRate } },
          { upsert: true }
        );
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

export default ViewTrackingService;
