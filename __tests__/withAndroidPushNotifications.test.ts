import path from 'path';
import fs from 'fs';

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
  let readFileSyncSpy: jest.SpyInstance;

  const fakeBuildGradle = `
android {
    compileSdkVersion 34
}

dependencies {
    implementation("com.facebook.react:react-native:+")
}
`;

  beforeEach(() => {
    mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync').mockReturnValue(undefined);
    writeFileSyncSpy = jest
      .spyOn(fs, 'writeFileSync')
      .mockReturnValue(undefined);
    readFileSyncSpy = jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValue(fakeBuildGradle);
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

      expect(content).toContain(
        'IntercomModule.sendTokenToIntercom(application, refreshedToken)'
      );
      expect(content).toContain('IntercomModule.isIntercomPush(remoteMessage)');
      expect(content).toContain(
        'IntercomModule.handleRemotePushMessage(application, remoteMessage)'
      );
      expect(content).toContain('super.onMessageReceived(remoteMessage)');
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
        expect.any(String),
        'utf-8'
      );
    });
  });

  describe('Gradle dependency', () => {
    test('adds firebase-messaging when not present', () => {
      const config = createMockConfig('com.example.myapp');
      withAndroidPushNotifications(config as any, {} as any);

      const gradleWriteCall = writeFileSyncSpy.mock.calls.find(
        (call: any[]) => (call[0] as string).includes('build.gradle')
      );
      expect(gradleWriteCall).toBeDefined();
      expect(gradleWriteCall[1]).toContain('firebase-messaging');
    });

    test('skips adding firebase-messaging when already present', () => {
      readFileSyncSpy.mockReturnValue(
        'dependencies {\n    implementation("com.google.firebase:firebase-messaging:23.0.0")\n}'
      );
      const config = createMockConfig('com.example.myapp');
      withAndroidPushNotifications(config as any, {} as any);

      const gradleWriteCall = writeFileSyncSpy.mock.calls.find(
        (call: any[]) => (call[0] as string).includes('build.gradle')
      );
      expect(gradleWriteCall).toBeUndefined();
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

    test('registers MESSAGING_EVENT intent filter with priority', () => {
      const config = createMockConfig('com.example.myapp');
      withAndroidPushNotifications(config as any, {} as any);

      const service = config.modResults.manifest.application[0].service[0];
      const intentFilter = service['intent-filter'][0];
      const action = intentFilter.action[0];

      expect(action.$['android:name']).toBe(
        'com.google.firebase.MESSAGING_EVENT'
      );
      expect(intentFilter.$['android:priority']).toBe('10');
    });

    test('preserves existing services when adding Intercom service', () => {
      const config = createMockConfig('com.example.myapp');

      config.modResults.manifest.application[0].service.push({
        $: {
          'android:name': '.SomeOtherService',
          'android:exported': 'false',
        },
      } as any);

      withAndroidPushNotifications(config as any, {} as any);

      const services = config.modResults.manifest.application[0].service;
      expect(services).toHaveLength(2);
      expect(services[0].$['android:name']).toBe('.SomeOtherService');
      expect(services[1].$['android:name']).toBe(
        '.IntercomFirebaseMessagingService'
      );
    });

    test('does not duplicate service on repeated runs (idempotency)', () => {
      const config = createMockConfig('com.example.myapp');

      withAndroidPushNotifications(config as any, {} as any);
      withAndroidPushNotifications(config as any, {} as any);

      const services = config.modResults.manifest.application[0].service;
      expect(services).toHaveLength(1);
    });

    test('skips registration and warns when another FCM service exists', () => {
      const config = createMockConfig('com.example.myapp');
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      config.modResults.manifest.application[0].service.push({
        '$': {
          'android:name': '.ExistingFcmService',
          'android:exported': 'true',
        },
        'intent-filter': [
          {
            action: [
              {
                $: {
                  'android:name': 'com.google.firebase.MESSAGING_EVENT',
                },
              },
            ],
          },
        ],
      } as any);

      withAndroidPushNotifications(config as any, {} as any);

      const services = config.modResults.manifest.application[0].service;
      expect(services).toHaveLength(1);
      expect(services[0].$['android:name']).toBe('.ExistingFcmService');
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('existing FirebaseMessagingService')
      );

      warnSpy.mockRestore();
    });
  });

  describe('error handling', () => {
    test('throws if android.package is not defined', () => {
      const config = createMockConfig();

      expect(() => {
        withAndroidPushNotifications(config as any, {} as any);
      }).toThrow('android.package must be defined');
    });
  });
});
