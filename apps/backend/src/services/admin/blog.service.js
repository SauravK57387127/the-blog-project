import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';
import { nanoid } from 'nanoid';

const { Blog } = models;

/**
 * Generate slug from title
 */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default {
  /**
 * Get all published/scheduled blogs with pagination & filters
 */
// Used by: Admin Blogs page UI
getPublishedBlogs: async ({ status, category, page, limit }) => {
  try {
    const query = {};

    // Filter by status (published or scheduled)
    if (status === 'published' || status === 'scheduled') {
      query.status = status;
    } else {
      query.status = { $in: ['published', 'scheduled'] };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const [blogs, totalCount] = await Promise.all([
      Blog.find(query)
        .sort({ publishedAt: -1, scheduledAt: -1 })  // Most recent first
        .skip(skip)
        .limit(limit)
        .select('title slug coverImage status category publishedAt scheduledAt')
        .lean(),
      Blog.countDocuments(query),
    ]);

    // Format with time labels
    const formatted = blogs.map(blog => ({
      _id: blog._id,
      title: blog.title,
      slug: blog.slug,
      coverImage: blog.coverImage,
      status: blog.status,
      category: blog.category,
      timeLabel: blog.status === 'published'
        ? formatTimeAgo(blog.publishedAt)
        : formatFutureDate(blog.scheduledAt),
      publishedAt: blog.publishedAt,
      scheduledAt: blog.scheduledAt,
    }));

    logger.info('Published blogs fetched', { 
      status, 
      category, 
      page, 
      count: blogs.length 
    });

    return {
      success: true,
      message: 'Blogs fetched',
      data: {
        blogs: formatted,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalBlogs: totalCount,
          hasMore: skip + blogs.length < totalCount,
        },
      },
    };
  } catch (error) {
    logger.error('Get published blogs failed', { error: error.message });
    return {
      success: false,
      message: 'Failed to fetch blogs',
      data: null,
      error: error.message,
    };
  }
},

/**
 * Get all drafts with pagination
 */
// Used by: Admin Drafts page UI
getDrafts: async ({ page, limit }) => {
  try {
    const skip = (page - 1) * limit;

    const [drafts, totalCount] = await Promise.all([
      Blog.find({ status: 'draft' })
        .sort({ updatedAt: -1 })  // Most recently updated first
        .skip(skip)
        .limit(limit)
        .select('title content updatedAt wordCount')
        .lean(),
      Blog.countDocuments({ status: 'draft' }),
    ]);

    // Format with excerpts
    const formatted = drafts.map(draft => ({
      _id: draft._id,
      title: draft.title,
      excerpt: draft.content
        .replace(/<[^>]*>/g, '')  // Remove HTML
        .split('\n')[0]
        .substring(0, 150),
      editedLabel: formatTimeAgo(draft.updatedAt),
      wordCount: draft.wordCount || 0,
      updatedAt: draft.updatedAt,
    }));

    logger.info('Drafts fetched', { page, count: drafts.length });

    return {
      success: true,
      message: 'Drafts fetched',
      data: {
        drafts: formatted,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalDrafts: totalCount,
          hasMore: skip + drafts.length < totalCount,
        },
      },
    };
  } catch (error) {
    logger.error('Get drafts failed', { error: error.message });
    return {
      success: false,
      message: 'Failed to fetch drafts',
      data: null,
      error: error.message,
    };
  }
},

/**
 * Delete blog (any status) 
 */
deleteBlog: async (blogId, { blogQueue }) => {
  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return {
        success: false,
        message: 'Blog not found',
        data: null,
      };
    }

    // Cancel scheduled publish job if exists
    if (blog.status === 'scheduled' && blogQueue) {
      const jobId = `publish-${blog._id}`;
      try {
        const job = await blogQueue.getJob(jobId);
        if (job) {
          await job.remove();
          logger.info('Cancelled scheduled publish job', { jobId });
        }
      } catch (error) {
        logger.warn('Could not cancel job', { jobId, error: error.message });
      }
    }

    await blog.deleteOne();

    // Delete associated data
    await Promise.all([
      BlogAnalytics.deleteOne({ blogId }),
      BlogView.deleteMany({ blogId }),
      Like.deleteMany({ blogId }),
      Bookmark.deleteMany({ blogId }),
      Comment.deleteMany({ blogId }),
    ]);

    logger.info('Blog deleted', { blogId, status: blog.status });

    return {
      success: true,
      message: 'Blog deleted successfully',
      data: { blogId },
    };
  } catch (error) {
    logger.error('Delete blog failed', { error: error.message, blogId });
    return {
      success: false,
      message: 'Failed to delete blog',
      data: null,
      error: error.message,
    };
  }
},


  /**
   * List all blogs with filtering
   */
// Used by: Generic admin blog management
  listBlogs: async ({ status, search, page, limit }) => {
    try {
      const query = {};

      // Filter by status
      if (status) {
        query.status = status;
      }

      // Search by title/content
      if (search && search.trim().length > 0) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ];
      }

      const skip = (page - 1) * limit;

      const [blogs, totalCount] = await Promise.all([
        Blog.find(query)
          .select('title slug status coverImage tags category publishedAt scheduledAt createdAt updatedAt')
          .sort({ updatedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Blog.countDocuments(query),
      ]);

      logger.info('Admin blogs listed', { status, count: blogs.length, totalCount });

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
    } catch (error) {
      logger.error('List blogs failed', { error: error.message });
      return {
        success: false,
        message: 'Failed to fetch blogs',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Get blog by ID
   */
  getBlogById: async (blogId) => {
    try {
      const blog = await Blog.findById(blogId).lean();

      if (!blog) {
        return {
          success: false,
          message: 'Blog not found',
          data: null,
        };
      }

      logger.info('Admin blog fetched', { blogId });

      return {
        success: true,
        message: 'Blog fetched',
        data: blog,
      };
    } catch (error) {
      logger.error('Get blog failed', { error: error.message, blogId });
      return {
        success: false,
        message: 'Failed to fetch blog',
        data: null,
        error: error.message,
      };
    }
  },

  /**
 * Get blog by draft slug (for editor)
 */
getBlogByDraftSlug: async (draftSlug) => {
  try {
    const blog = await Blog.findOne({ draftSlug }).lean();

    if (!blog) {
      return {
        success: false,
        message: 'Draft not found',
        data: null,
      };
    }

    logger.info('Blog fetched by draft slug', { draftSlug });

    return {
      success: true,
      message: 'Blog fetched',
      data: blog,
    };
  } catch (error) {
    logger.error('Get blog by draft slug failed', { error: error.message, draftSlug });
    return {
      success: false,
      message: 'Failed to fetch blog',
      data: null,
      error: error.message,
    };
  }
},
  
/**
 * Create new blog (draft by default)
 * Returns draftSlug for editor navigation
 */
createBlog: async (blogData) => {
  try {
    // Generate unique draft slug
    const draftSlug = nanoid(10);

    const blog = await Blog.create({
      ...blogData,
      status: 'draft',
      draftSlug,
      authorId: 'single-author',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    logger.info('Blog created', { blogId: blog._id, draftSlug });

    return {
      success: true,
      message: 'Blog created',
      data: {
        _id: blog._id,
        draftSlug: blog.draftSlug,
        title: blog.title,
      },
    };
  } catch (error) {
    logger.error('Create blog failed', { error: error.message });
    return {
      success: false,
      message: 'Failed to create blog',
      data: null,
      error: error.message,
    };
  }
},

  /**
   * Update blog
   */
  updateBlog: async (blogId, updates) => {
    try {
      const blog = await Blog.findById(blogId);

      if (!blog) {
        return {
          success: false,
          message: 'Blog not found',
          data: null,
        };
      }

      // Update fields
      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) {
          blog[key] = updates[key];
        }
      });

      // Regenerate slug if title changed
      if (updates.title) {
        blog.slug = slugify(updates.title);
      }

      blog.updatedAt = new Date();
      await blog.save();

      logger.info('Blog updated', { blogId, status: blog.status });

      return {
        success: true,
        message: 'Blog updated',
        data: blog,
      };
    } catch (error) {
      logger.error('Update blog failed', { error: error.message, blogId });
      return {
        success: false,
        message: 'Failed to update blog',
        data: null,
        error: error.message,
      };
    }
  },

  
  /**
   * Auto-save blog (debounced from frontend)
   */
  autosaveBlog: async (blogId, updates) => {
    try {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          ...updates,
          autosaveAt: new Date(),
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!blog) {
        return {
          success: false,
          message: 'Blog not found',
          data: null,
        };
      }

      logger.debug('Blog autosaved', { blogId });

      return {
        success: true,
        message: 'Blog autosaved',
        data: blog,
      };
    } catch (error) {
      logger.error('Autosave failed', { error: error.message, blogId });
      return {
        success: false,
        message: 'Failed to autosave',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Publish blog immediately
   */
  publishBlog: async (blogId, { blogQueue }) => {
    try {
      const blog = await Blog.findById(blogId);

      if (!blog) {
        return {
          success: false,
          message: 'Blog not found',
          data: null,
        };
      }

      // If already published, return as-is
      if (blog.status === 'published') {
        return {
          success: true,
          message: 'Blog already published',
          data: blog,
        };
      }

      // Generate slug if not exists
      if (!blog.slug) {
        blog.slug = slugify(blog.title);
      }

      // Update status
      blog.status = 'published';
      blog.publishedAt = new Date();
      blog.scheduledAt = null;  // Clear scheduled time
      blog.updatedAt = new Date();

      await blog.save();

      // Cancel scheduled job if exists
      if (blogQueue) {
        const jobId = `publish:${blogId}`;
        try {
          const job = await blogQueue.getJob(jobId);
          if (job) {
            await job.remove();
            logger.info('Scheduled job cancelled (published now)', { jobId });
          }
        } catch (err) {
          logger.warn('Failed to cancel job', { jobId });
        }
      }

      logger.info('Blog published', { blogId, slug: blog.slug });

      return {
        success: true,
        message: 'Blog published',
        data: blog,
      };
    } catch (error) {
      logger.error('Publish blog failed', { error: error.message, blogId });
      return {
        success: false,
        message: 'Failed to publish blog',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Schedule blog for future publication
   */
  scheduleBlog: async (blogId, scheduledAt, { blogQueue }) => {
    try {
      const blog = await Blog.findById(blogId);

      if (!blog) {
        return {
          success: false,
          message: 'Blog not found',
          data: null,
        };
      }

      const scheduledDate = new Date(scheduledAt);
      const now = new Date();

      // Validate future date
      if (scheduledDate <= now) {
        return {
          success: false,
          message: 'Scheduled time must be in the future',
          data: null,
        };
      }

      // Generate slug if not exists
      if (!blog.slug) {
        blog.slug = slugify(blog.title);
      }

      // Update status
      blog.status = 'scheduled';
      blog.scheduledAt = scheduledDate;
      blog.publishedAt = null;
      blog.updatedAt = new Date();

      await blog.save();

      // Create BullMQ job
      if (blogQueue) {
        const delay = scheduledDate - now;
        const jobId = `publish:${blogId}`;

        await blogQueue.add(
          'publish-blog',
          { blogId: blogId.toString() },
          {
            delay,
            jobId,
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
          }
        );

        logger.info('Blog scheduled', { blogId, scheduledAt, delay });
      }

      return {
        success: true,
        message: 'Blog scheduled',
        data: blog,
      };
    } catch (error) {
      logger.error('Schedule blog failed', { error: error.message, blogId });
      return {
        success: false,
        message: 'Failed to schedule blog',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Unpublish blog (back to draft)
   */
  unpublishBlog: async (blogId, { blogQueue }) => {
    try {
      const blog = await Blog.findById(blogId);

      if (!blog) {
        return {
          success: false,
          message: 'Blog not found',
          data: null,
        };
      }

      // Update status
      blog.status = 'draft';
      blog.publishedAt = null;
      blog.scheduledAt = null;
      blog.updatedAt = new Date();

      await blog.save();

      // Cancel job if exists
      if (blogQueue) {
        const jobId = `publish:${blogId}`;
        try {
          const job = await blogQueue.getJob(jobId);
          if (job) {
            await job.remove();
            logger.info('Job cancelled on unpublish', { jobId });
          }
        } catch (err) {
          logger.warn('Failed to cancel job', { jobId });
        }
      }

      logger.info('Blog unpublished', { blogId });

      return {
        success: true,
        message: 'Blog unpublished',
        data: blog,
      };
    } catch (error) {
      logger.error('Unpublish blog failed', { error: error.message, blogId });
      return {
        success: false,
        message: 'Failed to unpublish blog',
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
function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  
  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
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
  
  // Format as "scheduled for Mar 10"
  return `scheduled for ${target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}
