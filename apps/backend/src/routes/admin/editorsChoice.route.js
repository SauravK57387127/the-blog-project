import { Router } from 'express';
import EditorsChoiceController from '../../controllers/admin/editorsChoice.controller.js';

const router = Router();

/**
 * GET /api/admin/editors-choice
 * Get current editor's picks (max 4)
 */
router.get('/', EditorsChoiceController.getCurrentPicks);

/**
 * POST /api/admin/editors-choice
 * Add blog to editor's choice
 * Body: { blogId, annotation, pickOrder }
 */
router.post('/', EditorsChoiceController.addPick);

/**
 * PUT /api/admin/editors-choice/:blogId
 * Update pick annotation/order
 * Body: { annotation?, pickOrder? }
 */
router.put('/:blogId', EditorsChoiceController.updatePick);

/**
 * DELETE /api/admin/editors-choice/:blogId
 * Remove from editor's choice
 */
router.delete('/:blogId', EditorsChoiceController.removePick);

/**
 * PUT /api/admin/editors-choice/reorder
 * Reorder all picks at once
 * Body: { blogIds: ['id1', 'id2', 'id3', 'id4'] }
 */
router.put('/reorder', EditorsChoiceController.reorderPicks);

export default router;
