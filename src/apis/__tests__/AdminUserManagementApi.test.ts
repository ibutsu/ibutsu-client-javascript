import { AdminUserManagementApi } from '../AdminUserManagementApi';
import type { User, UserList } from '../../models';
import { Configuration } from '../../runtime';
import { createMockFetch, createMockResponse } from '../../__tests__/test-utils';

describe('AdminUserManagementApi', () => {
  let api: AdminUserManagementApi;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    const config = new Configuration({
      basePath: 'http://localhost/api',
    });
    api = new AdminUserManagementApi(config);
  });

  describe('adminAddUser', () => {
    it('should create a new user', async () => {
      const newUser: User = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const responseUser: User = {
        id: 'user-123',
        ...newUser,
      };

      mockFetch = createMockFetch(responseUser, 201);
      global.fetch = mockFetch;

      const result = await api.adminAddUser({ user: newUser });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/admin/user',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result.id).toBe('user-123');
    });

    it('should handle errors when creating a user', async () => {
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Bad Request' }, 400));
      global.fetch = mockFetch;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(api.adminAddUser({ user: {} as any })).rejects.toThrow();
    });
  });

  describe('adminGetUser', () => {
    it('should fetch a user by ID', async () => {
      const userId = 'user-123';
      const expectedUser: User = {
        id: userId,
        email: 'test@example.com',
      };

      mockFetch = createMockFetch(expectedUser);
      global.fetch = mockFetch;

      const result = await api.adminGetUser({ id: userId });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/admin/user/${userId}`,
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.id).toBe(userId);
    });

    it('should handle 404 when user not found', async () => {
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Not Found' }, 404));
      global.fetch = mockFetch;
      await expect(api.adminGetUser({ id: 'missing' })).rejects.toThrow();
    });

    it('should require id parameter', async () => {
      await expect(api.adminGetUser({ id: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('adminGetUserList', () => {
    it('should fetch a list of users', async () => {
      const mockList: UserList = {
        users: [
          { id: '1', email: 'u1@e.com' },
          { id: '2', email: 'u2@e.com' },
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

      const result = await api.adminGetUserList({});

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/admin/user',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.users).toHaveLength(2);
    });

    it('should handle pagination parameters', async () => {
      mockFetch = createMockFetch({ users: [] });
      global.fetch = mockFetch;

      await api.adminGetUserList({ page: 2, pageSize: 10 });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('page=2');
      expect(url).toContain('pageSize=10');
    });

    it('should handle filter parameters', async () => {
      mockFetch = createMockFetch({ users: [] });
      global.fetch = mockFetch;

      await api.adminGetUserList({ filter: ['email=test'] });

      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain('filter=');
    });
  });

  describe('adminUpdateUser', () => {
    it('should update an existing user', async () => {
      const userId = 'user-123';
      const updatedUser: User = {
        id: userId,
        email: 'test@example.com',
        name: 'Updated Name',
      };

      mockFetch = createMockFetch(updatedUser);
      global.fetch = mockFetch;

      const result = await api.adminUpdateUser({ id: userId, user: updatedUser });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/admin/user/${userId}`,
        expect.objectContaining({
          method: 'PUT',
        })
      );
      expect(result.name).toBe('Updated Name');
    });

    it('should require id parameter', async () => {
      await expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        api.adminUpdateUser({ id: null as unknown as string, user: {} as any })
      ).rejects.toThrow();
    });
  });

  describe('adminDeleteUser', () => {
    it('should delete a user', async () => {
      const userId = 'user-delete';
      mockFetch = jest.fn().mockResolvedValue({ ok: true, status: 204 });
      global.fetch = mockFetch;

      await api.adminDeleteUser({ id: userId });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/admin/user/${userId}`,
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('should require id parameter', async () => {
      await expect(api.adminDeleteUser({ id: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('authentication', () => {
    it('should include Bearer token when configured', async () => {
      const config = new Configuration({
        basePath: 'http://localhost/api',
        accessToken: async () => 'test-token',
      });
      api = new AdminUserManagementApi(config);
      mockFetch = createMockFetch({});
      global.fetch = mockFetch;

      await api.adminGetUser({ id: '1' });

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
