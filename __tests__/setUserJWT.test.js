/**
 * Tests for setUserJWT functionality
 */

const { NativeModules } = require('react-native');
const Intercom = require('../src/index').default;

// Mock the native module
jest.mock('react-native', () => ({
  NativeModules: {
    IntercomModule: {
      setUserJwt: jest.fn(),
    },
    IntercomEventEmitter: {
      UNREAD_COUNT_CHANGE_NOTIFICATION:
        'IntercomUnreadCountDidChangeNotification',
      WINDOW_DID_HIDE_NOTIFICATION: 'IntercomWindowDidHideNotification',
      WINDOW_DID_SHOW_NOTIFICATION: 'IntercomWindowDidShowNotification',
    },
  },
  NativeEventEmitter: jest.fn(),
  Platform: {
    OS: 'ios',
    select: jest.fn((config) => config.ios || config.default),
  },
}));

describe('setUserJWT', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call native setUserJwt method with correct JWT token', async () => {
    const mockJwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    NativeModules.IntercomModule.setUserJwt.mockResolvedValue(true);

    const result = await Intercom.setUserJwt(mockJwt);

    expect(NativeModules.IntercomModule.setUserJwt).toHaveBeenCalledWith(
      mockJwt
    );
    expect(result).toBe(true);
  });

  test('should handle empty JWT token', async () => {
    const emptyJwt = '';

    NativeModules.IntercomModule.setUserJwt.mockResolvedValue(true);

    const result = await Intercom.setUserJwt(emptyJwt);

    expect(NativeModules.IntercomModule.setUserJwt).toHaveBeenCalledWith(
      emptyJwt
    );
    expect(result).toBe(true);
  });

  test('should handle null JWT token', async () => {
    const nullJwt = null;

    NativeModules.IntercomModule.setUserJwt.mockResolvedValue(true);

    const result = await Intercom.setUserJwt(nullJwt);

    expect(NativeModules.IntercomModule.setUserJwt).toHaveBeenCalledWith(
      nullJwt
    );
    expect(result).toBe(true);
  });

  test('should handle rejection from native module', async () => {
    const mockJwt = 'invalid-jwt-token';
    const mockError = new Error('Invalid JWT token format');

    NativeModules.IntercomModule.setUserJwt.mockRejectedValue(mockError);

    await expect(Intercom.setUserJwt(mockJwt)).rejects.toThrow(
      'Invalid JWT token format'
    );
    expect(NativeModules.IntercomModule.setUserJwt).toHaveBeenCalledWith(
      mockJwt
    );
  });

  test('should handle complex JWT token structure', async () => {
    const complexJwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjQyNjIyLCJhdWQiOiJpbnRlcmNvbS1hcHAiLCJpc3MiOiJteS1hcHAifQ.K1fOjxHcxtRYFfKZPEfUCzUXLp8sSpgPbMa8t0gE6A0';

    NativeModules.IntercomModule.setUserJwt.mockResolvedValue(true);

    const result = await Intercom.setUserJwt(complexJwt);

    expect(NativeModules.IntercomModule.setUserJwt).toHaveBeenCalledWith(
      complexJwt
    );
    expect(result).toBe(true);
  });
});
