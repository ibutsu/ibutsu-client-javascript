import { WidgetConfigApi } from '../WidgetConfigApi';
import type { WidgetConfig, WidgetConfigList } from '../../models';
import { Configuration } from '../../runtime';
import { createMockFetch, createMockResponse } from '../../__tests__/test-utils';

describe('WidgetConfigApi', () => {
  let api: WidgetConfigApi;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    const config = new Configuration({
      basePath: 'http://localhost/api',
    });
    api = new WidgetConfigApi(config);
  });

  describe('addWidgetConfig', () => {
    it('should create a new widget config', async () => {
      const newConfig: WidgetConfig = {
        title: 'Test Config',
        type: 'bar',
      };

      const responseConfig: WidgetConfig = {
        id: 'config-123',
        ...newConfig,
      };

      mockFetch = createMockFetch(responseConfig, 201);
      global.fetch = mockFetch;

      const result = await api.addWidgetConfig({ widgetConfig: newConfig });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/widget-config',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result.id).toBe('config-123');
    });

    it('should handle errors when creating a widget config', async () => {
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Bad Request' }, 400));
      global.fetch = mockFetch;

      await expect(api.addWidgetConfig({ widgetConfig: {} })).rejects.toThrow();
    });
  });

  describe('getWidgetConfig', () => {
    it('should fetch a widget config by ID', async () => {
      const configId = 'config-123';
      const expectedConfig: WidgetConfig = {
        id: configId,
        title: 'Test Config',
      };

      mockFetch = createMockFetch(expectedConfig);
      global.fetch = mockFetch;

      const result = await api.getWidgetConfig({ id: configId });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/widget-config/${configId}`,
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.id).toBe(configId);
    });

    it('should handle 404 when not found', async () => {
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Not Found' }, 404));
      global.fetch = mockFetch;
      await expect(api.getWidgetConfig({ id: 'missing' })).rejects.toThrow();
    });

    it('should require id parameter', async () => {
      await expect(api.getWidgetConfig({ id: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('getWidgetConfigList', () => {
    it('should fetch a list of widget configs', async () => {
      const mockList: WidgetConfigList = {
        widgets: [
          { id: '1', title: 'Config 1' },
          { id: '2', title: 'Config 2' },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 2,
          totalPages: 1,
        },
      };

      mockFetch = createMockFetch(mockList);
      global.fetch = mockFetch;

      const result = await api.getWidgetConfigList({});

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/widget-config',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.widgets).toHaveLength(2);
    });

    it('should handle pagination parameters', async () => {
      mockFetch = createMockFetch({ widgets: [] });
      global.fetch = mockFetch;

      await api.getWidgetConfigList({ page: 2, pageSize: 10 });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('page=2');
      expect(url).toContain('pageSize=10');
    });

    it('should handle filter parameters', async () => {
      mockFetch = createMockFetch({ widgets: [] });
      global.fetch = mockFetch;

      await api.getWidgetConfigList({ filter: ['type=bar'] });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('filter=');
    });
  });

  describe('updateWidgetConfig', () => {
    it('should update an existing widget config', async () => {
      const configId = 'config-123';
      const updatedConfig: WidgetConfig = {
        id: configId,
        title: 'Updated Config',
      };

      mockFetch = createMockFetch(updatedConfig);
      global.fetch = mockFetch;

      const result = await api.updateWidgetConfig({ id: configId, widgetConfig: updatedConfig });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/widget-config/${configId}`,
        expect.objectContaining({
          method: 'PUT',
        })
      );
      expect(result.title).toBe('Updated Config');
    });

    it('should require id parameter', async () => {
      await expect(
        api.updateWidgetConfig({ id: null as unknown as string, widgetConfig: {} })
      ).rejects.toThrow();
    });
  });

  describe('deleteWidgetConfig', () => {
    it('should delete a widget config', async () => {
      const configId = 'config-delete';
      mockFetch = jest.fn().mockResolvedValue({ ok: true, status: 204 });
      global.fetch = mockFetch;

      await api.deleteWidgetConfig({ id: configId });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/widget-config/${configId}`,
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('should require id parameter', async () => {
      await expect(api.deleteWidgetConfig({ id: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('authentication', () => {
    it('should include Bearer token when configured', async () => {
      const config = new Configuration({
        basePath: 'http://localhost/api',
        accessToken: async () => 'test-token',
      });
      api = new WidgetConfigApi(config);
      mockFetch = createMockFetch({});
      global.fetch = mockFetch;

      await api.getWidgetConfig({ id: '1' });

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
