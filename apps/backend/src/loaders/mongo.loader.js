import mongoose from 'mongoose';
import { dbName, mongoUri } from '../config/index.js';
import { logger } from '../../../../packages/logger/index.js';



// export default async function loadMongo() {
//   try {
//     await mongoose.connect(`${mongoUri}/${dbName}`, {
//       maxPoolSize: 10,
//     });

//     console.log('🟢 Mongo connected')
//     logger.info('🟢 Mongo connected');
    
//   } catch (err) {
//     console.log("🔴 Error occured: ", err)

//     logger.error({ err }, '🔴 Mongo connection failed');
//     // process.exit(1); // critical → stop boot
//   }
// }




// Modified approach

export default async function loadMongo() {
    if (!mongoUri) {
        logger.warn('⚠️ MONGO_URI not defined. Skipping Mongo connection.');
        return null;
    }

    try {
        const connectionInstance = await mongoose.connect(`${mongoUri}/${dbName}`, { maxPoolSize: 10 });
        console.log('🟢 Mongo connected')
        logger.info('🟢 Mongo connected\n\n');
        return connectionInstance;
    } catch (err) {
        logger.error({ err }, '🔴 Mongo connection failed\n\n');
        return null;
    }
}






