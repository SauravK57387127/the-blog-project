import { Router } from 'express';
import { captureException } from '../../utils/sentry.js';
import * as Sentry from '@sentry/node';

const router = Router();

// Test Sentry (only in dev/staging)
router.get('/sentry-test', (req, res) => {
    try {
        Sentry.logger.info('User triggered test log', { action: 'test_log' });
        throw new Error('This is a test error for Sentry!');
    } catch (error) {
        captureException(error, {
            tags: { test: true },
            extra: { endpoint: '/admin/test/sentry-test' },
        });
        res.json({ message: 'Test error sent to Sentry' });
    }
});

export default router;
