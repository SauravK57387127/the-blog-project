import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';
import mongoose from 'mongoose';

const { Like, Blog, User, BlogAnalytics } = models;

export default {
  /**
   * Toggle like (if exists, remove; if not, add)
   */
  toggleLike: async ({ userId, blogId }) => {
    try {
      // Find user by Clerk ID
      const user = await User.findOne({ clerkUserId: userId });
      
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          data: null,
        };
      }

      // Verify blog exists
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return {
          success: false,
          message: 'Blog not found',
          data: null,
        };
      }

      // Check if already liked
      const existingLike = await Like.findOne({
        userId: user._id,
        blogId: new mongoose.Types.ObjectId(blogId),
      });

      if (existingLike) {
        // Unlike
        await Like.deleteOne({ _id: existingLike._id });
        
        // Update analytics (decrement like count)
        await BlogAnalytics.findOneAndUpdate(
          { blogId },
          { $inc: { totalLikes: -1 } },
          { upsert: true }
        );

        logger.info('Blog unliked', { userId, blogId });

        return {
          success: true,
          message: 'Blog unliked',
          data: { isLiked: false },
        };
      } else {
        // Like
        const like = await Like.create({
          userId: user._id,
          blogId: new mongoose.Types.ObjectId(blogId),
          likedAt: new Date(),
        });

        // Update analytics (increment like count)
        await BlogAnalytics.findOneAndUpdate(
          { blogId },
          { $inc: { totalLikes: 1 } },
          { upsert: true }
        );

        logger.info('Blog liked', { userId, blogId });

        return {
          success: true,
          message: 'Blog liked',
          data: { isLiked: true, like },
        };
      }
    } catch (error) {
      logger.error('Toggle like failed', { error: error.message, userId, blogId });
      return {
        success: false,
        message: 'Failed to toggle like',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Unlike a blog
   */
  unlikeBlog: async ({ userId, blogId }) => {
    try {
      const user = await User.findOne({ clerkUserId: userId });
      
      if (!user) {
        return {
          success: false,
          message: 'User not found',
          data: null,
        };
      }

      const deleted = await Like.findOneAndDelete({
        userId: user._id,
        blogId: new mongoose.Types.ObjectId(blogId),
      });

      if (!deleted) {
        return {
          success: false,
          message: 'Like not found',
          data: null,
        };
      }

      // Update analytics
      await BlogAnalytics.findOneAndUpdate(
        { blogId },
        { $inc: { totalLikes: -1 } },
        { upsert: true }
      );

      logger.info('Blog unliked', { userId, blogId });

      return {
        success: true,
        message: 'Blog unliked',
        data: { blogId },
      };
    } catch (error) {
      logger.error('Unlike failed', { error: error.message, userId, blogId });
      return {
        success: false,
        message: 'Failed to unlike blog',
        data: null,
        error: error.message,
      };
    }
  },

  /**
 * Get all my liked blogs with pagination
 */
getMyLikes: async ({ userId, page, limit }) => {
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

    const [likes, totalCount] = await Promise.all([
      Like.find({ userId: user._id })
        .sort({ likedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'blogId',
          select: 'title slug excerpt coverImage tags readingTime publishedAt',
        })
        .lean(),
      Like.countDocuments({ userId: user._id }),
    ]);

    // Format response
    const formattedLikes = likes.map(like => ({
      blogId: like.blogId._id,
      title: like.blogId.title,
      slug: like.blogId.slug,
      coverImage: like.blogId.coverImage,
      tags: like.blogId.tags,
      readingTime: like.blogId.readingTime,
      publishedAt: like.blogId.publishedAt,
      likedAt: like.likedAt,
    }));

    logger.info('User likes fetched', { userId, count: likes.length });

    return {
      success: true,
      message: 'Likes fetched',
      data: {
        likes: formattedLikes,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalLikes: totalCount,
          hasMore: skip + likes.length < totalCount,
        },
      },
    };
  } catch (error) {
    logger.error('Get my likes failed', { error: error.message, userId });
    return {
      success: false,
      message: 'Failed to fetch likes',
      data: null,
      error: error.message,
    };
  }
},
};
