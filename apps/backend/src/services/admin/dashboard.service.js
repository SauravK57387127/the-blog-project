import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';

const { Blog } = models;

export default {
    /**
     * Get dashboard statistics
     */
    getStats: async () => {
        try {
            const [totalBlogs, publishedBlogs, scheduledBlogs, draftBlogs] =
                await Promise.all([
                    Blog.countDocuments(),
                    Blog.countDocuments({ status: 'published' }),
                    Blog.countDocuments({ status: 'scheduled' }),
                    Blog.countDocuments({ status: 'draft' }),
                ]);

            logger.info('Dashboard stats fetched');

            return {
                success: true,
                message: 'Stats fetched',
                data: {
                    totalBlogs,
                    publishedBlogs,
                    scheduledBlogs,
                    draftBlogs,
                },
            };
        } catch (error) {
            logger.error('Get stats failed', { error: error.message });
            return {
                success: false,
                message: 'Failed to fetch stats',
                data: null,
                error: error.message,
            };
        }
    },

    /**
     * Get recent activity (recent blogs updated/created)
     */
    getRecentActivity: async (limit) => {
        try {
            const recentBlogs = await Blog.find()
                .select('title status updatedAt createdAt')
                .sort({ updatedAt: -1 })
                .limit(limit)
                .lean();

            logger.info('Recent activity fetched', {
                count: recentBlogs.length,
            });

            return {
                success: true,
                message: 'Activity fetched',
                data: recentBlogs,
            };
        } catch (error) {
            logger.error('Get activity failed', { error: error.message });
            return {
                success: false,
                message: 'Failed to fetch activity',
                data: null,
                error: error.message,
            };
        }
    },
};
