import { setupTestDB, clearTestDB, teardownTestDB } from './dbSetup.js';
import { setupTestRedis, clearTestRedis, teardownTestRedis } from './redisSetup.js';
import { initTestApp, getTestApp } from './apiHelper.js';
import { mockClerkAuth } from './authHelper.js';
import { seedDatabase } from '../fixtures/testData.js';

/**testsetup
 * Complete test environment setup
 */
export async function setupTestEnvironment(options = {}) {
  // Setup databases
  await setupTestDB();
  const redis = await setupTestRedis();

  // Create app with mocked Clerk
  const app = initTestApp(options);
  //mockClerkAuth(app);

  // Seed data if requested
  if (options.seed) {
    await seedDatabase();
  }

  return { app, redis };
}

/**
 * Clean test environment between tests
 */
export async function cleanTestEnvironment() {
  await clearTestDB();
  await clearTestRedis();
}

/**
 * Teardown test environment
 */
export async function teardownTestEnvironment() {
  await teardownTestDB();
  await teardownTestRedis();
}
