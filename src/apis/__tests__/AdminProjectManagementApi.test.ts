import { AdminProjectManagementApi } from '../AdminProjectManagementApi';
import type { Project, ProjectList } from '../../models';
import { Configuration } from '../../runtime';
import { createMockFetch, createMockResponse } from '../../__tests__/test-utils';

describe('AdminProjectManagementApi', () => {
  let api: AdminProjectManagementApi;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    const config = new Configuration({
      basePath: 'http://localhost/api',
    });
    api = new AdminProjectManagementApi(config);
  });

  describe('adminAddProject', () => {
    it('should create a new project', async () => {
      const newProject: Project = {
        name: 'new-project',
        title: 'New Project',
      };

      const responseProject: Project = {
        id: 'project-123',
        ...newProject,
      };

      mockFetch = createMockFetch(responseProject, 201);
      global.fetch = mockFetch;

      const result = await api.adminAddProject({ project: newProject });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/admin/project',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result.id).toBe('project-123');
    });

    it('should handle errors when creating a project', async () => {
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Bad Request' }, 400));
      global.fetch = mockFetch;

      await expect(api.adminAddProject({ project: {} })).rejects.toThrow();
    });
  });

  describe('adminGetProject', () => {
    it('should fetch a project by ID', async () => {
      const projectId = 'project-123';
      const expectedProject: Project = {
        id: projectId,
        name: 'my-project',
      };

      mockFetch = createMockFetch(expectedProject);
      global.fetch = mockFetch;

      const result = await api.adminGetProject({ id: projectId });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/admin/project/${projectId}`,
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.id).toBe(projectId);
    });

    it('should handle 404 when project not found', async () => {
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Not Found' }, 404));
      global.fetch = mockFetch;
      await expect(api.adminGetProject({ id: 'missing' })).rejects.toThrow();
    });

    it('should require id parameter', async () => {
      await expect(api.adminGetProject({ id: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('adminGetProjectList', () => {
    it('should fetch a list of projects', async () => {
      const mockList: ProjectList = {
        projects: [
          { id: '1', name: 'p1' },
          { id: '2', name: 'p2' },
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

      const result = await api.adminGetProjectList({});

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/admin/project',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.projects).toHaveLength(2);
    });

    it('should handle pagination parameters', async () => {
      mockFetch = createMockFetch({ projects: [] });
      global.fetch = mockFetch;

      await api.adminGetProjectList({ page: 2, pageSize: 10 });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('page=2');
      expect(url).toContain('pageSize=10');
    });

    it('should handle filter parameters', async () => {
      mockFetch = createMockFetch({ projects: [] });
      global.fetch = mockFetch;

      await api.adminGetProjectList({ filter: ['name=test'] });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('filter=');
    });
  });

  describe('adminUpdateProject', () => {
    it('should update an existing project', async () => {
      const projectId = 'project-123';
      const updatedProject: Project = {
        id: projectId,
        title: 'Updated Title',
      };

      mockFetch = createMockFetch(updatedProject);
      global.fetch = mockFetch;

      const result = await api.adminUpdateProject({ id: projectId, project: updatedProject });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/admin/project/${projectId}`,
        expect.objectContaining({
          method: 'PUT',
        })
      );
      expect(result.title).toBe('Updated Title');
    });

    it('should require id parameter', async () => {
      await expect(
        api.adminUpdateProject({ id: null as unknown as string, project: {} })
      ).rejects.toThrow();
    });
  });

  describe('adminDeleteProject', () => {
    it('should delete a project', async () => {
      const projectId = 'project-delete';
      mockFetch = jest.fn().mockResolvedValue({ ok: true, status: 204 });
      global.fetch = mockFetch;

      await api.adminDeleteProject({ id: projectId });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/admin/project/${projectId}`,
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('should require id parameter', async () => {
      await expect(api.adminDeleteProject({ id: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('authentication', () => {
    it('should include Bearer token when configured', async () => {
      const config = new Configuration({
        basePath: 'http://localhost/api',
        accessToken: async () => 'test-token',
      });
      api = new AdminProjectManagementApi(config);
      mockFetch = createMockFetch({});
      global.fetch = mockFetch;

      await api.adminGetProject({ id: '1' });

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
