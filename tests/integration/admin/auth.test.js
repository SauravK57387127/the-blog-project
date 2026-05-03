import request from 'supertest';
import { createApp } from '../../../apps/backend/src/app.js';
import { setupTestDB, clearTestDB, teardownTestDB } from '../../helpers/dbSetup.js';
import { createAdmin } from '../../fixtures/factories/admin.factory.js';

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

describe('POST /api/admin/auth/login', () => {
  test('logs in with valid credentials', async () => {
    await createAdmin({ username: 'testadmin', password: 'TestPassword123!' });

    const res = await request(app)
      .post('/api/admin/auth/login')
      .send({ username: 'testadmin', password: 'TestPassword123!' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.admin.username).toBe('testadmin');
  });

  test('fails with wrong password', async () => {
    await createAdmin({ username: 'testadmin2', password: 'TestPassword123!' });

    const res = await request(app)
      .post('/api/admin/auth/login')
      .send({ username: 'testadmin2', password: 'WrongPassword!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('fails with non-existent username', async () => {
    const res = await request(app)
      .post('/api/admin/auth/login')
      .send({ username: 'nobody', password: 'SomePassword123!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid credentials');
  });

  test('locks account after 5 failed attempts', async () => {
    await createAdmin({ username: 'locktest', password: 'TestPassword123!' });

    // 5 failed attempts
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/admin/auth/login')
        .send({ username: 'locktest', password: 'WrongPassword!' });
    }

    // 6th attempt — should be locked
    const res = await request(app)
      .post('/api/admin/auth/login')
      .send({ username: 'locktest', password: 'TestPassword123!' });

    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('locked');
  });
});

describe('POST /api/admin/auth/logout', () => {
  test('logs out with valid token', async () => {
    await createAdmin({ username: 'logouttest', password: 'TestPassword123!' });

    const loginRes = await request(app)
      .post('/api/admin/auth/login')
      .send({ username: 'logouttest', password: 'TestPassword123!' });

    const { accessToken } = loginRes.body.data;
    // Extract cookie from login response
    const cookies = loginRes.headers['set-cookie'];

    const res = await request(app)
      .post('/api/admin/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Logged out successfully');
  });

  test('returns 401 without token', async () => {
    const res = await request(app).post('/api/admin/auth/logout');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/admin/auth/me', () => {
  test('returns admin info with valid token', async () => {
    await createAdmin({ username: 'metest', password: 'TestPassword123!' });

    const loginRes = await request(app)
      .post('/api/admin/auth/login')
      .send({ username: 'metest', password: 'TestPassword123!' });

    const { accessToken } = loginRes.body.data;

    const res = await request(app)
      .get('/api/admin/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.admin.username).toBe('metest'); // ← data.admin.username
  });

  test('returns 401 without token', async () => {
    const res = await request(app).get('/api/admin/auth/me');
    expect(res.status).toBe(401);
  });
});
