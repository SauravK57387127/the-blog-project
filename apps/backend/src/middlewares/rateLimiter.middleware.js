import { RateLimiterRedis } from 'rate-limiter-flexible';
import { getRedis } from '../../../../database/index.js';
import { config } from '@theblogproj/config';
import { logger } from '../../../../packages/logger/index.js';

// Get Redis client
const redis = getRedis();

/**
 * Admin Login Rate Limiter
 * Strict: 5 attempts per 15 minutes
 * Prevents brute force attacks
 */
export const adminLoginLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'rl:admin:login',
  points: config.rateLimitAdminLogin,              // 5 requests
  duration: 15 * 60,      // per 15 minutes
  blockDuration: 15 * 60, // block for 15 minutes after limit
});

/**
 * Admin Endpoints Rate Limiter
 * Moderate: 100 requests per 15 minutes
 */
export const adminLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'rl:admin',
  points: config.rateLimitAdmin,
  duration: 15 * 60,
  blockDuration: 60,      // block for 1 minute
});

/**
 * Public Endpoints Rate Limiter
 * Relaxed: 300 requests per 15 minutes
 */
export const publicLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'rl:public',
  points: config.rateLimitPublic,
  duration: 15 * 60,
  blockDuration: 60,
});

/**
 * User Endpoints Rate Limiter
 * Moderate: 200 requests per 15 minutes
 */
export const userLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'rl:user',
  points: config.rateLimitUser,
  duration: 15 * 60,
  blockDuration: 60,
});

/**
 * Express middleware wrapper for rate limiter
 */
export function rateLimitMiddleware(limiter, options = {}) {
  return async (req, res, next) => {
    // Skip in test environment
    if (config.nodeEnv === 'test') {
      return next();
    }

    try {
      // Use IP as key (or userId for authenticated routes)
      const key = options.useUserId && req.auth?.userId 
        ? req.auth.userId 
        : req.ip;

      // Consume 1 point
      await limiter.consume(key);
      
      // Success - allow request
      next();
    } catch (rejRes) {
      // Rate limit exceeded
      if (rejRes instanceof Error) {
        // Redis error - fail open (allow request but log)
        logger.error({ error: rejRes.message }, 'Rate limiter Redis error');
        return next();
      }

      // Rate limit hit
      const retryAfter = Math.ceil(rejRes.msBeforeNext / 1000);
      
      logger.warn({
        ip: req.ip,
        path: req.path,
        retryAfter,
      }, 'Rate limit exceeded');

      res.set('Retry-After', String(retryAfter));
      res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter,
      });
    }
  };
}

// Export ready-to-use middleware
export const adminLoginRateLimit = rateLimitMiddleware(adminLoginLimiter);
export const adminRateLimit = rateLimitMiddleware(adminLimiter);
export const publicRateLimit = rateLimitMiddleware(publicLimiter);
export const userRateLimit = rateLimitMiddleware(userLimiter, { useUserId: true });
