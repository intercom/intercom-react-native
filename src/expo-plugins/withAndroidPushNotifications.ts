import path from 'path';
import fs from 'fs';

import { type ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import type { IntercomPluginProps } from './@types';

const SERVICE_CLASS_NAME = 'IntercomFirebaseMessagingService';

function hasExpoNotifications(): boolean {
  try {
    require('expo-notifications');
    return true;
  } catch (e: any) {
    return e?.code !== 'MODULE_NOT_FOUND';
  }
}

/**
 * Generates the Kotlin source for the FirebaseMessagingService that
 * forwards FCM tokens and Intercom push messages to the Intercom SDK.
 */
function generateFirebaseServiceKotlin(packageName: string): string {
  const extendsExpo = hasExpoNotifications();
  const baseClass = extendsExpo
    ? 'ExpoFirebaseMessagingService'
    : 'FirebaseMessagingService';
  const baseImport = extendsExpo
    ? 'import expo.modules.notifications.service.ExpoFirebaseMessagingService'
    : 'import com.google.firebase.messaging.FirebaseMessagingService';

  return `package ${packageName}

${baseImport}
import com.google.firebase.messaging.RemoteMessage
import com.intercom.reactnative.IntercomModule

class ${SERVICE_CLASS_NAME} : ${baseClass}() {

    override fun onNewToken(refreshedToken: String) {
        IntercomModule.sendTokenToIntercom(application, refreshedToken)
        super.onNewToken(refreshedToken)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        if (IntercomModule.isIntercomPush(remoteMessage)) {
            IntercomModule.handleRemotePushMessage(application, remoteMessage)
        } else {
            super.onMessageReceived(remoteMessage)
        }
    }
}
`;
}

/**
 * Uses withDangerousMod to write the Kotlin FirebaseMessagingService file
 * into the app's Android source directory, and ensures firebase-messaging
 * is on the app module's compile classpath.
 */
export const withAndroidPushNotifications: ConfigPlugin<IntercomPluginProps> = (
  _config
) =>
  withDangerousMod(_config, [
    'android',
    (config) => {
      const packageName = config.android?.package;
      if (!packageName) {
        throw new Error(
          '@intercom/intercom-react-native: android.package must be defined in your Expo config to use Android push notifications.'
        );
      }

      const projectRoot = config.modRequest.projectRoot;
      const packagePath = packageName.replace(/\./g, '/');
      const serviceDir = path.join(
        projectRoot,
        'android',
        'app',
        'src',
        'main',
        'java',
        packagePath
      );

      fs.mkdirSync(serviceDir, { recursive: true });
      fs.writeFileSync(
        path.join(serviceDir, `${SERVICE_CLASS_NAME}.kt`),
        generateFirebaseServiceKotlin(packageName),
        'utf-8'
      );

      // The native module declares firebase-messaging as an `implementation`
      // dependency, which keeps it private to the library. Since our generated
      // service lives in the app module, we need firebase-messaging on the
      // app's compile classpath too. We read the version from the native
      // module's build.gradle so it stays in sync automatically.
      const packageRoot = path.resolve(__dirname, '..', '..', '..');
      const nativeBuildGradle = fs.readFileSync(
        path.join(packageRoot, 'android', 'build.gradle'),
        'utf-8'
      );
      const versionMatch = nativeBuildGradle.match(
        /com\.google\.firebase:firebase-messaging:([\d.]+)/
      );
      const firebaseMessagingVersion = versionMatch
        ? versionMatch[1]
        : '24.1.2';

      const buildGradlePath = path.join(
        projectRoot,
        'android',
        'app',
        'build.gradle'
      );
      const buildGradle = fs.readFileSync(buildGradlePath, 'utf-8');
      if (!buildGradle.includes('firebase-messaging')) {
        const updatedBuildGradle = buildGradle.replace(
          /dependencies\s*\{/,
          `dependencies {\n    implementation("com.google.firebase:firebase-messaging:${firebaseMessagingVersion}")`
        );
        fs.writeFileSync(buildGradlePath, updatedBuildGradle, 'utf-8');
      }

      return config;
    },
  ]);
