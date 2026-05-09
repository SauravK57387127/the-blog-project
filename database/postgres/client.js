import { PrismaClient } from '@prisma/client';

let prisma = null;

export function getPrisma() {
    if (!prisma) {
        prisma = new PrismaClient({
            log: ['error', 'warn'],
        });
    }
    return prisma;
}
