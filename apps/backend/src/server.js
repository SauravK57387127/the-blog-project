// import { createApp } from './app.js';
import { port, flags } from './config/index.js';
// import loadMongo from './loaders/mongo.loader.js';
// import loadPrisma from './loaders/prisma.loader.js';
// import loadRedis from './loaders/redis.loader.js';
// import { logger } from '../../../packages/logger/index.js';




// if (flags.enableMongo) await loadMongo();
// if (flags.enablePrisma) await loadPrisma();
// if (flags.enableRedis) await loadRedis();


// const app = createApp();


// app.listen(port, () => {
//   logger.info(`🚀 Server running on http://localhost:${port}\n`);
// });





import express from 'express';

const app = express();

app.get('/', (req, res) => res.send('Root OK'));
app.get('/health', (req, res) => res.send('Health OK'));
app.get('/debug', (req, res) => res.send('Debug OK'));

// const PORT = process.env.PORT || 3000;
app.listen(port, () => console.log(`Test server running on ${port}`));






// app.listen(port, () => {
//   console.log('🚀 Server listener callback executed');
//   console.log(`http://localhost:${port}\n`);
//   // console.log(`http://localhost:${1000}\n`);
// });



// app.listen(1000 , () => {
//   console.log('🚀 Server listener callback executed');
//   console.log(`http://localhost:1000}\n`)
// //   logger.info(`🚀 Server running on http://localhost:${process.env.PORT}\n`);
// });



// app.listen(1000 , () => {
//   console.log('🚀 Server listener callback executed');
//   console.log(`http://localhost:1000\n`);
// //   console.log(`http://localhost:${1000}}\n`)

// //   logger.info(`🚀 Server running on http://localhost:${process.env.PORT}\n`);
// });







// node src/server.js








// console.log('Testing logger...');
// logger.info('Test message');
// setTimeout(() => {
//   console.log('Still alive after logger test');
// }, 2000);




// import express from "express";

// const app = express();

// app.get("/", (req, res) => res.send("Hello World"));

// app.listen(3000, () => console.log("Server running on http://localhost:3000"));
