import { Router } from 'express';
import authController from '../../controllers/admin/auth.controller.js';
import { requireAdmin } from '../../middlewares/adminAuth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { loginSchema } from '../../schemas/admin/auth.schema.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { adminLoginRateLimit } from '../../middlewares/rateLimiter.middleware.js';

const router = Router();

/**
 * 🔐 ADMIN AUTHENTICATION ROUTES
 *
 * Base path: /api/admin/auth/*
 *
 * Public routes (no auth):
 * - POST /login
 * - POST /refresh
 *
 * Protected routes (requireAdmin):
 * - POST /logout
 * - POST /revoke-all-sessions
 * - GET  /me
 */

// ==================== PUBLIC ROUTES ====================

/**
 * POST /api/admin/auth/login
 *
 * Body: { username, password }
 * Returns: { accessToken, admin: { id, username, role } }
 *
 * Sets refresh token as httpOnly cookie
 */
router.post(
    '/login',
    adminLoginRateLimit,
    validate(loginSchema), // Validate request body with Zod
    asyncHandler(authController.login),
);

/**
 * POST /api/admin/auth/refresh
 *
 * Headers: Cookie: adminRefreshToken=...
 * Returns: { accessToken, admin: { id, username, role } }
 *
 * Gets new access token using refresh token from cookie
 */
router.post(
    '/refresh',
    adminLoginRateLimit,
    asyncHandler(authController.refresh),
);

// ==================== PROTECTED ROUTES ====================

/**
 * POST /api/admin/auth/logout
 *
 * Headers: Authorization: Bearer <accessToken>
 * Returns: { message: "Logged out successfully" }
 *
 * Revokes current refresh token and clears cookie
 */
router.post(
    '/logout',
    requireAdmin, // Requires valid access token
    asyncHandler(authController.logout),
);

/**
 * POST /api/admin/auth/revoke-all-sessions
 *
 * Headers: Authorization: Bearer <accessToken>
 * Returns: { message: "Logged out from N devices" }
 *
 * Revokes ALL refresh tokens (logout from all devices)
 */
router.post(
    '/revoke-all-sessions',
    requireAdmin,
    asyncHandler(authController.revokeAllSessions),
);

/**
 * GET /api/admin/auth/me
 *
 * Headers: Authorization: Bearer <accessToken>
 * Returns: { admin: { id, username, role } }
 *
 * Get current admin info (verify token still valid)
 */
router.get('/me', requireAdmin, asyncHandler(authController.me));

export default router;
