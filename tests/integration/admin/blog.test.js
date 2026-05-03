import request from 'supertest';
import { createApp } from '../../../apps/backend/src/app.js';
import { setupTestDB, clearTestDB, teardownTestDB } from '../../helpers/dbSetup.js';
import { createBlog } from '../../fixtures/factories/blog.factory.js';
import { createAdmin } from '../../fixtures/factories/admin.factory.js';

let app;
let accessToken;

async function loginAsAdmin() {
  await createAdmin({ username: 'blogadmin', password: 'TestPassword123!' });
  const res = await request(app)
    .post('/api/admin/auth/login')
    .send({ username: 'blogadmin', password: 'TestPassword123!' });
  return res.body.data.accessToken;
}

beforeAll(async () => {
  await setupTestDB();
  app = createApp();
});

beforeEach(async () => {
  accessToken = await loginAsAdmin();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await teardownTestDB();  
});

describe('POST /api/admin/blogs — create', () => {
  test('creates a new blog as draft', async () => {
    const res = await request(app)
      .post('/api/admin/blogs')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'My New Blog Post' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('My New Blog Post');
    expect(res.body.data.draftSlug).toBeDefined();
  });

  test('returns 401 without token', async () => {
    const res = await request(app)
      .post('/api/admin/blogs')
      .send({ title: 'Unauthorized Blog' });

    expect(res.status).toBe(401);
  });
});

describe('POST /api/admin/blogs/:id/publish', () => {
  test('publishes a draft blog', async () => {
    const blog = await createBlog({ status: 'draft' });

    const res = await request(app)
      .post(`/api/admin/blogs/${blog._id}/publish`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('published');
    expect(res.body.data.publishedAt).toBeDefined();
  });

  test('returns already published for published blog', async () => {
    const blog = await createBlog({ status: 'published' });

    const res = await request(app)
      .post(`/api/admin/blogs/${blog._id}/publish`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Blog already published');
  });
});

describe('POST /api/admin/blogs/:id/schedule', () => {
  test('schedules a blog for future publication', async () => {
    const blog = await createBlog({ status: 'draft' });
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const res = await request(app)
      .post(`/api/admin/blogs/${blog._id}/schedule`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ scheduledAt: futureDate });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('scheduled');
    expect(res.body.data.scheduledAt).toBeDefined();
  });

  test('rejects past date for scheduling', async () => {
    const blog = await createBlog({ status: 'draft' });
    const pastDate = new Date(Date.now() - 1000).toISOString();

    const res = await request(app)
      .post(`/api/admin/blogs/${blog._id}/schedule`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ scheduledAt: pastDate });

    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Scheduled time must be in the future');
  });
});

describe('POST /api/admin/blogs/:id/unpublish', () => {
  test('unpublishes a published blog back to draft', async () => {
    const blog = await createBlog({ status: 'published' });

    const res = await request(app)
      .post(`/api/admin/blogs/${blog._id}/unpublish`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('draft');
    expect(res.body.data.publishedAt).toBeNull();
  });
});

describe('DELETE /api/admin/blogs/:id', () => {
  test('deletes a blog and its associated data', async () => {
    const { models } = await import('../../../database/index.js');
    const blog = await createBlog();

    await models.BlogAnalytics.create({ blogId: blog._id });

    const res = await request(app)
      .delete(`/api/admin/blogs/${blog._id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const deleted = await models.Blog.findById(blog._id);
    expect(deleted).toBeNull();

    const analytics = await models.BlogAnalytics.findOne({ blogId: blog._id });
    expect(analytics).toBeNull();
  });

  test('returns 404 for non-existent blog', async () => {
    const res = await request(app)
      .delete('/api/admin/blogs/000000000000000000000001')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Blog not found');
  });
});

describe('GET /api/admin/blogs/drafts', () => {
  test('returns only draft blogs', async () => {
    await createBlog({ status: 'draft', title: 'My Draft' });
    await createBlog({ status: 'published', title: 'Published' });

    const res = await request(app)
      .get('/api/admin/blogs/drafts')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.drafts).toHaveLength(1);
    expect(res.body.data.drafts[0].title).toBe('My Draft');
  });
});
