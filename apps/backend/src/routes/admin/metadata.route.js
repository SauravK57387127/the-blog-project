import { Router } from 'express';
import MetadataController from '../../controllers/admin/metadata.controller.js';


const router = Router();

// /api/admin/metadata
router.get('/', MetadataController.get);
router.put('/', MetadataController.update);

export default router;
