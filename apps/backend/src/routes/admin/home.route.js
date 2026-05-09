import { Router } from 'express';
import AdminHomeController from '../../controllers/admin/home.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

/**
 * GET /api/admin/home
 * Get dashboard overview stats
 */
router.get('/', asyncHandler(AdminHomeController.getDashboard));

export default router;
