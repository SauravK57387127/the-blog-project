import { jest } from '@jest/globals';
import { config } from '../../packages/config/index.js';

// Enforce test environment — hard stop if wrong
if (config.nodeEnv !== 'test') {
  throw new Error('Tests must run with NODE_ENV=test');
}

// Suppress console noise from your app code in test output
// You'll still see jest's own output and your test descriptions
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // keep error visible — real errors should surface
  error: console.error,
};
