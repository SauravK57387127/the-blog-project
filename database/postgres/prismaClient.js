// db/postgres/prismaClient.js  (ESM wrapper)
import pkg from '@prisma/client';   // CommonJS seen as default export
const { PrismaClient } = pkg;


const prisma = new PrismaClient();
export default prisma;
