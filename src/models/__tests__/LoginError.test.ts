import {
  type LoginError,
  LoginErrorFromJSON,
  LoginErrorToJSON,
  instanceOfLoginError,
} from '../LoginError';

describe('LoginError Model', () => {
  describe('interface and types', () => {
    it('should create a valid LoginError object with all fields', () => {
      const loginError: LoginError = {
        code: 'AUTH_001',
        message: 'Invalid credentials',
      };

      expect(loginError.code).toBe('AUTH_001');
      expect(loginError.message).toBe('Invalid credentials');
    });

    it('should create a LoginError object with minimal fields', () => {
      const loginError: LoginError = {
        code: 'ERR_001',
      };

      expect(loginError.code).toBe('ERR_001');
      expect(loginError.message).toBeUndefined();
    });

    it('should allow undefined values for optional fields', () => {
      const loginError: LoginError = {
        code: undefined,
        message: undefined,
      };

      expect(loginError.code).toBeUndefined();
      expect(loginError.message).toBeUndefined();
    });

    it('should support different error codes', () => {
      const authError: LoginError = {
        code: 'INVALID_TOKEN',
        message: 'Token has expired',
      };
      const permissionError: LoginError = {
        code: 'PERMISSION_DENIED',
        message: 'User lacks required permissions',
      };

      expect(authError.code).toBe('INVALID_TOKEN');
      expect(permissionError.code).toBe('PERMISSION_DENIED');
    });
  });

  describe('LoginErrorFromJSON', () => {
    it('should convert JSON to LoginError object', () => {
      const json = {
        code: 'NETWORK_ERROR',
        message: 'Connection timeout',
      };

      const loginError = LoginErrorFromJSON(json);

      expect(loginError.code).toBe('NETWORK_ERROR');
      expect(loginError.message).toBe('Connection timeout');
    });

    it('should handle null values correctly', () => {
      const json = {
        code: null,
        message: null,
      };

      const loginError = LoginErrorFromJSON(json);

      expect(loginError.code).toBeUndefined();
      expect(loginError.message).toBeUndefined();
    });

    it('should handle missing fields as undefined', () => {
      const json = {
        code: 'PARTIAL_ERROR',
      };

      const loginError = LoginErrorFromJSON(json);

      expect(loginError.code).toBe('PARTIAL_ERROR');
      expect(loginError.message).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = LoginErrorFromJSON(null);
      expect(result).toBeNull();
    });

    it('should handle empty JSON object', () => {
      const json = {};

      const loginError = LoginErrorFromJSON(json);

      expect(loginError.code).toBeUndefined();
      expect(loginError.message).toBeUndefined();
    });

    it('should handle server error responses', () => {
      const json = {
        code: '500',
        message: 'Internal server error',
      };

      const loginError = LoginErrorFromJSON(json);

      expect(loginError.code).toBe('500');
      expect(loginError.message).toBe('Internal server error');
    });
  });

  describe('LoginErrorToJSON', () => {
    it('should convert LoginError object to JSON', () => {
      const loginError: LoginError = {
        code: 'BAD_REQUEST',
        message: 'Missing required parameter',
      };

      const json = LoginErrorToJSON(loginError);

      expect(json.code).toBe('BAD_REQUEST');
      expect(json.message).toBe('Missing required parameter');
    });

    it('should handle undefined fields', () => {
      const loginError: LoginError = {
        code: 'UNKNOWN',
      };

      const json = LoginErrorToJSON(loginError);

      expect(json.code).toBe('UNKNOWN');
      expect(json.message).toBeUndefined();
    });

    it('should return null when passed null', () => {
      const result = LoginErrorToJSON(null);
      expect(result).toBeNull();
    });

    it('should return undefined when passed undefined', () => {
      const result = LoginErrorToJSON(undefined);
      expect(result).toBeUndefined();
    });

    it('should handle empty LoginError object', () => {
      const loginError: LoginError = {};

      const json = LoginErrorToJSON(loginError);

      expect(json.code).toBeUndefined();
      expect(json.message).toBeUndefined();
    });

    it('should preserve special characters in messages', () => {
      const loginError: LoginError = {
        code: 'VALIDATION_ERROR',
        message: 'Field "username" must not contain special characters: @#$%',
      };

      const json = LoginErrorToJSON(loginError);

      expect(json.message).toBe('Field "username" must not contain special characters: @#$%');
    });
  });

  describe('instanceOfLoginError', () => {
    it('should return true for any object (as per implementation)', () => {
      const result = instanceOfLoginError({});
      expect(result).toBe(true);
    });

    it('should return true for valid LoginError objects', () => {
      const loginError: LoginError = {
        code: 'TEST_ERROR',
        message: 'Test message',
      };
      const result = instanceOfLoginError(loginError);
      expect(result).toBe(true);
    });
  });

  describe('JSON round-trip', () => {
    it('should maintain data integrity through JSON conversion round-trip', () => {
      const original: LoginError = {
        code: 'ROUNDTRIP_ERROR',
        message: 'Testing round-trip conversion',
      };

      const json = LoginErrorToJSON(original);
      const restored = LoginErrorFromJSON(json);

      expect(restored).toEqual(original);
    });

    it('should handle minimal LoginError in round-trip', () => {
      const original: LoginError = {
        code: 'MINIMAL',
      };

      const json = LoginErrorToJSON(original);
      const restored = LoginErrorFromJSON(json);

      expect(restored).toEqual(original);
    });

    it('should handle empty LoginError in round-trip', () => {
      const original: LoginError = {};

      const json = LoginErrorToJSON(original);
      const restored = LoginErrorFromJSON(json);

      expect(restored).toEqual(original);
    });

    it('should handle multiline error messages', () => {
      const original: LoginError = {
        code: 'COMPLEX_ERROR',
        message: 'Error occurred:\n- Line 1\n- Line 2\n- Line 3',
      };

      const json = LoginErrorToJSON(original);
      const restored = LoginErrorFromJSON(json);

      expect(restored).toEqual(original);
    });
  });
});
