import { Router } from 'express';
import { requireAdmin } from '../../middlewares/adminAuth.middleware.js';
import { adminRateLimit } from '../../middlewares/rateLimiter.middleware.js';
import authRoutes from './auth.route.js';
import adminBlogRoutes from './blog.route.js';
import dashboardRoutes from './dashboard.route.js';
import sentryTestRoutes from './test.route.js';
import analyticsRoutes from './analytics.route.js';
import editorsChoiceRoutes from './editorsChoice.route.js';
import uploadRoutes from './upload.route.js';
import analyticsStatsRoutes from './analyticsStats.route.js';

export default ({ blogQueue }) => {
    const router = Router();

    // ==================== AUTH ROUTES (Public) ====================
    router.use('/auth', authRoutes);

    // ==================== PROTECTED ROUTES ====================
    router.use(requireAdmin);
    // router.use((req, res, next) => {    // TEMP: remove before production
    // req.admin = { id: 1, username: 'admin', role: 'admin' };
    // next();
    // });

    router.use(adminRateLimit);

    router.use('/dashboard', dashboardRoutes);
    router.use('/blogs', adminBlogRoutes({ blogQueue }));
    router.use('/analytics', analyticsRoutes);
    router.use('/analytics', analyticsStatsRoutes);

    router.use('/editors-choice', editorsChoiceRoutes);
    router.use('/upload', uploadRoutes);

    // Sentry test
    router.use('/test', sentryTestRoutes);

    return router;
};
