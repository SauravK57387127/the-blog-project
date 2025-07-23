import dotenv from 'dotenv';
dotenv.config({ path: '../../database/postgres/.env'})
dotenv.config({ path: '../../database/.env'})
dotenv.config();


const config = {
    port: process.env.PORT || 5000,
    dbName: process.env.DB_NAME,
    mongoUri: process.env.MONGO_URI,
    flags: {
        enableMongo: process.env.ENABLE_MONGO     === 'true',
        enableRedis:   process.env.ENABLE_REDIS   === 'true',
        enablePrisma:  process.env.ENABLE_PRISMA  === 'true',
    },
    

    // All other services here when needed (e.g. S3, Redis etc.)
}


export const { port, dbName, mongoUri, flags } = config;



