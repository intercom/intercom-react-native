describe('importing the module', () => {
  test('does not throw without the native modules', () => {
    jest.isolateModules(() => {
      const { NativeModules } = require('react-native');
      expect(NativeModules.IntercomEventEmitter).toBeUndefined();
      expect(NativeModules.IntercomModule).toBeUndefined();

      const { IntercomEvents } = require('../src');

      expect(IntercomEvents.IntercomUnreadCountDidChange).toBeUndefined();
    });
  });

  test('reads event names and methods from the native modules', () => {
    jest.isolateModules(() => {
      jest.doMock('../src/nativeModules', () => ({
        IntercomModule: {
          setNeedsStatusBarAppearanceUpdate: jest.fn(() =>
            Promise.resolve(true)
          ),
        },
        IntercomEventEmitter: {
          UNREAD_COUNT_CHANGE_NOTIFICATION: 'unread',
          WINDOW_DID_HIDE_NOTIFICATION: 'hide',
          WINDOW_DID_SHOW_NOTIFICATION: 'show',
        },
      }));
      const { IntercomModule } = require('../src/nativeModules');
      const { default: Intercom, IntercomEvents } = require('../src');

      expect(IntercomEvents).toEqual({
        IntercomUnreadCountDidChange: 'unread',
        IntercomWindowDidHide: 'hide',
        IntercomWindowDidShow: 'show',
        IntercomHelpCenterWindowDidShow: 'show',
        IntercomHelpCenterWindowDidHide: 'hide',
      });

      Intercom.setNeedsStatusBarAppearanceUpdate();
      expect(
        IntercomModule.setNeedsStatusBarAppearanceUpdate
      ).toHaveBeenCalledTimes(1);
    });
  });
});
