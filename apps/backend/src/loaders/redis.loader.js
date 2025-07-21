// apps/backend/src/loaders/redis.js
import redis from '../../../../database/redis/redisClient.js';
import { logger } from '../../../../packages/logger/index.js';


export default async function loadRedis() {
  try {
    await redis.ping();                       // health‑check
    logger.info('🟢 Redis connected');
  } catch (err) {
    logger.warn({ err }, 'Redis unavailable – running in degraded mode');
  }
  return redis;                               // same singleton instance
}
