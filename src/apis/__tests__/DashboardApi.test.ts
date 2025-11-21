import { DashboardApi } from '../DashboardApi';
import type { Dashboard, DashboardList } from '../../models';
import { Configuration } from '../../runtime';
import { createMockFetch, createMockResponse } from '../../__tests__/test-utils';

describe('DashboardApi', () => {
  let api: DashboardApi;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    const config = new Configuration({
      basePath: 'http://localhost/api',
    });
    api = new DashboardApi(config);
  });

  describe('addDashboard', () => {
    it('should create a new dashboard', async () => {
      const newDashboard: Dashboard = {
        title: 'Test Dashboard',
        description: 'A test dashboard',
      };

      const responseDashboard: Dashboard = {
        id: 'dashboard-123',
        ...newDashboard,
      };

      mockFetch = createMockFetch(responseDashboard, 201);
      global.fetch = mockFetch;

      const result = await api.addDashboard({ dashboard: newDashboard });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      interface FetchOptions {
        method: string;
        headers: Record<string, string>;
      }
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/dashboard',
        expect.objectContaining<Partial<FetchOptions>>({
          method: 'POST',
          headers: expect.objectContaining<Record<string, string>>({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result.id).toBe('dashboard-123');
      expect(result.title).toBe('Test Dashboard');
    });

    it('should handle errors when creating a dashboard', async () => {
      const newDashboard: Dashboard = {
        title: 'Test',
      };

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Bad Request' }, 400));
      global.fetch = mockFetch;

      await expect(api.addDashboard({ dashboard: newDashboard })).rejects.toThrow();
    });
  });

  describe('getDashboard', () => {
    it('should fetch a dashboard by ID', async () => {
      const dashboardId = 'dashboard-456';
      const expectedDashboard: Dashboard = {
        id: dashboardId,
        title: 'My Dashboard',
        description: 'Dashboard description',
        filters: 'project_id=123',
      };

      mockFetch = createMockFetch(expectedDashboard);
      global.fetch = mockFetch;

      const result = await api.getDashboard({ id: dashboardId });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/dashboard/${dashboardId}`,
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.id).toBe(dashboardId);
      expect(result.title).toBe('My Dashboard');
    });

    it('should handle 404 when dashboard not found', async () => {
      const dashboardId = 'non-existent';

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Not Found' }, 404));
      global.fetch = mockFetch;

      await expect(api.getDashboard({ id: dashboardId })).rejects.toThrow();
    });

    it('should require id parameter', async () => {
      await expect(api.getDashboard({ id: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('getDashboardList', () => {
    it('should fetch a list of dashboards', async () => {
      const mockDashboardList: DashboardList = {
        dashboards: [
          {
            id: 'dashboard-1',
            title: 'Dashboard One',
          },
          {
            id: 'dashboard-2',
            title: 'Dashboard Two',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 2,
          totalPages: 1,
        },
      };

      mockFetch = createMockFetch(mockDashboardList);
      global.fetch = mockFetch;

      const result = await api.getDashboardList({});

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/dashboard',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.dashboards).toHaveLength(2);
    });

    it('should handle pagination parameters', async () => {
      const mockDashboardList: DashboardList = {
        dashboards: [],
        pagination: {
          page: 2,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0,
        },
      };

      mockFetch = createMockFetch(mockDashboardList);
      global.fetch = mockFetch;

      await api.getDashboardList({ page: 2, pageSize: 10 });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('page=2');
      expect(url).toContain('pageSize=10');
    });

    it('should filter by projectId', async () => {
      const projectId = 'project-123';
      const mockDashboardList: DashboardList = {
        dashboards: [],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 0,
          totalPages: 0,
        },
      };

      mockFetch = createMockFetch(mockDashboardList);
      global.fetch = mockFetch;

      await api.getDashboardList({ projectId });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain(`project_id=${projectId}`);
    });

    it('should filter by userId', async () => {
      const userId = 'user-456';
      const mockDashboardList: DashboardList = {
        dashboards: [],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 0,
          totalPages: 0,
        },
      };

      mockFetch = createMockFetch(mockDashboardList);
      global.fetch = mockFetch;

      await api.getDashboardList({ userId });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain(`user_id=${userId}`);
    });

    it('should handle filter parameters', async () => {
      const mockDashboardList: DashboardList = {
        dashboards: [],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 0,
          totalPages: 0,
        },
      };

      mockFetch = createMockFetch(mockDashboardList);
      global.fetch = mockFetch;

      await api.getDashboardList({ filter: ['title~test'] });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('filter=');
    });

    it('should return empty list when no dashboards exist', async () => {
      const mockDashboardList: DashboardList = {
        dashboards: [],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 0,
          totalPages: 0,
        },
      };

      mockFetch = createMockFetch(mockDashboardList);
      global.fetch = mockFetch;

      const result = await api.getDashboardList({});

      expect(result.dashboards).toHaveLength(0);
    });
  });

  describe('updateDashboard', () => {
    it('should update an existing dashboard', async () => {
      const dashboardId = 'dashboard-789';
      const updatedDashboard: Dashboard = {
        id: dashboardId,
        title: 'Updated Dashboard',
        description: 'Updated description',
        filters: 'status=passed',
      };

      mockFetch = createMockFetch(updatedDashboard);
      global.fetch = mockFetch;

      const result = await api.updateDashboard({ id: dashboardId, dashboard: updatedDashboard });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/dashboard/${dashboardId}`,
        expect.objectContaining({
          method: 'PUT',
        })
      );
      expect(result.title).toBe('Updated Dashboard');
    });

    it('should handle partial updates', async () => {
      const dashboardId = 'dashboard-999';
      const partialUpdate: Dashboard = {
        title: 'New Title',
      };

      const responseDashboard: Dashboard = {
        id: dashboardId,
        ...partialUpdate,
      };

      mockFetch = createMockFetch(responseDashboard);
      global.fetch = mockFetch;

      const result = await api.updateDashboard({ id: dashboardId, dashboard: partialUpdate });

      expect(result.id).toBe(dashboardId);
      expect(result.title).toBe('New Title');
    });

    it('should require id parameter', async () => {
      const dashboard: Dashboard = {
        title: 'Test',
      };

      await expect(
        api.updateDashboard({ id: null as unknown as string, dashboard })
      ).rejects.toThrow();
    });
  });

  describe('deleteDashboard', () => {
    it('should delete a dashboard', async () => {
      const dashboardId = 'dashboard-delete';

      mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 204,
      });
      global.fetch = mockFetch;

      await api.deleteDashboard({ id: dashboardId });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/dashboard/${dashboardId}`,
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('should handle delete errors', async () => {
      const dashboardId = 'dashboard-error';

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Forbidden' }, 403));
      global.fetch = mockFetch;

      await expect(api.deleteDashboard({ id: dashboardId })).rejects.toThrow();
    });

    it('should require id parameter', async () => {
      await expect(api.deleteDashboard({ id: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('authentication', () => {
    it('should include Bearer token when configured', async () => {
      const config = new Configuration({
        basePath: 'http://localhost/api',
        accessToken: async () => 'test-token-dashboard',
      });
      api = new DashboardApi(config);

      const dashboardId = 'dashboard-auth';
      const expectedDashboard: Dashboard = {
        id: dashboardId,
        title: 'Test',
      };

      mockFetch = createMockFetch(expectedDashboard);
      global.fetch = mockFetch;

      await api.getDashboard({ id: dashboardId });

      interface FetchOptions {
        method: string;
        headers: Record<string, string>;
      }
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining<Partial<FetchOptions>>({
          headers: expect.objectContaining<Record<string, string>>({
            Authorization: 'Bearer test-token-dashboard',
          }),
        })
      );
    });

    it('should work without authentication when not configured', async () => {
      const dashboardId = 'dashboard-no-auth';
      const expectedDashboard: Dashboard = {
        id: dashboardId,
        title: 'Test',
      };

      mockFetch = createMockFetch(expectedDashboard);
      global.fetch = mockFetch;

      await api.getDashboard({ id: dashboardId });

      const callArgs = mockFetch.mock.calls[0][1] as RequestInit;
      const headers = callArgs.headers as Record<string, string>;
      expect(headers.Authorization).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should handle 400 Bad Request errors', async () => {
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Bad Request' }, 400));
      global.fetch = mockFetch;

      await expect(api.addDashboard({ dashboard: {} })).rejects.toThrow();
    });

    it('should handle 401 Unauthorized errors', async () => {
      const dashboardId = 'dashboard-123';
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Unauthorized' }, 401));
      global.fetch = mockFetch;

      await expect(api.getDashboard({ id: dashboardId })).rejects.toThrow();
    });

    it('should handle 403 Forbidden errors', async () => {
      const dashboardId = 'dashboard-123';
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Forbidden' }, 403));
      global.fetch = mockFetch;

      await expect(api.deleteDashboard({ id: dashboardId })).rejects.toThrow();
    });

    it('should handle 404 Not Found errors', async () => {
      const dashboardId = 'non-existent';
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Not Found' }, 404));
      global.fetch = mockFetch;

      await expect(api.getDashboard({ id: dashboardId })).rejects.toThrow();
    });

    it('should handle 500 Internal Server Error', async () => {
      mockFetch = jest
        .fn()
        .mockResolvedValue(createMockResponse({ error: 'Internal Server Error' }, 500));
      global.fetch = mockFetch;

      await expect(api.getDashboardList({})).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
      global.fetch = mockFetch;

      await expect(api.getDashboardList({})).rejects.toThrow();
    });
  });
});
