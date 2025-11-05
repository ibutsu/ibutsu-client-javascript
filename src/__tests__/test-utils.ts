/**
 * Test utilities for mocking and testing API calls
 */

import { Configuration } from '../runtime';

/**
 * Create a mock Configuration for testing
 */
export function createMockConfiguration(overrides?: Partial<Configuration>): Configuration {
  return new Configuration({
    basePath: 'http://localhost/api',
    ...overrides,
  });
}

/**
 * Create a mock fetch response
 */
export function createMockResponse<T>(
  data: T,
  status = 200,
  headers: Record<string, string> = {}
): Response {
  const response = {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: new Headers({
      'Content-Type': 'application/json',
      ...headers,
    }),
    json: async () => data,
    text: async () => JSON.stringify(data),
    blob: async () => new Blob([JSON.stringify(data)]),
    arrayBuffer: async () => new ArrayBuffer(0),
    formData: async () => new FormData(),
    clone: function () {
      return this;
    },
  } as Response;

  return response;
}

/**
 * Create a mock fetch function that returns a specific response
 */
export function createMockFetch<T>(data: T, status = 200): jest.Mock {
  return jest.fn().mockResolvedValue(createMockResponse(data, status));
}

/**
 * Create a mock fetch that can handle multiple responses
 */
export function createMockFetchSequence(
  responses: Array<{ data: unknown; status?: number }>
): jest.Mock {
  const mockFetch = jest.fn();
  responses.forEach((response) => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse(response.data, response.status ?? 200)
    );
  });
  return mockFetch;
}

/**
 * Setup global fetch mock
 */
export function setupFetchMock(): void {
  global.fetch = jest.fn();
}

/**
 * Restore fetch after tests
 */
export function restoreFetch(): void {
  if (global.fetch && jest.isMockFunction(global.fetch)) {
    (global.fetch as jest.Mock).mockRestore();
  }
}

/**
 * Helper to validate that an object matches a type structure
 */
export function validateObjectStructure<T>(
  obj: unknown,
  expectedKeys: Array<keyof T>
): obj is T {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  return expectedKeys.every((key) => key in obj);
}

