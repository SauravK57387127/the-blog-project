import request from 'supertest';
import { createApp } from '../../../apps/backend/src/app.js';
import { setupTestDB, clearTestDB, teardownTestDB } from '../../helpers/dbSetup.js';
import { createBlog } from '../../fixtures/factories/blog.factory.js';
import { createBlogAnalytics } from '../../fixtures/factories/blogAnalytics.factory.js';

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

// ─── List Blogs ───────────────────────────────────────────────
describe('GET /api/public/blogs', () => {
  test('returns empty list when no blogs exist', async () => {
    const res = await request(app).get('/api/public/blogs');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.blogs).toHaveLength(0);
    expect(res.body.data.pagination.totalBlogs).toBe(0);
  });

  test('returns published blogs only', async () => {
    await createBlog({ title: 'Published', status: 'published' });
    await createBlog({ title: 'Draft', status: 'draft' });

    const res = await request(app).get('/api/public/blogs');

    expect(res.status).toBe(200);
    expect(res.body.data.blogs).toHaveLength(1);
    expect(res.body.data.blogs[0].title).toBe('Published');
  });

  test('filters by category', async () => {
    await createBlog({ category: 'tech-deep-dive' });
    await createBlog({ category: 'life-and-growth' });

    const res = await request(app)
      .get('/api/public/blogs')
      .query({ category: 'tech-deep-dive' });

    expect(res.status).toBe(200);
    expect(res.body.data.blogs).toHaveLength(1);
    expect(res.body.data.blogs[0].category).toBe('tech-deep-dive');
  });

  test('paginates correctly', async () => {
    await Promise.all([
      createBlog({ title: 'Blog 1' }),
      createBlog({ title: 'Blog 2' }),
      createBlog({ title: 'Blog 3' }),
    ]);

    const res = await request(app)
      .get('/api/public/blogs')
      .query({ page: 1, limit: 2 });

    expect(res.status).toBe(200);
    expect(res.body.data.blogs).toHaveLength(2);
    expect(res.body.data.pagination.totalBlogs).toBe(3);
    expect(res.body.data.pagination.hasMore).toBe(true);
  });
});

// ─── Get Blog By Slug ─────────────────────────────────────────
describe('GET /api/public/blogs/:slug', () => {
  test('returns blog with analytics when found', async () => {
    const blog = await createBlog({ title: 'Hello World' });
    await createBlogAnalytics(blog._id, { totalViews: 42 });

    const res = await request(app).get(`/api/public/blogs/${blog.slug}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe(blog.slug);
    expect(res.body.data.totalViews).toBe(42);
  });

  test('returns 404 when blog not found', async () => {
    const res = await request(app).get('/api/public/blogs/non-existent-slug');

    expect(res.status).toBe(404); // service returns success:false, not HTTP 404
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Blog not found');
  });

  test('does not return draft blogs', async () => {
    const blog = await createBlog({ status: 'draft' });

    const res = await request(app).get(`/api/public/blogs/${blog.slug}`);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Blog not found');
  });
});

// ─── Search ───────────────────────────────────────────────────
describe('GET /api/public/blogs/search', () => {
  test('returns blogs matching title query', async () => {
    await createBlog({ title: 'Learning JavaScript deeply' });
    await createBlog({ title: 'Python for beginners' });

    const res = await request(app)
      .get('/api/public/blogs/search')
      .query({ q: 'JavaScript' });

    expect(res.status).toBe(200);
    expect(res.body.data.blogs).toHaveLength(1);
    expect(res.body.data.blogs[0].title).toContain('JavaScript');
  });

  test('returns empty when no match', async () => {
    await createBlog({ title: 'Something else' });

    const res = await request(app)
      .get('/api/public/blogs/search')
      .query({ q: 'zzznomatch' });

    expect(res.status).toBe(200);
    expect(res.body.data.blogs).toHaveLength(0);
  });

  test('filters by tags', async () => {
    await createBlog({ tags: ['javascript', 'react'] });
    await createBlog({ tags: ['python'] });

    const res = await request(app)
      .get('/api/public/blogs/search')
      .query({ tags: 'javascript' });

    expect(res.status).toBe(200);
    expect(res.body.data.blogs).toHaveLength(1);
  });
});

// ─── Related Blogs ────────────────────────────────────────────
describe('GET /api/public/blogs/:slug/related', () => {
  test('returns blogs with overlapping tags', async () => {
    const main = await createBlog({ 
      title: 'Main Blog', 
      tags: ['javascript'] 
    });
    await createBlog({ 
      title: 'Related Blog', 
      tags: ['javascript', 'react'] 
    });
    await createBlog({ 
      title: 'Unrelated Blog', 
      tags: ['python'] 
    });

    const res = await request(app)
      .get(`/api/public/blogs/${main.slug}/related`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('Related Blog');
  });

  test('returns empty for blog with no matching tags', async () => {
    const main = await createBlog({ tags: ['uniquetag123'] });

    const res = await request(app)
      .get(`/api/public/blogs/${main.slug}/related`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });
});
