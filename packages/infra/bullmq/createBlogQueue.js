import { Queue } from 'bullmq';

/**
 * Factory to create a Blog Queue
 * @param {object} redisConnection - ioredis connection or options
 * @returns {Queue}
 */
export function createBlogQueue(redisConnection) {
    return new Queue('blogQueue', {
        connection: redisConnection,

        // Default job options
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000, // 5, 10, 20...
            },
            removeOnComplete: {
                age: 24 * 3600, // 24 hours
                count: 1000,
            },
            removeOnFail: {
                age: 7 * 24 * 3600, // 7 days
            },
            timeout: 300000, // 5 mins
        },
    });
}
