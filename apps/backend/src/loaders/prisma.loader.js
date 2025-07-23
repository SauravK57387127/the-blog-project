// import prisma from '../../../../database/postgres/prismaClient.js';
import { logger } from '../../../../packages/logger/index.js';



// export default async function loadPrisma() {
//   try {
//     await prisma.$queryRaw`SELECT 1`;         // quick ping
//     logger.info('🟢 Prisma connected');
//   } catch (err) {
//     logger.error({ err }, '🔴 Prisma connection failed'); // analytics only
//   }
//   return prisma;
// }
 




// Modified approach


import { getPrisma } from '../../../../database/postgres/prismaClient.js';




// export default async function loadPrisma() {
//   try {
//     const prisma = getPrisma(); // Only initializes when called
//     await prisma.$queryRaw`SELECT 1`; // Quick ping
//     logger.info('🟢 Prisma connected\n\n');
//     return prisma;
//   } catch (err) {
//     logger.error({ err }, '🔴 Prisma connection failed\n\n');
//     return null;
//   }
// }





// More modified approach


export default async function loadPrisma() {
    if (!process.env.DATABASE_URL) {
        console.log('⚠️ DATABASE_URL not defined. Skipping Prisma connection.');
        logger.warn('⚠️ DATABASE_URL not defined. Skipping Prisma connection.');
        return null;
    }

    try {
        const prisma = getPrisma();
        await prisma.$queryRaw`SELECT 1`;
        console.log('🟢 Prisma connected');
        logger.info('🟢 Prisma connected\n\n');
        return prisma;
    } catch (err) {
        console.log('🔴 Prisma connection failed');
        logger.error({ err }, '🔴 Prisma connection failed\n\n');
        return null;
    }
}