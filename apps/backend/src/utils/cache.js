import { getRedis } from '../../../../database/index.js';
import { config } from '@theblogproj/config';
import { logger } from '../../../../packages/logger/index.js';

/**
 * Cache wrapper with fallback
 */
class Cache {
  constructor() {
    this.redis = null;
    this.enabled = config.nodeEnv !== 'test'; // Disable in tests
    
    if (this.enabled) {
      try {
        this.redis = getRedis();
        logger.info('Cache enabled', { environment: config.nodeEnv });
      } catch (error) {
        logger.warn('Redis not available - caching disabled', { error: error.message });
        this.enabled = false;
      }
    }
  }

  /**
   * Get value from cache
   */
  async get(key) {
    if (!this.enabled || !this.redis) return null;

    try {
      const value = await this.redis.get(key);
      if (value) {
        logger.debug({ key }, 'Cache hit');
        return JSON.parse(value);
      }
      logger.debug({ key }, 'Cache miss');
      return null;
    } catch (error) {
      logger.error({ key, error: error.message }, 'Cache get error');
      return null; // Fail gracefully
    }
  }

  /**
   * Set value in cache with TTL
   */
  async set(key, value, ttlSeconds = 3600) {
    if (!this.enabled || !this.redis) return false;

    try {
      await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
      logger.debug({ key, ttl: ttlSeconds }, 'Cache set');
      return true;
    } catch (error) {
      logger.error({ key, error: error.message }, 'Cache set error');
      return false;
    }
  }

  /**
   * Delete specific key
   */
  async del(key) {
    if (!this.enabled || !this.redis) return false;

    try {
      await this.redis.del(key);
      logger.debug({ key }, 'Cache deleted');
      return true;
    } catch (error) {
      logger.error({ key, error: error.message }, 'Cache delete error');
      return false;
    }
  }

  /**
   * Delete keys matching pattern
   */
  async delPattern(pattern) {
    if (!this.enabled || !this.redis) return false;

    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        logger.info({ pattern, count: keys.length }, 'Cache pattern deleted');
      }
      return true;
    } catch (error) {
      logger.error({ pattern, error: error.message }, 'Cache pattern delete error');
      return false;
    }
  }

  /**
   * Flush all cache
   */
  async flush() {
    if (!this.enabled || !this.redis) return false;

    try {
      await this.redis.flushdb();
      logger.warn('Cache flushed');
      return true;
    } catch (error) {
      logger.error({ error: error.message }, 'Cache flush error');
      return false;
    }
  }

  /**
   * Cache wrapper pattern
   */
  async getOrSet(key, fetchFn, ttlSeconds = 3600) {
    // Try cache first
    const cached = await this.get(key);
    if (cached !== null) {
      return cached;
    }

    // Cache miss - fetch from source
    const data = await fetchFn();
    
    // Store in cache
    await this.set(key, data, ttlSeconds);
    
    return data;
  }
}

// Singleton instance
export const cache = new Cache();
