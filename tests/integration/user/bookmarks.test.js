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

describe('POST /api/user/bookmarks/:blogId — toggle', () => {
    test('bookmarks a blog', async () => {
        const blog = await createBlog();
        const user = await createUser({ clerkUserId: 'clerk_bm_001' });

        const res = await request(app)
            .post(`/api/user/bookmarks/${blog._id}`)
            .set('x-test-user-id', user.clerkUserId);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.isBookmarked).toBe(true);
    });

    test('removes bookmark when toggled again', async () => {
        const blog = await createBlog();
        const user = await createUser({ clerkUserId: 'clerk_bm_002' });

        await request(app)
            .post(`/api/user/bookmarks/${blog._id}`)
            .set('x-test-user-id', user.clerkUserId);

        const res = await request(app)
            .post(`/api/user/bookmarks/${blog._id}`)
            .set('x-test-user-id', user.clerkUserId);

        expect(res.body.success).toBe(true);
        expect(res.body.data.isBookmarked).toBe(false);
    });

    test('increments and decrements BlogAnalytics totalBookmarks', async () => {
        const { models } = await import('../../../database/index.js');
        const blog = await createBlog();
        const user = await createUser({ clerkUserId: 'clerk_bm_003' });

        await request(app)
            .post(`/api/user/bookmarks/${blog._id}`)
            .set('x-test-user-id', user.clerkUserId);

        const after = await models.BlogAnalytics.findOne({ blogId: blog._id });
        expect(after.totalBookmarks).toBe(1);

        await request(app)
            .post(`/api/user/bookmarks/${blog._id}`)
            .set('x-test-user-id', user.clerkUserId);

        const afterRemove = await models.BlogAnalytics.findOne({
            blogId: blog._id,
        });
        expect(afterRemove.totalBookmarks).toBe(0);
    });

    test('returns 401 when unauthenticated', async () => {
        const blog = await createBlog();
        const res = await request(app).post(`/api/user/bookmarks/${blog._id}`);
        expect(res.status).toBe(401);
    });
});

describe('GET /api/user/bookmarks', () => {
    test('returns bookmarked blogs for user', async () => {
        const blog = await createBlog({ title: 'Saved Blog' });
        const user = await createUser({ clerkUserId: 'clerk_bm_004' });

        await request(app)
            .post(`/api/user/bookmarks/${blog._id}`)
            .set('x-test-user-id', user.clerkUserId);

        const res = await request(app)
            .get('/api/user/bookmarks')
            .set('x-test-user-id', user.clerkUserId);

        expect(res.status).toBe(200);
        expect(res.body.data.bookmarks).toHaveLength(1);
        expect(res.body.data.bookmarks[0].title).toBe('Saved Blog');
    });

    test('returns empty when user has no bookmarks', async () => {
        const user = await createUser({ clerkUserId: 'clerk_bm_005' });

        const res = await request(app)
            .get('/api/user/bookmarks')
            .set('x-test-user-id', user.clerkUserId);

        expect(res.status).toBe(200);
        expect(res.body.data.bookmarks).toHaveLength(0);
    });
});
