import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { accessTokenSecret, accessTokenExpiry } from '@theblogproj/config';


// ==================== PASSWORD HASHING ====================

/**
 * Hash a plain-text password using bcrypt
 * 
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 * 
 * How bcrypt works:
 * 1. Generates random salt (unique per password)
 * 2. Hashes password + salt using Blowfish algorithm
 * 3. Returns: $2b$12$[salt][hash]
 * 
 * Why 12 rounds?
 * - 10 rounds = ~100ms (fast, less secure)
 * - 12 rounds = ~300ms (good balance)
 * - 14 rounds = ~1000ms (very secure, slower)
 * 
 * For admin auth, we want strong protection, so 12 rounds is perfect
 */
export async function hashPassword(password) {
  const SALT_ROUNDS = 12;  // Industry standard for 2024
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against stored hash
 * 
 * @param {string} password - Plain text password from login
 * @param {string} hash - Stored bcrypt hash from database
 * @returns {Promise<boolean>} - True if password matches
 * 
 * bcrypt automatically extracts the salt from the hash and compares
 */
export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}



// ==================== JWT GENERATION ====================

const ACCESS_TOKEN_SECRET = accessTokenSecret;
const ACCESS_TOKEN_EXPIRY = accessTokenExpiry || '15m';

/**
 * Generate access token (JWT)
 * 
 * @param {Object} admin - Admin object from database
 * @returns {string} - Signed JWT
 * 
 * Access Token contains:
 * - User identification (id, username, role)
 * - Expiry (15 minutes)
 * - Signature (prevents tampering)
 * 
 * This token is sent with EVERY API request
 */
export function generateAccessToken(admin) {
  const payload = {
    // Standard JWT claims
    iss: 'theBlogProject',      // Issuer (your app name)
    sub: admin.id,               // Subject (user ID)
    iat: Math.floor(Date.now() / 1000),  // Issued At (current timestamp)
    
    // Custom claims (your data)
    username: admin.username,
    role: admin.role,
    type: 'access',              // Important: distinguish from refresh token
  };

  // Sign the JWT with secret key
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,  // Token expires in 15 minutes
    algorithm: 'HS256'                // HMAC SHA-256 (symmetric encryption)
  });
}

/**
 * Generate refresh token (random string, NOT JWT)
 * 
 * @returns {string} - Random 64-character hex string
 * 
 * Why not JWT for refresh token?
 * - Refresh tokens are stored in database (can be revoked)
 * - JWT can't be revoked (stateless)
 * - Random string is simpler and equally secure
 * 
 * This token is used ONLY to get new access tokens
 */
export function generateRefreshToken() {
  // Generate cryptographically secure random bytes
  return crypto.randomBytes(32).toString('hex');
  // Returns: "8f9e7d6c5b4a3f2something7f6e5d4c3b2a1fsomething5f4e3d2c1b0a9f8e"
}

/**
 * Hash refresh token before storing in database
 * 
 * @param {string} token - Plain refresh token
 * @returns {string} - SHA-256 hash
 * 
 * Why hash refresh tokens in database?
 * - If database is compromised, attacker can't use tokens
 * - Similar to password hashing, but faster (SHA-256 vs bcrypt)
 * - We don't need slow hashing here (no brute force risk)
 */
export function hashRefreshToken(token) {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
}

/**
 * Verify access token (JWT)
 * 
 * @param {string} token - JWT from Authorization header
 * @returns {Object|null} - Decoded payload if valid, null if invalid
 * 
 * Verification checks:
 * 1. Signature is valid (token not tampered)
 * 2. Token not expired
 * 3. Token type is "access"
 */
export function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET, {
      algorithms: ['HS256']  // Only accept HMAC SHA-256
    });

    // Additional check: ensure it's an access token, not refresh
    if (decoded.type !== 'access') {
      return null;
    }

    return decoded;
  } catch (error) {
    // Token is invalid or expired
    console.error('JWT verification failed:', error.message);
    return null;
  }
}

/**
 * Verify refresh token (check database)
 * 
 * @param {string} token - Refresh token from client
 * @param {Object} prisma - Prisma client instance
 * @returns {Promise<Object|null>} - Admin object if valid, null if invalid
 * 
 * Verification checks:
 * 1. Token exists in database (by hash)
 * 2. Token not expired
 * 3. Token not revoked (revokedAt is null)
 */
export async function verifyRefreshToken(token, prisma) {
  const tokenHash = hashRefreshToken(token);

  const refreshToken = await prisma.adminRefreshToken.findUnique({
    where: { tokenHash },
    include: { admin: true }  // Include admin data
  });

  if (!refreshToken) {
    return null;  // Token not found in database
  }

  // Check if token expired
  if (new Date() > refreshToken.expiresAt) {
    return null;  // Token expired
  }

  // Check if token revoked (admin logged out)
  if (refreshToken.revokedAt) {
    return null;  // Token was revoked
  }

  return refreshToken.admin;
}



// ==================== TOKEN EXPIRY HELPERS ====================

/**
 * Get expiry date for refresh token
 * 
 * @returns {Date} - Date 7 days from now
 */
export function getRefreshTokenExpiry() {
  const days = 7;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

/**
 * Extract token from Authorization header
 * 
 * @param {string} authHeader - "Bearer eyJhbGc..."
 * @returns {string|null} - Token or null
 * 
 * Handles formats:
 * - "Bearer eyJhbGc..."  ✅
 * - "eyJhbGc..."         ✅
 * - null/undefined       ❌
 */
export function extractTokenFromHeader(authHeader) {
  if (!authHeader) return null;
  
  // Remove "Bearer " prefix if present
  return authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : authHeader;
}



// ==================== DEVICE/IP HELPERS ====================

/**
 * Extract device info from User-Agent header
 * 
 * @param {string} userAgent - Browser user agent string
 * @returns {string} - Simplified device info
 * 
 * Example output: "Chrome 120, Windows 10"
 */
export function getDeviceInfo(userAgent) {
  if (!userAgent) return 'Unknown Device';
  
  // Simple parsing (you could use a library like 'ua-parser-js' for better results)
  const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edge)\/([0-9.]+)/);
  const osMatch = userAgent.match(/(Windows|Mac|Linux|Android|iOS)/);
  
  const browser = browserMatch ? `${browserMatch[1]} ${browserMatch[2].split('.')[0]}` : 'Unknown Browser';
  const os = osMatch ? osMatch[1] : 'Unknown OS';
  
  return `${browser}, ${os}`;
}

export function getDeviceId(ipAddress, userAgent) {
  return crypto
    .createHash('sha256')
    .update(`${ipAddress}-${userAgent}`)
    .digest('hex');
}

/**
 * Extract IP address from request
 * 
 * @param {Object} req - Express request object
 * @returns {string} - IP address
 * 
 * Handles proxies (x-forwarded-for header)
 */
export function getClientIP(req) {
  // Check for proxy headers first
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // x-forwarded-for can be: "client, proxy1, proxy2"
    return forwarded.split(',')[0].trim();
  }
  
  return req.ip || req.connection.remoteAddress || 'Unknown';
}