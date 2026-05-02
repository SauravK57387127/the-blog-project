import request from 'supertest';
import { createApp } from '../../../apps/backend/src/app.js';
import { setupTestDB, clearTestDB, teardownTestDB } from '../../helpers/dbSetup.js';
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

describe('POST /api/user/likes/:blogId — toggle', () => {
  test('likes a blog', async () => {
    const blog = await createBlog();
    const user = await createUser({ clerkUserId: 'clerk_like_001' });

    const res = await request(app)
      .post(`/api/user/likes/${blog._id}`)
      .set('x-test-user-id', user.clerkUserId);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isLiked).toBe(true);
  });

  test('unlikes when toggled again', async () => {
    const blog = await createBlog();
    const user = await createUser({ clerkUserId: 'clerk_like_002' });

    // Like
    await request(app)
      .post(`/api/user/likes/${blog._id}`)
      .set('x-test-user-id', user.clerkUserId);

    // Toggle again — unlike
    const res = await request(app)
      .post(`/api/user/likes/${blog._id}`)
      .set('x-test-user-id', user.clerkUserId);

    expect(res.body.success).toBe(true);
    expect(res.body.data.isLiked).toBe(false);
  });

  test('increments and decrements BlogAnalytics totalLikes', async () => {
    const { models } = await import('../../../database/index.js');
    const blog = await createBlog();
    const user = await createUser({ clerkUserId: 'clerk_like_003' });

    await request(app)
      .post(`/api/user/likes/${blog._id}`)
      .set('x-test-user-id', user.clerkUserId);

    const after = await models.BlogAnalytics.findOne({ blogId: blog._id });
    expect(after.totalLikes).toBe(1);

    await request(app)
      .post(`/api/user/likes/${blog._id}`)
      .set('x-test-user-id', user.clerkUserId);

    const afterUnlike = await models.BlogAnalytics.findOne({ blogId: blog._id });
    expect(afterUnlike.totalLikes).toBe(0);
  });

  test('returns 401 when unauthenticated', async () => {
    const blog = await createBlog();
    const res = await request(app).post(`/api/user/likes/${blog._id}`);
    expect(res.status).toBe(401);
  });
});

describe('GET /api/user/likes', () => {
  test('returns liked blogs for user', async () => {
    const blog = await createBlog({ title: 'Liked Blog' });
    const user = await createUser({ clerkUserId: 'clerk_like_004' });

    await request(app)
      .post(`/api/user/likes/${blog._id}`)
      .set('x-test-user-id', user.clerkUserId);

    const res = await request(app)
      .get('/api/user/likes')
      .set('x-test-user-id', user.clerkUserId);

    expect(res.status).toBe(200);
    expect(res.body.data.likes).toHaveLength(1);
    expect(res.body.data.likes[0].title).toBe('Liked Blog');
  });

  test('returns empty when user has no likes', async () => {
    const user = await createUser({ clerkUserId: 'clerk_like_005' });

    const res = await request(app)
      .get('/api/user/likes')
      .set('x-test-user-id', user.clerkUserId);

    expect(res.status).toBe(200);
    expect(res.body.data.likes).toHaveLength(0);
  });
});
