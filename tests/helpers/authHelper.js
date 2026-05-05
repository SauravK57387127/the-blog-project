import jwt from 'jsonwebtoken';
import { config } from '@theblogproj/config';

/**
 * Generate test admin JWT token
 */
export function generateAdminToken(payload = {}) {
    const defaultPayload = {
        adminId: 'test-admin-123',
        email: 'admin@test.com',
        role: 'admin',
        ...payload,
    };

    return jwt.sign(defaultPayload, config.accessTokenSecret, {
        expiresIn: '1h',
    });
}

/**
 * Mock Clerk middleware for tests
 * Injects fake userId into req.auth
 */
export function mockClerkAuth(app) {
    // Insert middleware BEFORE Clerk's real middleware
    app.use((req, res, next) => {
        // Check for test user ID header
        const testUserId = req.get('x-test-user-id');

        if (testUserId) {
            // Mock Clerk's getAuth response
            req.auth = { userId: testUserId };
        }

        next();
    });
}

/**
 * Create test user IDs
 */
export const testUsers = {
    user1: 'test_user_1',
    user2: 'test_user_2',
    admin: 'test_admin_1',
};
