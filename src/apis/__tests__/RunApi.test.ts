import { RunApi } from '../RunApi';
import type { Run, RunList, UpdateRun } from '../../models';
import { Configuration } from '../../runtime';
import { createMockFetch, createMockResponse } from '../../__tests__/test-utils';

describe('RunApi', () => {
  let api: RunApi;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    const config = new Configuration({
      basePath: 'http://localhost/api',
    });
    api = new RunApi(config);
  });

  describe('addRun', () => {
    it('should create a new run', async () => {
      const newRun: Run = {
        metadata: {
          project: 'test-project',
          component: 'test-component',
        },
        summary: {
          passes: 0,
          failures: 0,
          skips: 0,
          errors: 0,
          xfailures: 0,
          xpasses: 0,
          tests: 0,
        },
      };

      const responseRun: Run = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...newRun,
        created: '2024-01-01T00:00:00.000Z',
      };

      mockFetch = createMockFetch(responseRun, 201);
      global.fetch = mockFetch;

      const result = await api.addRun({ run: newRun });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      interface FetchOptions {
        method: string;
        headers: Record<string, string>;
      }
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/run',
        expect.objectContaining<Partial<FetchOptions>>({
          method: 'POST',
          headers: expect.objectContaining<Record<string, string>>({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect((result.metadata as Record<string, unknown>).project).toBe('test-project');
    });

    it('should send run data with correct JSON format (snake_case)', async () => {
      const newRun: Run = {
        metadata: { project: 'test' },
        startTime: '2024-01-01T00:00:00.000Z',
      };

      mockFetch = jest.fn().mockResolvedValue(createMockResponse(newRun, 201));
      global.fetch = mockFetch;

      await api.addRun({ run: newRun });

      const callArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse((callArgs[1] as RequestInit).body as string);

      expect(requestBody).toHaveProperty('start_time');
      expect(requestBody.start_time).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should handle errors when creating a run', async () => {
      const newRun: Run = { metadata: { project: 'test' } };

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Bad Request' }, 400));
      global.fetch = mockFetch;

      await expect(api.addRun({ run: newRun })).rejects.toThrow();
    });
  });

  describe('getRun', () => {
    it('should fetch a run by ID', async () => {
      const runId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedRun: Run = {
        id: runId,
        metadata: { project: 'test-project' },
        summary: {
          passes: 10,
          failures: 2,
          skips: 1,
          errors: 0,
          xfailures: 0,
          xpasses: 0,
          tests: 13,
        },
      };

      mockFetch = createMockFetch(expectedRun);
      global.fetch = mockFetch;

      const result = await api.getRun({ id: runId });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/run/${runId}`,
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.id).toBe(runId);
      expect((result.summary as Record<string, unknown>).tests).toBe(13);
    });

    it('should handle 404 when run not found', async () => {
      const runId = '123e4567-e89b-12d3-a456-426614174000';

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Not Found' }, 404));
      global.fetch = mockFetch;

      await expect(api.getRun({ id: runId })).rejects.toThrow();
    });

    it('should require id parameter', async () => {
      await expect(api.getRun({ id: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('getRunList', () => {
    it('should fetch a list of runs', async () => {
      const mockRunList: RunList = {
        runs: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            metadata: { project: 'project1' },
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            metadata: { project: 'project2' },
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 2,
          totalPages: 1,
        },
      };

      mockFetch = createMockFetch(mockRunList);
      global.fetch = mockFetch;

      const result = await api.getRunList({});

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/run',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.runs).toHaveLength(2);
    });

    it('should handle pagination parameters', async () => {
      const mockRunList: RunList = {
        runs: [],
        pagination: {
          page: 2,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0,
        },
      };

      mockFetch = createMockFetch(mockRunList);
      global.fetch = mockFetch;

      await api.getRunList({ page: 2, pageSize: 10 });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('page=2');
      expect(url).toContain('pageSize=10');
    });

    it('should handle filter parameters', async () => {
      const mockRunList: RunList = {
        runs: [],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 0,
          totalPages: 0,
        },
      };

      mockFetch = createMockFetch(mockRunList);
      global.fetch = mockFetch;

      await api.getRunList({ filter: ['metadata.project=test-project', 'summary.failures>0'] });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('filter=');
    });

    it('should handle estimate parameter', async () => {
      const mockRunList: RunList = {
        runs: [],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 1000,
          totalPages: 40,
        },
      };

      mockFetch = createMockFetch(mockRunList);
      global.fetch = mockFetch;

      await api.getRunList({ estimate: true });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('estimate=true');
    });

    it('should return empty list when no runs exist', async () => {
      const mockRunList: RunList = {
        runs: [],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 0,
          totalPages: 0,
        },
      };

      mockFetch = createMockFetch(mockRunList);
      global.fetch = mockFetch;

      const result = await api.getRunList({});

      expect(result.runs).toHaveLength(0);
    });
  });

  describe('updateRun', () => {
    it('should update an existing run', async () => {
      const runId = '123e4567-e89b-12d3-a456-426614174000';
      const updatedRun: Run = {
        id: runId,
        metadata: {
          project: 'updated-project',
          env: 'production',
        },
        summary: {
          passes: 15,
          failures: 1,
          skips: 0,
          errors: 0,
          xfailures: 0,
          xpasses: 0,
          tests: 16,
        },
      };

      mockFetch = createMockFetch(updatedRun);
      global.fetch = mockFetch;

      const result = await api.updateRun({ id: runId, run: updatedRun });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/run/${runId}`,
        expect.objectContaining({
          method: 'PUT',
        })
      );
      expect((result.metadata as Record<string, unknown>).project).toBe('updated-project');
    });

    it('should handle partial updates', async () => {
      const runId = '123e4567-e89b-12d3-a456-426614174000';
      const partialUpdate: Run = {
        id: runId,
        metadata: { env: 'staging' },
      };

      mockFetch = createMockFetch(partialUpdate);
      global.fetch = mockFetch;

      const result = await api.updateRun({ id: runId, run: partialUpdate });

      expect((result.metadata as Record<string, unknown>).env).toBe('staging');
    });

    it('should require id parameter', async () => {
      const run: Run = { metadata: { project: 'test' } };

      await expect(api.updateRun({ id: null as unknown as string, run })).rejects.toThrow();
    });
  });

  describe('bulkUpdate', () => {
    it('should update multiple runs', async () => {
      const updateData: UpdateRun = {
        metadata: {
          tagged: 'bulk-update',
        },
      };

      const mockRunList: RunList = {
        runs: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            metadata: { project: 'test', tagged: 'bulk-update' },
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            metadata: { project: 'test', tagged: 'bulk-update' },
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 2,
          totalPages: 1,
        },
      };

      mockFetch = createMockFetch(mockRunList);
      global.fetch = mockFetch;

      const result = await api.bulkUpdate({
        filter: ['metadata.project=test'],
        updateRun: updateData,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/runs/bulk-update'),
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(result.runs).toHaveLength(2);
    });

    it('should handle pageSize parameter', async () => {
      const updateData: UpdateRun = {
        metadata: { status: 'archived' },
      };

      const mockRunList: RunList = {
        runs: [],
        pagination: { page: 1, pageSize: 100, totalItems: 0, totalPages: 0 },
      };

      mockFetch = createMockFetch(mockRunList);
      global.fetch = mockFetch;

      await api.bulkUpdate({
        filter: ['metadata.project=test'],
        pageSize: 100,
        updateRun: updateData,
      });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('pageSize=100');
    });

    it('should handle empty filter', async () => {
      const updateData: UpdateRun = {
        metadata: { global: 'true' },
      };

      const mockRunList: RunList = {
        runs: [],
        pagination: { page: 1, pageSize: 25, totalItems: 0, totalPages: 0 },
      };

      mockFetch = createMockFetch(mockRunList);
      global.fetch = mockFetch;

      const result = await api.bulkUpdate({ updateRun: updateData });

      expect(result.runs).toHaveLength(0);
    });
  });

  describe('authentication', () => {
    it('should include Bearer token when configured for getRun', async () => {
      const config = new Configuration({
        basePath: 'http://localhost/api',
        accessToken: async () => 'test-token-123',
      });
      api = new RunApi(config);

      const runId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedRun: Run = {
        id: runId,
        metadata: { project: 'test' },
      };

      mockFetch = createMockFetch(expectedRun);
      global.fetch = mockFetch;

      await api.getRun({ id: runId });

      interface FetchOptions {
        method: string;
        headers: Record<string, string>;
      }
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining<Partial<FetchOptions>>({
          headers: expect.objectContaining<Record<string, string>>({
            Authorization: 'Bearer test-token-123',
          }),
        })
      );
    });

    it('should include Bearer token when configured for addRun', async () => {
      const config = new Configuration({
        basePath: 'http://localhost/api',
        accessToken: async () => 'test-token-add',
      });
      api = new RunApi(config);

      const newRun: Run = { metadata: { project: 'test' } };
      mockFetch = createMockFetch({ id: 'run-123', ...newRun }, 201);
      global.fetch = mockFetch;

      await api.addRun({ run: newRun });

      interface FetchOptions {
        method: string;
        headers: Record<string, string>;
      }
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining<Partial<FetchOptions>>({
          headers: expect.objectContaining<Record<string, string>>({
            Authorization: 'Bearer test-token-add',
          }),
        })
      );
    });

    it('should include Bearer token when configured for getRunList', async () => {
      const config = new Configuration({
        basePath: 'http://localhost/api',
        accessToken: async () => 'test-token-list',
      });
      api = new RunApi(config);

      mockFetch = createMockFetch({ runs: [] });
      global.fetch = mockFetch;

      await api.getRunList({});

      interface FetchOptions {
        method: string;
        headers: Record<string, string>;
      }
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining<Partial<FetchOptions>>({
          headers: expect.objectContaining<Record<string, string>>({
            Authorization: 'Bearer test-token-list',
          }),
        })
      );
    });

    it('should include Bearer token when configured for updateRun', async () => {
      const config = new Configuration({
        basePath: 'http://localhost/api',
        accessToken: async () => 'test-token-update',
      });
      api = new RunApi(config);

      const updatedRun = { summary: { passed: 10 } };
      mockFetch = createMockFetch({ id: 'run-123', ...updatedRun });
      global.fetch = mockFetch;

      await api.updateRun({ id: 'run-123', run: updatedRun });

      interface FetchOptions {
        method: string;
        headers: Record<string, string>;
      }
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining<Partial<FetchOptions>>({
          headers: expect.objectContaining<Record<string, string>>({
            Authorization: 'Bearer test-token-update',
          }),
        })
      );
    });

    it('should work without authentication when not configured', async () => {
      const runId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedRun: Run = {
        id: runId,
        metadata: { project: 'test' },
      };

      mockFetch = createMockFetch(expectedRun);
      global.fetch = mockFetch;

      await api.getRun({ id: runId });

      const callArgs = mockFetch.mock.calls[0][1] as RequestInit;
      const headers = callArgs.headers as Record<string, string>;
      expect(headers.Authorization).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should handle 400 Bad Request errors', async () => {
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Bad Request' }, 400));
      global.fetch = mockFetch;

      await expect(api.addRun({ run: {} })).rejects.toThrow();
    });

    it('should handle 401 Unauthorized errors', async () => {
      const runId = '123e4567-e89b-12d3-a456-426614174000';
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Unauthorized' }, 401));
      global.fetch = mockFetch;

      await expect(api.getRun({ id: runId })).rejects.toThrow();
    });

    it('should handle 403 Forbidden errors', async () => {
      const runId = '123e4567-e89b-12d3-a456-426614174000';
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Forbidden' }, 403));
      global.fetch = mockFetch;

      await expect(api.updateRun({ id: runId, run: {} })).rejects.toThrow();
    });

    it('should handle 500 Internal Server Error', async () => {
      mockFetch = jest
        .fn()
        .mockResolvedValue(createMockResponse({ error: 'Internal Server Error' }, 500));
      global.fetch = mockFetch;

      await expect(api.getRunList({})).rejects.toThrow();
    });

    it('should handle 503 Service Unavailable', async () => {
      mockFetch = jest
        .fn()
        .mockResolvedValue(createMockResponse({ error: 'Service Unavailable' }, 503));
      global.fetch = mockFetch;

      await expect(api.getRunList({})).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
      global.fetch = mockFetch;

      await expect(api.getRunList({})).rejects.toThrow();
    });

    it('should handle malformed JSON responses', async () => {
      mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });
      global.fetch = mockFetch;

      await expect(api.getRunList({})).rejects.toThrow();
    });

    it('should handle empty response body for non-2xx status', async () => {
      mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({}),
        text: async () => '',
      });
      global.fetch = mockFetch;

      const runId = '123e4567-e89b-12d3-a456-426614174000';
      await expect(api.getRun({ id: runId })).rejects.toThrow();
    });
  });
});
