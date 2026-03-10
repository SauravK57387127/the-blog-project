import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';

const { Author } = models;

export default {
  getAuthor: async (authorId) => {
    try {
      const author = await Author.findById(authorId)
        .select('name bio profileImage email socialLinks')
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
