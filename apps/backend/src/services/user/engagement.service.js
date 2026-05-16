import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';
import mongoose from 'mongoose';
const { Like, Bookmark, User, BlogAnalytics } = models;
export default {
    getEngagementStatus: async ({ userId, blogId }) => {
        try {
            const objectId = new mongoose.Types.ObjectId(blogId);

            // Get analytics regardless of auth
            const analytics = await BlogAnalytics.findOne({ blogId: objectId })
                .select('totalViews')
                .lean();

            // Anonymous user — return just view count
            if (!userId) {
                return {
                    success: true,
                    message: 'Engagement status fetched',
                    data: {
                        isLiked: false,
                        isBookmarked: false,
                        totalViews: analytics?.totalViews ?? 0,
                    },
                };
            }

            const user = await User.findOne({ clerkUserId: userId });
            if (!user) {
                return {
                    success: true,
                    message: 'Engagement status fetched',
                    data: {
                        isLiked: false,
                        isBookmarked: false,
                        totalViews: analytics?.totalViews ?? 0,
                    },
                };
            }

            const [like, bookmark] = await Promise.all([
                Like.findOne({ userId: user._id, blogId: objectId }).lean(),
                Bookmark.findOne({ userId: user._id, blogId: objectId }).lean(),
            ]);

            return {
                success: true,
                message: 'Engagement status fetched',
                data: {
                    isLiked: !!like,
                    isBookmarked: !!bookmark,
                    totalViews: analytics?.totalViews ?? 0,
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
                data: { isLiked: false, isBookmarked: false, totalViews: 0 },
                error: error.message,
            };
        }
    },
};
