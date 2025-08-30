import Redis from 'ioredis';


let redis = null;

export function getRedis() {
  if (!redis) {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    // redis = new Redis(url + '?family=0');
    redis = new Redis(url, {
      family: 0,
      maxRetriesPerRequest: null, // ✅ required for BullMQ v5
    });
    // console.log(`🟢 Redis initialized: ${url}`);
  }
  return redis;
}
