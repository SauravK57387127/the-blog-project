import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';

const { Blog } = models;

export default {
  /**
   * Get current editor's picks
   */
  getCurrentPicks: async () => {
    try {
      const picks = await Blog.find({
        status: 'published',
        'editorsPick.isEditorsPick': true,
      })
        .sort({ 'editorsPick.pickOrder': 1 })
        .select('title slug editorsPick')
        .lean();

      logger.info('Editor\'s picks fetched', { count: picks.length });

      return {
        success: true,
        message: 'Picks fetched',
        data: picks,
      };
    } catch (error) {
      logger.error('Get picks failed', { error: error.message });
      return {
        success: false,
        message: 'Failed to fetch picks',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Add blog to editor's choice
   */
  addPick: async ({ blogId, annotation, pickOrder }) => {
    try {
      // Check if already 4 picks
      const currentCount = await Blog.countDocuments({
        'editorsPick.isEditorsPick': true,
      });

      if (currentCount >= 4) {
        return {
          success: false,
          message: 'Maximum 4 picks allowed. Remove one first.',
          data: null,
        };
      }

      // Check if order already taken
      const orderTaken = await Blog.findOne({
        'editorsPick.isEditorsPick': true,
        'editorsPick.pickOrder': pickOrder,
      });

      if (orderTaken) {
        return {
          success: false,
          message: `Order ${pickOrder} already taken`,
          data: null,
        };
      }

      const blog = await Blog.findById(blogId);

      if (!blog) {
        return {
          success: false,
          message: 'Blog not found',
          data: null,
        };
      }

      if (blog.status !== 'published') {
        return {
          success: false,
          message: 'Only published blogs can be editor\'s picks',
          data: null,
        };
      }

      if (blog.editorsPick?.isEditorsPick) {
        return {
          success: false,
          message: 'Blog already in editor\'s choice',
          data: null,
        };
      }

      blog.editorsPick = {
        isEditorsPick: true,
        annotation,
        pickOrder,
        pickedAt: new Date(),
      };

      await blog.save();

      logger.info('Blog added to editor\'s choice', { blogId, pickOrder });

      return {
        success: true,
        message: 'Added to editor\'s choice',
        data: blog,
      };
    } catch (error) {
      logger.error('Add pick failed', { error: error.message, blogId });
      return {
        success: false,
        message: 'Failed to add pick',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Update pick annotation/order
   */
  updatePick: async (blogId, updates) => {
    try {
      const blog = await Blog.findById(blogId);

      if (!blog || !blog.editorsPick?.isEditorsPick) {
        return {
          success: false,
          message: 'Blog not in editor\'s choice',
          data: null,
        };
      }

      // If updating order, check if new order available
      if (updates.pickOrder && updates.pickOrder !== blog.editorsPick.pickOrder) {
        const orderTaken = await Blog.findOne({
          _id: { $ne: blogId },
          'editorsPick.isEditorsPick': true,
          'editorsPick.pickOrder': updates.pickOrder,
        });

        if (orderTaken) {
          return {
            success: false,
            message: `Order ${updates.pickOrder} already taken`,
            data: null,
          };
        }
      }

      if (updates.annotation) {
        blog.editorsPick.annotation = updates.annotation;
      }

      if (updates.pickOrder) {
        blog.editorsPick.pickOrder = updates.pickOrder;
      }

      await blog.save();

      logger.info('Editor\'s pick updated', { blogId });

      return {
        success: true,
        message: 'Pick updated',
        data: blog,
      };
    } catch (error) {
      logger.error('Update pick failed', { error: error.message, blogId });
      return {
        success: false,
        message: 'Failed to update pick',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Remove from editor's choice
   */
  removePick: async (blogId) => {
    try {
      const blog = await Blog.findById(blogId);

      if (!blog || !blog.editorsPick?.isEditorsPick) {
        return {
          success: false,
          message: 'Blog not in editor\'s choice',
          data: null,
        };
      }

      blog.editorsPick = {
        isEditorsPick: false,
        annotation: null,
        pickOrder: null,
        pickedAt: null,
      };

      await blog.save();

      logger.info('Removed from editor\'s choice', { blogId });

      return {
        success: true,
        message: 'Removed from editor\'s choice',
        data: { blogId },
      };
    } catch (error) {
      logger.error('Remove pick failed', { error: error.message, blogId });
      return {
        success: false,
        message: 'Failed to remove pick',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Reorder all picks at once
   */
  reorderPicks: async (blogIds) => {
    try {
      // Validate all IDs are current picks
      const blogs = await Blog.find({
        _id: { $in: blogIds },
        'editorsPick.isEditorsPick': true,
      });

      if (blogs.length !== 4) {
        return {
          success: false,
          message: 'All 4 blogIds must be current picks',
          data: null,
        };
      }

      // Update orders
      const updates = blogIds.map((blogId, index) =>
        Blog.updateOne(
          { _id: blogId },
          { 'editorsPick.pickOrder': index + 1 }
        )
      );

      await Promise.all(updates);

      logger.info('Editor\'s picks reordered');

      return {
        success: true,
        message: 'Picks reordered',
        data: { blogIds },
      };
    } catch (error) {
      logger.error('Reorder picks failed', { error: error.message });
      return {
        success: false,
        message: 'Failed to reorder picks',
        data: null,
        error: error.message,
      };
    }
  },
};
