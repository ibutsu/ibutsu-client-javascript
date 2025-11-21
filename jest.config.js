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
    // Note: Global thresholds are intentionally lower because they include
    // modules without tests. Specific per-file thresholds ensure 90%+ coverage
    // for all modules that have test coverage.
    global: {
      branches: 13,
      functions: 23,
      lines: 27,
      statements: 27,
    },
    // Specific thresholds for modules with tests
    'src/apis/ArtifactApi.ts': {
      branches: 85,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/apis/DashboardApi.ts': {
      branches: 80,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/apis/GroupApi.ts': {
      branches: 80,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/apis/HealthApi.ts': {
      branches: 80,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/apis/LoginApi.ts': {
      branches: 60,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/apis/ProjectApi.ts': {
      branches: 80,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/apis/ResultApi.ts': {
      branches: 80,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/apis/RunApi.ts': {
      branches: 75,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/models/Artifact.ts': {
      branches: 80,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/models/ArtifactList.ts': {
      branches: 90,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/models/Dashboard.ts': {
      branches: 80,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/models/DashboardList.ts': {
      branches: 90,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/models/Group.ts': {
      branches: 75,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/models/GroupList.ts': {
      branches: 90,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/models/Pagination.ts': {
      branches: 90,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/models/Project.ts': {
      branches: 85,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/models/ProjectList.ts': {
      branches: 90,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/models/Result.ts': {
      branches: 95,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/models/ResultList.ts': {
      branches: 90,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/models/Run.ts': {
      branches: 90,
      functions: 100,
      lines: 90,
      statements: 90,
    },
    'src/models/RunList.ts': {
      branches: 90,
      functions: 100,
      lines: 90,
      statements: 90,
    },
  },

  // Custom flags that differ from ts-jest defaults
  verbose: true,
  testTimeout: 10000,
  errorOnDeprecated: true,
  clearMocks: true,
  maxWorkers: '50%',
};
