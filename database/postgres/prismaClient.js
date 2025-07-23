// db/postgres/prismaClient.js  (ESM wrapper)
// import pkg from '@prisma/client';   // CommonJS seen as default export
// const { PrismaClient } = pkg;


// const prisma = new PrismaClient();
// export default prisma;
 





// Modified approach 

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


