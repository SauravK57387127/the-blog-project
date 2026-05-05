import { cache } from '../utils/cache.js';
import { logger } from '../../../../packages/logger/index.js';
import { config } from '@theblogproj/config';

/**
 * Cache middleware for GET requests
 * Usage: router.get('/blogs', cacheMiddleware(300), controller)
 */
export function cacheMiddleware(ttlSeconds = 300) {
    return async (req, res, next) => {
        if (!config.flags.enableCache) return next();
        // Only cache GET requests
        if (!config.flags.enableCache) {
            logger.warn('Cache disabled — skipping cache middleware');
            return next();
        }

        // Generate cache key from route + query params
        const cacheKey = `cache:${req.path}:${JSON.stringify(req.query)}`;

        try {
            // Try to get from cache
            const cached = await cache.get(cacheKey);

            if (cached) {
                logger.debug({ key: cacheKey }, 'Serving from cache');
                return res.json(cached);
            }

            // Cache miss - continue to controller
            // Override res.json to cache the response
            const originalJson = res.json.bind(res);
            res.json = function (data) {
                // Cache successful responses only
                if (res.statusCode === 200) {
                    cache
                        .set(cacheKey, data, ttlSeconds)
                        .catch((err) =>
                            logger.error(
                                { error: err.message },
                                'Failed to cache response',
                            ),
                        );
                }
                return originalJson(data);
            };

            next();
        } catch (error) {
            logger.error({ error: error.message }, 'Cache middleware error');
            next(); // Fail open - continue without cache
        }
    };
}

/**
 * Cache invalidation middleware
 * Usage: router.post('/blogs', invalidateCache('cache:blogs:*'), controller)
 */
export function invalidateCache(pattern) {
    return async (req, res, next) => {
        // Continue to controller first
        next();

        if (!config.flags.enableCache) {
            logger.warn('Cache disabled — skipping invalidation');
            return;
        }

        // Invalidate cache after response (non-blocking)
        res.on('finish', async () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                try {
                    await cache.delPattern(pattern);
                    logger.info({ pattern }, 'Cache invalidated');
                } catch (error) {
                    logger.error(
                        { error: error.message },
                        'Cache invalidation error',
                    );
                }
            }
        });
    };
}
