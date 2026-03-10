import { models } from '../../../../../database/index.js';
import { logger } from '../../../../../packages/logger/index.js';

const { Notification, User, Blog } = models;

export default {
  /**
   * Get user notifications with pagination
   */
  getNotifications: async ({ userId, page, limit }) => {
    try {
      const user = await User.findOne({ clerkUserId: userId });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          data: null,
        };
      }

      const skip = (page - 1) * limit;

      const [notifications, totalCount, unreadCount] = await Promise.all([
        Notification.find({ recipientId: user._id })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('actorId', 'name profileImage')
          .populate('blogId', 'title slug')
          .lean(),
        Notification.countDocuments({ recipientId: user._id }),
        Notification.countDocuments({ recipientId: user._id, isRead: false }),
      ]);

      // Format notifications
      const formattedNotifications = notifications.map(notif => ({
        _id: notif._id,
        type: notif.type,
        actor: {
          name: notif.actorId?.name || 'Unknown User',
          profileImage: notif.actorId?.profileImage || null,
        },
        blogTitle: notif.blogId?.title || 'Untitled',
        blogSlug: notif.blogId?.slug || '',
        commentPreview: notif.commentPreview,
        isRead: notif.isRead,
        createdAt: notif.createdAt,
      }));

      logger.info('Notifications fetched', { userId, count: notifications.length });

      return {
        success: true,
        message: 'Notifications fetched',
        data: {
          notifications: formattedNotifications,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalNotifications: totalCount,
            unreadCount,
            hasMore: skip + notifications.length < totalCount,
          },
        },
      };
    } catch (error) {
      logger.error('Get notifications failed', { error: error.message, userId });
      return {
        success: false,
        message: 'Failed to fetch notifications',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Mark single notification as read
   */
  markAsRead: async (clerkUserId, notificationId) => {
    try {
      const user = await User.findOne({ clerkUserId });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          data: null,
        };
      }

      const notification = await Notification.findById(notificationId);

      if (!notification) {
        return {
          success: false,
          message: 'Notification not found',
          data: null,
        };
      }

      // Verify ownership
      if (notification.recipientId.toString() !== user._id.toString()) {
        return {
          success: false,
          message: 'Not authorized',
          data: null,
        };
      }

      notification.isRead = true;
      notification.readAt = new Date();
      await notification.save();

      logger.info('Notification marked as read', { notificationId });

      return {
        success: true,
        message: 'Marked as read',
        data: { notificationId },
      };
    } catch (error) {
      logger.error('Mark as read failed', { error: error.message, notificationId });
      return {
        success: false,
        message: 'Failed to mark as read',
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (clerkUserId) => {
    try {
      const user = await User.findOne({ clerkUserId });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          data: null,
        };
      }

      const result = await Notification.updateMany(
        { recipientId: user._id, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      logger.info('All notifications marked as read', { userId: clerkUserId, count: result.modifiedCount });

      return {
        success: true,
        message: 'All marked as read',
        data: { markedCount: result.modifiedCount },
      };
    } catch (error) {
      logger.error('Mark all as read failed', { error: error.message, userId: clerkUserId });
      return {
        success: false,
        message: 'Failed to mark all as read',
        data: null,
        error: error.message,
      };
    }
  },
};
