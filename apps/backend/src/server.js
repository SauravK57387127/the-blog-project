import { createApp } from './app.js';
import { port, flags } from './config/index.js';
import loadMongo from './loaders/mongo.loader.js';
import loadPrisma from './loaders/prisma.loader.js';
import loadRedis from './loaders/redis.loader.js';
import { logger } from '../../../packages/logger/index.js';




if (flags.enableMongo) await loadMongo();
if (flags.enablePrisma) await loadPrisma();
if (flags.enableRedis) await loadRedis();


const app = createApp();


app.listen(port, () => {
  logger.info(`🚀 Server running on http://localhost:${port}\n`);
});


