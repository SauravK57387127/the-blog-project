import { Router } from 'express';
import { requireAuth } from '../../middlewares/requireAuth.middleware.js';
import { userRateLimit } from '../../middlewares/rateLimiter.middleware.js';
import engagementRoutes from './engagement.route.js';
import likeRoutes from './like.route.js';
import bookmarkRoutes from './bookmark.route.js';
import commentRoutes from './comment.route.js';
import profileRoutes from './profile.route.js';
import notificationRoutes from './notification.route.js';
import historyRoutes from './history.route.js';
import newsletterRoutes from './newsletter.route.js';

export default () => {
    const router = Router();

    // Rate limiting
    router.use(userRateLimit);

    // Auth middleware (Clerk)
    router.use(requireAuth);

    // Mount routes
    router.use('/profile', profileRoutes);
    router.use('/notifications', notificationRoutes);
    router.use('/engagement', engagementRoutes);
    router.use('/likes', likeRoutes);
    router.use('/bookmarks', bookmarkRoutes);
    router.use('/comments', commentRoutes);
    router.use('/history', historyRoutes);
    router.use('/newsletter', newsletterRoutes);

    return router;
};
