import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';

const { Blog, BlogAnalytics } = models;

export default {
    /**
     * Get initial search page data
     */
    getInitialData: async () => {
        try {
            const [categories, topTags, popularReads] = await Promise.all([
                getCategories(),
                getTopTags(),
                getPopularReads(),
            ]);

            logger.info('Search initial data fetched');

            return {
                success: true,
                message: 'Search data fetched',
                data: {
                    categories,
                    topTags,
                    popularReads,
                },
            };
        } catch (error) {
            logger.error('Search initial data failed', {
                error: error.message,
            });
            return {
                success: false,
                message: 'Failed to fetch search data',
                data: null,
                error: error.message,
            };
        }
    },
};

// ========== HELPER FUNCTIONS ==========

/**
 * Get categories with counts
 */
async function getCategories() {
    const categoryCounts = await Blog.aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]);

    // Map to structured format
    const categoryMap = {
        tech: { slug: 'tech', label: 'Tech', count: 0 },
        life: { slug: 'life', label: 'Life', count: 0 },
        experiments: { slug: 'experiments', label: 'Experiments', count: 0 },
    };

    categoryCounts.forEach((cat) => {
        if (categoryMap[cat._id]) {
            categoryMap[cat._id].count = cat.count;
        }
    });

    return Object.values(categoryMap);
}

/**
 * Get top 12 most-used tags
 */
async function getTopTags() {
    const topTags = await Blog.aggregate([
        { $match: { status: 'published' } },
        { $unwind: '$tags' },
        {
            $group: {
                _id: '$tags',
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
        { $limit: 12 },
        {
            $project: {
                tag: '$_id',
                count: 1,
                _id: 0,
            },
        },
    ]);

    return topTags;
}

/**
 * Get 6 popular reads (consistent performers - last 6 months)
 */
async function getPopularReads() {
    const analytics = await BlogAnalytics.find({
        views180d: { $gte: 10 }, // At least 10 views (low threshold for start)
        completionRate: { $gte: 30 }, // At least 30% completion
    })
        .sort({ views180d: -1 })
        .limit(6)
        .select('blogId views180d completionRate');

    if (analytics.length === 0) {
        // Fallback: return recent if no analytics
        return Blog.find({ status: 'published' })
            .sort({ publishedAt: -1 })
            .limit(6)
            .select(
                'title slug excerpt coverImage tags category readingTime publishedAt',
            )
            .lean();
    }

    const blogIds = analytics.map((a) => a.blogId);

    const blogs = await Blog.find({
        _id: { $in: blogIds },
        status: 'published',
    })
        .select(
            'title slug excerpt coverImage tags category readingTime publishedAt',
        )
        .lean();

    // Sort by analytics order and add view count
    const blogsMap = new Map(blogs.map((b) => [b._id.toString(), b]));
    const sortedBlogs = analytics
        .map((a) => {
            const blog = blogsMap.get(a.blogId.toString());
            if (blog) {
                blog.views = a.views180d;
            }
            return blog;
        })
        .filter(Boolean);

    return sortedBlogs;
}
