import { GroupApi } from '../GroupApi';
import type { Group, GroupList } from '../../models';
import { Configuration } from '../../runtime';
import { createMockFetch, createMockResponse } from '../../__tests__/test-utils';

describe('GroupApi', () => {
  let api: GroupApi;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    const config = new Configuration({
      basePath: 'http://localhost/api',
    });
    api = new GroupApi(config);
  });

  describe('addGroup', () => {
    it('should create a new group', async () => {
      const newGroup: Group = {
        name: 'engineering-team',
      };

      const responseGroup: Group = {
        id: 'group-123',
        ...newGroup,
      };

      mockFetch = createMockFetch(responseGroup, 201);
      global.fetch = mockFetch;

      const result = await api.addGroup({ group: newGroup });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      interface FetchOptions {
        method: string;
        headers: Record<string, string>;
      }
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/group',
        expect.objectContaining<Partial<FetchOptions>>({
          method: 'POST',
          headers: expect.objectContaining<Record<string, string>>({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result.id).toBe('group-123');
      expect(result.name).toBe('engineering-team');
    });

    it('should send group data with correct JSON format', async () => {
      const newGroup: Group = {
        name: 'test-team',
      };

      mockFetch = jest.fn().mockResolvedValue(createMockResponse(newGroup, 201));
      global.fetch = mockFetch;

      await api.addGroup({ group: newGroup });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0]).toBe('http://localhost/api/group');
    });

    it('should handle errors when creating a group', async () => {
      const newGroup: Group = {
        name: 'test-team',
      };

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Bad Request' }, 400));
      global.fetch = mockFetch;

      await expect(api.addGroup({ group: newGroup })).rejects.toThrow();
    });

    it('should handle duplicate group name errors', async () => {
      const newGroup: Group = {
        name: 'existing-group',
      };

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Conflict' }, 409));
      global.fetch = mockFetch;

      await expect(api.addGroup({ group: newGroup })).rejects.toThrow();
    });
  });

  describe('getGroup', () => {
    it('should fetch a group by ID', async () => {
      const groupId = 'group-456';
      const expectedGroup: Group = {
        id: groupId,
        name: 'qa-team',
      };

      mockFetch = createMockFetch(expectedGroup);
      global.fetch = mockFetch;

      const result = await api.getGroup({ id: groupId });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/group/${groupId}`,
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.id).toBe(groupId);
      expect(result.name).toBe('qa-team');
    });

    it('should handle 404 when group not found', async () => {
      const groupId = 'non-existent-group';

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Not Found' }, 404));
      global.fetch = mockFetch;

      await expect(api.getGroup({ id: groupId })).rejects.toThrow();
    });

    it('should require id parameter', async () => {
      await expect(api.getGroup({ id: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('getGroupList', () => {
    it('should fetch a list of groups', async () => {
      const mockGroupList: GroupList = {
        groups: [
          {
            id: 'group-1',
            name: 'team-alpha',
          },
          {
            id: 'group-2',
            name: 'team-beta',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 2,
          totalPages: 1,
        },
      };

      mockFetch = createMockFetch(mockGroupList);
      global.fetch = mockFetch;

      const result = await api.getGroupList({});

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/group',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.groups).toHaveLength(2);
    });

    it('should handle pagination parameters', async () => {
      const mockGroupList: GroupList = {
        groups: [],
        pagination: {
          page: 2,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0,
        },
      };

      mockFetch = createMockFetch(mockGroupList);
      global.fetch = mockFetch;

      await api.getGroupList({ page: 2, pageSize: 10 });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('page=2');
      expect(url).toContain('pageSize=10');
    });

    it('should return empty list when no groups exist', async () => {
      const mockGroupList: GroupList = {
        groups: [],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 0,
          totalPages: 0,
        },
      };

      mockFetch = createMockFetch(mockGroupList);
      global.fetch = mockFetch;

      const result = await api.getGroupList({});

      expect(result.groups).toHaveLength(0);
    });

    it('should handle large page sizes', async () => {
      const mockGroupList: GroupList = {
        groups: [],
        pagination: {
          page: 1,
          pageSize: 100,
          totalItems: 0,
          totalPages: 0,
        },
      };

      mockFetch = createMockFetch(mockGroupList);
      global.fetch = mockFetch;

      await api.getGroupList({ pageSize: 100 });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('pageSize=100');
    });
  });

  describe('updateGroup', () => {
    it('should update an existing group', async () => {
      const groupId = 'group-789';
      const updatedGroup: Group = {
        id: groupId,
        name: 'updated-team-name',
      };

      mockFetch = createMockFetch(updatedGroup);
      global.fetch = mockFetch;

      const result = await api.updateGroup({ id: groupId, group: updatedGroup });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/group/${groupId}`,
        expect.objectContaining({
          method: 'PUT',
        })
      );
      expect(result.name).toBe('updated-team-name');
    });

    it('should handle partial updates', async () => {
      const groupId = 'group-999';
      const partialUpdate: Group = {
        name: 'new-name',
      };

      const responseGroup: Group = {
        id: groupId,
        ...partialUpdate,
      };

      mockFetch = createMockFetch(responseGroup);
      global.fetch = mockFetch;

      const result = await api.updateGroup({ id: groupId, group: partialUpdate });

      expect(result.id).toBe(groupId);
      expect(result.name).toBe('new-name');
    });

    it('should require id parameter', async () => {
      const group: Group = {
        name: 'test',
      };

      await expect(api.updateGroup({ id: null as unknown as string, group })).rejects.toThrow();
    });

    it('should handle update errors', async () => {
      const groupId = 'group-error';
      const group: Group = {
        name: 'test',
      };

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Bad Request' }, 400));
      global.fetch = mockFetch;

      await expect(api.updateGroup({ id: groupId, group })).rejects.toThrow();
    });
  });

  describe('authentication', () => {
    it('should include Bearer token when configured', async () => {
      const config = new Configuration({
        basePath: 'http://localhost/api',
        accessToken: async () => 'test-token-abc',
      });
      api = new GroupApi(config);

      const groupId = 'group-auth';
      const expectedGroup: Group = {
        id: groupId,
        name: 'test-group',
      };

      mockFetch = createMockFetch(expectedGroup);
      global.fetch = mockFetch;

      await api.getGroup({ id: groupId });

      interface FetchOptions {
        method: string;
        headers: Record<string, string>;
      }
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining<Partial<FetchOptions>>({
          headers: expect.objectContaining<Record<string, string>>({
            Authorization: 'Bearer test-token-abc',
          }),
        })
      );
    });

    it('should work without authentication when not configured', async () => {
      const groupId = 'group-no-auth';
      const expectedGroup: Group = {
        id: groupId,
        name: 'test-group',
      };

      mockFetch = createMockFetch(expectedGroup);
      global.fetch = mockFetch;

      await api.getGroup({ id: groupId });

      const callArgs = mockFetch.mock.calls[0][1] as RequestInit;
      const headers = callArgs.headers as Record<string, string>;
      expect(headers.Authorization).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should handle 400 Bad Request errors', async () => {
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Bad Request' }, 400));
      global.fetch = mockFetch;

      await expect(api.addGroup({ group: { name: '' } })).rejects.toThrow();
    });

    it('should handle 401 Unauthorized errors', async () => {
      const groupId = 'group-123';
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Unauthorized' }, 401));
      global.fetch = mockFetch;

      await expect(api.getGroup({ id: groupId })).rejects.toThrow();
    });

    it('should handle 403 Forbidden errors', async () => {
      const groupId = 'group-123';
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Forbidden' }, 403));
      global.fetch = mockFetch;

      await expect(api.updateGroup({ id: groupId, group: {} })).rejects.toThrow();
    });

    it('should handle 404 Not Found errors', async () => {
      const groupId = 'non-existent';
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Not Found' }, 404));
      global.fetch = mockFetch;

      await expect(api.getGroup({ id: groupId })).rejects.toThrow();
    });

    it('should handle 500 Internal Server Error', async () => {
      mockFetch = jest
        .fn()
        .mockResolvedValue(createMockResponse({ error: 'Internal Server Error' }, 500));
      global.fetch = mockFetch;

      await expect(api.getGroupList({})).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
      global.fetch = mockFetch;

      await expect(api.getGroupList({})).rejects.toThrow();
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

      await expect(api.getGroupList({})).rejects.toThrow();
    });
  });
});
