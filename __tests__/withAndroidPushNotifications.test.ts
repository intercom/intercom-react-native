import path from 'path';
import fs from 'fs';

jest.mock('@expo/config-plugins', () => ({
  withDangerousMod: (config: any, [_platform, callback]: [string, Function]) =>
    callback(config),
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
  };
}

describe('withAndroidPushNotifications', () => {
  let mkdirSyncSpy: jest.SpyInstance;
  let writeFileSyncSpy: jest.SpyInstance;
  let readFileSyncSpy: jest.SpyInstance;

  const fakeNativeBuildGradle = `
dependencies {
    implementation "com.google.firebase:firebase-messaging:24.1.2"
    implementation 'io.intercom.android:intercom-sdk:17.4.5'
}
`;

  const fakeAppBuildGradle = `
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
      .mockImplementation((filePath: any) => {
        const p = String(filePath);
        if (p.includes(path.join('app', 'build.gradle'))) {
          return fakeAppBuildGradle;
        }
        return fakeNativeBuildGradle;
      });
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
    test('adds firebase-messaging with version from native module', () => {
      const config = createMockConfig('com.example.myapp');
      withAndroidPushNotifications(config as any, {} as any);

      const gradleWriteCall = writeFileSyncSpy.mock.calls.find((call: any[]) =>
        (call[0] as string).includes('build.gradle')
      );
      expect(gradleWriteCall).toBeDefined();
      expect(gradleWriteCall[1]).toContain('firebase-messaging:24.1.2');
    });

    test('skips adding firebase-messaging when already present', () => {
      readFileSyncSpy.mockImplementation((filePath: any) => {
        const p = String(filePath);
        if (p.includes(path.join('app', 'build.gradle'))) {
          return 'dependencies {\n    implementation("com.google.firebase:firebase-messaging:23.0.0")\n}';
        }
        return fakeNativeBuildGradle;
      });
      const config = createMockConfig('com.example.myapp');
      withAndroidPushNotifications(config as any, {} as any);

      const gradleWriteCall = writeFileSyncSpy.mock.calls.find((call: any[]) =>
        (call[0] as string).includes('build.gradle')
      );
      expect(gradleWriteCall).toBeUndefined();
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
