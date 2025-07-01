/**
 * Test setup for React Native mocking
 */

import { NativeModules } from 'react-native';

// Mock the native modules
const mockIntercomModule = {
  setUserHash: jest.fn(),
  setUserJWT: jest.fn(),
  loginUnidentifiedUser: jest.fn(),
  loginUserWithUserAttributes: jest.fn(),
  logout: jest.fn(),
  updateUser: jest.fn(),
  isUserLoggedIn: jest.fn(),
  fetchLoggedInUserAttributes: jest.fn(),
  logEvent: jest.fn(),
  presentIntercom: jest.fn(),
  presentIntercomSpace: jest.fn(),
  presentContent: jest.fn(),
  presentMessageComposer: jest.fn(),
  getUnreadConversationCount: jest.fn(),
  hideIntercom: jest.fn(),
  setBottomPadding: jest.fn(),
  setInAppMessageVisibility: jest.fn(),
  setLauncherVisibility: jest.fn(),
  setNeedsStatusBarAppearanceUpdate: jest.fn(),
  handlePushMessage: jest.fn(),
  sendTokenToIntercom: jest.fn(),
  setLogLevel: jest.fn(),
  fetchHelpCenterCollections: jest.fn(),
  fetchHelpCenterCollection: jest.fn(),
  searchHelpCenter: jest.fn(),
};

const mockEventEmitter = {
  UNREAD_COUNT_CHANGE_NOTIFICATION: 'UNREAD_COUNT_CHANGE_NOTIFICATION',
  WINDOW_DID_HIDE_NOTIFICATION: 'WINDOW_DID_HIDE_NOTIFICATION',
  WINDOW_DID_SHOW_NOTIFICATION: 'WINDOW_DID_SHOW_NOTIFICATION',
  HELP_CENTER_WINDOW_DID_SHOW_NOTIFICATION:
    'HELP_CENTER_WINDOW_DID_SHOW_NOTIFICATION',
  HELP_CENTER_WINDOW_DID_HIDE_NOTIFICATION:
    'HELP_CENTER_WINDOW_DID_HIDE_NOTIFICATION',
  startEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

NativeModules.IntercomModule = mockIntercomModule;
NativeModules.IntercomEventEmitter = mockEventEmitter;

// Mock Platform
const mockPlatform = {
  OS: 'ios',
  select: jest.fn((obj) => obj.ios || obj.default),
};

jest.doMock('react-native', () => ({
  NativeModules: {
    IntercomModule: mockIntercomModule,
    IntercomEventEmitter: mockEventEmitter,
  },
  NativeEventEmitter: jest.fn().mockImplementation(() => ({
    addListener: jest.fn().mockReturnValue({
      remove: jest.fn(),
    }),
  })),
  Platform: mockPlatform,
}));

export { mockIntercomModule, mockEventEmitter, mockPlatform };
