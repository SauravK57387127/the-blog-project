import request from 'supertest';
import { createApp } from '../../../apps/backend/src/app.js';
import {
    setupTestDB,
    clearTestDB,
    teardownTestDB,
} from '../../helpers/dbSetup.js';
import { generateUnsubscribeToken } from '../../../apps/backend/src/services/public/newsletter.service.js';

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

describe('POST /api/public/newsletter/subscribe', () => {
    test('subscribes a new email successfully', async () => {
        const res = await request(app)
            .post('/api/public/newsletter/subscribe')
            .send({ email: 'test@example.com', source: 'homepage' });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe('test@example.com');
        expect(res.body.data.isNew).toBe(true);
    });

    test('returns already subscribed for duplicate email', async () => {
        await request(app)
            .post('/api/public/newsletter/subscribe')
            .send({ email: 'twice@example.com' });

        const res = await request(app)
            .post('/api/public/newsletter/subscribe')
            .send({ email: 'twice@example.com' });

        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Already subscribed');
        expect(res.body.data.isNew).toBe(false);
    });

    test('reactivates previously unsubscribed email', async () => {
        const { models } = await import('../../../database/index.js');

        // Subscribe then manually deactivate
        await request(app)
            .post('/api/public/newsletter/subscribe')
            .send({ email: 'returning@example.com' });

        await models.Subscriber.findOneAndUpdate(
            { email: 'returning@example.com' },
            { isActive: false, unsubscribedAt: new Date() },
        );

        // Re-subscribe
        const res = await request(app)
            .post('/api/public/newsletter/subscribe')
            .send({ email: 'returning@example.com' });

        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Subscribed successfully');
        expect(res.body.data.isNew).toBe(false);
    });
});

describe('GET /api/public/newsletter/unsubscribe/:token', () => {
    test('unsubscribes via valid token', async () => {
        await request(app)
            .post('/api/public/newsletter/subscribe')
            .send({ email: 'unsub@example.com' });

        const token = generateUnsubscribeToken('unsub@example.com');

        const res = await request(app).get(
            `/api/public/newsletter/unsubscribe/${token}`,
        );

        expect(res.status).toBe(200);
        expect(res.text).toContain('unsubscribed from our newsletter');
    });

    test('returns 400 for invalid token', async () => {
        const res = await request(app).get(
            '/api/public/newsletter/unsubscribe/invalidtoken123',
        );

        expect(res.status).toBe(400);
        expect(res.text).toContain('Invalid unsubscribe link');
    });

    test('handles already unsubscribed gracefully', async () => {
        await request(app)
            .post('/api/public/newsletter/subscribe')
            .send({ email: 'already@example.com' });

        const token = generateUnsubscribeToken('already@example.com');

        await request(app).get(`/api/public/newsletter/unsubscribe/${token}`);

        const res = await request(app).get(
            `/api/public/newsletter/unsubscribe/${token}`,
        );

        expect(res.status).toBe(200);
        expect(res.text).toContain('already unsubscribed');
    });
});
