import { LoginApi } from '../LoginApi';
import type {
  LoginToken,
  Credentials,
  AccountRecovery,
  AccountRegistration,
  AccountReset,
  LoginSupport,
} from '../../models';
import { Configuration } from '../../runtime';
import { createMockFetch, createMockResponse } from '../../__tests__/test-utils';

describe('LoginApi', () => {
  let api: LoginApi;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    const config = new Configuration({
      basePath: 'http://localhost/api',
    });
    api = new LoginApi(config);
  });

  describe('login', () => {
    it('should login with credentials and return token', async () => {
      const credentials: Credentials = {
        email: 'testuser@example.com',
        password: 'testpass123',
      };

      const loginResponse: LoginToken = {
        token: 'jwt-token-abc123',
      };

      mockFetch = createMockFetch(loginResponse);
      global.fetch = mockFetch;

      const result = await api.login({ credentials });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      interface FetchOptions {
        method: string;
        headers: Record<string, string>;
      }
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/login',
        expect.objectContaining<Partial<FetchOptions>>({
          method: 'POST',
          headers: expect.objectContaining<Record<string, string>>({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result.token).toBe('jwt-token-abc123');
    });

    it('should handle invalid credentials', async () => {
      const credentials: Credentials = {
        email: 'baduser@example.com',
        password: 'wrongpass',
      };

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Unauthorized' }, 401));
      global.fetch = mockFetch;

      await expect(api.login({ credentials })).rejects.toThrow();
    });

    it('should handle invalid credentials', async () => {
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Bad Request' }, 400));
      global.fetch = mockFetch;

      await expect(
        api.login({ credentials: { email: 'invalid@example.com', password: 'wrong' } })
      ).rejects.toThrow();
    });
  });

  describe('register', () => {
    it('should register a new account', async () => {
      const registration: AccountRegistration = {
        email: 'newuser@example.com',
        password: 'newpass123',
      };

      mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 201,
      });
      global.fetch = mockFetch;

      await api.register({ accountRegistration: registration });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/login/register',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should handle duplicate email errors', async () => {
      const registration: AccountRegistration = {
        email: 'existing@example.com',
        password: 'pass123',
      };

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Conflict' }, 409));
      global.fetch = mockFetch;

      await expect(api.register({ accountRegistration: registration })).rejects.toThrow();
    });

    it('should handle validation errors', async () => {
      const registration: AccountRegistration = {
        email: 'invalid-email',
        password: 'short',
      };

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Bad Request' }, 400));
      global.fetch = mockFetch;

      await expect(api.register({ accountRegistration: registration })).rejects.toThrow();
    });
  });

  describe('activate', () => {
    it('should activate an account with valid code', async () => {
      const activationCode = 'ABC123XYZ789';

      mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
      });
      global.fetch = mockFetch;

      await api.activate({ activationCode });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/login/activate/${activationCode}`,
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should handle invalid activation code', async () => {
      const activationCode = 'INVALID';

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Bad Request' }, 400));
      global.fetch = mockFetch;

      await expect(api.activate({ activationCode })).rejects.toThrow();
    });

    it('should require activationCode parameter', async () => {
      await expect(api.activate({ activationCode: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('recover', () => {
    it('should initiate password recovery', async () => {
      const recovery: AccountRecovery = {
        email: 'user@example.com',
      };

      mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
      });
      global.fetch = mockFetch;

      await api.recover({ accountRecovery: recovery });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/login/recover',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should handle non-existent email', async () => {
      const recovery: AccountRecovery = {
        email: 'nonexistent@example.com',
      };

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Not Found' }, 404));
      global.fetch = mockFetch;

      await expect(api.recover({ accountRecovery: recovery })).rejects.toThrow();
    });

    it('should handle invalid email format', async () => {
      const recovery: AccountRecovery = {
        email: 'invalid-email',
      };

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Bad Request' }, 400));
      global.fetch = mockFetch;

      await expect(api.recover({ accountRecovery: recovery })).rejects.toThrow();
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid activation code', async () => {
      const reset: AccountReset = {
        activationCode: 'reset-code-123',
        password: 'newpassword123',
      };

      mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
      });
      global.fetch = mockFetch;

      await api.resetPassword({ accountReset: reset });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/login/reset-password',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should handle invalid reset activation code', async () => {
      const reset: AccountReset = {
        activationCode: 'invalid-code',
        password: 'newpass123',
      };

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Forbidden' }, 403));
      global.fetch = mockFetch;

      await expect(api.resetPassword({ accountReset: reset })).rejects.toThrow();
    });

    it('should handle weak password', async () => {
      const reset: AccountReset = {
        activationCode: 'valid-code',
        password: '123',
      };

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Bad Request' }, 400));
      global.fetch = mockFetch;

      await expect(api.resetPassword({ accountReset: reset })).rejects.toThrow();
    });
  });

  describe('auth', () => {
    it('should initiate OAuth authentication', async () => {
      const provider = 'github';
      const authResponse = {
        url: 'https://github.com/login/oauth/authorize',
      };

      mockFetch = createMockFetch(authResponse);
      global.fetch = mockFetch;

      await api.auth({ provider });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/login/auth/${provider}`,
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should handle unsupported provider', async () => {
      const provider = 'unsupported';

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Not Found' }, 404));
      global.fetch = mockFetch;

      await expect(api.auth({ provider })).rejects.toThrow();
    });

    it('should require provider parameter', async () => {
      await expect(api.auth({ provider: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('config', () => {
    it('should get login configuration for provider', async () => {
      const provider = 'oidc';
      const configResponse = {
        client_id: 'client-123',
        redirect_uri: 'http://localhost:3000/callback',
        scope: 'openid profile email',
      };

      mockFetch = createMockFetch(configResponse);
      global.fetch = mockFetch;

      const result = await api.config({ provider });

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost/api/login/config/${provider}`,
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.clientId).toBe('client-123');
      expect(result.redirectUri).toBe('http://localhost:3000/callback');
    });

    it('should handle unsupported provider config', async () => {
      const provider = 'unsupported';

      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Not Found' }, 404));
      global.fetch = mockFetch;

      await expect(api.config({ provider })).rejects.toThrow();
    });

    it('should require provider parameter', async () => {
      await expect(api.config({ provider: null as unknown as string })).rejects.toThrow();
    });
  });

  describe('support', () => {
    it('should get login support information', async () => {
      const supportResponse: LoginSupport = {
        user: true,
        github: true,
        google: true,
        keycloak: false,
      };

      mockFetch = createMockFetch(supportResponse);
      global.fetch = mockFetch;

      const result = await api.support();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost/api/login/support',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result.user).toBe(true);
      expect(result.github).toBe(true);
    });

    it('should handle minimal support info', async () => {
      const supportResponse: LoginSupport = {
        user: false,
        keycloak: false,
      };

      mockFetch = createMockFetch(supportResponse);
      global.fetch = mockFetch;

      const result = await api.support();

      expect(result.user).toBe(false);
    });

    it('should handle support endpoint errors', async () => {
      mockFetch = jest
        .fn()
        .mockResolvedValue(createMockResponse({ error: 'Service Unavailable' }, 503));
      global.fetch = mockFetch;

      await expect(api.support()).rejects.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle 400 Bad Request errors', async () => {
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Bad Request' }, 400));
      global.fetch = mockFetch;

      await expect(
        api.login({ credentials: { email: 'invalid@example.com', password: 'bad' } })
      ).rejects.toThrow();
    });

    it('should handle 401 Unauthorized errors', async () => {
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Unauthorized' }, 401));
      global.fetch = mockFetch;

      await expect(
        api.login({ credentials: { email: 'user@example.com', password: 'pass' } })
      ).rejects.toThrow();
    });

    it('should handle 403 Forbidden errors', async () => {
      mockFetch = jest.fn().mockResolvedValue(createMockResponse({ error: 'Forbidden' }, 403));
      global.fetch = mockFetch;

      await expect(
        api.resetPassword({ accountReset: { activationCode: 'invalid', password: 'pass' } })
      ).rejects.toThrow();
    });

    it('should handle 500 Internal Server Error', async () => {
      mockFetch = jest
        .fn()
        .mockResolvedValue(createMockResponse({ error: 'Internal Server Error' }, 500));
      global.fetch = mockFetch;

      await expect(api.support()).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
      global.fetch = mockFetch;

      await expect(api.support()).rejects.toThrow();
    });

    it('should handle rate limiting', async () => {
      mockFetch = jest
        .fn()
        .mockResolvedValue(createMockResponse({ error: 'Too Many Requests' }, 429));
      global.fetch = mockFetch;

      await expect(
        api.login({ credentials: { email: 'user@example.com', password: 'pass' } })
      ).rejects.toThrow();
    });
  });
});
