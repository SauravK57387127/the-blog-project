import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine environment
const env = process.env.NODE_ENV || 'development';
const isDocker = process.env.IN_DOCKER === 'true' || process.env.DOCKER === 'true';

// Load .env ONLY if not in Docker
if (!isDocker) {
  const monorepoRoot = path.resolve(__dirname, '../../');
  const envFile = path.resolve(monorepoRoot, `.env.${env}`);

  const result = dotenv.config({ path: envFile });

  if (result.error) {
    console.warn(`⚠️ Could not load ${envFile}`);
  } else {
    console.log(`✅ Loaded environment file: ${envFile}`);
  }
} else {
  console.log('🐳 Running inside Docker – env provided by container');
}

// Validation helper
function required(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing required env var: ${key}`);
  }
  return value;
}

// Config object with validation
export const config = {
  nodeEnv: env,
  port: parseInt(process.env.PORT || '7000', 10),
  workerPort: parseInt(process.env.WORKER_PORT || '4001', 10),

  // Database
  dbName: required('DB_NAME'),
  mongoUri: required('MONGO_URI'),
  postgresUri: process.env.POSTGRES_DATABASE_URL,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // Feature flags
  flags: {
    enableMongo: process.env.ENABLE_MONGO === 'true',
    enablePrisma: process.env.ENABLE_PRISMA === 'true',
    enableRedis: process.env.ENABLE_REDIS === 'true',
  },

  // Auth
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
clerkWebhookSecret: process.env.CLERK_WEBHOOK_SECRET,

  // Rate Limiter
  rateLimitAdminLogin: process.env.RATE_LIMIT_ADMIN_LOGIN,
  rateLimitAdmin: process.env.RATE_LIMIT_ADMIN,
  rateLimitPublic:  process.env.RATE_LIMIT_PUBLIC,
  rateLimitUser: process.env.RATE_LIMIT_USER,

  // Admin JWT
  accessTokenSecret: process.env.ADMIN_JWT_SECRET,
  accessTokenExpiry: process.env.ADMIN_ACCESS_TOKEN_EXPIRY || '15m',
  refreshTokenSecret: process.env.ADMIN_JWT_REFRESH_SECRET,
  refreshTokenExpiry: process.env.ADMIN_REFRESH_TOKEN_EXPIRY || '7d',

  // Job Queue
  queue: {
    concurrency: parseInt(process.env.QUEUE_CONCURRENCY || '5', 10),
    jobTimeout: parseInt(process.env.JOB_TIMEOUT || '300000', 10), // 5 min
    maxRetries: parseInt(process.env.JOB_MAX_RETRIES || '3', 10),
  },
 
  // Sentry
  sentry: {
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT || env,
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    enabled: !!process.env.SENTRY_DSN,  // Only enable if DSN provided
  },

  // Cloudinary
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,  
};


// Named export
export const {
  nodeEnv,
  port,
  dbName,
  mongoUri,
  postgresUri,
  flags,
  redisUrl,
  clerkSecretKey,
  clerkPublishableKey,
  accessTokenSecret,
  accessTokenExpiry,
  refreshTokenSecret,
  refreshTokenExpiry,
  rateLimitAdminLogin,
  rateLimitAdmin,
  rateLimitPublic,
  rateLimitUser,
  sentry
} = config;
