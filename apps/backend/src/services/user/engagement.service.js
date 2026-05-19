import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';
import mongoose from 'mongoose';
const { Like, Bookmark, User } = models;
export default {
    getEngagementStatus: async ({ userId, blogId }) => {
        try {
            const user = await User.findOne({ clerkUserId: userId });
            if (!user) {
                return {
                    success: false,
                    message: 'User not found',
                    data: { isLiked: false, isBookmarked: false },
                };
            }
            const [like, bookmark] = await Promise.all([
                Like.findOne({
                    userId: user._id,
                    blogId: new mongoose.Types.ObjectId(blogId),
                }).lean(),
                Bookmark.findOne({
                    userId: user._id,
                    blogId: new mongoose.Types.ObjectId(blogId),
                }).lean(),
            ]);
            logger.debug('Engagement status checked', { userId, blogId });
            return {
                success: true,
                message: 'Engagement status fetched',
                data: {
                    isLiked: !!like,
                    isBookmarked: !!bookmark,
                },
            };
        } catch (error) {
            logger.error('Get engagement status failed', {
                error: error.message,
                userId,
                blogId,
            });
            return {
                success: false,
                message: 'Failed to get engagement status',
                data: { isLiked: false, isBookmarked: false },
                error: error.message,
            };
        }
    },
};