import { Router } from 'express';
import { Webhook } from 'svix';
import ClerkWebhookService from '../../services/webhooks/clerk.service.js';
import { logger } from '../../../../../packages/logger/index.js';

const router = Router();

/**
 * POST /api/webhooks/clerk
 * Clerk webhook handler for user events
 */
router.post('/', async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    logger.error('Clerk webhook secret not configured');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  // Get headers
  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Missing svix headers' });
  }

  // Get raw body (important for signature verification)
  const payload = req.body;

  try {
    // Verify webhook signature
    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });

    // Handle event
    const eventType = evt.type;
    
    logger.info('Clerk webhook received', { eventType, userId: evt.data.id });

    switch (eventType) {
      case 'user.created':
        await ClerkWebhookService.handleUserCreated(evt.data);
        break;

      case 'user.updated':
        await ClerkWebhookService.handleUserUpdated(evt.data);
        break;

      case 'user.deleted':
        await ClerkWebhookService.handleUserDeleted(evt.data);
        break;

      default:
        logger.debug('Unhandled webhook event', { eventType });
    }

    return res.status(200).json({ message: 'Webhook processed' });
  } catch (error) {
    logger.error('Clerk webhook verification failed', { error: error.message });
    return res.status(400).json({ error: 'Webhook verification failed' });
  }
});

export default router;
