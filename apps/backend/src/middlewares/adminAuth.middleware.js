import { getPrisma } from '../../../../database/index.js';
//import { getPrisma } from '../../../../database/postgres/prismaClient.js';
import {
    verifyAccessToken,
    extractTokenFromHeader,
} from '../utils/adminAuth.js';
import { sendResponse } from '../utils/sendResponse.js';

const prisma = getPrisma();

/**
 * 🛡️ REQUIRE ADMIN AUTHENTICATION
 *
 * This middleware MUST be applied to all /api/admin/* routes
 *
 * Flow:
 * 1. Extract access token from Authorization header or cookie
 * 2. Verify JWT signature and expiry
 * 3. Check if admin still exists in database
 * 4. Check if admin account is locked
 * 5. Attach admin object to req.admin for use in controllers
 * 6. Allow request to continue
 *
 * If any step fails → Return 401 Unauthorized
 *
 * Usage:
 * router.get('/admin/blogs', requireAdmin, blogController.getAll);
 */
export const requireAdmin = async (req, res, next) => {
    console.log('\n🛡️  Admin Auth Middleware - START');
    console.log(`📍 Route: ${req.method} ${req.path}`);

    try {
        // STEP 1: Extract token from Authorization header or cookie
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies?.adminAccessToken;

        const token = extractTokenFromHeader(authHeader) || cookieToken;

        if (!token) {
            console.log('❌ No access token provided');
            return sendResponse({
                res,
                statusCode: 401,
                success: false,
                message: 'Authentication required',
            });
        }

        console.log('✅ Access token found');

        // STEP 2: Verify JWT (signature + expiry)
        const decoded = verifyAccessToken(token);

        if (!decoded) {
            console.log('❌ Invalid or expired token');
            return sendResponse({
                res,
                statusCode: 401,
                success: false,
                message: 'Invalid or expired token',
            });
        }

        console.log(`✅ Token verified for admin ID: ${decoded.sub}`);

        // STEP 3: Check if admin still exists (they might be deleted)
        const admin = await prisma.admin.findUnique({
            where: { id: decoded.sub },
            select: {
                id: true,
                username: true,
                role: true,
                lockedUntil: true,
            },
        });

        if (!admin) {
            console.log('❌ Admin not found in database');
            return sendResponse({
                res,
                statusCode: 401,
                success: false,
                message: 'Admin account not found',
            });
        }

        console.log(`✅ Admin found: ${admin.username}`);

        // STEP 4: Check if account is locked
        if (admin.lockedUntil && new Date() < admin.lockedUntil) {
            const remainingTime = Math.ceil(
                (admin.lockedUntil - new Date()) / 1000 / 60,
            );
            console.log(
                `🔒 Account is locked for ${remainingTime} more minutes`,
            );

            return sendResponse({
                res,
                statusCode: 403,
                success: false,
                message: `Account locked. Try again in ${remainingTime} minutes.`,
            });
        }

        // STEP 5: Attach admin to request object
        // Controllers can now access req.admin
        req.admin = admin;
        req.adminId = admin.id;

        console.log(`req.admin: ${req.admin}`);
        console.log(`req.adminId: ${req.adminId}`);

        console.log('✅ Admin authenticated successfully');
        console.log('🛡️  Admin Auth Middleware - END\n');

        // STEP 6: Continue to next middleware/controller
        next();
    } catch (error) {
        console.error('❌ Admin auth middleware error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            success: false,
            message: 'Authentication error',
        });
    }
};

/**
 * 🎭 REQUIRE SUPER ADMIN ROLE
 *
 * Additional middleware for super admin-only routes
 * Must be used AFTER requireAdmin
 *
 * Usage:
 * router.delete('/admin/users/:id', requireAdmin, requireSuperAdmin, userController.delete);
 */
export const requireSuperAdmin = (req, res, next) => {
    console.log('\n👑 Super Admin Check - START');

    const admin = req.admin; // Set by requireAdmin middleware

    if (!admin) {
        console.log('❌ Admin not authenticated (requireAdmin not called?)');
        return sendResponse({
            res,
            statusCode: 401,
            success: false,
            message: 'Authentication required',
        });
    }

    if (admin.role !== 'super_admin') {
        console.log(
            `❌ Admin ${admin.username} is not super admin (role: ${admin.role})`,
        );
        return sendResponse({
            res,
            statusCode: 403,
            success: false,
            message: 'Super admin access required',
        });
    }

    console.log(`✅ Super admin verified: ${admin.username}`);
    console.log('👑 Super Admin Check - END\n');

    next();
};

/**
 * 📊 OPTIONAL ADMIN AUTH
 *
 * Try to authenticate admin, but don't fail if not authenticated
 * Useful for routes that behave differently for admins
 *
 * Example: Public blog list might show unpublished blogs to admins
 *
 * Usage:
 * router.get('/public/blogs', optionalAdmin, blogController.getAll);
 */
export const optionalAdmin = async (req, res, next) => {
    console.log('\n🔓 Optional Admin Check - START');

    try {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies?.adminAccessToken;

        const token = extractTokenFromHeader(authHeader) || cookieToken;

        if (!token) {
            console.log('ℹ️  No token provided (continuing as non-admin)');
            req.admin = null;
            return next();
        }

        const decoded = verifyAccessToken(token);

        if (!decoded) {
            console.log('ℹ️  Invalid token (continuing as non-admin)');
            req.admin = null;
            return next();
        }

        const admin = await prisma.admin.findUnique({
            where: { id: decoded.sub },
            select: {
                id: true,
                username: true,
                role: true,
            },
        });

        if (admin) {
            req.admin = admin;
            req.adminId = admin.id;
            console.log(`✅ Admin authenticated: ${admin.username}`);
        } else {
            req.admin = null;
            console.log('ℹ️  Admin not found (continuing as non-admin)');
        }
        console.log('🔓 Optional Admin Check - END\n');
        next();
    } catch (error) {
        console.error('❌ Admin auth middleware error:', error);
        return sendResponse({
            res,
            statusCode: 500,
            success: false,
            message: 'Authentication error',
        });
    }
};
