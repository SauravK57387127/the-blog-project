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

describe('POST /api/user/comments/:blogId', () => {
  test('adds a comment to a published blog', async () => {
    const blog = await createBlog();
    const user = await createUser({ clerkUserId: 'clerk_test_001' });

    const res = await request(app)
      .post(`/api/user/comments/${blog._id}`)
      .set('x-test-user-id', user.clerkUserId)
      .send({ content: 'Great post!' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.content).toBe('Great post!');
  });

  test('adds a reply to an existing comment', async () => {
    const blog = await createBlog();
    const user = await createUser({ clerkUserId: 'clerk_test_002' });
    const parent = await createComment(blog._id, user._id);

    const res = await request(app)
      .post(`/api/user/comments/${blog._id}`)
      .set('x-test-user-id', user.clerkUserId)
      .send({ content: 'My reply', parentId: parent._id });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.parentId).toBe(parent._id.toString());
  });

  test('returns 401 when unauthenticated', async () => {
    const blog = await createBlog();

    const res = await request(app)
      .post(`/api/user/comments/${blog._id}`)
      .send({ content: 'No auth' });

    expect(res.status).toBe(401);
  });

  test('fails for unpublished blog', async () => {
    const blog = await createBlog({ status: 'draft' });
    const user = await createUser({ clerkUserId: 'clerk_test_003' });

    const res = await request(app)
      .post(`/api/user/comments/${blog._id}`)
      .set('x-test-user-id', user.clerkUserId)
      .send({ content: 'Comment on draft' });

    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Blog not found or not published');
  });
});

describe('PUT /api/user/comments/:commentId', () => {
  test('updates own comment', async () => {
    const blog = await createBlog();
    const user = await createUser({ clerkUserId: 'clerk_test_004' });
    const comment = await createComment(blog._id, user._id, {
      content: 'Original content',
    });

    const res = await request(app)
      .put(`/api/user/comments/${comment._id}`)
      .set('x-test-user-id', user.clerkUserId)
      .send({ content: 'Updated content' });

    expect(res.status).toBe(200);
    expect(res.body.data.content).toBe('Updated content');
  });

  test('cannot update another user comment', async () => {
    const blog = await createBlog();
    const owner = await createUser({ clerkUserId: 'clerk_test_005' });
    const other = await createUser({ clerkUserId: 'clerk_test_006' });
    const comment = await createComment(blog._id, owner._id);

    const res = await request(app)
      .put(`/api/user/comments/${comment._id}`)
      .set('x-test-user-id', other.clerkUserId)
      .send({ content: 'Hijacked content' });

    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Not authorized to edit this comment');
  });
});

describe('DELETE /api/user/comments/:commentId', () => {
  test('deletes own comment and its replies', async () => {
    const { models } = await import('../../../database/index.js');
    const blog = await createBlog();
    const user = await createUser({ clerkUserId: 'clerk_test_007' });
    const parent = await createComment(blog._id, user._id);
    await createComment(blog._id, user._id, { parentId: parent._id });

    const res = await request(app)
      .delete(`/api/user/comments/${parent._id}`)
      .set('x-test-user-id', user.clerkUserId);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Replies also deleted
    const replies = await models.Comment.find({ parentId: parent._id });
    expect(replies).toHaveLength(0);
  });

  test('cannot delete another user comment', async () => {
    const blog = await createBlog();
    const owner = await createUser({ clerkUserId: 'clerk_test_008' });
    const other = await createUser({ clerkUserId: 'clerk_test_009' });
    const comment = await createComment(blog._id, owner._id);

    const res = await request(app)
      .delete(`/api/user/comments/${comment._id}`)
      .set('x-test-user-id', other.clerkUserId);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Not authorized to delete this comment');
  });
});

describe('GET /api/user/comments/my', () => {
  test('returns comments for authenticated user', async () => {
    const blog = await createBlog();
    const user = await createUser({ clerkUserId: 'clerk_test_010' });
    await createComment(blog._id, user._id, { content: 'My comment' });

    const res = await request(app)
      .get('/api/user/comments/my')
      .set('x-test-user-id', user.clerkUserId);

    expect(res.status).toBe(200);
    expect(res.body.data.comments).toHaveLength(1);
    expect(res.body.data.comments[0].content).toBe('My comment');
  });

  test('returns 401 when unauthenticated', async () => {
    const res = await request(app).get('/api/user/comments/my');
    expect(res.status).toBe(401);
  });
});
