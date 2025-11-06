const { defaults: tsjPreset } = require('ts-jest/presets');

/** @type {import('jest').Config} */
module.exports = {
  // Spread ts-jest preset defaults (includes transform, moduleFileExtensions, testMatch, etc.)
  ...tsjPreset,

  // Override only what we need
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts', '**/*.spec.ts'],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 15,
      functions: 15,
      lines: 25,
      statements: 25,
    },
  },

  // Custom flags that differ from ts-jest defaults
  verbose: true,
  testTimeout: 10000,
  errorOnDeprecated: true,
  clearMocks: true,
  maxWorkers: '50%',
};
