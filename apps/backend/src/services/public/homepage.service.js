import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';

const { Blog, BlogAnalytics } = models;

export default {
  /**
   * Get all homepage data in single call
   */
  getHomepageData: async () => {
    try {
      const [
        hero,
        recentHighlights,
        trending,
        mostRead,
        editorsChoice,
      ] = await Promise.all([
        getHeroBlog(),
        getRecentHighlights(),
        getTrending(),
        getMostRead(),
        getEditorsChoice(),
      ]);

      logger.info('Homepage data fetched');

      return {
        success: true,
        message: 'Homepage data fetched',
        data: {
          hero,
          recentHighlights,
          trending,
          mostRead,
          editorsChoice,
        },
      };
    } catch (error) {
      logger.error('Homepage data fetch failed', { error: error.message });
      return {
        success: false,
        message: 'Failed to fetch homepage data',
        data: null,
        error: error.message,
      };
    }
  },
};

// ========== HELPER FUNCTIONS ==========

/**
 * Get hero blog (most recent published)
 */
async function getHeroBlog() {
  const blog = await Blog.findOne({ status: 'published' })
    .sort({ publishedAt: -1 })
    .select('title slug excerpt coverImage tags category readingTime publishedAt')
    .lean();

  return blog;
}

/**
 * Get recent highlights (5 most recent)
 */
async function getRecentHighlights() {
  const blogs = await Blog.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(5)
    .select('title slug excerpt coverImage tags category readingTime publishedAt')
    .lean();

  return blogs;
}

/**
 * Get trending blogs (most views in last 30 days)
 * NOTE: Change to views7d for weekly trending
 */
async function getTrending() {
  // CURRENT: Monthly trending (views30d)
  const analytics = await BlogAnalytics.find({ views30d: { $gt: 0 } })
    .sort({ views30d: -1 })
    .limit(5)
    .select('blogId views30d');

  // FUTURE: Uncomment for weekly trending
  // const analytics = await BlogAnalytics.find({ views7d: { $gt: 0 } })
  //   .sort({ views7d: -1 })
  //   .limit(5)
  //   .select('blogId views7d');

  if (analytics.length === 0) {
    // Fallback: return recent if no trending data
    return getRecentHighlights();
  }

  const blogIds = analytics.map(a => a.blogId);

  const blogs = await Blog.find({
    _id: { $in: blogIds },
    status: 'published',
  })
    .select('title slug tags category readingTime publishedAt')
    .lean();

  // Sort by analytics order
  const blogsMap = new Map(blogs.map(b => [b._id.toString(), b]));
  const sortedBlogs = analytics
    .map(a => blogsMap.get(a.blogId.toString()))
    .filter(Boolean);

  return sortedBlogs;
}

/**
 * Get most read (last 6 months)
 */
async function getMostRead() {
  const analytics = await BlogAnalytics.find({ views180d: { $gt: 0 } })
    .sort({ views180d: -1 })
    .limit(5)
    .select('blogId views180d');

  if (analytics.length === 0) {
    // Fallback: return recent if no analytics data
    return getRecentHighlights();
  }

  const blogIds = analytics.map(a => a.blogId);

  const blogs = await Blog.find({
    _id: { $in: blogIds },
    status: 'published',
  })
    .select('title slug coverImage tags category readingTime publishedAt')
    .lean();

  // Add view count and sort
  const blogsMap = new Map(blogs.map(b => [b._id.toString(), b]));
  const blogsWithViews = analytics
    .map(a => {
      const blog = blogsMap.get(a.blogId.toString());
      if (blog) {
        blog.views = a.views180d;
      }
      return blog;
    })
    .filter(Boolean);

  return blogsWithViews;
}

/**
 * Get editor's choice (4 curated blogs)
 */
async function getEditorsChoice() {
  const blogs = await Blog.find({
    status: 'published',
    'editorsPick.isEditorsPick': true,
  })
    .sort({ 'editorsPick.pickOrder': 1 })
    .limit(4)
    .select('title slug tags category readingTime publishedAt editorsPick')
    .lean();

  // Transform to include annotation at top level
  return blogs.map(blog => ({
    ...blog,
    annotation: blog.editorsPick?.annotation,
  }));
}
