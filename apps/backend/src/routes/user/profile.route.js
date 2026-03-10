import { Router } from 'express';
import ProfileController from '../../controllers/user/profile.controller.js';

const router = Router();

/**
 * GET /api/user/profile
 * Get current user profile
 */
router.get('/', ProfileController.getProfile);

export default router;
