import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';
import mongoose from 'mongoose';

const { Bookmark, Blog, User, BlogAnalytics } = models;

export default {
    /**
     * Toggle bookmark
     */
    toggleBookmark: async ({ userId, blogId }) => {
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
            if (!blog) {
                return {
                    success: false,
                    message: 'Blog not found',
                    data: null,
                };
            }

            const existingBookmark = await Bookmark.findOne({
                userId: user._id,
                blogId: new mongoose.Types.ObjectId(blogId),
            });

            if (existingBookmark) {
                // Remove bookmark
                await Bookmark.deleteOne({ _id: existingBookmark._id });

                // Update analytics
                await BlogAnalytics.findOneAndUpdate(
                    { blogId },
                    { $inc: { totalBookmarks: -1 } },
                    { upsert: true },
                );

                logger.info('Bookmark removed', { userId, blogId });

                return {
                    success: true,
                    message: 'Bookmark removed',
                    data: { isBookmarked: false },
                };
            } else {
                // Add bookmark
                const bookmark = await Bookmark.create({
                    userId: user._id,
                    blogId: new mongoose.Types.ObjectId(blogId),
                    savedAt: new Date(),
                });

                // Update analytics
                await BlogAnalytics.findOneAndUpdate(
                    { blogId },
                    { $inc: { totalBookmarks: 1 } },
                    { upsert: true },
                );

                logger.info('Blog bookmarked', { userId, blogId });

                return {
                    success: true,
                    message: 'Blog bookmarked',
                    data: { isBookmarked: true, bookmark },
                };
            }
        } catch (error) {
            logger.error('Toggle bookmark failed', {
                error: error.message,
                userId,
                blogId,
            });
            return {
                success: false,
                message: 'Failed to toggle bookmark',
                data: null,
                error: error.message,
            };
        }
    },

    /**
     * Remove bookmark
     */
    removeBookmark: async ({ userId, blogId }) => {
        try {
            const user = await User.findOne({ clerkUserId: userId });

            if (!user) {
                return {
                    success: false,
                    message: 'User not found',
                    data: null,
                };
            }

            const deleted = await Bookmark.findOneAndDelete({
                userId: user._id,
                blogId: new mongoose.Types.ObjectId(blogId),
            });

            if (!deleted) {
                return {
                    success: false,
                    message: 'Bookmark not found',
                    data: null,
                };
            }

            // Update analytics
            await BlogAnalytics.findOneAndUpdate(
                { blogId },
                { $inc: { totalBookmarks: -1 } },
                { upsert: true },
            );

            logger.info('Bookmark removed', { userId, blogId });

            return {
                success: true,
                message: 'Bookmark removed',
                data: { blogId },
            };
        } catch (error) {
            logger.error('Remove bookmark failed', {
                error: error.message,
                userId,
                blogId,
            });
            return {
                success: false,
                message: 'Failed to remove bookmark',
                data: null,
                error: error.message,
            };
        }
    },

    /**
     * Get all my bookmarks
     */
    getMyBookmarks: async ({ userId, page, limit }) => {
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

            const [bookmarks, totalCount] = await Promise.all([
                Bookmark.find({ userId: user._id })
                    .sort({ savedAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate({
                        path: 'blogId',
                        select: 'title slug excerpt coverImage tags readingTime publishedAt',
                    })
                    .lean(),
                Bookmark.countDocuments({ userId: user._id }),
            ]);

            // Format response
            const formattedBookmarks = bookmarks.map((bookmark) => ({
                blogId: bookmark.blogId._id,
                title: bookmark.blogId.title,
                slug: bookmark.blogId.slug,
                coverImage: bookmark.blogId.coverImage,
                tags: bookmark.blogId.tags,
                readingTime: bookmark.blogId.readingTime,
                publishedAt: bookmark.blogId.publishedAt,
                savedAt: bookmark.savedAt,
            }));

            logger.info('User bookmarks fetched', {
                userId,
                count: bookmarks.length,
            });

            return {
                success: true,
                message: 'Bookmarks fetched',
                data: {
                    bookmarks: formattedBookmarks,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(totalCount / limit),
                        totalBookmarks: totalCount,
                        hasMore: skip + bookmarks.length < totalCount,
                    },
                },
            };
        } catch (error) {
            logger.error('Get my bookmarks failed', {
                error: error.message,
                userId,
            });
            return {
                success: false,
                message: 'Failed to fetch bookmarks',
                data: null,
                error: error.message,
            };
        }
    },
};
