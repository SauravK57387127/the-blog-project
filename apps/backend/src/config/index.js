import dotenv from 'dotenv';
dotenv.config();


const config = {
    // env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    dbName: process.env.DB_NAME,
    mongoUri: process.env.MONGO_URI,
    // jwt: {
    //     secret: process.env.JWT_SECRET,
    //     expiresIn: process.env.EXPIRES_IN || '1d'
    // },
    flags: {
    enableRedis:   process.env.ENABLE_REDIS   === 'true',
    enablePrisma:  process.env.ENABLE_PRISMA  === 'true',
    },

    // All other services here when needed (e.g. S3, Redis etc.)
}



export const { port, dbName, mongoUri, flags } = config;



// Usage

// import { config } from '../config';

// console.log(config.port);
// console.log(config.jwt.secret);
