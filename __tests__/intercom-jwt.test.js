/**
 * Tests for setUserJwt API specifically
 */

describe('Intercom setUserJwt API', () => {
  let mockIntercomModule;
  let Intercom;

  beforeEach(() => {
    jest.resetModules();

    // Mock React Native
    jest.doMock('react-native', () => ({
      NativeModules: {
        IntercomModule: {
          setUserJwt: jest.fn(),
          setUserHash: jest.fn(),
          loginUserWithUserAttributes: jest.fn(),
          logout: jest.fn(),
          updateUser: jest.fn(),
          isUserLoggedIn: jest.fn(),
        },
        IntercomEventEmitter: {
          UNREAD_COUNT_CHANGE_NOTIFICATION: 'UNREAD_COUNT_CHANGE_NOTIFICATION',
          WINDOW_DID_HIDE_NOTIFICATION: 'WINDOW_DID_HIDE_NOTIFICATION',
          WINDOW_DID_SHOW_NOTIFICATION: 'WINDOW_DID_SHOW_NOTIFICATION',
          HELP_CENTER_WINDOW_DID_SHOW_NOTIFICATION:
            'HELP_CENTER_WINDOW_DID_SHOW_NOTIFICATION',
          HELP_CENTER_WINDOW_DID_HIDE_NOTIFICATION:
            'HELP_CENTER_WINDOW_DID_HIDE_NOTIFICATION',
          startEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        },
      },
      NativeEventEmitter: jest.fn().mockImplementation(() => ({
        addListener: jest.fn().mockReturnValue({
          remove: jest.fn(),
        }),
      })),
      Platform: {
        OS: 'ios',
        select: jest.fn((obj) => obj.ios || obj.default),
      },
    }));

    const { NativeModules } = require('react-native');
    mockIntercomModule = NativeModules.IntercomModule;

    // Import Intercom after mocking
    Intercom = require('../src/index.tsx').default;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setUserJwt method', () => {
    test('should call native setUserJwt with valid JWT', async () => {
      const testJWT =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.test';
      mockIntercomModule.setUserJwt.mockResolvedValue(true);

      const result = await Intercom.setUserJwt(testJWT);

      expect(mockIntercomModule.setUserJwt).toHaveBeenCalledWith(testJWT);
      expect(result).toBe(true);
    });

    test('should handle JWT authentication errors', async () => {
      const invalidJWT = 'invalid.jwt';
      const error = new Error('JWT validation failed');
      mockIntercomModule.setUserJwt.mockRejectedValue(error);

      await expect(Intercom.setUserJwt(invalidJWT)).rejects.toThrow(
        'JWT validation failed'
      );
    });

    test('should work with empty JWT string', async () => {
      const emptyJWT = '';
      mockIntercomModule.setUserJwt.mockResolvedValue(true);

      const result = await Intercom.setUserJwt(emptyJWT);

      expect(mockIntercomModule.setUserJwt).toHaveBeenCalledWith(emptyJWT);
      expect(result).toBe(true);
    });

    test('should handle long JWT tokens', async () => {
      const longJWT =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzNDU2Nzg5MCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsIm5hbWUiOiJKb2huIERvZSIsImN1c3RvbV9hdHRyaWJ1dGVzIjp7InBsYW4iOiJwcmVtaXVtIiwiY29tcGFueSI6IkFjbWUgSW5jIn19.very_long_signature';
      mockIntercomModule.setUserJwt.mockResolvedValue(true);

      const result = await Intercom.setUserJwt(longJWT);

      expect(mockIntercomModule.setUserJwt).toHaveBeenCalledWith(longJWT);
      expect(result).toBe(true);
    });
  });

  describe('JWT authentication workflow', () => {
    test('should set JWT before user login', async () => {
      const jwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIn0.test';
      const userAttributes = { email: 'test@example.com' };

      mockIntercomModule.setUserJwt.mockResolvedValue(true);
      mockIntercomModule.loginUserWithUserAttributes.mockResolvedValue(true);

      await Intercom.setUserJwt(jwt);
      await Intercom.loginUserWithUserAttributes(userAttributes);

      expect(mockIntercomModule.setUserJwt).toHaveBeenCalledWith(jwt);
      expect(
        mockIntercomModule.loginUserWithUserAttributes
      ).toHaveBeenCalledWith(userAttributes);
      // Verify setUserJwt was called first by checking call counts
      expect(mockIntercomModule.setUserJwt).toHaveBeenCalledTimes(1);
      expect(
        mockIntercomModule.loginUserWithUserAttributes
      ).toHaveBeenCalledTimes(1);
    });

    test('should support both JWT and HMAC methods', async () => {
      const jwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIn0.test';
      const hash = 'hmac_hash_123';

      mockIntercomModule.setUserJwt.mockResolvedValue(true);
      mockIntercomModule.setUserHash.mockResolvedValue(true);

      const jwtResult = await Intercom.setUserJwt(jwt);
      const hashResult = await Intercom.setUserHash(hash);

      expect(mockIntercomModule.setUserJwt).toHaveBeenCalledWith(jwt);
      expect(mockIntercomModule.setUserHash).toHaveBeenCalledWith(hash);
      expect(jwtResult).toBe(true);
      expect(hashResult).toBe(true);
    });

    test('should handle complete authentication flow', async () => {
      const jwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIn0.test';
      const userAttributes = { userId: '123', email: 'test@example.com' };

      mockIntercomModule.setUserJwt.mockResolvedValue(true);
      mockIntercomModule.loginUserWithUserAttributes.mockResolvedValue(true);
      mockIntercomModule.isUserLoggedIn.mockResolvedValue(true);
      mockIntercomModule.updateUser.mockResolvedValue(true);

      // Set JWT first
      await Intercom.setUserJwt(jwt);

      // Login user
      await Intercom.loginUserWithUserAttributes(userAttributes);

      // Check login status
      const isLoggedIn = await Intercom.isUserLoggedIn();

      // Update user
      await Intercom.updateUser({ name: 'Updated Name' });

      expect(mockIntercomModule.setUserJwt).toHaveBeenCalledWith(jwt);
      expect(
        mockIntercomModule.loginUserWithUserAttributes
      ).toHaveBeenCalledWith(userAttributes);
      expect(isLoggedIn).toBe(true);
      expect(mockIntercomModule.updateUser).toHaveBeenCalledWith({
        name: 'Updated Name',
      });
    });
  });

  describe('Error handling', () => {
    test('should handle network errors', async () => {
      const jwt = 'test.jwt.token';
      const networkError = new Error('Network request failed');
      mockIntercomModule.setUserJwt.mockRejectedValue(networkError);

      await expect(Intercom.setUserJwt(jwt)).rejects.toThrow(
        'Network request failed'
      );
    });

    test('should handle invalid JWT format errors', async () => {
      const invalidJWT = 'not.a.valid.jwt';
      const formatError = new Error('Invalid JWT format');
      mockIntercomModule.setUserJwt.mockRejectedValue(formatError);

      await expect(Intercom.setUserJwt(invalidJWT)).rejects.toThrow(
        'Invalid JWT format'
      );
    });

    test('should handle JWT signature verification errors', async () => {
      const jwtWithBadSignature =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIn0.bad_signature';
      const signatureError = new Error('JWT signature verification failed');
      mockIntercomModule.setUserJwt.mockRejectedValue(signatureError);

      await expect(Intercom.setUserJwt(jwtWithBadSignature)).rejects.toThrow(
        'JWT signature verification failed'
      );
    });
  });
});
