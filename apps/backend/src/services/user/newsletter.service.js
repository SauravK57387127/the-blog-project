import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';

const { Subscriber, User } = models;

export default {
  /**
   * Get newsletter subscription status
   */
  getStatus: async (clerkUserId) => {
    try {
      const user = await User.findOne({ clerkUserId });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          data: { isSubscribed: false },
        };
      }

      const subscriber = await Subscriber.findOne({
        $or: [
          { userId: user._id },
          { email: user.email },
        ],
      }).lean();

      const isSubscribed = subscriber ? subscriber.isActive : false;

      logger.info('Newsletter status checked', { clerkUserId, isSubscribed });

      return {
        success: true,
        message: 'Status fetched',
        data: { isSubscribed },
      };
    } catch (error) {
      logger.error('Get newsletter status failed', { error: error.message, clerkUserId });
      return {
        success: false,
        message: 'Failed to get status',
        data: { isSubscribed: false },
        error: error.message,
      };
    }
  },

  /**
   * Unsubscribe authenticated user
   */
  unsubscribe: async (clerkUserId) => {
    try {
      const user = await User.findOne({ clerkUserId });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          data: null,
        };
      }

      const subscriber = await Subscriber.findOne({
        $or: [
          { userId: user._id },
          { email: user.email },
        ],
      });

      if (!subscriber) {
        return {
          success: false,
          message: 'Not subscribed',
          data: null,
        };
      }

      subscriber.isActive = false;
      subscriber.unsubscribedAt = new Date();
      await subscriber.save();

      logger.info('User unsubscribed', { clerkUserId });

      return {
        success: true,
        message: 'Unsubscribed successfully',
        data: { email: subscriber.email },
      };
    } catch (error) {
      logger.error('Unsubscribe failed', { error: error.message, clerkUserId });
      return {
        success: false,
        message: 'Failed to unsubscribe',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Resubscribe authenticated user
   */
  resubscribe: async (clerkUserId) => {
    try {
      const user = await User.findOne({ clerkUserId });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          data: null,
        };
      }

      let subscriber = await Subscriber.findOne({
        $or: [
          { userId: user._id },
          { email: user.email },
        ],
      });

      if (!subscriber) {
        // Create new subscriber
        subscriber = await Subscriber.create({
          email: user.email,
          userId: user._id,
          isActive: true,
          subscribedAt: new Date(),
          source: 'user_signup',
        });
      } else {
        subscriber.isActive = true;
        subscriber.unsubscribedAt = null;
        subscriber.subscribedAt = new Date();
        await subscriber.save();
      }

      logger.info('User resubscribed', { clerkUserId });

      return {
        success: true,
        message: 'Subscribed successfully',
        data: { email: subscriber.email },
      };
    } catch (error) {
      logger.error('Resubscribe failed', { error: error.message, clerkUserId });
      return {
        success: false,
        message: 'Failed to resubscribe',
        data: null,
        error: error.message,
      };
    }
  },
};
