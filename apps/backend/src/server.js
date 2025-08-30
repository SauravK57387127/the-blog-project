import { createApp } from './app.js';
import { port, flags } from './config/index.js';
import loadMongo from './loaders/mongo.loader.js';
import loadPrisma from './loaders/prisma.loader.js';
import loadRedis from './loaders/redis.loader.js';
import { logger } from '../../../packages/logger/index.js';
import { runBlogReconciliation } from '../../../infra/bullmq/reconciliation/blogReconciliation.js';




if (flags.enableMongo) await loadMongo();
if (flags.enablePrisma) await loadPrisma();
if (flags.enableRedis) await loadRedis();

// 🟢 Run reconciliation once on startup
runBlogReconciliation();
// 🟡 Optional: run reconciliation every 5 minutes
setInterval(runBlogReconciliation, 5 * 60 * 1000);
console.log("🚀 Blog Worker is running...");

const app = createApp();


app.listen(port, () => {
  logger.info(`🚀 Server running on http://localhost:${port}\n`);
});


