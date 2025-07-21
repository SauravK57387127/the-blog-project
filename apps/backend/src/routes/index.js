// Aggregate and prefix every router in one place
import { Router } from 'express';

/* ---------- ADMIN ---------- */
import adminBlogRoutes      from './admin/blog.route.js';
import adminAnalyticsRoutes from './admin/analytics.route.js';
import adminMetadataRoutes  from './admin/metadata.route.js';
import adminTagRoutes       from './admin/tag.route.js';
import adminCacheRoutes     from './admin/cache.route.js';

/* ---------- AUTH ---------- */
import authRoutes from './auth/auth.route.js';
 
/* ---------- USER ---------- */
import bookmarkRoutes from './user/bookmark.route.js';
import likeRoutes     from './user/like.route.js';
import commentRoutes  from './user/comment.route.js';

/* ---------- PUBLIC ---------- */
import publicBlogRoutes   from './public/blog.route.js';
import publicTagRoutes    from './public/tag.route.js';
import publicSearchRoutes from './public/search.route.js';

const router = Router();

/* ---------- mount prefixes ---------- */
// admin ( /api/admin/* )
router.use('/admin/blogs',      adminBlogRoutes);
router.use('/admin/analytics',  adminAnalyticsRoutes);
router.use('/admin/metadata',   adminMetadataRoutes);
router.use('/admin/tags',       adminTagRoutes);
router.use('/admin/cache',      adminCacheRoutes);

// auth ( /api/auth/* )
router.use('/auth', authRoutes);

// user ( /api/user/* )
router.use('/user/bookmarks', bookmarkRoutes);
router.use('/user/likes',     likeRoutes);
router.use('/user/comments',  commentRoutes);

// public ( /api/* )
router.use('/blogs', publicBlogRoutes);    // /api/blogs...
router.use('/tags',  publicTagRoutes);     // /api/tags/slug
router.use('/',      publicSearchRoutes);  // /api/blogs/search?q=...

export default router;

