import {
    connectMongo,
    disconnectMongo,
    mongoose,
} from '../../database/mongo/connect.js';
import {
    connectPostgres,
    disconnectPostgres,
    getPrisma,
} from '../../database/postgres/connect.js';
import {
    connectRedis,
    disconnectRedis,
    getRedis,
} from '../../database/redis/connect.js';

/**
 * Connect all three DBs — called in globalSetup or beforeAll
 */
export async function setupTestDB() {
    await connectMongo();
    await connectPostgres();
    await connectRedis();
}

/**
 * Wipe all data between tests — called in beforeEach/afterEach
 * Keeps connections alive, just clears data
 */
export async function clearTestDB() {
    // Mongo — drop all collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }

    // Postgres — delete all rows in correct order (foreign keys)
    const prisma = getPrisma();
    await prisma.$transaction([
        prisma.adminRefreshToken.deleteMany(),
        prisma.auditLog.deleteMany(),
        prisma.admin.deleteMany(),
        prisma.event.deleteMany(),
    ]);

    // Redis — flush only test DB (db 15 in redisSetup, here via config)
    const redis = getRedis();
    await redis.flushdb();
}

/**
 * Disconnect all — called in globalTeardown or afterAll
 */
export async function teardownTestDB() {
    await disconnectMongo();
    await disconnectPostgres();
    await disconnectRedis();
}
