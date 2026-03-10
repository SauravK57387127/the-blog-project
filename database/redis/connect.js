import { getRedis } from './client.js';
import { config } from '@theblogproj/config';

export async function connectRedis(urlOverride = null) {
  try {
    const url = urlOverride || config.redisUrl;
    const redis = getRedis({ url });
    
    await redis.ping();
    console.log('✅ Redis connected');
    return redis;
  } catch (err) {
    console.warn('⚠️  Redis unavailable – running in degraded mode:', err.message);
    return null;
  }
}

export async function disconnectRedis() {
  const redis = getRedis();
  if (redis) {
    await redis.quit();
    console.log('✅ Redis disconnected');
  }
}

export { getRedis };
