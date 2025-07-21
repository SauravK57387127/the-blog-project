import mongoose from 'mongoose';
import { dbName, mongoUri } from '../config/index.js';
import { logger } from '../../../../packages/logger/index.js';



export default async function loadMongo() {
  try {
    await mongoose.connect(`${mongoUri}/${dbName}`, {
      maxPoolSize: 10,
    });

    logger.info('🟢 Mongo connected');
    
  } catch (err) {
    logger.error({ err }, '🔴 Mongo connection failed');
    process.exit(1); // critical → stop boot
  }
}




// export default async function loadMongo() {
//     try {
//         const connectionInstance = await mongoose.connect(`${PROCESS.ENV.MONGO_URI}/${PROCESS.ENV.DB_NAME}`)
        
//     } catch (error) {
        
//     }
// }
