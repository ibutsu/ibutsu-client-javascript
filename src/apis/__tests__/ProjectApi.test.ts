/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { ProjectApi } from '../ProjectApi';
import type { Project, ProjectList } from '../../models';
import { Configuration } from '../../runtime';
import { createMockFetch } from '../../__tests__/test-utils';

describe('ProjectApi', () => {
  let api: ProjectApi;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    const config = new Configuration({
      basePath: 'http://localhost/api',
    });
    api = new ProjectApi(config);
  });

  describe('addProject', () => {
    it('should create a new project', async () => {
      const newProject: Project = {
        name: 'test-project',
        title: 'Test Project',
      };

      const responseProject: Project = {
        id: 'project-123',
        ...newProject,
      };

      mockFetch = createMockFetch(responseProject, 201);
      global.fetch = mockFetch;

      const result = await api.addProject({ project: newProject });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      interface FetchOptions {
        method: string;
        headers: Record<string, string>;
      }
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/project',
        expect.objectContaining<Partial<FetchOptions>>({
          method: 'POST',
          headers: expect.objectContaining<Record<string, string>>({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result.id).toBe('project-123');
      expect(result.name).toBe('test-project');
    });

    it('should send project data with correct JSON format (snake_case)', async () => {
      const newProject: Project = {
        name: 'test-project',
        title: 'Test Project',
        ownerId: 'user-123',
        groupId: 'group-456',
      };

      mockFetch = createMockFetch({ id: 'project-123', ...newProject });
      global.fetch = mockFetch;

      await api.addProject({ project: newProject });

      const callArgs = mockFetch.mock.calls[0] as [string, RequestInit];
      const bodyString = callArgs[1].body as string;
      const body: { name?: string; owner_id?: string; group_id?: string } = JSON.parse(
        bodyString
      ) as { name?: string; owner_id?: string; group_id?: string };

      expect(body).toHaveProperty('name', 'test-project');
      expect(body).toHaveProperty('owner_id', 'user-123');
      expect(body).toHaveProperty('group_id', 'group-456');
    });

    it('should handle errors when creating a project', async () => {
      mockFetch = createMockFetch({ error: 'Bad Request' }, 400);
      global.fetch = mockFetch;

      await expect(api.addProject({ project: {} })).rejects.toThrow();
    });
  });

  describe('getProject', () => {
    it('should fetch a project by ID', async () => {
      const project: Project = {
        id: 'project-123',
        name: 'test-project',
        title: 'Test Project',
      };

      mockFetch = createMockFetch(project);
      global.fetch = mockFetch;

      const result = await api.getProject({ id: 'project-123' });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/project/project-123',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(project);
    });

    it('should handle 404 when project not found', async () => {
      mockFetch = createMockFetch({ error: 'Not Found' }, 404);
      global.fetch = mockFetch;

      await expect(api.getProject({ id: 'non-existent' })).rejects.toThrow();
    });

    it('should require id parameter', async () => {
      // TypeScript should catch this, but testing runtime behavior
      await expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        api.getProject({ id: null as any })
      ).rejects.toThrow();
    });
  });

  describe('getProjectList', () => {
    it('should fetch a list of projects', async () => {
      const projectList: ProjectList = {
        projects: [
          { id: 'project-1', name: 'proj1' },
          { id: 'project-2', name: 'proj2' },
        ],
        pagination: {
          page: 1,
          pageSize: 20,
          totalItems: 2,
          totalPages: 1,
        },
      };

      mockFetch = createMockFetch(projectList);
      global.fetch = mockFetch;

      const result = await api.getProjectList({});

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result.projects).toHaveLength(2);
      expect(result.pagination?.totalItems).toBe(2);
    });

    it('should handle pagination parameters', async () => {
      mockFetch = createMockFetch({ projects: [] });
      global.fetch = mockFetch;

      await api.getProjectList({
        page: 2,
        pageSize: 50,
      });

      const callArgs = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(callArgs[0]).toContain('page=2');
      expect(callArgs[0]).toContain('pageSize=50');
    });

    it('should handle filter parameters', async () => {
      mockFetch = createMockFetch({ projects: [] });
      global.fetch = mockFetch;

      await api.getProjectList({
        filter: ['name=test', 'active=true'],
        ownerId: 'user-123',
      });

      const callArgs = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(callArgs[0]).toContain('filter=name%3Dtest');
      expect(callArgs[0]).toContain('ownerId=user-123');
    });

    it('should return empty list when no projects exist', async () => {
      const emptyList: ProjectList = {
        projects: [],
        pagination: {
          page: 1,
          pageSize: 20,
          totalItems: 0,
          totalPages: 0,
        },
      };

      mockFetch = createMockFetch(emptyList);
      global.fetch = mockFetch;

      const result = await api.getProjectList({});

      expect(result.projects).toHaveLength(0);
      expect(result.pagination?.totalItems).toBe(0);
    });
  });

  describe('updateProject', () => {
    it('should update an existing project', async () => {
      const updatedProject: Project = {
        id: 'project-123',
        name: 'updated-project',
        title: 'Updated Project',
      };

      mockFetch = createMockFetch(updatedProject);
      global.fetch = mockFetch;

      const result = await api.updateProject({
        id: 'project-123',
        project: updatedProject,
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      interface FetchOptions {
        method: string;
        headers: Record<string, string>;
      }
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/project/project-123',
        expect.objectContaining<Partial<FetchOptions>>({
          method: 'PUT',
          headers: expect.objectContaining<Record<string, string>>({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result.name).toBe('updated-project');
    });

    it('should handle partial updates', async () => {
      const partialUpdate: Project = {
        title: 'New Title Only',
      };

      mockFetch = createMockFetch({
        id: 'project-123',
        name: 'existing-name',
        title: 'New Title Only',
      });
      global.fetch = mockFetch;

      const result = await api.updateProject({
        id: 'project-123',
        project: partialUpdate,
      });

      expect(result.title).toBe('New Title Only');
      expect(result.name).toBe('existing-name');
    });

    it('should require id parameter', async () => {
      await expect(
        api.updateProject({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          id: null as any,
          project: {},
        })
      ).rejects.toThrow();
    });
  });

  describe('getFilterParams', () => {
    it('should fetch filterable parameters for a project', async () => {
      const filterParams = ['env', 'component', 'result'];

      mockFetch = createMockFetch(filterParams);
      global.fetch = mockFetch;

      const result = await api.getFilterParams({ id: 'project-123' });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/project/filter-params/project-123',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(filterParams);
    });

    it('should return empty array when no filters exist', async () => {
      mockFetch = createMockFetch([]);
      global.fetch = mockFetch;

      const result = await api.getFilterParams({ id: 'project-123' });

      expect(result).toEqual([]);
    });
  });

  describe('authentication', () => {
    it('should include Bearer token when configured', async () => {
      const configWithAuth = new Configuration({
        basePath: 'http://localhost/api',
        accessToken: 'test-token-123',
      });
      const authenticatedApi = new ProjectApi(configWithAuth);

      mockFetch = createMockFetch({ projects: [] });
      global.fetch = mockFetch;

      await authenticatedApi.getProjectList({});

      const callArgs = mockFetch.mock.calls[0] as [string, RequestInit];
      const { headers } = callArgs[1];
      expect((headers as Record<string, string>).Authorization).toBe('Bearer test-token-123');
    });

    it('should work without authentication when not configured', async () => {
      mockFetch = createMockFetch({ projects: [] });
      global.fetch = mockFetch;

      await api.getProjectList({});

      const callArgs = mockFetch.mock.calls[0] as [string, RequestInit];
      const { headers } = callArgs[1];
      expect((headers as Record<string, string>).Authorization).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should handle 401 Unauthorized errors', async () => {
      mockFetch = createMockFetch({ error: 'Unauthorized' }, 401);
      global.fetch = mockFetch;

      await expect(api.getProjectList({})).rejects.toThrow();
    });

    it('should handle 403 Forbidden errors', async () => {
      mockFetch = createMockFetch({ error: 'Forbidden' }, 403);
      global.fetch = mockFetch;

      await expect(api.getProject({ id: 'project-123' })).rejects.toThrow();
    });

    it('should handle 500 Internal Server Error', async () => {
      mockFetch = createMockFetch({ error: 'Internal Server Error' }, 500);
      global.fetch = mockFetch;

      await expect(api.addProject({ project: { name: 'test' } })).rejects.toThrow();
    });

    it('should handle 503 Service Unavailable', async () => {
      mockFetch = createMockFetch({ error: 'Service Unavailable' }, 503);
      global.fetch = mockFetch;

      await expect(api.updateProject({ id: 'proj-1', project: {} })).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
      global.fetch = mockFetch;

      // Network errors are wrapped in a FetchError by the runtime
      await expect(api.getProjectList({})).rejects.toThrow();
    });

    it('should handle malformed JSON responses', async () => {
      mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => Promise.reject(new Error('Invalid JSON')),
      });
      global.fetch = mockFetch;

      await expect(api.getProjectList({})).rejects.toThrow();
    });

    it('should handle empty response body for non-2xx status', async () => {
      mockFetch = createMockFetch(null, 400);
      global.fetch = mockFetch;

      await expect(api.addProject({ project: {} })).rejects.toThrow();
    });

    it('should handle malformed error responses', async () => {
      mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => Promise.resolve('not an object'),
        text: async () => Promise.resolve('not an object'),
      });
      global.fetch = mockFetch;

      await expect(api.getProject({ id: 'bad-id' })).rejects.toThrow();
    });
  });
});
