import prisma from '../../../../database/postgres/prismaClient.js';
import { logger } from '../../../../packages/logger/index.js';



export default async function loadPrisma() {
  try {
    await prisma.$queryRaw`SELECT 1`;         // quick ping
    logger.info('🟢 Prisma connected');
  } catch (err) {
    logger.error({ err }, '🔴 Prisma connection failed'); // analytics only
  }
  return prisma;
}
