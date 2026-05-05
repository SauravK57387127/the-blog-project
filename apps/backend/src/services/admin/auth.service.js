import { getPrisma } from '../../../../../database/index.js';

import {
    hashPassword,
    verifyPassword,
    generateAccessToken,
    generateRefreshToken,
    hashRefreshToken,
    verifyRefreshToken,
    getRefreshTokenExpiry,
    getDeviceInfo,
    getDeviceId,
    getClientIP,
} from '../../utils/adminAuth.js';

const prisma = getPrisma();

// ==================== ACCOUNT LOCKOUT CONFIGURATION ====================

const MAX_FAILED_ATTEMPTS = 5; // Lock account after 5 wrong passwords
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // Lock for 30 minutes

export default {
    /**
     * 🔐 LOGIN - Authenticate admin and issue tokens
     *
     * Flow:
     * 1. Find admin by username
     * 2. Check if account is locked
     * 3. Verify password
     * 4. Handle failed attempts / account lockout
     * 5. Generate access + refresh tokens
     * 6. Store refresh token in database
     * 7. Update last login info
     * 8. Create audit log
     * 9. Return tokens + admin info
     */
    login: async ({ username, password, userAgent, ipAddress }) => {
        console.log('\n🔐 Admin Login Service - START');

        // STEP 1: Find admin by username
        const admin = await prisma.admin.findUnique({
            where: { username },
        });

        if (!admin) {
            console.log('❌ Admin not found');

            // ⚠️ SECURITY: Don't reveal whether username exists
            // Always return generic message to prevent username enumeration
            return {
                success: false,
                message: 'Invalid credentials',
                data: null,
            };
        }

        console.log(`✅ Admin found: ${admin.username} (ID: ${admin.id})`);

        // STEP 2: Check if account is locked
        if (admin.lockedUntil && new Date() < admin.lockedUntil) {
            const remainingTime = Math.ceil(
                (admin.lockedUntil - new Date()) / 1000 / 60,
            );
            console.log(`🔒 Account locked for ${remainingTime} more minutes`);

            return {
                success: false,
                message: `Account locked. Try again in ${remainingTime} minutes.`,
                data: null,
            };
        }

        // STEP 3: Verify password
        const isPasswordValid = await verifyPassword(
            password,
            admin.passwordHash,
        );

        if (!isPasswordValid) {
            console.log('❌ Invalid password');

            // STEP 4a: Increment failed attempts
            const newFailedAttempts = admin.failedAttempts + 1;

            // Check if we should lock the account
            if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
                const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);

                await prisma.admin.update({
                    where: { id: admin.id },
                    data: {
                        failedAttempts: newFailedAttempts,
                        lockedUntil,
                    },
                });

                console.log(`🔒 Account locked until ${lockedUntil}`);

                // Create audit log for lockout
                await prisma.auditLog.create({
                    data: {
                        adminId: admin.id,
                        action: 'ACCOUNT_LOCKED',
                        ipAddress,
                        userAgent,
                        statusCode: 429,
                        metadata: {
                            reason: 'Too many failed login attempts',
                            failedAttempts: newFailedAttempts,
                        },
                    },
                });

                return {
                    success: false,
                    message: `Account locked due to ${MAX_FAILED_ATTEMPTS} failed attempts. Try again in 30 minutes.`,
                    data: null,
                };
            }

            // Just increment failed attempts (not locked yet)
            await prisma.admin.update({
                where: { id: admin.id },
                data: { failedAttempts: newFailedAttempts },
            });

            // Create audit log for failed login
            await prisma.auditLog.create({
                data: {
                    adminId: admin.id,
                    action: 'LOGIN_FAILED',
                    ipAddress,
                    userAgent,
                    statusCode: 401,
                    metadata: {
                        reason: 'Invalid password',
                        failedAttempts: newFailedAttempts,
                    },
                },
            });

            return {
                success: false,
                message: `Invalid credentials. ${MAX_FAILED_ATTEMPTS - newFailedAttempts} attempts remaining.`,
                data: null,
            };
        }

        console.log('✅ Password verified');

        // STEP 4b: Password valid - Reset failed attempts
        await prisma.admin.update({
            where: { id: admin.id },
            data: {
                failedAttempts: 0,
                lockedUntil: null,
                lastLoginAt: new Date(),
                lastLoginIP: ipAddress,
            },
        });

        // STEP 5: Generate tokens
        const accessToken = generateAccessToken(admin);
        const refreshToken = generateRefreshToken();
        const refreshTokenHash = hashRefreshToken(refreshToken);

        console.log('✅ Tokens generated');

        // STEP 6: Store refresh token in database
        // await prisma.adminRefreshToken.create({
        //   data: {
        //     adminId: admin.id,
        //     tokenHash: refreshTokenHash,
        //     deviceInfo: getDeviceInfo(userAgent),
        //     ipAddress,
        //     expiresAt: getRefreshTokenExpiry()
        //   }
        // });
        const deviceId = getDeviceId(ipAddress, userAgent);

        const existing = await prisma.adminRefreshToken.findFirst({
            where: {
                adminId: admin.id,
                deviceId,
                revokedAt: null,
            },
        });

        if (existing) {
            // Rotate token for existing device
            await prisma.adminRefreshToken.update({
                where: { id: existing.id },
                data: {
                    tokenHash: refreshTokenHash,
                    expiresAt: getRefreshTokenExpiry(),
                },
            });
        } else {
            // Create new session
            await prisma.adminRefreshToken.create({
                data: {
                    adminId: admin.id,
                    tokenHash: refreshTokenHash,
                    deviceId,
                    deviceInfo: getDeviceInfo(userAgent),
                    ipAddress,
                    expiresAt: getRefreshTokenExpiry(),
                },
            });
        }

        console.log('✅ Refresh token stored in database');

        // STEP 7: Create audit log for successful login
        await prisma.auditLog.create({
            data: {
                adminId: admin.id,
                action: 'LOGIN_SUCCESS',
                ipAddress,
                userAgent,
                statusCode: 200,
                metadata: {
                    deviceInfo: getDeviceInfo(userAgent),
                },
            },
        });

        console.log('✅ Login successful!\n');

        // STEP 8: Return tokens and admin info (exclude sensitive data)
        return {
            success: true,
            message: 'Login successful',
            data: {
                accessToken,
                refreshToken,
                admin: {
                    id: admin.id,
                    username: admin.username,
                    role: admin.role,
                    lastLoginAt: admin.lastLoginAt,
                },
            },
        };
    },

    /**
     * 🔄 REFRESH - Get new access token using refresh token
     *
     * Flow:
     * 1. Verify refresh token (check database)
     * 2. Generate new access token
     * 3. Create audit log
     * 4. Return new access token
     */
    refresh: async ({ refreshToken, ipAddress, userAgent }) => {
        console.log('\n🔄 Token Refresh Service - START');

        if (!refreshToken) {
            return {
                success: false,
                message: 'Refresh token required',
                data: null,
            };
        }

        // STEP 1: Verify refresh token (checks database)
        const admin = await verifyRefreshToken(refreshToken, prisma);

        if (!admin) {
            console.log('❌ Invalid or expired refresh token');

            // Create audit log for suspicious refresh attempt
            await prisma.auditLog.create({
                data: {
                    action: 'REFRESH_FAILED',
                    ipAddress,
                    userAgent,
                    statusCode: 401,
                    metadata: {
                        reason: 'Invalid or expired refresh token',
                    },
                },
            });

            return {
                success: false,
                message: 'Invalid or expired refresh token',
                data: null,
            };
        }

        console.log(`✅ Refresh token valid for admin: ${admin.username}`);

        // STEP 2: Generate new access token
        const accessToken = generateAccessToken(admin);

        console.log('✅ New access token generated');

        // STEP 3: Create audit log
        await prisma.auditLog.create({
            data: {
                adminId: admin.id,
                action: 'TOKEN_REFRESHED',
                ipAddress,
                userAgent,
                statusCode: 200,
            },
        });

        console.log('✅ Token refresh successful!\n');

        // STEP 4: Return new access token
        return {
            success: true,
            message: 'Token refreshed',
            data: {
                accessToken,
                admin: {
                    id: admin.id,
                    username: admin.username,
                    role: admin.role,
                },
            },
        };
    },

    /**
   * 🚪 LOGOUT - Revoke refresh token
   * 
   * Flow:
   * 1. Find refresh token in database
   * 2. Mark as revoked (don't delete - keep for audit trail)
   * 3. Create audit log
   * 4. Return success
   * 
   * Note: Access token can't be revoked (stateless)
   * But it expires in 15 minutes anywa// TODO: Implement token blacklist in Redis for immediate access token invalidation
// Store revoked token JTI (JWT ID) in Redis with TTL = remaining token expiry
// Check blacklist in requireAdmin middleware before allowing accessy
   */

    logout: async ({ refreshToken, adminId, ipAddress, userAgent }) => {
        console.log('\n🚪 Logout Service - START');

        if (!refreshToken) {
            return {
                success: false,
                message: 'Refresh token required',
                data: null,
            };
        }

        // STEP 1: Find and revoke refresh token
        const tokenHash = hashRefreshToken(refreshToken);

        const updatedToken = await prisma.adminRefreshToken.updateMany({
            where: {
                tokenHash,
                adminId, // Ensure token belongs to this admin
                revokedAt: null, // Only revoke if not already revoked
            },
            data: {
                revokedAt: new Date(),
            },
        });

        if (updatedToken.count === 0) {
            console.log('❌ Refresh token not found or already revoked');
            return {
                success: false,
                message: 'Invalid refresh token',
                data: null,
            };
        }

        console.log('✅ Refresh token revoked');

        // STEP 2: Create audit log
        await prisma.auditLog.create({
            data: {
                adminId,
                action: 'LOGOUT',
                ipAddress,
                userAgent,
                statusCode: 200,
            },
        });

        console.log('✅ Logout successful!\n');

        return {
            success: true,
            message: 'Logged out successfully',
            data: null,
        };
    },

    /**
     * 🧹 CLEANUP - Remove expired refresh tokens (run periodically)
     *
     * Should be called by a cron job or BullMQ worker daily
     */
    cleanupExpiredTokens: async () => {
        console.log('\n🧹 Cleanup Expired Tokens - START');

        const result = await prisma.adminRefreshToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(), // Less than current time = expired
                },
            },
        });

        console.log(`✅ Deleted ${result.count} expired tokens\n`);

        return {
            success: true,
            message: `Cleaned up ${result.count} expired tokens`,
            data: { deletedCount: result.count },
        };
    },

    /**
     * 🔒 REVOKE ALL SESSIONS - Logout from all devices
     *
     * Useful if admin suspects account compromise
     */
    revokeAllSessions: async ({ adminId, ipAddress, userAgent }) => {
        console.log('\n🔒 Revoke All Sessions - START');

        const result = await prisma.adminRefreshToken.updateMany({
            where: {
                adminId,
                revokedAt: null, // Only revoke active tokens
            },
            data: {
                revokedAt: new Date(),
            },
        });

        console.log(`✅ Revoked ${result.count} active sessions`);

        // Create audit log
        await prisma.auditLog.create({
            data: {
                adminId,
                action: 'REVOKE_ALL_SESSIONS',
                ipAddress,
                userAgent,
                statusCode: 200,
                metadata: {
                    sessionsRevoked: result.count,
                },
            },
        });

        console.log('✅ All sessions revoked!\n');

        return {
            success: true,
            message: `Logged out from ${result.count} devices`,
            data: { revokedCount: result.count },
        };
    },
};
