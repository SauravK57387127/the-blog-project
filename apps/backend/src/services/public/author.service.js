import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';

const { Author } = models;

const AUTHOR_SELECT = 'name bio profileImage email socialLinks tagline learningAreas currentFocus writingTopics isActive';

export default {
  /**
   * Get the single active author.
   * Used by: about page, blog detail page.
   */
  getActiveAuthor: async () => {
    try {
      const author = await Author.findOne({ isActive: true })
        .select(AUTHOR_SELECT)
        .lean();

      if (!author) {
        return {
          success: false,
          message: 'Author not found',
          data: null,
        };
      }

      logger.info('Active author fetched');

      return {
        success: true,
        message: 'Author fetched',
        data: author,
      };
    } catch (error) {
      logger.error('Get active author failed', { error: error.message });
      return {
        success: false,
        message: 'Failed to fetch author',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Get author by ID.
   */
  getAuthor: async (authorId) => {
    try {
      const author = await Author.findById(authorId)
        .select(AUTHOR_SELECT)
        .lean();

      if (!author) {
        return {
          success: false,
          message: 'Author not found',
          data: null,
        };
      }

      logger.info('Author fetched', { authorId });

      return {
        success: true,
        message: 'Author fetched',
        data: author,
      };
    } catch (error) {
      logger.error('Get author failed', { error: error.message, authorId });
      return {
        success: false,
        message: 'Failed to fetch author',
        data: null,
        error: error.message,
      };
    }
  },
};
