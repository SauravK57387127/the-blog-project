export const API_ENDPOINTS = {
  PUBLIC: {
    HOMEPAGE: '/api/public/homepage',

    BLOGS: {
      LIST:     '/api/public/blogs',
      SEARCH:   '/api/public/blogs/search',
      POPULAR:  '/api/public/blogs/popular',
      DETAIL:   (slug) => `/api/public/blogs/${slug}`,
      RELATED:  (slug) => `/api/public/blogs/${slug}/related`,
      VIEW:     (slug) => `/api/public/blogs/${slug}/view`,
    },

   AUTHORS: {
      ME:     '/api/public/authors/me',
      DETAIL: (authorId) => `/api/public/authors/${authorId}`,
    }, 

    COMMENTS: {
      BY_BLOG: (blogId) => `/api/public/comments/${blogId}`,
    },

    SEARCH: {
      INITIAL: '/api/public/search/initial',
    },

    NEWSLETTER: {
      SUBSCRIBE:   '/api/public/newsletter/subscribe',
      UNSUBSCRIBE: (token) => `/api/public/newsletter/unsubscribe/${token}`,
    },

    VIEWS: {
      UPDATE: '/api/public/views/update',
    },
  },

  USER: {
    PROFILE: '/api/user/profile',

    LIKES: {
      LIST:   '/api/user/likes',
      TOGGLE: (blogId) => `/api/user/likes/${blogId}`,
      UNLIKE: (blogId) => `/api/user/likes/${blogId}`,
    },

    BOOKMARKS: {
      LIST:   '/api/user/bookmarks',
      TOGGLE: (blogId) => `/api/user/bookmarks/${blogId}`,
      REMOVE: (blogId) => `/api/user/bookmarks/${blogId}`,
    },

    ENGAGEMENT: {
      STATUS: (blogId) => `/api/user/engagement/${blogId}`,
    },

    COMMENTS: {
      MY:     '/api/user/comments/my',
      ADD:    (blogId) => `/api/user/comments/${blogId}`,
      UPDATE: (commentId) => `/api/user/comments/${commentId}`,
      DELETE: (commentId) => `/api/user/comments/${commentId}`,
    },

    NOTIFICATIONS: {
      LIST:      '/api/user/notifications',
      MARK_READ: (id) => `/api/user/notifications/${id}/read`,
      MARK_ALL:  '/api/user/notifications/read-all',
    },

    HISTORY: '/api/user/history',

    NEWSLETTER: {
      STATUS:      '/api/user/newsletter/status',
      SUBSCRIBE:   '/api/user/newsletter/resubscribe',
      UNSUBSCRIBE: '/api/user/newsletter/unsubscribe',
    },
  },

  ADMIN: {
    AUTH: {
      LOGIN:      '/api/admin/auth/login',
      LOGOUT:     '/api/admin/auth/logout',
      REFRESH:    '/api/admin/auth/refresh',
      ME:         '/api/admin/auth/me',
      REVOKE_ALL: '/api/admin/auth/revoke-all-sessions',
    },

    BLOGS: {
      LIST:          '/api/admin/blogs',
      PUBLISHED:     '/api/admin/blogs/published',
      DRAFTS:        '/api/admin/blogs/drafts',
      CREATE:        '/api/admin/blogs',
      DETAIL:        (id) => `/api/admin/blogs/${id}`,
      BY_DRAFT_SLUG: (slug) => `/api/admin/blogs/draft/${slug}`,
      UPDATE:        (id) => `/api/admin/blogs/${id}`,
      DELETE:        (id) => `/api/admin/blogs/${id}`,
      AUTOSAVE:      (id) => `/api/admin/blogs/${id}/autosave`,
      PUBLISH:       (id) => `/api/admin/blogs/${id}/publish`,
      UNPUBLISH:     (id) => `/api/admin/blogs/${id}/unpublish`,
      SCHEDULE:      (id) => `/api/admin/blogs/${id}/schedule`,
    },

    UPLOAD: {
      COVER_IMAGE: '/api/admin/upload/cover-image',
    },

    DASHBOARD: {
      STATS:    '/api/admin/dashboard/stats',
      ACTIVITY: '/api/admin/dashboard/activity',
    },

    ANALYTICS: {
      WRITING_STREAK:     '/api/admin/analytics/writing-streak',
      SIDEBAR_STATS:      '/api/admin/analytics/sidebar-stats',
      RECENT_DRAFT:       '/api/admin/analytics/recent-draft',
      SCHEDULED_UPCOMING: '/api/admin/analytics/scheduled-upcoming',
      STALE_DRAFTS:       '/api/admin/analytics/stale-drafts',

      OVERVIEW:           '/api/admin/analytics/overview',
VIEWS_30D:          '/api/admin/analytics/views-30d',
TOP_POSTS:          '/api/admin/analytics/top-posts',
CATEGORY_BREAKDOWN: '/api/admin/analytics/category-breakdown',
PERSONAL_BEST:      '/api/admin/analytics/personal-best',
    },

    ANALYTICS_STATS: {
      OVERVIEW:           '/api/admin/analytics-stats/overview',
      VIEWS_30D:          '/api/admin/analytics-stats/views-30d',
      TOP_POSTS:          '/api/admin/analytics-stats/top-posts',
      CATEGORY_BREAKDOWN: '/api/admin/analytics-stats/category-breakdown',
      PERSONAL_BEST:      '/api/admin/analytics-stats/personal-best',
    },

    EDITORS_CHOICE: '/api/admin/editors-choice',
  },
};
