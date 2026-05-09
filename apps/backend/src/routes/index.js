import express from 'express';
import { Router } from 'express';

import adminRoutes from './admin/index.js';
import userRoutes from './user/index.js';
import publicRoutes from './public/index.js';

import webhookRoutes from './webhooks/clerk.route.js';

export const routerFactory = ({ blogQueue }) => {
    const router = Router();

    // ===== WEBHOOKS (NO AUTH, raw body needed) =====
    router.use(
        '/webhooks/clerk',
        express.raw({ type: 'application/json' }),
        webhookRoutes,
    );

    /* ---------- mount prefixes ---------- */

    // ============    admin ( /api/admin/* )    ===============
    router.use('/admin', adminRoutes({ blogQueue }));

    // ===========     public ( /api/* )    ====================
    router.use('/public', publicRoutes());

    // ===========    user ( /api/user/* )    ===================
    router.use('/user', userRoutes()); // all auth protected

    return router;
};
