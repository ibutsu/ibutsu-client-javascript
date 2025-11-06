/**
 * Jest global setup file
 * This file is run once before all test suites
 */

import { setupFetchMock, restoreFetch } from './src/__tests__/test-utils';

// Setup fetch mock before each test
beforeEach(() => {
  setupFetchMock();
});

// Clean up fetch mock after each test
afterEach(() => {
  restoreFetch();
});
