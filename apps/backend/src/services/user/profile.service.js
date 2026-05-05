import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';

const { User } = models;

export default {
    /**
     * Get user profile
     */
    getProfile: async (clerkUserId) => {
        try {
            const user = await User.findOne({ clerkUserId })
                .select('name email profileImage clerkUserId createdAt')
                .lean();

            if (!user) {
                return {
                    success: false,
                    message: 'User not found',
                    data: null,
                };
            }

            logger.info('User profile fetched', { clerkUserId });

            return {
                success: true,
                message: 'Profile fetched',
                data: user,
            };
        } catch (error) {
            logger.error('Get profile failed', {
                error: error.message,
                clerkUserId,
            });
            return {
                success: false,
                message: 'Failed to fetch profile',
                data: null,
                error: error.message,
            };
        }
    },
};
