export default {
    testEnvironment: 'node',
    testMatch: [
        '**/tests/unit/**/*.test.js',
        '**/tests/integration/**/*.test.js',
    ],
    testPathIgnorePatterns: ['/node_modules/', '/tests/e2e/'],
    transform: {},

    // Package aliases — only real packages need mapping
    moduleNameMapper: {
        '^@theblogproj/config$': '<rootDir>/packages/config/index.js',
        '^.*packages/logger/index\\.js$': '<rootDir>/tests/__mocks__/logger.js',
        '^@clerk/express$': '<rootDir>/tests/__mocks__/@clerk/express.js',
        '^.*packages/logger/httpLogger\\.js$':
            '<rootDir>/tests/__mocks__/httpLogger.js',
    },

    // __mocks__ folder location — tells Jest where to find auto-mocks
    roots: ['<rootDir>'],

    // Runs once before entire suite — starts docker DBs, runs migrations
    globalSetup: '<rootDir>/tests/helpers/globalSetup.js',

    // Runs once after entire suite — stops docker DBs
    globalTeardown: '<rootDir>/tests/helpers/globalTeardown.js',

    // Runs before every test FILE — enforces env, suppresses console
    setupFilesAfterEnv: ['<rootDir>/tests/helpers/jestSetup.js'],

    testTimeout: 30000,
    verbose: true,
    forceExit: true,
    detectOpenHandles: true,
};
