import { getRedis } from '../../../../database/redis/redisClient.js';
import { logger } from '../../../../packages/logger/index.js';




export default async function loadRedis() {
    try {
        const redis = getRedis();
        await redis.ping();
        logger.info('🟢 Redis connected\n\n');
        return redis;
    } catch (err) {
        logger.warn({ err }, '⚠️ Redis unavailable – running in degraded mode\n\n');
        return null;
    }
}

