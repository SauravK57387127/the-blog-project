import { asyncHandler } from '../../utils/asyncHandler.js';
// import CacheService from '../../services/admin/cache.service.js';

export default {
  flushRedis: asyncHandler(async (req, res) => {
    // await CacheService.flush();
    res.json({ msg: 'redis flushed (stub)' });
  }),
};

