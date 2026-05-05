import request from 'supertest';
import { createApp } from '../../../apps/backend/src/app.js';
import {
    setupTestDB,
    clearTestDB,
    teardownTestDB,
} from '../../helpers/dbSetup.js';
import { createBlog } from '../../fixtures/factories/blog.factory.js';

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

describe('POST /api/public/views/track', () => {
    test('tracks a new view for a published blog', async () => {
        const blog = await createBlog();

        const res = await request(app).post('/api/public/views/track').send({
            blogId: blog._id,
            sessionId: 'session-001',
            device: 'desktop',
        });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.sessionId).toBe('session-001');
    });

    test('does not duplicate view for same session', async () => {
        const blog = await createBlog();

        // First view
        await request(app)
            .post('/api/public/views/track')
            .send({ blogId: blog._id, sessionId: 'session-dup' });

        // Second view same session
        const res = await request(app)
            .post('/api/public/views/track')
            .send({ blogId: blog._id, sessionId: 'session-dup' });

        expect(res.status).toBe(201);
        expect(res.body.data.alreadyTracked).toBe(true);
    });

    test('increments BlogAnalytics totalViews on new view', async () => {
        const { models } = await import('../../../database/index.js');
        const blog = await createBlog();

        await request(app)
            .post('/api/public/views/track')
            .send({ blogId: blog._id, sessionId: 'session-analytics' });

        const analytics = await models.BlogAnalytics.findOne({
            blogId: blog._id,
        });
        expect(analytics.totalViews).toBe(1);
        expect(analytics.views7d).toBe(1);
    });

    test('returns failure when slug does not exist', async () => {
        const res = await request(app)
            .post('/api/public/blogs/non-existent-slug/view')
            .send({ sessionId: 'session-none' });

        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Blog not found');
    });
});

describe('POST /api/public/views/update', () => {
    test('updates view metrics after reading', async () => {
        const blog = await createBlog();

        // Track first
        await request(app)
            .post('/api/public/views/track')
            .send({ blogId: blog._id, sessionId: 'session-update' });

        // Update metrics
        const res = await request(app).post('/api/public/views/update').send({
            blogId: blog._id,
            sessionId: 'session-update',
            timeSpent: 120,
            scrollDepth: 80,
            completed: true,
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.timeSpent).toBe(120);
        expect(res.body.data.scrollDepth).toBe(80);
        expect(res.body.data.completed).toBe(true);
    });

    test('returns failure when view not found', async () => {
        const blog = await createBlog();

        const res = await request(app).post('/api/public/views/update').send({
            blogId: blog._id,
            sessionId: 'non-existent-session',
            timeSpent: 60,
        });

        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('View not found');
    });
});
