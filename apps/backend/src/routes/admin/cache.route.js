import { Router } from 'express';
import CacheController from '../../controllers/admin/cache.controller.js';


const router = Router();

// /api/admin/cache/flush
router.post('/flush', CacheController.flushRedis);
 
export default router;
