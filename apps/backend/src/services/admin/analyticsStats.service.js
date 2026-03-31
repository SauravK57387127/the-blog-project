import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';

const { Blog, BlogAnalytics, BlogView, Subscriber } = models;

export default {
  /**
   * Get overview stats (4 cards)
   */
  getOverviewStats: async () => {
    try {
      // Total views (sum of all blog analytics)
      const analyticsData = await BlogAnalytics.aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$totalViews' },
            totalAvgReadTime: { $sum: '$avgReadTime' },
            count: { $sum: 1 },
          },
        },
      ]);

      const totalViews = analyticsData[0]?.totalViews || 0;
      const avgReadTimeSum = analyticsData[0]?.totalAvgReadTime || 0;
      const publishedPostsCount = analyticsData[0]?.count || 0;

      // Average read time across all posts
      const avgReadTime = publishedPostsCount > 0 
        ? Math.round(avgReadTimeSum / publishedPostsCount) 
        : 0;

      // Total subscribers
      const totalSubscribers = await Subscriber.countDocuments({ isActive: true });

      // New subscribers this month
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const newSubscribersThisMonth = await Subscriber.countDocuments({
        isActive: true,
        subscribedAt: { $gte: monthStart },
      });

      logger.info('Overview stats fetched', { totalViews, publishedPostsCount });

      return {
        success: true,
        message: 'Overview stats fetched',
        data: {
          totalViews,
          publishedPosts: publishedPostsCount,
          avgReadTime: `${avgReadTime}s`,
          subscribers: {
            total: totalSubscribers,
            newThisMonth: newSubscribersThisMonth,
          },
        },
      };
    } catch (error) {
      logger.error('Get overview stats failed', { error: error.message });
      return {
        success: false,
        message: 'Failed to fetch overview stats',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Get views for last 30 days (daily breakdown)
   */
  getViewsLast30Days: async () => {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);

      // Aggregate views by day
      const dailyViews = await BlogView.aggregate([
        {
          $match: {
            viewedAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$viewedAt',
              },
            },
            views: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      // Create map of existing data
      const viewsMap = new Map(dailyViews.map(d => [d._id, d.views]));

      // Fill in missing days with 0
      const result = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date(thirtyDaysAgo);
        date.setDate(thirtyDaysAgo.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        result.push({
          date: dateStr,
          views: viewsMap.get(dateStr) || 0,
        });
      }

      // Calculate stats
      const totalViews = result.reduce((sum, day) => sum + day.views, 0);
      const dailyAverage = Math.round(totalViews / 30);

      // Determine trend (compare last 15 days vs previous 15)
      const recentViews = result.slice(15).reduce((sum, day) => sum + day.views, 0);
      const previousViews = result.slice(0, 15).reduce((sum, day) => sum + day.views, 0);
      const trend = recentViews > previousViews ? 'growing' : 'decreasing';

      logger.info('Views last 30 days fetched', { totalViews, dailyAverage });

      return {
        success: true,
        message: 'Views last 30 days fetched',
        data: {
          dailyViews: result,
          totalViews,
          dailyAverage,
          trend,
        },
      };
    } catch (error) {
      logger.error('Get views last 30 days failed', { error: error.message });
      return {
        success: false,
        message: 'Failed to fetch views',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Get top 5 performing posts (last 6 months)
   */
  getTopPerformingPosts: async ({ limit = 5 }) => {
    try {
      const topAnalytics = await BlogAnalytics.find({ views180d: { $gt: 0 } })
        .sort({ views180d: -1 })
        .limit(limit)
        .select('blogId views180d')
        .lean();

      if (topAnalytics.length === 0) {
        return {
          success: true,
          message: 'No data available',
          data: [],
        };
      }

      const blogIds = topAnalytics.map(a => a.blogId);

      const blogs = await Blog.find({ _id: { $in: blogIds } })
        .select('title category publishedAt')
        .lean();

      const blogsMap = new Map(blogs.map(b => [b._id.toString(), b]));

      const topPosts = topAnalytics
        .map(analytics => {
          const blog = blogsMap.get(analytics.blogId.toString());
          if (!blog) return null;

          return {
            _id: blog._id,
            title: blog.title,
            category: blog.category,
            publishedAt: formatTimeAgo(blog.publishedAt),
            totalViews: formatNumber(analytics.views180d),
          };
        })
        .filter(Boolean);

      logger.info('Top performing posts fetched', { count: topPosts.length });

      return {
        success: true,
        message: 'Top posts fetched',
        data: topPosts,
      };
    } catch (error) {
      logger.error('Get top performing posts failed', { error: error.message });
      return {
        success: false,
        message: 'Failed to fetch top posts',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Get category breakdown
   */
  getCategoryBreakdown: async () => {
    try {
      const categories = ['tech-deep-dive', 'life-and-growth', 'career-and-learnings']; 

      // Get total views across all blogs
      const totalViewsData = await BlogAnalytics.aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$totalViews' },
          },
        },
      ]);

      const allTotalViews = totalViewsData[0]?.totalViews || 1; // Avoid division by zero

      const categoryStats = await Promise.all(
        categories.map(async (category) => {
          // Get all blogs in this category
          const blogs = await Blog.find({ 
            category, 
            status: 'published' 
          }).select('_id').lean();

          const blogIds = blogs.map(b => b._id);

          if (blogIds.length === 0) {
            return {
              category,
              totalViews: 0,
              totalPosts: 0,
              avgViewsPerPost: 0,
              percentage: 0,
            };
          }

          // Get analytics for these blogs
          const analytics = await BlogAnalytics.find({ 
            blogId: { $in: blogIds } 
          }).select('totalViews').lean();

          const totalViews = analytics.reduce((sum, a) => sum + a.totalViews, 0);
          const avgViews = Math.round(totalViews / blogIds.length);
          const percentage = ((totalViews / allTotalViews) * 100).toFixed(1);

          return {
            category,
            totalViews: formatNumber(totalViews),
            totalPosts: blogIds.length,
            avgViewsPerPost: formatNumber(avgViews),
            percentage: parseFloat(percentage),
          };
        })
      );

      logger.info('Category breakdown fetched');

      return {
        success: true,
        message: 'Category breakdown fetched',
        data: categoryStats,
      };
    } catch (error) {
      logger.error('Get category breakdown failed', { error: error.message });
      return {
        success: false,
        message: 'Failed to fetch category breakdown',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Get personal best (best day + best month)
   */
  getPersonalBest: async () => {
    try {
      // Best day ever (highest views on single day for any blog)
      const allViews = await BlogView.find().select('blogId viewedAt').lean();

      // Group by day
      const dayViewsMap = new Map();
      allViews.forEach(view => {
        const dateStr = new Date(view.viewedAt).toISOString().split('T')[0];
        const key = `${view.blogId}_${dateStr}`;
        
        if (!dayViewsMap.has(key)) {
          dayViewsMap.set(key, { blogId: view.blogId, date: dateStr, views: 0 });
        }
        dayViewsMap.get(key).views++;
      });

      // Find max
      let bestDay = { views: 0 };
      for (const entry of dayViewsMap.values()) {
        if (entry.views > bestDay.views) {
          bestDay = entry;
        }
      }

      let bestDayData = null;
      if (bestDay.views > 0) {
        const blog = await Blog.findById(bestDay.blogId).select('title').lean();
        bestDayData = {
          views: formatNumber(bestDay.views),
          date: new Date(bestDay.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          blogTitle: blog?.title || 'Unknown',
        };
      }

      // Best month (highest total views in any month)
      const monthViewsMap = new Map();
      const monthPostsMap = new Map();

      allViews.forEach(view => {
        const date = new Date(view.viewedAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        monthViewsMap.set(monthKey, (monthViewsMap.get(monthKey) || 0) + 1);
      });

      // Count posts published per month
      const allBlogs = await Blog.find({ status: 'published' })
        .select('publishedAt')
        .lean();

      allBlogs.forEach(blog => {
        if (!blog.publishedAt) return;
        const date = new Date(blog.publishedAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        monthPostsMap.set(monthKey, (monthPostsMap.get(monthKey) || 0) + 1);
      });

      // Find best month
      let bestMonth = { views: 0 };
      for (const [month, views] of monthViewsMap.entries()) {
        if (views > bestMonth.views) {
          bestMonth = { month, views, posts: monthPostsMap.get(month) || 0 };
        }
      }

      let bestMonthData = null;
      if (bestMonth.views > 0) {
        const [year, month] = bestMonth.month.split('-');
        const monthName = new Date(year, parseInt(month) - 1).toLocaleString('en-US', { month: 'long' });
        
        bestMonthData = {
          views: formatNumber(bestMonth.views),
          month: `${monthName} ${year}`,
          postsPublished: bestMonth.posts,
        };
      }

      logger.info('Personal best fetched');

      return {
        success: true,
        message: 'Personal best fetched',
        data: {
          bestDay: bestDayData,
          bestMonth: bestMonthData,
        },
      };
    } catch (error) {
      logger.error('Get personal best failed', { error: error.message });
      return {
        success: false,
        message: 'Failed to fetch personal best',
        data: null,
        error: error.message,
      };
    }
  },
};

// ===== HELPER FUNCTIONS =====

/**
 * Format number (1234 → 1.2k, 45678 → 45.7k)
 */
function formatNumber(num) {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

/**
 * Format time ago (5d ago, 2w ago, etc)
 */
function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  
  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  return 'today';
}
