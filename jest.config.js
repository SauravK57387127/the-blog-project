export default {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/unit/**/*.test.js',
    '**/tests/integration/**/*.test.js',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/e2e/', // E2E uses Playwright
  ],
  transform: {},
  moduleNameMapper: {
    '^@theblogproj/config$': '<rootDir>/packages/config/index.js',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/helpers/jestSetup.js'],
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
};
