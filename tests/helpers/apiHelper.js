import request from 'supertest';
import { createApp } from '../../apps/backend/src/app.js';

let app;

/**
 * Initialize test app
 */
export function initTestApp(options = {}) {
  app = createApp(options);
  return app;
}

/**
 * Get test app instance
 */
export function getTestApp() {
  return app;
}

/**
 * Make authenticated admin request
 */
export function adminRequest(method, path, token) {
  return request(app)
    [method.toLowerCase()](path)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json');
}

/**
 * Make authenticated user request (Clerk)
 */
export function userRequest(method, path, userId) {
  const req = request(app)
    [method.toLowerCase()](path)
    .set('Content-Type', 'application/json');
  
  // Attach fake Clerk userId (our mock will use this)
  // Only set header if userId exists
  if (userId) {
    req.set('x-test-user-id', userId);
  }
  return req;
}

/**
 * Make public request (no auth)
 */
export function publicRequest(method, path) {
  return request(app)
    [method.toLowerCase()](path)
    .set('Content-Type', 'application/json');
}
