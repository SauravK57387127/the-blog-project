import { createApp } from './app.js';
import { logger } from '../../../packages/logger/index.js';
import { port, flags } from './config/index.js';
import loadMongo  from './loaders/mongo.loader.js';
import loadRedis  from './loaders/redis.loader.js';
import loadPrisma from './loaders/prisma.loader.js';



await loadMongo();                        // always

if (flags.enableRedis)  await loadRedis();
if (flags.enablePrisma) await loadPrisma();

console.log("✅ App setup starting...");


const app = createApp();
// app.listen(port, () => logger.info(`🚀 Server running on port ${port}`));

app.use('*', (req, res) => {
  res.status(404).send(`❌ Route ${req.originalUrl} not found`);
});


app.get('/debug', (req, res) => {
  res.send('✅ Server reached debug route');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


