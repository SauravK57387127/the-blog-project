import mongoose from 'mongoose';
import { config } from '@theblogproj/config';

let connection = null;

export async function connectMongo(dbNameOverride = null, mongoUriOverride = null) {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const dbName = dbNameOverride || config.dbName;
  const mongoUri = mongoUriOverride || config.mongoUri;

  if (!mongoUri) {
    console.warn('⚠️  MONGO_URI not defined. Skipping MongoDB connection.');
    return null;
  }

  try {
    const uri = `${mongoUri}/${dbName}`;
    connection = await mongoose.connect(uri, { maxPoolSize: 10 });
    
    console.log('✅ MongoDB connected');
    return mongoose.connection;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    return null;
  }
}

export async function disconnectMongo() {
  if (connection) {
    await mongoose.disconnect();
    connection = null;
    console.log('✅ MongoDB disconnected');
  }
}

export { mongoose };
