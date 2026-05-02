import request from 'supertest';
import { createApp } from '../../../apps/backend/src/app.js';
import { setupTestDB, clearTestDB, teardownTestDB } from '../../helpers/dbSetup.js';
import { createBlog } from '../../fixtures/factories/blog.factory.js';
import { createUser } from '../../fixtures/factories/user.factory.js';
import { createComment } from '../../fixtures/factories/comment.factory.js';

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

describe('GET /api/public/comments/:blogId', () => {
  test('returns empty comments when none exist', async () => {
    const blog = await createBlog();

    const res = await request(app)
      .get(`/api/public/comments/${blog._id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.comments).toHaveLength(0);
    expect(res.body.data.pagination.totalComments).toBe(0);
  });

  test('returns top-level comments for a blog', async () => {
    const blog = await createBlog();
    const user = await createUser();

    await createComment(blog._id, user._id, { content: 'First comment' });
    await createComment(blog._id, user._id, { content: 'Second comment' });

    const res = await request(app)
      .get(`/api/public/comments/${blog._id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.comments).toHaveLength(2);
    expect(res.body.data.pagination.totalComments).toBe(2);
  });

  test('returns nested replies under parent comment', async () => {
    const blog = await createBlog();
    const user = await createUser();

    const parent = await createComment(blog._id, user._id, {
      content: 'Parent comment',
    });
    await createComment(blog._id, user._id, {
      content: 'Reply to parent',
      parentId: parent._id,
    });

    const res = await request(app)
      .get(`/api/public/comments/${blog._id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.comments).toHaveLength(1); // only top-level
    expect(res.body.data.comments[0].replies).toHaveLength(1); // reply nested
    expect(res.body.data.comments[0].replies[0].content).toBe('Reply to parent');
  });

  test('paginates top-level comments', async () => {
    const blog = await createBlog();
    const user = await createUser();

    await Promise.all([
      createComment(blog._id, user._id, { content: 'Comment 1' }),
      createComment(blog._id, user._id, { content: 'Comment 2' }),
      createComment(blog._id, user._id, { content: 'Comment 3' }),
    ]);

    const res = await request(app)
      .get(`/api/public/comments/${blog._id}`)
      .query({ page: 1, limit: 2 });

    expect(res.status).toBe(200);
    expect(res.body.data.comments).toHaveLength(2);
    expect(res.body.data.pagination.totalComments).toBe(3);
    expect(res.body.data.pagination.hasMore).toBe(true);
  });
});
