// ── Query keys ───────────────────────────────────────────────────────────────
export const queryKeys = {
  // Public
  homepage: ['homepage'],

  blogs: {
    all: ['blogs'],
    list: (filters) => ['blogs', 'list', filters ?? {}],
    detail: (slug) => ['blogs', 'detail', slug],
    related: (slug) => ['blogs', 'related', slug],
    search: (query, filters) => ['blogs', 'search', query, filters ?? {}],
    popular: (limit) => ['blogs', 'popular', limit ?? 10],
  },

  authors: {
    detail: (id) => ['authors', id],
  },

  comments: {
    byBlog: (blogId) => ['comments', blogId],
  },

  // User — always stale (personal data must be fresh)
  user: {
    profile: ['user', 'profile'],
    likes: ['user', 'likes'],
    bookmarks: ['user', 'bookmarks'],
    comments: ['user', 'comments'],
    notifications: ['user', 'notifications'],
    history: ['user', 'history'],
    newsletter: ['user', 'newsletter'],
    engagement: (blogId) => ['user', 'engagement', blogId],
  },

  // Admin
  admin: {
    blogs: {
      all: ['admin', 'blogs'],
      list: (filters) => ['admin', 'blogs', 'list', filters ?? {}],
      detail: (id) => ['admin', 'blogs', id],
      drafts: ['admin', 'blogs', 'drafts'],
      published: ['admin', 'blogs', 'published'],
    },
    dashboard: ['admin', 'dashboard'],
    analytics: {
      all: ['admin', 'analytics'],
      overview: ['admin', 'analytics', 'overview'],
      views: ['admin', 'analytics', 'views'],
      topPosts: ['admin', 'analytics', 'top-posts'],
    },
  },
};
