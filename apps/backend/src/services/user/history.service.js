import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';

const { BlogView, User, Blog } = models;

export default {
  /**
   * Get user's reading history
   * Only includes completed reads (timeSpent >= 30s OR scrollDepth >= 50%)
   */
  getHistory: async ({ userId, page, limit }) => {
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

      // Find views that qualify as "reads"
      const readViews = await BlogView.find({
        userId: userId,
        $or: [
          { timeSpent: { $gte: 30 } },
          { scrollDepth: { $gte: 50 } },
          { completed: true },
        ],
      })
        .sort({ viewedAt: -1 })  // Most recent reads first
        .skip(skip)
        .limit(limit)
        .lean();

      const totalCount = await BlogView.countDocuments({
        userId: userId,
        $or: [
          { timeSpent: { $gte: 30 } },
          { scrollDepth: { $gte: 50 } },
          { completed: true },
        ],
      });

      // Get blog details
      const blogIds = readViews.map(v => v.blogId);
      const blogs = await Blog.find({ _id: { $in: blogIds } })
        .select('title slug coverImage tags readingTime publishedAt')
        .lean();

      // Merge blog details with view data
      const blogsMap = new Map(blogs.map(b => [b._id.toString(), b]));
      const history = readViews.map(view => {
        const blog = blogsMap.get(view.blogId.toString());
        return {
          blogId: view.blogId,
          title: blog?.title || 'Untitled',
          slug: blog?.slug || '',
          coverImage: blog?.coverImage || null,
          tags: blog?.tags || [],
          readingTime: blog?.readingTime || 5,
          publishedAt: blog?.publishedAt,
          viewedAt: view.viewedAt,
          exitedAt: view.exitedAt,
          timeSpent: view.timeSpent,
          completed: view.completed,
        };
      }).filter(h => h.slug);  // Remove any with missing blog data

      logger.info('Reading history fetched', { userId, count: history.length });

      return {
        success: true,
        message: 'History fetched',
        data: {
          history,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalReads: totalCount,
            hasMore: skip + history.length < totalCount,
          },
        },
      };
    } catch (error) {
      logger.error('Get history failed', { error: error.message, userId });
      return {
        success: false,
        message: 'Failed to fetch history',
        data: null,
        error: error.message,
      };
    }
  },
};
