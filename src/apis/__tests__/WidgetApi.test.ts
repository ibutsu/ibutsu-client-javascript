import { WidgetApi } from '../WidgetApi';
import type { WidgetTypeList } from '../../models';
import { Configuration } from '../../runtime';
import { createMockFetch, createMockResponse } from '../../__tests__/test-utils';

describe('WidgetApi', () => {
  let api: WidgetApi;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    const config = new Configuration({
      basePath: 'http://localhost/api',
    });
    api = new WidgetApi(config);
  });

  describe('getWidget', () => {
    it('should fetch a widget by ID', async () => {
      const widgetId = 'widget-123';
      const expectedWidget = {
        id: widgetId,
        type: 'bar',
        title: 'Test Widget',
      };

      mockFetch = createMockFetch(expectedWidget);
      global.fetch = mockFetch;

      const result = await api.getWidget({ id: widgetId });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/widget/${widgetId}`,
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(expectedWidget);
    });

    it('should include params in query string', async () => {
      const widgetId = 'widget-params';
      const params = { metric: 'duration' };

      mockFetch = createMockFetch({});
      global.fetch = mockFetch;

      await api.getWidget({ id: widgetId, params });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain(widgetId);
    });

    it('should handle 404 when widget not found', async () => {
      const widgetId = 'non-existent';
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Not Found' }, 404));
      global.fetch = mockFetch;

      await expect(api.getWidget({ id: widgetId })).rejects.toThrow();
    });

    it('should require id parameter', async () => {
      await expect(api.getWidget({ id: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('getWidgetTypes', () => {
    it('should fetch a list of widget types', async () => {
      const mockWidgetTypeList: WidgetTypeList = {
        types: [
          {
            id: 'type-1',
            title: 'Type One',
          },
          {
            id: 'type-2',
            title: 'Type Two',
          },
        ],
      };

      mockFetch = createMockFetch(mockWidgetTypeList);
      global.fetch = mockFetch;

      const result = await api.getWidgetTypes();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/widget/types',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.types).toHaveLength(2);
    });

    it('should filter by type', async () => {
      const type = 'bar';
      mockFetch = createMockFetch({ types: [] });
      global.fetch = mockFetch;

      await api.getWidgetTypes({ type });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain(`type=${type}`);
    });
  });

  describe('authentication', () => {
    it('should include Bearer token when configured for getWidget', async () => {
      const config = new Configuration({
        basePath: 'http://localhost/api',
        accessToken: async () => 'test-token',
      });
      api = new WidgetApi(config);

      mockFetch = createMockFetch({});
      global.fetch = mockFetch;

      await api.getWidget({ id: '123' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('should include Bearer token when configured for getWidgetTypes', async () => {
      const config = new Configuration({
        basePath: 'http://localhost/api',
        accessToken: async () => 'test-token',
      });
      api = new WidgetApi(config);

      mockFetch = createMockFetch({});
      global.fetch = mockFetch;

      await api.getWidgetTypes();

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
