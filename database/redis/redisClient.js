import Redis from 'ioredis';


const redis = new Redis(process.env.REDIS_URL); // defaults to localhost:6379 | even without URL

export default redis;
