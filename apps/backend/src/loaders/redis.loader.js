// apps/backend/src/loaders/redis.js
import { getRedis } from '../../../../database/redis/redisClient.js';
import { logger } from '../../../../packages/logger/index.js';


// export default async function loadRedis() {
//   const redis = getRedis();  // Only connects if called
//   try {
//     await redis.ping();  // optional health check
//     console.log('🟢 Redis connected');
//     logger.info('🟢 Redis connected');
//   } catch (err) {
//     console.log("Error occurred:", err);
//     logger.warn({ err }, 'Redis unavailable – running in degraded mode');
//   }
//   return redis;  // same singleton instance
// }



// Modified approach 


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

