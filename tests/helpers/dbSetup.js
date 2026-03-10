import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

/**
 * Connect to in-memory MongoDB for testing
 */
export async function setupTestDB() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  await mongoose.connect(uri);
  console.log('✅ Test MongoDB connected');
  
  return uri;
}

/**
 * Clear all collections
 */
export async function clearTestDB() {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

/**
 * Disconnect and stop MongoDB
 */
export async function teardownTestDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  
  if (mongod) {
    await mongod.stop();
  }
  
  console.log('✅ Test MongoDB disconnected');
}
