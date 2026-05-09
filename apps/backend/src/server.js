import { setDefaultResultOrder } from 'dns';
setDefaultResultOrder('ipv4first');

import { config } from '@theblogproj/config';
import { logger } from '../../../packages/logger/index.js';

import {
    connectMongo,
    connectRedis,
    connectPostgres,
} from '../../../database/index.js';

import { createApp } from './app.js';
// import { loadMongo } from "../../../packages/infra/loaders/mongoLoader.js";
// import { loadRedis } from "../../../packages/infra/loaders/redisLoader.js";
// import { getRedis } from '../../../database/redis/redisClient.js';

import { createBlogQueue } from '../../../packages/infra/bullmq/createBlogQueue.js';
import { createDeadLetterQueue } from '../../../packages/infra/bullmq/createDeadLetterQueue.js';

// Connect mongo
if (config.flags.enableMongo) {
    await connectMongo();
}
// console.log(`postgres URI: ${postgresUri} |`)

// const redis = getRedis()
// const redisUrl = process.env.REDIS_URL || undefined;
// const redis = redisUrl ? getRedis({ url: redisUrl }) : getRedis();

// const mongoConnectionString = process.env.MONGO_URI || mongoUri; // prefer injected test URI
// if (flags.enableMongo) await loadMongo(dbName, mongoConnectionString);
// const redis = getRedis({ url: redisUrl });

// Connect to MongoDB
//if (flags.enableMongo) {
//  await loadMongo(dbName, mongoUri);
// }

// if (flags.enableRedis) await loadRedis(redis);
// if (flags.enablePrisma) await loadPrisma();

let redis;
if (config.flags.enableRedis) {
    redis = await connectRedis();
}
// backend's postInstall for prisma ->     "postinstall": "npx prisma generate --schema ../../database/postgres/prisma/schema.prisma",

if (config.flags.enablePrisma) {
    await connectPostgres();
}

// Create queues
const blogQueue = redis ? createBlogQueue(redis) : null;
const deadLetterQueue = redis ? createDeadLetterQueue(redis) : null;

// 🟢 Run reconciliation once on startup
// runBlogReconciliation();
// // 🟡 Optional: run reconciliation every 5 minutes
// setInterval(runBlogReconciliation, 5 * 60 * 1000);
// console.log("🚀 Blog Worker is running...");

// await blogQueue.obliterate({ force: true });                                 // command to eliminate left-over processes

// const queueEvents = new QueueEvents('blogQueue', { connection: getRedis() });

// queueEvents.on('waiting', ({ jobId }) => console.log(`🕒 waiting: ${jobId}`));
// queueEvents.on('active', ({ jobId }) => console.log(`▶️ active: ${jobId}`));
// queueEvents.on('completed', ({ jobId }) => console.log(`✅ completed: ${jobId}`));
// queueEvents.on('failed', ({ jobId, failedReason }) =>
//   console.log(`❌ failed: ${jobId} -> ${failedReason}`)
// );

// await blogQueue.add(
//   'reconcile-blogs',
//   {},
//   { repeat: { every: 5 * 60 * 1000 }, jobId: 'reconcile-blogs' }
// );

// const app = createApp();

//const blogQueue = createBlogQueue(redis)
//const deadLetterQueue = createDeadLetterQueue(redis)

// Create app
const app = createApp({ blogQueue, deadLetterQueue });

// setupBullBoard(app, { blogQueue });

app.listen(config.port, () => {
    logger.info(`🚀 Server running on http://localhost:${config.port}\n`);
});
