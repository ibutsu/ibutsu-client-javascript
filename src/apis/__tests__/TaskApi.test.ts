import { TaskApi } from '../TaskApi';
import { Configuration } from '../../runtime';
import { createMockFetch, createMockResponse } from '../../__tests__/test-utils';

describe('TaskApi', () => {
  let api: TaskApi;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    const config = new Configuration({
      basePath: 'http://localhost/api',
    });
    api = new TaskApi(config);
  });

  describe('getTask', () => {
    it('should fetch a task by ID', async () => {
      const taskId = 'task-123';
      const expectedTask = {
        id: taskId,
        status: 'running',
        result: null,
      };

      mockFetch = createMockFetch(expectedTask);
      global.fetch = mockFetch;

      const result = await api.getTask({ id: taskId });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/task/${taskId}`,
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(expectedTask);
    });

    it('should handle 404 when task not found', async () => {
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Not Found' }, 404));
      global.fetch = mockFetch;
      await expect(api.getTask({ id: 'missing' })).rejects.toThrow();
    });

    it('should require id parameter', async () => {
      await expect(api.getTask({ id: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('authentication', () => {
    it('should include Bearer token when configured', async () => {
      const config = new Configuration({
        basePath: 'http://localhost/api',
        accessToken: async () => 'test-token',
      });
      api = new TaskApi(config);
      mockFetch = createMockFetch({});
      global.fetch = mockFetch;

      await api.getTask({ id: '1' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });
  });
});
