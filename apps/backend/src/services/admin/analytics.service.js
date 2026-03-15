import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';

const { Blog, BlogAnalytics, BlogView, Like, Bookmark, Comment } = models;

/**
 * Get activity for a specific day
 * Activity = any blog created, published, or scheduled that day
 */
async function getActivityForDay(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Count activities: created, published, or scheduled on this day
  const [drafted, published, scheduled] = await Promise.all([
    Blog.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }),
    Blog.countDocuments({
      publishedAt: { $gte: startOfDay, $lte: endOfDay },
      status: 'published',
    }),
    Blog.countDocuments({
      scheduledAt: { $gte: startOfDay, $lte: endOfDay },
      status: 'scheduled',
    }),
  ]);

  const totalActivity = drafted + published + scheduled;

  return {
    date: startOfDay,
    drafted,
    published,
    scheduled,
    totalActivity,
    hasActivity: totalActivity > 0,
  };
}

/**
 * Calculate current streak (consecutive days with activity)
 */
async function calculateCurrentStreak() {
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  while (true) {
    const activity = await getActivityForDay(currentDate);
    
    if (!activity.hasActivity) {
      break;
    }
    
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
    
    // Safety: max 365 days
    if (streak > 365) break;
  }

  return streak;
}

/**
 * Calculate longest streak in period
 */
async function calculateLongestStreak(startDate, endDate) {
  let longestStreak = 0;
  let currentStreak = 0;
  
  let currentDate = new Date(endDate);
  
  while (currentDate >= startDate) {
    const activity = await getActivityForDay(currentDate);
    
    if (activity.hasActivity) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
    
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return longestStreak;
}

export default {
  /**
   * Get writing streak data for graphs
   */
  getWritingStreak: async ({ period = 'month' }) => {
    try {
      const now = new Date();
      let data = [];

      if (period === 'month') {
        // Last 31 days (tiled calendar)
        const startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        
        for (let i = 0; i <= 30; i++) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          
          const activity = await getActivityForDay(date);
          data.push(activity);
        }
      } else if (period === 'week') {
        // Last 12 weeks (bar graph)
        for (let i = 11; i >= 0; i--) {
          const weekEnd = new Date(now);
          weekEnd.setDate(now.getDate() - (i * 7));
          
          const weekStart = new Date(weekEnd);
          weekStart.setDate(weekEnd.getDate() - 6);
          
          // Aggregate week activity
          let weekActivity = 0;
          for (let day = 0; day < 7; day++) {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + day);
            const activity = await getActivityForDay(date);
            weekActivity += activity.totalActivity;
          }
          
          data.push({
            weekStart: weekStart,
            weekEnd: weekEnd,
            totalActivity: weekActivity,
          });
        }
      } else if (period === 'year') {
        // Last 12 months (bar graph)
        for (let i = 11; i >= 0; i--) {
          const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
          const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
          
          // Aggregate month activity
          let monthActivity = 0;
          let currentDate = new Date(monthStart);
          
          while (currentDate <= monthEnd) {
            const activity = await getActivityForDay(currentDate);
            monthActivity += activity.totalActivity;
            currentDate.setDate(currentDate.getDate() + 1);
          }
          
          data.push({
            month: monthStart.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
            totalActivity: monthActivity,
          });
        }
      }

      logger.info('Writing streak data fetched', { period, dataPoints: data.length });

      return {
        success: true,
        message: 'Writing streak data fetched',
        data: { period, data },
      };
    } catch (error) {
      logger.error('Get writing streak failed', { error: error.message, period });
      return {
        success: false,
        message: 'Failed to fetch writing streak',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Get sidebar stats based on period
   */
  // TODO: Performance — getSidebarStats with period=year makes ~365 sequential DB queries
// (one per day via getActivityForDay). Refactor to use MongoDB aggregation pipeline
// to batch all date queries in a single operation before production launch.
  getSidebarStats: async ({ period = 'year' }) => {
    try {
      const now = new Date();
      let stats = {};

      // Always include last 28 days
      const last28Start = new Date(now);
      last28Start.setDate(now.getDate() - 27);
      
      let activeDaysCount = 0;
      for (let i = 0; i < 28; i++) {
        const date = new Date(last28Start);
        date.setDate(last28Start.getDate() + i);
        const activity = await getActivityForDay(date);
        if (activity.hasActivity) activeDaysCount++;
      }
      
      const currentStreak = await calculateCurrentStreak();
      const longestStreak28 = await calculateLongestStreak(last28Start, now);

      stats.last28d = {
        activeDays: activeDaysCount,
        currentStreak,
        longestStreak: longestStreak28,
      };

      // Period-specific stats
      if (period === 'year') {
        const yearStart = new Date(now.getFullYear(), 0, 1);
        
        const [totalPublished, totalScheduled, totalDrafts] = await Promise.all([
          Blog.countDocuments({
            status: 'published',
            publishedAt: { $gte: yearStart },
          }),
          Blog.countDocuments({
            status: 'scheduled',
            scheduledAt: { $gte: yearStart },
          }),
          Blog.countDocuments({
            status: 'draft',
            createdAt: { $gte: yearStart },
          }),
        ]);

        // Find best month
        let bestMonth = { month: 'Jan', activity: 0 };
        for (let month = 0; month < 12; month++) {
          const monthStart = new Date(now.getFullYear(), month, 1);
          const monthEnd = new Date(now.getFullYear(), month + 1, 0);
          
          let monthActivity = 0;
          let currentDate = new Date(monthStart);
          
          while (currentDate <= monthEnd) {
            const activity = await getActivityForDay(currentDate);
            monthActivity += activity.totalActivity;
            currentDate.setDate(currentDate.getDate() + 1);
          }
          
          if (monthActivity > bestMonth.activity) {
            bestMonth = {
              month: monthStart.toLocaleString('en-US', { month: 'short' }),
              activity: monthActivity,
            };
          }
        }

        stats.thisYear = {
          totalPublished,
          totalScheduled,
          totalDrafts,
          bestMonth: bestMonth.month,
        };
      } else if (period === 'week') {
        // Last 12 weeks stats
        let mostActiveWeek = { week: 0, activity: 0 };
        let totalWeekActivity = 0;
        let activeWeeksCount = 0;
        
        for (let i = 11; i >= 0; i--) {
          const weekEnd = new Date(now);
          weekEnd.setDate(now.getDate() - (i * 7));
          
          const weekStart = new Date(weekEnd);
          weekStart.setDate(weekEnd.getDate() - 6);
          
          let weekActivity = 0;
          for (let day = 0; day < 7; day++) {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + day);
            const activity = await getActivityForDay(date);
            weekActivity += activity.totalActivity;
          }
          
          totalWeekActivity += weekActivity;
          if (weekActivity > 0) activeWeeksCount++;
          
          if (weekActivity > mostActiveWeek.activity) {
            mostActiveWeek = {
              week: `Week ${12 - i}`,
              activity: weekActivity,
            };
          }
        }

        stats.last12Weeks = {
          mostActiveWeek: mostActiveWeek.week,
          averagePostsPerWeek: (totalWeekActivity / 12).toFixed(1),
          activeWeeks: `${activeWeeksCount}/12`,
        };
      } else if (period === 'month') {
        // Top 5 days this month
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        
        const dayActivities = [];
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(now.getFullYear(), now.getMonth(), day);
          const activity = await getActivityForDay(date);
          
          if (activity.hasActivity) {
            dayActivities.push({
              day: day,
              ...activity,
            });
          }
        }
        
        // Sort by total activity, take top 5
        const topDays = dayActivities
          .sort((a, b) => b.totalActivity - a.totalActivity)
          .slice(0, 5)
          .map(day => ({
            day: day.day,
            label: `${day.published} published, ${day.drafted} drafted`,
          }));

        stats.topDaysThisMonth = topDays;
      }

      logger.info('Sidebar stats fetched', { period });

      return {
        success: true,
        message: 'Sidebar stats fetched',
        data: stats,
      };
    } catch (error) {
      logger.error('Get sidebar stats failed', { error: error.message, period });
      return {
        success: false,
        message: 'Failed to fetch sidebar stats',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Get most recent draft (for "Pickup where you left off")
   */
  getRecentDraft: async () => {
    try {
      const draft = await Blog.findOne({ status: 'draft' })
        .sort({ updatedAt: -1 })
        .select('title content updatedAt')
        .lean();

      if (!draft) {
        return {
          success: true,
          message: 'No drafts found',
          data: null,
        };
      }

      // Extract first line as excerpt
      const excerpt = draft.content
        .replace(/<[^>]*>/g, '')  // Remove HTML tags
        .split('\n')[0]
        .substring(0, 100);

      const timeSinceUpdate = getTimeAgo(draft.updatedAt);

      logger.info('Recent draft fetched', { draftId: draft._id });

      return {
        success: true,
        message: 'Recent draft fetched',
        data: {
          _id: draft._id,
          title: draft.title,
          excerpt,
          lastOpened: timeSinceUpdate,
        },
      };
    } catch (error) {
      logger.error('Get recent draft failed', { error: error.message });
      return {
        success: false,
        message: 'Failed to fetch recent draft',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Get upcoming scheduled blogs
   */
  getScheduledUpcoming: async ({ limit = 5 }) => {
    try {
      const scheduled = await Blog.find({ status: 'scheduled' })
        .sort({ scheduledAt: 1 })  // Earliest first
        .limit(limit)
        .select('title scheduledAt')
        .lean();

      const formatted = scheduled.map(blog => ({
        _id: blog._id,
        title: blog.title,
        scheduledFor: blog.scheduledAt,
        scheduledLabel: formatFutureDate(blog.scheduledAt),
      }));

      logger.info('Scheduled upcoming fetched', { count: scheduled.length });

      return {
        success: true,
        message: 'Scheduled blogs fetched',
        data: formatted,
      };
    } catch (error) {
      logger.error('Get scheduled upcoming failed', { error: error.message });
      return {
        success: false,
        message: 'Failed to fetch scheduled blogs',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Get stale drafts (needs attention)
   */
  getStaleDrafts: async ({ limit = 5 }) => {
    try {
      const drafts = await Blog.find({ status: 'draft' })
        .sort({ updatedAt: 1 })  // Oldest first
        .limit(limit)
        .select('title content updatedAt')
        .lean();

      const formatted = drafts.map(draft => ({
        _id: draft._id,
        title: draft.title,
        excerpt: draft.content
          .replace(/<[^>]*>/g, '')
          .split('\n')[0]
          .substring(0, 100),
        lastUpdated: getTimeAgo(draft.updatedAt),
      }));

      logger.info('Stale drafts fetched', { count: drafts.length });

      return {
        success: true,
        message: 'Stale drafts fetched',
        data: formatted,
      };
    } catch (error) {
      logger.error('Get stale drafts failed', { error: error.message });
      return {
        success: false,
        message: 'Failed to fetch stale drafts',
        data: null,
        error: error.message,
      };
    }
  },
};

// ===== HELPER FUNCTIONS =====

/**
 * Format date as "2h ago" or "3d 2h ago"
 */
function getTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const months = Math.floor(diff / 2592000000);
  
  if (months > 0) return `${months}m ago`;
  if (days > 0) {
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h ago` : `${days}d ago`;
  }
  if (hours > 0) return `${hours}h ago`;
  return `${minutes}m ago`;
}

/**
 * Format future date as "in 5 days" or "scheduled for Mar 10"
 */
function formatFutureDate(date) {
  const now = new Date();
  const target = new Date(date);
  const diff = target - now;
  
  const days = Math.floor(diff / 86400000);
  
  if (days < 0) return 'overdue';
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days < 7) return `in ${days} days`;
  
  // Format as "Mar 10"
  return target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
