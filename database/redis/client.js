import Redis from 'ioredis';

let redis = null;

export function getRedis(opts = {}) {
  if (!redis) {
    const url = opts.url || process.env.REDIS_URL || 'redis://localhost:6379';
    redis = new Redis(url, {
      family: 0,
      maxRetriesPerRequest: null,
    });
  }
  return redis;
}
