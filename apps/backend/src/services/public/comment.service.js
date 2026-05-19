import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';
const { Comment, Author } = models;
export default {
    getBlogComments: async (blogId, page = 1, limit = 5) => {
        try {
            const author = await Author.findOne({ isActive: true })
                .select('clerkUserId')
                .lean();
            const authorClerkId = author?.clerkUserId ?? null;

            const skip = (page - 1) * limit;

            const topLevelComments = await Comment.find({
                blogId,
                parentId: null,
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('userId', 'name profileImage clerkUserId')
                .lean();

            const totalTopLevelComments = await Comment.countDocuments({
                blogId,
                parentId: null,
            });

            const commentsWithReplies = await Promise.all(
                topLevelComments.map(async (comment) => {
                    const replies = await buildNestedReplies(
                        comment._id,
                        authorClerkId,
                    );
                    return {
                        ...comment,
                        isAuthor:
                            !!authorClerkId &&
                            comment.userId?.clerkUserId === authorClerkId,
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
                            skip + topLevelComments.length < totalTopLevelComments,
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

async function buildNestedReplies(parentId, authorClerkId) {
    const replies = await Comment.find({ parentId })
        .sort({ createdAt: 1 })
        .populate('userId', 'name profileImage clerkUserId')
        .lean();

    const repliesWithNested = await Promise.all(
        replies.map(async (reply) => {
            const nestedReplies = await buildNestedReplies(
                reply._id,
                authorClerkId,
            );
            return {
                ...reply,
                isAuthor:
                    !!authorClerkId &&
                    reply.userId?.clerkUserId === authorClerkId,
                replies: nestedReplies,
            };
        }),
    );

    return repliesWithNested;
}
