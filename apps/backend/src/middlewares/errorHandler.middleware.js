import { logger } from '../../../../packages/logger/index.js';
import { sendResponse } from '../utils/sendResponse.js';
import { captureException } from '../utils/sentry.js';

export function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Log error
  logger.error({
    error: message,
    stack: err.stack,
    statusCode,
    path: req.path,
    method: req.method,
  }, 'Request error');

  // ✅ Send to Sentry for 500 errors
  if (statusCode >= 500) {
    captureException(err, {
      tags: {
        endpoint: req.path,
        method: req.method,
      },
      extra: {
        body: req.body,
        params: req.params,
        query: req.query,
      },
      user: req.auth ? { id: req.auth.userId } : undefined,
    });
  }

  sendResponse({
    res,
    statusCode: statusCode,
    success: false,
    message: err.message || 'Internal Server Error',
    stack: err.stack
  });
}


