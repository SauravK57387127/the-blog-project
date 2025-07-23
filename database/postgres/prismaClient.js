import pkg from '@prisma/client';
const { PrismaClient } = pkg;




let prisma = null;

export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient({
        datasources: {
            db: {     
                url: process.env.DATABASE_URL 
            }
        }
    });
    // console.log('Prisma client initialized');
  }
  return prisma;
}


