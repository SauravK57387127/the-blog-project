import { sendResponse } from '../utils/sendResponse.js';
import { getAuth } from '@clerk/express';

/**
 * Middleware to require Clerk authentication
 * Checks if user is authenticated via Clerk
 */
export const requireAuth = (req, res, next) => {
  // const { userId } = getAuth(req);
  
  // TODO: Replace with Clerk when auth is enabled
  const userId = req.headers['x-test-user-id'] || 'user_test1';
  
  if (!userId) {
    return sendResponse({
      res,
      statusCode: 401,
      success: false,
      message: 'Authentication required. Please log in to continue.',
      data: null,
    });
  }
  
  req.userId = userId;
  // User is authenticated, proceed
  next();
};
