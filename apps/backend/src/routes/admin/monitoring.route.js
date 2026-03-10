import { Router } from 'express';
import { getRedis } from '../../../../database/index.js';
import { cache } from '../../utils/cache.js';

const router = Router();

/**
 * GET /api/admin/monitoring/cache/stats
 * Get cache statistics
 */
router.get('/cache/stats', async (req, res) => {
  try {
    const redis = getRedis();
    
    const [dbsize, memory] = await Promise.all([
      redis.dbsize(),
      redis.info('memory'),
    ]);

    const memoryStats = memory
      .split('\r\n')
      .filter(line => line.includes('used_memory'))
      .reduce((acc, line) => {
        const [key, value] = line.split(':');
        acc[key] = value;
        return acc;
      }, {});

    res.json({
      success: true,
      data: {
        totalKeys: dbsize,
        memory: memoryStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get cache stats',
      error: error.message,
    });
  }
});

/**
 * DELETE /api/admin/monitoring/cache
 * Flush all cache (dangerous!)
 */
router.delete('/cache', async (req, res) => {
  try {
    await cache.flush();
    res.json({ success: true, message: 'Cache flushed' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to flush cache',
      error: error.message,
    });
  }
});


router.get('/rate-limits/:key', async (req, res) => {
  const redis = getRedis();
  const { key } = req.params;
  
  const fullKey = `rl:*:${key}`;
  const keys = await redis.keys(fullKey);
  
  const results = await Promise.all(
    keys.map(async (k) => {
      const ttl = await redis.ttl(k);
      const value = await redis.get(k);
      return { key: k, remaining: value, ttl };
    })
  );
  
  res.json({ results });
});

export default router;
