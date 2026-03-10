// Global test setup
import { config } from '../../packages/config/index.js';

// Ensure we're in test environment
if (config.nodeEnv !== 'test') {
  throw new Error('Tests must run with NODE_ENV=test');
}

// Suppress console logs in tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   info: jest.fn(),
// };
