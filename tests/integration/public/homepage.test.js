import request from 'supertest';
import { createApp } from '../../../apps/backend/src/app.js';
import { setupTestDB, clearTestDB, teardownTestDB } from '../../helpers/dbSetup.js';
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

describe('GET /api/public/homepage', () => {
  test('returns 200 with correct response shape when no data exists', async () => {
    const res = await request(app).get('/api/public/homepage');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      hero: null,
      recentHighlights: expect.any(Array),
      trending: expect.any(Array),
      mostRead: expect.any(Array),
      editorsChoice: expect.any(Array),
    });
  });

  test('returns hero as most recent published blog', async () => {
    const blog = await createBlog({ title: 'My Hero Blog' });

    const res = await request(app).get('/api/public/homepage');

    expect(res.status).toBe(200);
    expect(res.body.data.hero.slug).toBe(blog.slug);
    expect(res.body.data.hero.title).toBe('My Hero Blog');
  });

  test('returns empty arrays when no blogs exist', async () => {
    const res = await request(app).get('/api/public/homepage');
    expect(res.status).toBe(200);
    expect(res.body.data.hero).toBeNull();
    expect(res.body.data.recentHighlights).toHaveLength(0);
    expect(res.body.data.editorsChoice).toHaveLength(0);
  });
});
