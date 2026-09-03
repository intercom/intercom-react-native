/**
 * Tests that importing the native module bindings does not throw when the
 * native side is unavailable (Expo Go, Jest, web bundles, prebuilds before
 * pods are installed).
 */

describe('nativeModules', () => {
  afterEach(() => {
    jest.resetModules();
    jest.dontMock('react-native');
  });

  test('falls back to empty objects when native modules are missing', () => {
    jest.doMock('react-native', () => ({
      NativeModules: {},
      TurboModuleRegistry: { get: () => null },
    }));

    let modules: typeof import('../src/nativeModules') | undefined;
    expect(() => {
      modules = require('../src/nativeModules');
    }).not.toThrow();

    expect(modules?.IntercomModule).toEqual({});
    expect(modules?.IntercomEventEmitter).toEqual({});
  });

  test('uses the registered native modules when they are available', () => {
    const intercomModule = { initialize: jest.fn() };
    const intercomEventEmitter = { UNREAD_COUNT_CHANGE_NOTIFICATION: 'event' };

    jest.doMock('react-native', () => ({
      NativeModules: {
        IntercomModule: intercomModule,
        IntercomEventEmitter: intercomEventEmitter,
      },
      TurboModuleRegistry: { get: () => null },
    }));

    const modules = require('../src/nativeModules');

    expect(modules.IntercomModule).toBe(intercomModule);
    expect(modules.IntercomEventEmitter).toBe(intercomEventEmitter);
  });
});
