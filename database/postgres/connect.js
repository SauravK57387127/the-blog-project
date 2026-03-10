import { getPrisma } from './client.js';
import { config } from '@theblogproj/config';

export async function connectPrisma() {
  if (!config.postgresUri) {
    console.warn('⚠️  POSTGRES_DATABASE_URL not defined. Skipping Prisma connection.');
    return null;
  }

  try {
    const prisma = getPrisma();
    await prisma.$queryRaw`SELECT 1`;
    
    console.log('✅ Postgres connected');
    return prisma;
  } catch (err) {
    console.error('❌ Postgres connection failed:', err.message);
    return null;
  }
}
export async function disconnectPrisma() {
  const prisma = getPrisma();
  if (prisma) {
    await prisma.$disconnect();
    console.log('✅ Postgres disconnected');
  }
}

export { getPrisma };
