import { UserApi } from '../UserApi';
import {
  type CreateToken,
  type Token,
  type TokenList,
  type User,
  TokenToJSON,
  TokenListToJSON,
} from '../../models';
import { Configuration } from '../../runtime';
import { createMockFetch } from '../../__tests__/test-utils';

describe('UserApi', () => {
  let api: UserApi;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    const config = new Configuration({
      basePath: 'http://localhost/api',
    });
    api = new UserApi(config);
  });

  describe('getCurrentUser', () => {
    it('should fetch the current user', async () => {
      const expectedUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      };

      mockFetch = createMockFetch(expectedUser);
      global.fetch = mockFetch;

      const result = await api.getCurrentUser();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/user',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(expectedUser);
    });
  });

  describe('updateCurrentUser', () => {
    it('should update the current user', async () => {
      const updatedUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Updated Name',
      };

      mockFetch = createMockFetch(updatedUser);
      global.fetch = mockFetch;

      const result = await api.updateCurrentUser();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/user',
        expect.objectContaining({
          method: 'PUT',
        })
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('token management', () => {
    it('should create a new token', async () => {
      const createToken: CreateToken = {
        name: 'New Token',
        expires: null,
      };
      const responseToken: Token = {
        id: 'token-123',
        userId: 'user-123',
        name: 'New Token',
        token: 'abc-123',
        expires: undefined,
      };

      // Use TokenToJSON to simulate server response (snake_case)
      mockFetch = createMockFetch(TokenToJSON(responseToken), 201);
      global.fetch = mockFetch;

      const result = await api.addToken({ createToken });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/user/token',
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(result).toEqual(responseToken);
    });

    it('should get a token by ID', async () => {
      const tokenId = 'token-123';
      const expectedToken: Token = {
        id: tokenId,
        userId: 'user-123',
        name: 'My Token',
        token: 'abc-123',
        expires: undefined,
      };

      mockFetch = createMockFetch(TokenToJSON(expectedToken));
      global.fetch = mockFetch;

      const result = await api.getToken({ id: tokenId });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/user/token/${tokenId}`,
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(expectedToken);
    });

    it('should get a list of tokens', async () => {
      const mockList: TokenList = {
        tokens: [
          { id: '1', userId: 'u1', name: 't1', token: 'v1' },
          { id: '2', userId: 'u2', name: 't2', token: 'v2' },
        ],
        pagination: {
          page: 1,
          pageSize: 25,
          totalItems: 2,
          totalPages: 1,
        },
      };

      mockFetch = createMockFetch(TokenListToJSON(mockList));
      global.fetch = mockFetch;

      const result = await api.getTokenList({});

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/user/token',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.tokens).toHaveLength(2);
      // Verify content to ensure deserialization worked
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(result.tokens![0].userId).toBe('u1');
    });

    it('should delete a token', async () => {
      const tokenId = 'token-delete';
      mockFetch = jest.fn().mockResolvedValue({ ok: true, status: 204 });
      global.fetch = mockFetch;

      await api.deleteToken({ id: tokenId });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/user/token/${tokenId}`,
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('should require id for deleteToken', async () => {
      await expect(api.deleteToken({ id: null as unknown as string })).rejects.toThrow();
    });

    it('should require id for getToken', async () => {
      await expect(api.getToken({ id: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('authentication', () => {
    it('should include Bearer token when configured', async () => {
      const config = new Configuration({
        basePath: 'http://localhost/api',
        accessToken: async () => 'test-token',
      });
      api = new UserApi(config);
      mockFetch = createMockFetch({});
      global.fetch = mockFetch;

      await api.getCurrentUser();

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
