import { Router } from 'express';
import NotificationController from '../../controllers/user/notification.controller.js';

const router = Router();

/**
 * GET /api/user/notifications?page=1&limit=10
 * Get user notifications with pagination
 */
router.get('/', NotificationController.getNotifications);

/**
 * POST /api/user/notifications/:id/read
 * Mark single notification as read
 */
router.post('/:id/read', NotificationController.markAsRead);

/**
 * POST /api/user/notifications/read-all
 * Mark all notifications as read
 */
router.post('/read-all', NotificationController.markAllAsRead);

export default router;
