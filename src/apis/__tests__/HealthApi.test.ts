import { HealthApi } from '../HealthApi';
import type { Health, HealthInfo } from '../../models';
import { Configuration } from '../../runtime';
import { createMockFetch, createMockResponse } from '../../__tests__/test-utils';

describe('HealthApi', () => {
  let api: HealthApi;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    const config = new Configuration({
      basePath: 'http://localhost/api',
    });
    api = new HealthApi(config);
  });

  describe('getHealth', () => {
    it('should fetch general health report', async () => {
      const healthResponse: Health = {
        status: 'healthy',
        message: 'All systems operational',
      };

      mockFetch = createMockFetch(healthResponse);
      global.fetch = mockFetch;

      const result = await api.getHealth();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/health',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.status).toBe('healthy');
      expect(result.message).toBe('All systems operational');
    });

    it('should handle unhealthy status', async () => {
      const healthResponse: Health = {
        status: 'unhealthy',
        message: 'Service degraded',
      };

      mockFetch = createMockFetch(healthResponse);
      global.fetch = mockFetch;

      const result = await api.getHealth();

      expect(result.status).toBe('unhealthy');
    });

    it('should handle health check errors', async () => {
      mockFetch = jest
        .fn()
        .mockResolvedValue(createMockResponse({ error: 'Service Unavailable' }, 503));
      global.fetch = mockFetch;

      await expect(api.getHealth()).rejects.toThrow();
    });

    it('should work without authentication', async () => {
      const healthResponse: Health = {
        status: 'healthy',
      };

      mockFetch = createMockFetch(healthResponse);
      global.fetch = mockFetch;

      await api.getHealth();

      const callArgs = mockFetch.mock.calls[0][1] as RequestInit;
      const headers = callArgs.headers as Record<string, string>;
      expect(headers.Authorization).toBeUndefined();
    });
  });

  describe('getDatabaseHealth', () => {
    it('should fetch database health report', async () => {
      const healthResponse: Health = {
        status: 'healthy',
        message: 'Database connection OK',
      };

      mockFetch = createMockFetch(healthResponse);
      global.fetch = mockFetch;

      const result = await api.getDatabaseHealth();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/health/database',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.status).toBe('healthy');
    });

    it('should handle database connection issues', async () => {
      const healthResponse: Health = {
        status: 'unhealthy',
        message: 'Database connection failed',
      };

      mockFetch = createMockFetch(healthResponse, 500);
      global.fetch = mockFetch;

      await expect(api.getDatabaseHealth()).rejects.toThrow();
    });

    it('should include authentication when configured', async () => {
      const config = new Configuration({
        basePath: 'http://localhost/api',
        accessToken: async () => 'test-token-789',
      });
      api = new HealthApi(config);

      const healthResponse: Health = {
        status: 'healthy',
      };

      mockFetch = createMockFetch(healthResponse);
      global.fetch = mockFetch;

      await api.getDatabaseHealth();

      interface FetchOptions {
        method: string;
        headers: Record<string, string>;
      }
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining<Partial<FetchOptions>>({
          headers: expect.objectContaining<Record<string, string>>({
            Authorization: 'Bearer test-token-789',
          }),
        })
      );
    });

    it('should handle timeout errors', async () => {
      mockFetch = jest.fn().mockRejectedValue(new Error('Request timeout'));
      global.fetch = mockFetch;

      await expect(api.getDatabaseHealth()).rejects.toThrow();
    });
  });

  describe('getHealthInfo', () => {
    it('should fetch server information', async () => {
      const healthInfoResponse = {
        frontend: 'http://localhost:3000',
        backend: 'http://localhost:8080/api',
        api_ui: 'http://localhost:8080/api/ui',
      };

      mockFetch = createMockFetch(healthInfoResponse);
      global.fetch = mockFetch;

      const result = await api.getHealthInfo();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/health/info',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.frontend).toBe('http://localhost:3000');
      expect(result.backend).toBe('http://localhost:8080/api');
      expect(result.apiUi).toBe('http://localhost:8080/api/ui');
    });

    it('should handle minimal health info', async () => {
      const healthInfoResponse: HealthInfo = {
        frontend: 'http://localhost:3000',
      };

      mockFetch = createMockFetch(healthInfoResponse);
      global.fetch = mockFetch;

      const result = await api.getHealthInfo();

      expect(result.frontend).toBe('http://localhost:3000');
    });

    it('should include authentication when configured', async () => {
      const config = new Configuration({
        basePath: 'http://localhost/api',
        accessToken: async () => 'test-token-info',
      });
      api = new HealthApi(config);

      const healthInfoResponse = {
        backend: 'http://localhost:8080/api',
      };

      mockFetch = createMockFetch(healthInfoResponse);
      global.fetch = mockFetch;

      await api.getHealthInfo();

      interface FetchOptions {
        method: string;
        headers: Record<string, string>;
      }
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining<Partial<FetchOptions>>({
          headers: expect.objectContaining<Record<string, string>>({
            Authorization: 'Bearer test-token-info',
          }),
        })
      );
    });

    it('should handle health info errors', async () => {
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Forbidden' }, 403));
      global.fetch = mockFetch;

      await expect(api.getHealthInfo()).rejects.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle 500 Internal Server Error', async () => {
      mockFetch = jest
        .fn()
        .mockResolvedValue(createMockResponse({ error: 'Internal Server Error' }, 500));
      global.fetch = mockFetch;

      await expect(api.getHealth()).rejects.toThrow();
    });

    it('should handle 503 Service Unavailable', async () => {
      mockFetch = jest
        .fn()
        .mockResolvedValue(createMockResponse({ error: 'Service Unavailable' }, 503));
      global.fetch = mockFetch;

      await expect(api.getHealth()).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      mockFetch = jest.fn().mockRejectedValue(new Error('Network connection failed'));
      global.fetch = mockFetch;

      await expect(api.getHealth()).rejects.toThrow();
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

      await expect(api.getHealth()).rejects.toThrow();
    });
  });
});
