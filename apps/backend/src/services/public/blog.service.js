import mongoose from 'mongoose';
import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';

const { Blog, BlogAnalytics } = models;

export default {
    /**
     * List all published blogs
     */
    listBlogs: async ({ page, limit, tags, category, sort }) => {
        const query = { status: 'published' };

        // Filter by tags
        if (tags && tags.length > 0) {
            query.tags = { $in: tags };
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Sorting
        let sortQuery = {};
        switch (sort) {
            case 'latest':
                sortQuery = { publishedAt: -1 };
                break;
            case 'popular':
                // Join with analytics for sorting
                // We'll handle this separately
                sortQuery = { publishedAt: -1 }; // Fallback
                break;
            case 'trending':
                sortQuery = { publishedAt: -1 }; // Fallback
                break;
            default:
                sortQuery = { publishedAt: -1 };
        }

        const skip = (page - 1) * limit;

        const [blogs, totalCount] = await Promise.all([
            Blog.find(query)
                .select(
                    'title slug excerpt coverImage tags category readingTime publishedAt',
                )
                .sort(sortQuery)
                .skip(skip)
                .limit(limit)
                .lean(),
            Blog.countDocuments(query),
        ]);

        logger.info('Blogs listed', { count: blogs.length, page, totalCount });

        return {
            success: true,
            message: 'Blogs fetched',
            data: {
                blogs,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalBlogs: totalCount,
                    hasMore: skip + blogs.length < totalCount,
                },
            },
        };
    },

   searchBlogs: async ({ query, tags, category, page, limit }) => {
    try {
        const searchQuery = { status: 'published' };

        if (category) {
            searchQuery.category = category;
        }

        if (tags && tags.length > 0) {
            searchQuery.tags = { $in: tags };
        }

        if (query && query.trim().length >= 3) {
            const escapedQuery = query
                .trim()
                .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const wordBoundaryRegex = new RegExp(`\\b${escapedQuery}`, 'i');
            const anywhereRegex = new RegExp(escapedQuery, 'i');

            searchQuery.$or = [
                { title: wordBoundaryRegex },
                { tags: { $in: [anywhereRegex] } },
            ];
        }

        const skip = (page - 1) * limit;

        const [blogs, totalCount] = await Promise.all([
            Blog.find(searchQuery)
                .select(
                    'title slug excerpt coverImage tags category readingTime publishedAt',
                )
                .sort({ publishedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Blog.countDocuments(searchQuery),
        ]);

        // Client-side relevance sort
        if (query && query.trim().length >= 3) {
            const q = query.trim().toLowerCase();
            blogs.sort((a, b) => {
                const aTitle = a.title.toLowerCase().includes(q) ? 0 : 1;
                const bTitle = b.title.toLowerCase().includes(q) ? 0 : 1;
                if (aTitle !== bTitle) return aTitle - bTitle;
                const aTag = a.tags?.some((t) => t.toLowerCase().includes(q)) ? 0 : 1;
                const bTag = b.tags?.some((t) => t.toLowerCase().includes(q)) ? 0 : 1;
                return aTag - bTag;
            });
        }

        // Join analytics for view counts
        const blogIds = blogs.map(b => b._id);
        const analytics = await BlogAnalytics.find({ blogId: { $in: blogIds } })
            .select('blogId totalViews')
            .lean();
        const analyticsMap = new Map(
            analytics.map(a => [a.blogId.toString(), a.totalViews])
        );
        const blogsWithViews = blogs.map(blog => ({
            ...blog,
            views: analyticsMap.get(blog._id.toString()) ?? 0,
        }));

        logger.info('Blogs searched', {
            query,
            tagsCount: tags?.length,
            category,
            resultsCount: blogs.length,
        });

        return {
            success: true,
            message: 'Search results',
            data: {
                blogs: blogsWithViews,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalBlogs: totalCount,
                    hasMore: skip + blogs.length < totalCount,
                },
                filters: {
                    appliedQuery: query || null,
                    appliedCategory: category || null,
                    appliedTags: tags || [],
                    resultCount: totalCount,
                },
            },
        };
    } catch (error) {
        logger.error('Search failed', { error: error.message, query });
        return {
            success: false,
            message: 'Search failed',
            data: null,
            error: error.message,
        };
    }
},

    /**
     * Get popular blogs (by views)
     */
    getPopularBlogs: async ({ limit, period }) => {
        // Get blog IDs sorted by views from analytics
        const analytics = await BlogAnalytics.find({})
            .sort({ totalViews: -1 })
            .limit(limit)
            .select('blogId totalViews')
            .lean();

        const blogIds = analytics.map((a) => a.blogId);

        // Get blog details
        const blogs = await Blog.find({
            _id: { $in: blogIds },
            status: 'published',
        })
            .select('title slug excerpt coverImage tags publishedAt')
            .lean();

        // Merge with analytics data
        const blogsWithStats = blogs.map((blog) => {
            const stats = analytics.find(
                (a) => a.blogId.toString() === blog._id.toString(),
            );
            return {
                ...blog,
                views: stats?.totalViews || 0,
            };
        });

        // Sort by views
        blogsWithStats.sort((a, b) => b.views - a.views);

        logger.info('Popular blogs fetched', { count: blogsWithStats.length });

        return {
            success: true,
            message: 'Popular blogs fetched',
            data: blogsWithStats,
        };
    },

    /**
     * Get blog by slug with author and analytics
     */
    getBlogBySlug: async (slug) => {
        try {
            const blog = await Blog.findOne({
                slug,
                status: 'published',
            }).lean();

            if (!blog) {
                return {
                    success: false,
                    message: 'Blog not found',
                    data: null,
                };
            }

            // Get analytics (likes/comments counts)
            const analytics = await BlogAnalytics.findOne({ blogId: blog._id })
                .select('totalLikes totalComments totalViews')
                .lean();

            // Get author
            const Author = mongoose.model('Author');
            const author = await Author.findOne({ isActive: true })
                .select('name bio profileImage socialLinks')
                .lean();

            // Combine data
            const blogWithExtras = {
                ...blog,
                totalLikes: analytics?.totalLikes || 0,
                totalComments: analytics?.totalComments || 0,
                totalViews: analytics?.totalViews || 0,
                author: author || {
                    name: 'Saurav Kumar',
                    bio: 'Full-stack developer',
                    profileImage: null,
                    socialLinks: {},
                },
            };

            logger.info('Blog fetched by slug', { slug });

            return {
                success: true,
                message: 'Blog fetched',
                data: blogWithExtras,
            };
        } catch (error) {
            logger.error('Get blog by slug failed', {
                error: error.message,
                slug,
            });
            return {
                success: false,
                message: 'Failed to fetch blog',
                data: null,
                error: error.message,
            };
        }
    },

    /**
     * Get related blogs (same tags)
     */
    getRelatedBlogs: async ({ slug, limit }) => {
        // Get current blog
        const currentBlog = await Blog.findOne({
            slug,
            status: 'published',
        }).lean();

        if (!currentBlog) {
            return { success: true, message: 'No blogs found', data: [] };
        }

        // Find blogs with overlapping tags
        const relatedBlogs = await Blog.find({
            _id: { $ne: currentBlog._id },
            status: 'published',
            tags: { $in: currentBlog.tags },
        })
            .select(
                'title slug excerpt coverImage tags readingTime publishedAt',
            )
            .sort({ publishedAt: -1 })
            .limit(limit)
            .lean();

        logger.info('Related blogs fetched', {
            slug,
            count: relatedBlogs.length,
        });

        return {
            success: true,
            message: 'Related blogs fetched',
            data: relatedBlogs,
        };
    },
};
