import { createApp } from './app.js';
import { logger } from '../../../packages/logger/index.js';
import { port, flags } from './config/index.js';
import loadMongo  from './loaders/mongo.loader.js';
import loadRedis  from './loaders/redis.loader.js';
import loadPrisma from './loaders/prisma.loader.js';



await loadMongo();                        // always

if (flags.enableRedis)  await loadRedis();
if (flags.enablePrisma) await loadPrisma();

const app = createApp();
// app.listen(port, () => logger.info(`🚀 Server running on port ${port}`));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


