import { sendResponse } from '../utils/sendResponse.js';
import { getAuth } from '@clerk/express';

/**
 * Middleware to require Clerk authentication
 * Checks if user is authenticated via Clerk
 */
export const requireAuth = (req, res, next) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return sendResponse({
      res,
      statusCode: 401,
      success: false,
      message: 'Authentication required. Please log in to continue.',
      data: null,
    });
  }

  // User is authenticated, proceed
  next();
};
