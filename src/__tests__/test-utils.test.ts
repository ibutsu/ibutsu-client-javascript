/**
 * Tests for test utilities
 */

/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import {
  createMockConfiguration,
  createMockResponse,
  createMockFetch,
  createMockFetchSequence,
  setupFetchMock,
  restoreFetch,
  validateObjectStructure,
} from './test-utils';
import { Configuration } from '../runtime';

describe('test-utils', () => {
  describe('createMockConfiguration', () => {
    it('should create a Configuration with default basePath', () => {
      const config = createMockConfiguration();

      expect(config).toBeInstanceOf(Configuration);
      expect(config.basePath).toBe('http://localhost/api');
    });

    it('should allow overriding basePath', () => {
      const config = createMockConfiguration({
        basePath: 'https://example.com/api',
      });

      expect(config.basePath).toBe('https://example.com/api');
    });

    it('should allow adding accessToken', async () => {
      // TypeScript's getter type inference causes a false positive here
      // The constructor accepts string, but the getter returns a function
      const config = createMockConfiguration({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        accessToken: 'test-token' as any,
      });

      // accessToken getter returns a function, not the raw token
      expect(config.accessToken).toBeDefined();
      expect(typeof config.accessToken).toBe('function');
      if (config.accessToken) {
        expect(await config.accessToken()).toBe('test-token');
      }
    });

    it('should allow multiple overrides', async () => {
      const config = createMockConfiguration({
        basePath: 'https://test.com',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        accessToken: 'token-123' as any,
      });

      expect(config.basePath).toBe('https://test.com');
      expect(config.accessToken).toBeDefined();
      if (config.accessToken) {
        expect(await config.accessToken()).toBe('token-123');
      }
    });
  });

  describe('createMockResponse', () => {
    it('should create a successful response by default', async () => {
      const data = { id: '123', name: 'test' };
      const response = createMockResponse(data);

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
      expect(await response.json()).toEqual(data);
    });

    it('should handle 2xx status codes as ok', () => {
      const response201 = createMockResponse({ id: '1' }, 201);
      const response204 = createMockResponse(null, 204);

      expect(response201.ok).toBe(true);
      expect(response201.status).toBe(201);
      expect(response204.ok).toBe(true);
      expect(response204.status).toBe(204);
    });

    it('should handle error status codes (4xx)', async () => {
      const errorData = { error: 'Not Found' };
      const response = createMockResponse(errorData, 404);

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
      expect(response.statusText).toBe('Error');
      expect(await response.json()).toEqual(errorData);
    });

    it('should handle error status codes (5xx)', async () => {
      const errorData = { error: 'Internal Server Error' };
      const response = createMockResponse(errorData, 500);

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
      expect(response.statusText).toBe('Error');
      expect(await response.json()).toEqual(errorData);
    });

    it('should handle custom headers', () => {
      const response = createMockResponse({ data: 'test' }, 200, {
        'X-Custom-Header': 'custom-value',
      });

      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.headers.get('X-Custom-Header')).toBe('custom-value');
    });

    it('should allow header overrides', () => {
      const response = createMockResponse({ data: 'test' }, 200, {
        'Content-Type': 'text/plain',
      });

      expect(response.headers.get('Content-Type')).toBe('text/plain');
    });

    it('should implement text() method', async () => {
      const data = { id: '123', name: 'test' };
      const response = createMockResponse(data);

      expect(await response.text()).toBe(JSON.stringify(data));
    });

    it('should implement blob() method', async () => {
      const data = { id: '123' };
      const response = createMockResponse(data);
      const blob = await response.blob();

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBeGreaterThan(0);
    });

    it('should implement arrayBuffer() method', async () => {
      const response = createMockResponse({ data: 'test' });
      const buffer = await response.arrayBuffer();

      expect(buffer).toBeInstanceOf(ArrayBuffer);
    });

    it('should implement formData() method', async () => {
      const response = createMockResponse({ data: 'test' });
      const formData = await response.formData();

      expect(formData).toBeInstanceOf(FormData);
    });

    it('should implement clone() method that returns a fresh copy', async () => {
      const data = { id: '123', mutable: 'original' };
      const response = createMockResponse(data);
      const cloned = response.clone();

      expect(cloned).not.toBe(response);
      expect(cloned.status).toBe(response.status);
      expect(cloned.ok).toBe(response.ok);
      expect(await cloned.json()).toEqual(await response.json());
    });

    it('should handle edge case: empty object', async () => {
      const response = createMockResponse({});

      expect(response.ok).toBe(true);
      expect(await response.json()).toEqual({});
    });

    it('should handle edge case: null data', async () => {
      const response = createMockResponse(null);

      expect(response.ok).toBe(true);
      expect(await response.json()).toBe(null);
    });

    it('should handle edge case: array data', async () => {
      const data = [1, 2, 3];
      const response = createMockResponse(data);

      expect(await response.json()).toEqual(data);
    });

    it('should handle edge case: string data', async () => {
      const data = 'test string';
      const response = createMockResponse(data);

      expect(await response.json()).toBe(data);
      expect(await response.text()).toBe('"test string"');
    });
  });

  describe('createMockFetch', () => {
    it('should create a jest mock that returns a response', async () => {
      const data = { id: '123' };
      const mockFetch = createMockFetch(data);

      expect(jest.isMockFunction(mockFetch)).toBe(true);

      const response = await mockFetch('http://test.com', {});
      expect(response.ok).toBe(true);
      expect(await response.json()).toEqual(data);
    });

    it('should allow custom status codes', async () => {
      const mockFetch = createMockFetch({ error: 'Unauthorized' }, 401);
      const response = await mockFetch('http://test.com', {});

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });

    it('should be reusable for multiple calls', async () => {
      const data = { id: '123' };
      const mockFetch = createMockFetch(data);

      await mockFetch('http://test.com/1', {});
      await mockFetch('http://test.com/2', {});

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('createMockFetchSequence', () => {
    it('should create a mock that returns different responses in sequence', async () => {
      const responses = [
        { data: { id: '1' }, status: 200 },
        { data: { id: '2' }, status: 200 },
        { data: { error: 'Not Found' }, status: 404 },
      ];

      const mockFetch = createMockFetchSequence(responses);

      const response1 = await mockFetch('http://test.com/1', {});
      expect(await response1.json()).toEqual({ id: '1' });
      expect(response1.status).toBe(200);

      const response2 = await mockFetch('http://test.com/2', {});
      expect(await response2.json()).toEqual({ id: '2' });
      expect(response2.status).toBe(200);

      const response3 = await mockFetch('http://test.com/3', {});
      expect(await response3.json()).toEqual({ error: 'Not Found' });
      expect(response3.status).toBe(404);
    });

    it('should default to status 200 when not specified', async () => {
      const responses = [{ data: { id: '1' } }, { data: { id: '2' } }];

      const mockFetch = createMockFetchSequence(responses);

      const response1 = await mockFetch('http://test.com/1', {});
      expect(response1.status).toBe(200);

      const response2 = await mockFetch('http://test.com/2', {});
      expect(response2.status).toBe(200);
    });

    it('should handle empty sequence', () => {
      const mockFetch = createMockFetchSequence([]);

      expect(jest.isMockFunction(mockFetch)).toBe(true);
      expect(mockFetch.mock.calls.length).toBe(0);
    });
  });

  describe('setupFetchMock and restoreFetch', () => {
    let originalFetch: typeof global.fetch;

    beforeEach(() => {
      originalFetch = global.fetch;
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('should setup global fetch as a jest mock', () => {
      setupFetchMock();

      expect(jest.isMockFunction(global.fetch)).toBe(true);
    });

    it('should allow restoring fetch', () => {
      setupFetchMock();
      expect(jest.isMockFunction(global.fetch)).toBe(true);

      restoreFetch();

      // After restore, if it was a mock, mockRestore should have been called
      // We can't easily test the exact state, but we can verify no errors occurred
      expect(() => restoreFetch()).not.toThrow();
    });

    it('should handle restoreFetch when fetch is not mocked', () => {
      global.fetch = originalFetch;

      expect(() => restoreFetch()).not.toThrow();
    });

    it('should be reusable in multiple test contexts', () => {
      setupFetchMock();
      const mockFetch1 = global.fetch;
      restoreFetch();

      setupFetchMock();
      const mockFetch2 = global.fetch;

      expect(jest.isMockFunction(mockFetch1)).toBe(true);
      expect(jest.isMockFunction(mockFetch2)).toBe(true);
    });
  });

  describe('validateObjectStructure', () => {
    interface TestType {
      id: string;
      name: string;
      optional?: number;
    }

    it('should return true for valid object structure', () => {
      const obj = { id: '123', name: 'test', optional: 42 };
      const result = validateObjectStructure<TestType>(obj, ['id', 'name']);

      expect(result).toBe(true);
    });

    it('should return true when optional fields are missing', () => {
      const obj = { id: '123', name: 'test' };
      const result = validateObjectStructure<TestType>(obj, ['id', 'name']);

      expect(result).toBe(true);
    });

    it('should return true even with extra fields', () => {
      const obj = { id: '123', name: 'test', extra: 'field' };
      const result = validateObjectStructure<TestType>(obj, ['id', 'name']);

      expect(result).toBe(true);
    });

    it('should return false when required keys are missing', () => {
      const obj = { id: '123' };
      const result = validateObjectStructure<TestType>(obj, ['id', 'name']);

      expect(result).toBe(false);
    });

    it('should return false for null input', () => {
      const result = validateObjectStructure<TestType>(null, ['id', 'name']);

      expect(result).toBe(false);
    });

    it('should return false for undefined input', () => {
      const result = validateObjectStructure<TestType>(undefined, ['id', 'name']);

      expect(result).toBe(false);
    });

    it('should return false for non-object types (string)', () => {
      const result = validateObjectStructure<TestType>('not an object', ['id', 'name']);

      expect(result).toBe(false);
    });

    it('should return false for non-object types (number)', () => {
      const result = validateObjectStructure<TestType>(123, ['id', 'name']);

      expect(result).toBe(false);
    });

    it('should return false for arrays', () => {
      const result = validateObjectStructure<TestType>(
        [{ id: '123', name: 'test' }],
        ['id', 'name']
      );

      expect(result).toBe(false);
    });

    it('should handle empty expected keys array', () => {
      const obj = { id: '123', name: 'test' };
      const result = validateObjectStructure<TestType>(obj, []);

      expect(result).toBe(true);
    });

    it('should handle empty object with empty keys', () => {
      const obj = {};
      const result = validateObjectStructure<TestType>(obj, []);

      expect(result).toBe(true);
    });

    it('should handle empty object with required keys', () => {
      const obj = {};
      const result = validateObjectStructure<TestType>(obj, ['id', 'name']);

      expect(result).toBe(false);
    });
  });
});
