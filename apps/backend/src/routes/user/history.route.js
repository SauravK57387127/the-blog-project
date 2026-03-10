import { Router } from 'express';
import HistoryController from '../../controllers/user/history.controller.js';

const router = Router();

/**
 * GET /api/user/history?page=1&limit=10
 * Get user's reading history
 */
router.get('/', HistoryController.getHistory);

export default router;
