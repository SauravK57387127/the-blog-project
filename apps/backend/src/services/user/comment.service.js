import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';
import mongoose from 'mongoose';

const { Comment, Blog, User, BlogAnalytics, Notification } = models;

export default {
    /**
     * Get all my comments with pagination
     */
    getMyComments: async ({ userId, page, limit }) => {
        try {
            const user = await User.findOne({ clerkUserId: userId });

            if (!user) {
                return {
                    success: false,
                    message: 'User not found',
                    data: null,
                };
            }

            const skip = (page - 1) * limit;

            const [comments, totalCount] = await Promise.all([
                Comment.find({ userId: user._id })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate('blogId', 'title slug')
                    .lean(),
                Comment.countDocuments({ userId: user._id }),
            ]);

            // Count replies for each comment
            const commentsWithReplies = await Promise.all(
                comments.map(async (comment) => {
                    const replyCount = await Comment.countDocuments({
                        parentId: comment._id,
                    });
                    return {
                        _id: comment._id,
                        content: comment.content,
                        blogTitle: comment.blogId?.title || 'Untitled',
                        blogSlug: comment.blogId?.slug || '',
                        replyCount,
                        createdAt: comment.createdAt,
                    };
                }),
            );

            logger.info('User comments fetched', {
                userId,
                count: comments.length,
            });

            return {
                success: true,
                message: 'Comments fetched',
                data: {
                    comments: commentsWithReplies,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(totalCount / limit),
                        totalComments: totalCount,
                        hasMore: skip + comments.length < totalCount,
                    },
                },
            };
        } catch (error) {
            logger.error('Get my comments failed', {
                error: error.message,
                userId,
            });
            return {
                success: false,
                message: 'Failed to fetch comments',
                data: null,
                error: error.message,
            };
        }
    },

    /**
     * Add comment to blog
     */
    addComment: async ({ userId, blogId, content, parentId = null }) => {
        try {
            const user = await User.findOne({ clerkUserId: userId });

            if (!user) {
                return {
                    success: false,
                    message: 'User not found',
                    data: null,
                };
            }

            const blog = await Blog.findById(blogId);
            if (!blog || blog.status !== 'published') {
                return {
                    success: false,
                    message: 'Blog not found or not published',
                    data: null,
                };
            }

            const comment = await Comment.create({
                blogId: new mongoose.Types.ObjectId(blogId),
                userId: user._id,
                content,
                parentId: parentId
                    ? new mongoose.Types.ObjectId(parentId)
                    : null,
            });

            // Update analytics
            await BlogAnalytics.findOneAndUpdate(
                { blogId },
                { $inc: { totalComments: 1 } },
                { upsert: true },
            );

            logger.info('Comment added', {
                userId,
                blogId,
                commentId: comment._id,
            });

try {
    const { Author, Notification } = models;
    const author = await Author.findOne({ isActive: true })
        .select('clerkUserId')
        .lean();
    
    if (author?.clerkUserId && author.clerkUserId !== userId) {
        const authorUser = await User.findOne({ 
            clerkUserId: author.clerkUserId 
        }).select('_id').lean();

        if (authorUser) {
            await Notification.create({
                recipientId: authorUser._id,
                actorId: user._id,
                blogId: new mongoose.Types.ObjectId(blogId),
                type: 'comment',
                commentId: comment._id,
                commentPreview: content.slice(0, 200),
            });
        }
    }
} catch (notifError) {
    // Never block comment creation if notification fails
    logger.warn('Failed to create comment notification', {
        error: notifError.message,
    });
}

            return {
                success: true,
                message: 'Comment added',
                data: comment,
            };
        } catch (error) {
            logger.error('Add comment failed', {
                error: error.message,
                userId,
                blogId,
            });
            return {
                success: false,
                message: 'Failed to add comment',
                data: null,
                error: error.message,
            };
        }
    },

    /**
     * Update my comment
     */
    updateComment: async ({ userId, commentId, content }) => {
        try {
            const user = await User.findOne({ clerkUserId: userId });

            if (!user) {
                return {
                    success: false,
                    message: 'User not found',
                    data: null,
                };
            }

            const comment = await Comment.findById(commentId);

            if (!comment) {
                return {
                    success: false,
                    message: 'Comment not found',
                    data: null,
                };
            }

            // Verify ownership
            if (comment.userId.toString() !== user._id.toString()) {
                return {
                    success: false,
                    message: 'Not authorized to edit this comment',
                    data: null,
                };
            }

            comment.content = content;
            comment.updatedAt = new Date();
            await comment.save();

            logger.info('Comment updated', { userId, commentId });

            return {
                success: true,
                message: 'Comment updated',
                data: comment,
            };
        } catch (error) {
            logger.error('Update comment failed', {
                error: error.message,
                userId,
                commentId,
            });
            return {
                success: false,
                message: 'Failed to update comment',
                data: null,
                error: error.message,
            };
        }
    },

    /**
     * Delete my comment
     */
    deleteComment: async ({ userId, commentId }) => {
        try {
            const user = await User.findOne({ clerkUserId: userId });

            if (!user) {
                return {
                    success: false,
                    message: 'User not found',
                    data: null,
                };
            }

            const comment = await Comment.findById(commentId);

            if (!comment) {
                return {
                    success: false,
                    message: 'Comment not found',
                    data: null,
                };
            }

            // Verify ownership
            if (comment.userId.toString() !== user._id.toString()) {
                return {
                    success: false,
                    message: 'Not authorized to delete this comment',
                    data: null,
                };
            }

            const blogId = comment.blogId;
            await Comment.deleteOne({ _id: commentId });
            await Comment.deleteMany({ parentId: commentId });

            // Update analytics
            await BlogAnalytics.findOneAndUpdate(
                { blogId },
                { $inc: { totalComments: -1 } },
                { upsert: true },
            );

            logger.info('Comment deleted', { userId, commentId });

            return {
                success: true,
                message: 'Comment deleted',
                data: { commentId },
            };
        } catch (error) {
            logger.error('Delete comment failed', {
                error: error.message,
                userId,
                commentId,
            });
            return {
                success: false,
                message: 'Failed to delete comment',
                data: null,
                error: error.message,
            };
        }
    },
};
