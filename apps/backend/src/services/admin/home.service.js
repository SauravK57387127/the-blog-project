import Blog from '../../../../../database/models/blog.model.js';
import Draft from '../../../../../database/models/draft.model.js';



export default {
  /**
   * Get dashboard overview stats
   * 
   * Returns:
   * - Total blogs (published + scheduled)
   * - Total drafts
   * - Published blogs count
   * - Scheduled blogs count
   * - Recent activity (last 10 blogs/drafts)
   */
  getDashboard: async () => {
    console.log('📊 Dashboard service reached!');

    try {
      // Count stats
      const [
        totalBlogs,
        publishedBlogs,
        scheduledBlogs,
        totalDrafts,
        recentBlogs,
        recentDrafts
      ] = await Promise.all([
        // Total blogs (all statuses)
        Blog.countDocuments(),
        
        // Published blogs
        Blog.countDocuments({ status: 'published' }),
        
        // Scheduled blogs
        Blog.countDocuments({ status: 'scheduled' }),
        
        // Total drafts
        Draft.countDocuments(),
        
        // Recent blogs (last 5)
        Blog.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('title status publishedAt scheduledAt createdAt')
          .lean(),
        
        // Recent drafts (last 5)
        Draft.find()
          .sort({ updatedAt: -1 })
          .limit(5)
          .select('title updatedAt')
          .lean()
      ]);

      // Combine recent activity
      const recentActivity = [
        ...recentBlogs.map(blog => ({
          id: blog._id,
          title: blog.title,
          type: 'blog',
          status: blog.status,
          date: blog.publishedAt || blog.scheduledAt || blog.createdAt
        })),
        ...recentDrafts.map(draft => ({
          id: draft._id,
          title: draft.title,
          type: 'draft',
          status: 'draft',
          date: draft.updatedAt
        }))
      ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))  // Sort by date desc
        .slice(0, 10);  // Take top 10

      console.log('✅ Dashboard stats gathered');

      return {
        success: true,
        message: 'Dashboard data fetched',
        data: {
          stats: {
            totalBlogs,
            publishedBlogs,
            scheduledBlogs,
            totalDrafts
          },
          recentActivity
        }
      };
    } catch (error) {
      console.error('❌ Dashboard service error:', error);
      return {
        success: false,
        message: 'Failed to fetch dashboard data',
        data: null
      };
    }
  }
};