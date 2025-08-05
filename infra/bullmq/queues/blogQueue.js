import { Queue } from 'bullmq';
import { getRedis } from '../../../database/redis/redisClient.js';



export const blogQueue = new Queue('blogQueue', {
    connection: getRedis(),
});
