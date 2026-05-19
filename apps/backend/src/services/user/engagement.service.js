import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';
import mongoose from 'mongoose';
<<<<<<< HEAD
const { Like, Bookmark, User } = models;
export default {
    getEngagementStatus: async ({ userId, blogId }) => {
        try {
            const user = await User.findOne({ clerkUserId: userId });
            if (!user) {
=======
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
>>>>>>> main
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
<<<<<<< HEAD
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
=======

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

>>>>>>> main
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
