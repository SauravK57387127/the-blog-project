import { getPrisma } from './client.js';
import { config } from '@theblogproj/config';

export async function connectPostgres() {
    const databaseUrl = config.postgresUri;

    if (!databaseUrl) {
        console.warn('⚠️  DATABASE_URL not defined. Skipping Postgres.');
        return null;
    }

    try {
        console.log(
            '🔗 Connecting to Postgres (this may take 30s if cold start)...',
        );

        const prisma = getPrisma();

        // Test connection with timeout for Neon cold start
        await Promise.race([
            prisma.$connect(),
            new Promise((_, reject) =>
                setTimeout(
                    () =>
                        reject(
                            new Error('Postgres connection timeout after 30s'),
                        ),
                    30000,
                ),
            ),
        ]);

        console.log('✅ Postgres connected');
        return prisma;
    } catch (err) {
        console.error('❌ Postgres failed:', err.message);
        return null;
    }
}

export async function disconnectPostgres() {
    const prisma = getPrisma();
    if (prisma) {
        await prisma.$disconnect();
        console.log('✅ Prisma disconnected');
    }
}

export { getPrisma };
