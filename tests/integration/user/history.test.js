import request from 'supertest';
import { createApp } from '../../../apps/backend/src/app.js';
import {
    setupTestDB,
    clearTestDB,
    teardownTestDB,
} from '../../helpers/dbSetup.js';
import { createBlog } from '../../fixtures/factories/blog.factory.js';
import { createUser } from '../../fixtures/factories/user.factory.js';

let app;

beforeAll(async () => {
    await setupTestDB();
    app = createApp();
});

afterEach(async () => {
    await clearTestDB();
});

afterAll(async () => {
    await teardownTestDB();
});

describe('GET /api/user/history', () => {
    test('returns 401 when unauthenticated', async () => {
        const res = await request(app).get('/api/user/history');
        expect(res.status).toBe(401);
    });

    test('returns empty history when no reads exist', async () => {
        const user = await createUser({ clerkUserId: 'clerk_hist_001' });

        const res = await request(app)
            .get('/api/user/history')
            .set('x-test-user-id', user.clerkUserId);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.history).toHaveLength(0);
    });

    test('returns blogs where user spent 30+ seconds', async () => {
        const { models } = await import('../../../database/index.js');
        const blog = await createBlog({ title: 'Read Blog' });
        const user = await createUser({ clerkUserId: 'clerk_hist_002' });

        // Create a qualifying view — timeSpent >= 30
        await models.BlogView.create({
            blogId: blog._id,
            sessionId: 'session-hist-001',
            userId: user.clerkUserId, // clerkUserId string, not _id
            timeSpent: 45,
            scrollDepth: 30,
            completed: false,
            viewedAt: new Date(),
        });

        const res = await request(app)
            .get('/api/user/history')
            .set('x-test-user-id', user.clerkUserId);

        expect(res.status).toBe(200);
        expect(res.body.data.history).toHaveLength(1);
        expect(res.body.data.history[0].title).toBe('Read Blog');
        expect(res.body.data.history[0].timeSpent).toBe(45);
    });

    test('excludes views with insufficient time and scroll', async () => {
        const { models } = await import('../../../database/index.js');
        const blog = await createBlog();
        const user = await createUser({ clerkUserId: 'clerk_hist_003' });

        // Non-qualifying view — too short, low scroll, not completed
        await models.BlogView.create({
            blogId: blog._id,
            sessionId: 'session-hist-002',
            userId: user.clerkUserId,
            timeSpent: 5,
            scrollDepth: 10,
            completed: false,
            viewedAt: new Date(),
        });

        const res = await request(app)
            .get('/api/user/history')
            .set('x-test-user-id', user.clerkUserId);

        expect(res.status).toBe(200);
        expect(res.body.data.history).toHaveLength(0);
    });

    test('includes view with high scroll depth even without time', async () => {
        const { models } = await import('../../../database/index.js');
        const blog = await createBlog({ title: 'Scrolled Blog' });
        const user = await createUser({ clerkUserId: 'clerk_hist_004' });

        await models.BlogView.create({
            blogId: blog._id,
            sessionId: 'session-hist-003',
            userId: user.clerkUserId,
            timeSpent: 10,
            scrollDepth: 75, // >= 50 qualifies
            completed: false,
            viewedAt: new Date(),
        });

        const res = await request(app)
            .get('/api/user/history')
            .set('x-test-user-id', user.clerkUserId);

        expect(res.status).toBe(200);
        expect(res.body.data.history).toHaveLength(1);
        expect(res.body.data.history[0].title).toBe('Scrolled Blog');
    });
});
