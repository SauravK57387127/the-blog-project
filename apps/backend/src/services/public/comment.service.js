import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';

const { Comment } = models;

export default {
    /**
     * Get comments with nested replies
     * Fetches top-level comments with ALL nested replies
     */
    getBlogComments: async (blogId, page = 1, limit = 5) => {
        try {
            const skip = (page - 1) * limit;

            // Get top-level comments (parentId = null)
            const topLevelComments = await Comment.find({
                blogId,
                parentId: null,
            })
                .sort({ createdAt: -1 }) // Newest first
                .skip(skip)
                .limit(limit)
                .populate('userId', 'name profileImage clerkUserId')
                .lean();

            // Get total count of top-level comments (for pagination)
            const totalTopLevelComments = await Comment.countDocuments({
                blogId,
                parentId: null,
            });

            // For each top-level comment, fetch all nested replies
            const commentsWithReplies = await Promise.all(
                topLevelComments.map(async (comment) => {
                    const replies = await buildNestedReplies(comment._id);
                    return {
                        ...comment,
                        replies,
                    };
                }),
            );

            logger.info('Blog comments fetched', {
                blogId,
                page,
                topLevelCount: topLevelComments.length,
                totalTopLevel: totalTopLevelComments,
            });

            return {
                success: true,
                message: 'Comments fetched',
                data: {
                    comments: commentsWithReplies,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(totalTopLevelComments / limit),
                        totalComments: totalTopLevelComments,
                        hasMore:
                            skip + topLevelComments.length <
                            totalTopLevelComments,
                    },
                },
            };
        } catch (error) {
            logger.error('Fetch comments failed', {
                error: error.message,
                blogId,
            });
            return {
                success: false,
                message: 'Failed to fetch comments',
                data: null,
                error: error.message,
            };
        }
    },
};

/**
 * Recursively build nested reply tree
 */
async function buildNestedReplies(parentId) {
    const replies = await Comment.find({ parentId })
        .sort({ createdAt: 1 }) // Oldest first for replies (natural conversation flow)
        .populate('userId', 'name profileImage clerkUserId')
        .lean();

    // Recursively fetch replies for each reply
    const repliesWithNested = await Promise.all(
        replies.map(async (reply) => {
            const nestedReplies = await buildNestedReplies(reply._id);
            return {
                ...reply,
                replies: nestedReplies,
            };
        }),
    );

    return repliesWithNested;
}
