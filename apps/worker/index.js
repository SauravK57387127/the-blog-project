import http from 'http';
import { config } from '@theblogproj/config';
import { connectMongo, connectRedis, models } from '../../database/index.js';
import { logger } from '../../packages/logger/index.js';
import { createBlogWorker } from '../../packages/infra/bullmq/createBlogWorker.js';
import { createDeadLetterQueue } from '../../packages/infra/bullmq/createDeadLetterQueue.js';


//import Blog from "../../database/models/blog.model.js";
//import { createBlogWorker } from "../../packages/infra/bullmq/createBlogWorker.js";
//import { createDeadLetterQueue } from '../../packages/infra/bullmq/createDeadLetterQueue.js';
//import { getRedis } from "../../database/redis/redisClient.js";
//import { loadMongo } from "../../packages/infra/loaders/mongoLoader.js";
//import { loadRedis } from "../../packages/infra/loaders/redisLoader.js";
//import { flags, dbName, mongoUri, redisUrl } from "@theblogproj/config";
//import { logger } from "../../packages/logger/index.js";


// Connect mongo
//if (flags.enableMongo) { await loadMongo(dbName, mongoUri) }
if (config.flags.enableMongo) {
  await connectMongo();
}

//const redis = getRedis({ url: redisUrl });
//if (flags.enableRedis) {
//  await loadRedis(redis);
//}
const redis = await connectRedis();

// Create DLQ
const deadLetterQueue = createDeadLetterQueue(redis)

// Create Worker with DLQ
const blogWorker = createBlogWorker(redis, models.Blog, deadLetterQueue)

// Lifecycle events
blogWorker.on("completed", (job) => {
  logger.info({ jobId: job.id, jobName: job.name }, 'Job completed');
});

blogWorker.on("failed", (job, err) => {
  logger.error({
    jobId: job?.id,
    jobName: job?.name,
    error: err.message,
    retryable: err.retryable,
    attemptsRemaining: (job?.opts?.attempts || 3) - (job?.attemptsMade || 0)
  }, 'Job failed');
});

blogWorker.on("error", (err) => {
  logger.error({ error: err.message }, 'Worker error');
});


const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', worker: 'running' }));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(config.workerPort, () => {
  logger.info(`🏥 Worker health server on port ${config.workerPort}`);
});


// Graceful shutdown
async function shutdown(signal) {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  
  await blogWorker.close();
  await redis.quit();
  
  logger.info('Worker shut down successfully');
  process.exit(0);
}


process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

logger.info('🚀 Blog Worker started with DLQ');
