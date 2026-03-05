import path from 'path';
import fs from 'fs';

// Mock @expo/config-plugins so we don't need the full Expo runtime.
// withDangerousMod and withAndroidManifest just invoke their callbacks
// immediately with the config object, simulating what Expo does at prebuild.
jest.mock('@expo/config-plugins', () => ({
  withDangerousMod: (config: any, [_platform, callback]: [string, Function]) =>
    callback(config),
  withAndroidManifest: (config: any, callback: Function) => callback(config),
  AndroidConfig: {
    Manifest: {
      getMainApplicationOrThrow: (modResults: any) =>
        modResults.manifest.application[0],
    },
  },
}));

import { withAndroidPushNotifications } from '../src/expo-plugins/withAndroidPushNotifications';

/**
 * Helper to create a minimal Expo config object that the plugins expect.
 * Mirrors the shape that Expo passes during prebuild.
 */
function createMockConfig(packageName?: string) {
  return {
    name: 'TestApp',
    slug: 'test-app',
    android: packageName ? { package: packageName } : undefined,
    modRequest: {
      projectRoot: '/mock/project',
    },
    modResults: {
      manifest: {
        application: [
          {
            $: { 'android:name': '.MainApplication' },
            activity: [],
            service: [] as any[],
          },
        ],
      },
    },
  };
}

describe('withAndroidPushNotifications', () => {
  let mkdirSyncSpy: jest.SpyInstance;
  let writeFileSyncSpy: jest.SpyInstance;

  beforeEach(() => {
    mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync').mockReturnValue(undefined);
    writeFileSyncSpy = jest
      .spyOn(fs, 'writeFileSync')
      .mockReturnValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Kotlin service file generation', () => {
    test('writes file with correct package name', () => {
      const config = createMockConfig('com.example.myapp');
      withAndroidPushNotifications(config as any, {} as any);

      const content = writeFileSyncSpy.mock.calls[0][1] as string;
      expect(content).toContain('package com.example.myapp');
    });

    test('generates valid FirebaseMessagingService subclass', () => {
      const config = createMockConfig('com.example.myapp');
      withAndroidPushNotifications(config as any, {} as any);

      const content = writeFileSyncSpy.mock.calls[0][1] as string;

      expect(content).toContain(
        'class IntercomFirebaseMessagingService : FirebaseMessagingService()'
      );
      expect(content).toContain(
        'override fun onNewToken(refreshedToken: String)'
      );
      expect(content).toContain(
        'override fun onMessageReceived(remoteMessage: RemoteMessage)'
      );
    });

    test('includes Intercom message routing logic', () => {
      const config = createMockConfig('com.example.myapp');
      withAndroidPushNotifications(config as any, {} as any);

      const content = writeFileSyncSpy.mock.calls[0][1] as string;

      // Token forwarding
      expect(content).toContain(
        'IntercomModule.sendTokenToIntercom(application, refreshedToken)'
      );
      // Message filtering
      expect(content).toContain(
        'IntercomModule.isIntercomPush(remoteMessage)'
      );
      // Intercom message handling
      expect(content).toContain(
        'IntercomModule.handleRemotePushMessage(application, remoteMessage)'
      );
      // Non-Intercom passthrough
      expect(content).toContain('super.onMessageReceived(remoteMessage)');
      // Token passthrough
      expect(content).toContain('super.onNewToken(refreshedToken)');
    });

    test('includes all required Kotlin imports', () => {
      const config = createMockConfig('com.example.myapp');
      withAndroidPushNotifications(config as any, {} as any);

      const content = writeFileSyncSpy.mock.calls[0][1] as string;

      expect(content).toContain(
        'import com.google.firebase.messaging.FirebaseMessagingService'
      );
      expect(content).toContain(
        'import com.google.firebase.messaging.RemoteMessage'
      );
      expect(content).toContain(
        'import com.intercom.reactnative.IntercomModule'
      );
    });

    test('writes file to correct directory based on package name', () => {
      const config = createMockConfig('io.intercom.example');
      withAndroidPushNotifications(config as any, {} as any);

      const expectedDir = path.join(
        '/mock/project',
        'android',
        'app',
        'src',
        'main',
        'java',
        'io',
        'intercom',
        'example'
      );

      expect(mkdirSyncSpy).toHaveBeenCalledWith(expectedDir, {
        recursive: true,
      });
      expect(writeFileSyncSpy).toHaveBeenCalledWith(
        path.join(expectedDir, 'IntercomFirebaseMessagingService.kt'),
        expect.any(String)
      );
    });
  });

  describe('AndroidManifest service registration', () => {
    test('adds service entry with correct attributes', () => {
      const config = createMockConfig('com.example.myapp');
      withAndroidPushNotifications(config as any, {} as any);

      const services = config.modResults.manifest.application[0].service;
      expect(services).toHaveLength(1);

      const service = services[0];
      expect(service.$['android:name']).toBe(
        '.IntercomFirebaseMessagingService'
      );
      expect(service.$['android:exported']).toBe('false');
    });

    test('registers MESSAGING_EVENT intent filter', () => {
      const config = createMockConfig('com.example.myapp');
      withAndroidPushNotifications(config as any, {} as any);

      const service = config.modResults.manifest.application[0].service[0];
      const intentFilter = service['intent-filter'][0];
      const action = intentFilter.action[0];

      expect(action.$['android:name']).toBe(
        'com.google.firebase.MESSAGING_EVENT'
      );
    });

    test('does not duplicate service on repeated runs (idempotency)', () => {
      const config = createMockConfig('com.example.myapp');

      // Run plugin twice on the same config
      withAndroidPushNotifications(config as any, {} as any);
      withAndroidPushNotifications(config as any, {} as any);

      const services = config.modResults.manifest.application[0].service;
      expect(services).toHaveLength(1);
    });
  });

  describe('error handling', () => {
    test('throws if android.package is not defined', () => {
      const config = createMockConfig(); // no package name

      expect(() => {
        withAndroidPushNotifications(config as any, {} as any);
      }).toThrow('android.package must be defined');
    });
  });
});
