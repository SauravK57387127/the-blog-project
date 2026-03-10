import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';
import crypto from 'crypto';

const { Subscriber, User } = models;

/**
 * Generate unsubscribe token (signed email)
 */
function generateUnsubscribeToken(email) {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const hash = crypto
    .createHmac('sha256', secret)
    .update(email)
    .digest('hex');
  
  return Buffer.from(`${email}:${hash}`).toString('base64');
}

/**
 * Verify unsubscribe token
 */
function verifyUnsubscribeToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, hash] = decoded.split(':');
    
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(email)
      .digest('hex');
    
    if (hash === expectedHash) {
      return email;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export default {
  /**
   * Subscribe to newsletter
   * Creates new subscriber or reactivates existing
   */
  subscribe: async ({ email, source, ipAddress }) => {
    try {
      // Check if subscriber exists
      let subscriber = await Subscriber.findOne({ email });

      if (subscriber) {
        // Reactivate if unsubscribed
        if (!subscriber.isActive) {
          subscriber.isActive = true;
          subscriber.unsubscribedAt = null;
          subscriber.subscribedAt = new Date();
          await subscriber.save();

          logger.info('Subscriber reactivated', { email });

          return {
            success: true,
            message: 'Subscribed successfully',
            data: { email, isNew: false },
          };
        }

        // Already subscribed
        return {
          success: true,
          message: 'Already subscribed',
          data: { email, isNew: false },
        };
      }

      // Create new subscriber
      subscriber = await Subscriber.create({
        email,
        isActive: true,
        subscribedAt: new Date(),
        source,
        ipAddress,
      });

      logger.info('New subscriber created', { email, source });

      return {
        success: true,
        message: 'Subscribed successfully',
        data: { email, isNew: true },
      };
    } catch (error) {
      logger.error('Subscribe failed', { error: error.message, email });
      return {
        success: false,
        message: 'Failed to subscribe',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Unsubscribe via email link token
   */
  unsubscribeByToken: async (token) => {
    try {
      const email = verifyUnsubscribeToken(token);

      if (!email) {
        return {
          success: false,
          message: 'Invalid unsubscribe link',
          data: null,
        };
      }

      const subscriber = await Subscriber.findOne({ email });

      if (!subscriber) {
        return {
          success: false,
          message: 'Subscriber not found',
          data: null,
        };
      }

      if (!subscriber.isActive) {
        return {
          success: true,
          message: 'Already unsubscribed',
          data: { email },
        };
      }

      subscriber.isActive = false;
      subscriber.unsubscribedAt = new Date();
      await subscriber.save();

      logger.info('Subscriber unsubscribed via token', { email });

      return {
        success: true,
        message: 'Unsubscribed successfully',
        data: { email },
      };
    } catch (error) {
      logger.error('Unsubscribe by token failed', { error: error.message });
      return {
        success: false,
        message: 'Failed to unsubscribe',
        data: null,
        error: error.message,
      };
    }
  },
};

// Export token generator for email templates
export { generateUnsubscribeToken };
