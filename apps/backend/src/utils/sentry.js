import * as Sentry from '@sentry/node';
import { config } from '@theblogproj/config';
import { logger } from '../../../../packages/logger/index.js';


/**
 * Capture exception with context
 */
export function captureException(error, context = {}) {
  if (!config.sentry.enabled) {
    logger.error({ error: error.message, ...context });
    return;
  }

  Sentry.captureException(error, context);
  logger.error({ error: error.message, ...context });
}
