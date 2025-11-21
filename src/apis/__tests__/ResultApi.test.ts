import { ResultApi } from '../ResultApi';
import { type Result, type ResultList, ResultResultEnum } from '../../models';
import { Configuration } from '../../runtime';
import { createMockFetch } from '../../__tests__/test-utils';

describe('ResultApi', () => {
  let api: ResultApi;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    const config = new Configuration({
      basePath: 'http://localhost/api',
    });
    api = new ResultApi(config);
  });

  describe('addResult', () => {
    it('should create a new test result', async () => {
      const newResult: Result = {
        testId: 'test-123',
        result: ResultResultEnum.Passed,
        duration: 5.5,
        startTime: '2024-01-01T00:00:00Z',
      };

      const responseResult = {
        id: 'result-456',
        test_id: 'test-123',
        result: 'passed',
        duration: 5.5,
        start_time: '2024-01-01T00:00:00Z',
      };

      mockFetch = createMockFetch(responseResult, 201);
      global.fetch = mockFetch;

      const result = await api.addResult({ result: newResult });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      interface FetchOptions {
        method: string;
        headers: Record<string, string>;
      }
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/result',
        expect.objectContaining<Partial<FetchOptions>>({
          method: 'POST',
          headers: expect.objectContaining<Record<string, string>>({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result.id).toBe('result-456');
      expect(result.testId).toBe('test-123');
    });

    it('should send result data with correct JSON format (snake_case)', async () => {
      const newResult: Result = {
        testId: 'test-123',
        startTime: '2024-01-01T00:00:00Z',
        runId: 'run-789',
        projectId: 'project-101',
      };

      mockFetch = createMockFetch({ id: 'result-456', ...newResult });
      global.fetch = mockFetch;

      await api.addResult({ result: newResult });

      const callArgs = mockFetch.mock.calls[0] as [string, RequestInit];
      const bodyString = callArgs[1].body as string;
      const body: {
        test_id?: string;
        start_time?: string;
        run_id?: string;
        project_id?: string;
      } = JSON.parse(bodyString) as {
        test_id?: string;
        start_time?: string;
        run_id?: string;
        project_id?: string;
      };

      expect(body).toHaveProperty('test_id', 'test-123');
      expect(body).toHaveProperty('start_time', '2024-01-01T00:00:00Z');
      expect(body).toHaveProperty('run_id', 'run-789');
      expect(body).toHaveProperty('project_id', 'project-101');
    });

    it('should handle all result statuses', async () => {
      const statuses = [
        ResultResultEnum.Passed,
        ResultResultEnum.Failed,
        ResultResultEnum.Error,
        ResultResultEnum.Skipped,
      ];

      for (const status of statuses) {
        mockFetch = createMockFetch({ id: 'result-123', result: status });
        global.fetch = mockFetch;

        const result = await api.addResult({
          result: { result: status },
        });

        expect(result.result).toBe(status);
      }
    });

    it('should handle metadata and params objects', async () => {
      const newResult: Result = {
        testId: 'test-123',
        metadata: {
          browser: 'chrome',
          version: '100',
        },
        params: {
          timeout: 30,
          retries: 3,
        },
      };

      mockFetch = createMockFetch({ id: 'result-456', ...newResult });
      global.fetch = mockFetch;

      const result = await api.addResult({ result: newResult });

      expect(result.metadata).toEqual(newResult.metadata);
      expect(result.params).toEqual(newResult.params);
    });
  });

  describe('getResult', () => {
    it('should fetch a result by ID', async () => {
      const result = {
        id: 'result-123',
        test_id: 'test-456',
        result: 'passed',
        duration: 10.5,
      };

      mockFetch = createMockFetch(result);
      global.fetch = mockFetch;

      const fetchedResult = await api.getResult({ id: 'result-123' });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/result/result-123',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(fetchedResult.id).toBe('result-123');
      expect(fetchedResult.testId).toBe('test-456');
      expect(fetchedResult.result).toBe('passed');
      expect(fetchedResult.duration).toBe(10.5);
    });

    it('should handle 404 when result not found', async () => {
      mockFetch = createMockFetch({ error: 'Not Found' }, 404);
      global.fetch = mockFetch;

      await expect(api.getResult({ id: 'non-existent' })).rejects.toThrow();
    });

    it('should require id parameter', async () => {
      await expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        api.getResult({ id: null as any })
      ).rejects.toThrow();
    });
  });

  describe('getResultList', () => {
    it('should fetch a list of results', async () => {
      const resultList: ResultList = {
        results: [
          {
            id: 'result-1',
            testId: 'test-1',
            result: ResultResultEnum.Passed,
          },
          {
            id: 'result-2',
            testId: 'test-2',
            result: ResultResultEnum.Failed,
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 2,
          totalPages: 1,
        },
      };

      mockFetch = createMockFetch(resultList);
      global.fetch = mockFetch;

      const result = await api.getResultList({});

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result.results).toHaveLength(2);
      expect(result.pagination?.totalItems).toBe(2);
    });

    it('should handle pagination parameters', async () => {
      mockFetch = createMockFetch({ results: [] });
      global.fetch = mockFetch;

      await api.getResultList({
        page: 3,
        pageSize: 100,
      });

      const callArgs = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(callArgs[0]).toContain('page=3');
      expect(callArgs[0]).toContain('pageSize=100');
    });

    it('should handle filter parameters', async () => {
      mockFetch = createMockFetch({ results: [] });
      global.fetch = mockFetch;

      await api.getResultList({
        filter: ['result=passed', 'duration>10'],
      });

      const callArgs = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(callArgs[0]).toContain('filter=result%3Dpassed');
      expect(callArgs[0]).toContain('filter=duration');
    });

    it('should handle estimate parameter', async () => {
      mockFetch = createMockFetch({
        results: [],
        pagination: { totalItems: '~1000' },
      });
      global.fetch = mockFetch;

      await api.getResultList({
        estimate: true,
      });

      const callArgs = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(callArgs[0]).toContain('estimate=true');
    });

    it('should return empty list when no results exist', async () => {
      const emptyList: ResultList = {
        results: [],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 0,
          totalPages: 0,
        },
      };

      mockFetch = createMockFetch(emptyList);
      global.fetch = mockFetch;

      const result = await api.getResultList({});

      expect(result.results).toHaveLength(0);
      expect(result.pagination?.totalItems).toBe(0);
    });
  });

  describe('updateResult', () => {
    it('should update an existing result', async () => {
      const updatedResult: Result = {
        id: 'result-123',
        testId: 'test-456',
        result: ResultResultEnum.Failed,
        duration: 15.5,
      };

      mockFetch = createMockFetch(updatedResult);
      global.fetch = mockFetch;

      const result = await api.updateResult({
        id: 'result-123',
        result: updatedResult,
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      interface FetchOptions {
        method: string;
        headers: Record<string, string>;
      }
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/result/result-123',
        expect.objectContaining<Partial<FetchOptions>>({
          method: 'PUT',
          headers: expect.objectContaining<Record<string, string>>({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result.result).toBe(ResultResultEnum.Failed);
      expect(result.duration).toBe(15.5);
    });

    it('should handle partial updates', async () => {
      const partialUpdate: Result = {
        result: ResultResultEnum.Error,
      };

      mockFetch = createMockFetch({
        id: 'result-123',
        test_id: 'test-456',
        result: 'error',
        duration: 10,
      });
      global.fetch = mockFetch;

      const result = await api.updateResult({
        id: 'result-123',
        result: partialUpdate,
      });

      expect(result.result).toBe(ResultResultEnum.Error);
      expect(result.testId).toBe('test-456');
    });

    it('should handle metadata updates', async () => {
      const updatedMetadata = {
        metadata: {
          retried: true,
          failureReason: 'timeout',
        },
      };

      mockFetch = createMockFetch({
        id: 'result-123',
        ...updatedMetadata,
      });
      global.fetch = mockFetch;

      const result = await api.updateResult({
        id: 'result-123',
        result: updatedMetadata,
      });

      expect(result.metadata).toEqual(updatedMetadata.metadata);
    });

    it('should require id parameter', async () => {
      await expect(
        api.updateResult({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          id: null as any,
          result: {},
        })
      ).rejects.toThrow();
    });
  });

  describe('filter operations', () => {
    it('should handle complex filter queries', async () => {
      mockFetch = createMockFetch({ results: [] });
      global.fetch = mockFetch;

      await api.getResultList({
        filter: ['result=passed', 'duration>5', 'env=production', 'metadata.browser~chrome'],
      });

      const callArgs = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(callArgs[0]).toContain('filter=');
      expect(mockFetch).toHaveBeenCalled();
    });

    it('should handle special characters in filters', async () => {
      mockFetch = createMockFetch({ results: [] });
      global.fetch = mockFetch;

      await api.getResultList({
        filter: ['test_id~test-.*-regex'],
      });

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('authentication', () => {
    it('should include Bearer token when configured', async () => {
      const configWithAuth = new Configuration({
        basePath: 'http://localhost/api',
        accessToken: 'test-token-456',
      });
      const authenticatedApi = new ResultApi(configWithAuth);

      mockFetch = createMockFetch({ results: [] });
      global.fetch = mockFetch;

      await authenticatedApi.getResultList({});

      const callArgs = mockFetch.mock.calls[0] as [string, RequestInit];
      const { headers } = callArgs[1];
      expect((headers as Record<string, string>).Authorization).toBe('Bearer test-token-456');
    });

    it('should work without authentication when not configured', async () => {
      mockFetch = createMockFetch({ results: [] });
      global.fetch = mockFetch;

      await api.getResultList({});

      const callArgs = mockFetch.mock.calls[0] as [string, RequestInit];
      const { headers } = callArgs[1];
      expect((headers as Record<string, string>).Authorization).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should handle 400 Bad Request errors', async () => {
      mockFetch = createMockFetch({ error: 'Bad Request' }, 400);
      global.fetch = mockFetch;

      await expect(api.addResult({ result: {} })).rejects.toThrow();
    });

    it('should handle 401 Unauthorized errors', async () => {
      mockFetch = createMockFetch({ error: 'Unauthorized' }, 401);
      global.fetch = mockFetch;

      await expect(api.getResultList({})).rejects.toThrow();
    });

    it('should handle 403 Forbidden errors', async () => {
      mockFetch = createMockFetch({ error: 'Forbidden' }, 403);
      global.fetch = mockFetch;

      await expect(api.getResult({ id: 'result-123' })).rejects.toThrow();
    });

    it('should handle 500 Internal Server Error', async () => {
      mockFetch = createMockFetch({ error: 'Internal Server Error' }, 500);
      global.fetch = mockFetch;

      await expect(api.getResultList({})).rejects.toThrow();
    });

    it('should handle 502 Bad Gateway errors', async () => {
      mockFetch = createMockFetch({ error: 'Bad Gateway' }, 502);
      global.fetch = mockFetch;

      await expect(api.updateResult({ id: 'result-1', result: {} })).rejects.toThrow();
    });

    it('should handle 503 Service Unavailable', async () => {
      mockFetch = createMockFetch({ error: 'Service Unavailable' }, 503);
      global.fetch = mockFetch;

      await expect(api.addResult({ result: {} })).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
      global.fetch = mockFetch;

      // Network errors are wrapped in a FetchError by the runtime
      await expect(api.getResultList({})).rejects.toThrow();
    });

    it('should handle timeout errors', async () => {
      mockFetch = jest.fn().mockRejectedValue(new Error('Request timeout'));
      global.fetch = mockFetch;

      // Timeout errors are wrapped in a FetchError by the runtime
      await expect(api.getResult({ id: 'result-123' })).rejects.toThrow();
    });

    it('should handle malformed JSON responses', async () => {
      mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => Promise.reject(new Error('Invalid JSON')),
      });
      global.fetch = mockFetch;

      await expect(api.getResultList({})).rejects.toThrow();
    });

    it('should handle empty response body for non-2xx status', async () => {
      mockFetch = createMockFetch(null, 404);
      global.fetch = mockFetch;

      await expect(api.getResult({ id: 'missing' })).rejects.toThrow();
    });

    it('should handle malformed error responses', async () => {
      mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => Promise.resolve('not an object'),
        text: async () => Promise.resolve('not an object'),
      });
      global.fetch = mockFetch;

      await expect(api.addResult({ result: {} })).rejects.toThrow();
    });

    it('should handle responses with missing required fields', async () => {
      mockFetch = createMockFetch({ incomplete: 'data' });
      global.fetch = mockFetch;

      // The API should still return the response even if fields are missing
      // The validation happens at the application level
      const result = await api.getResult({ id: 'result-123' });
      expect(result).toBeDefined();
    });
  });
});
