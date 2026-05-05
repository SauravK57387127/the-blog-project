import Redis from 'ioredis';

let redis = null;

/**
 * Connect to Redis for testing (use separate DB index)
 */
export async function setupTestRedis() {
    redis = new Redis({
        host: 'localhost',
        port: 6379,
        db: 15, // Use DB 15 for tests (separate from dev DB 0)
        maxRetriesPerRequest: null,
    });

    await redis.ping();
    console.log('✅ Test Redis connected');

    return redis;
}

/**
 * Clear all Redis data
 */
export async function clearTestRedis() {
    if (redis) {
        await redis.flushdb();
    }
}

/**
 * Disconnect Redis
 */
export async function teardownTestRedis() {
    if (redis) {
        await redis.quit();
        console.log('✅ Test Redis disconnected');
    }
}

export function getTestRedis() {
    return redis;
}
