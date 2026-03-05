import path from 'path';
import fs from 'fs';

import {
  type ConfigPlugin,
  withDangerousMod,
  withAndroidManifest,
  AndroidConfig,
} from '@expo/config-plugins';
import type { IntercomPluginProps } from './@types';

const SERVICE_CLASS_NAME = 'IntercomFirebaseMessagingService';

/**
 * Generates the Kotlin source for the FirebaseMessagingService that
 * forwards FCM tokens and Intercom push messages to the Intercom SDK.
 */
function generateFirebaseServiceKotlin(packageName: string): string {
  return `package ${packageName}

import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.intercom.reactnative.IntercomModule

class ${SERVICE_CLASS_NAME} : FirebaseMessagingService() {

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
 * into the app's Android source directory.
 */
const writeFirebaseService: ConfigPlugin<IntercomPluginProps> = (_config) =>
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
        generateFirebaseServiceKotlin(packageName)
      );

      return config;
    },
  ]);

/**
 * Adds the FirebaseMessagingService entry to the AndroidManifest.xml
 * so Android knows to route FCM events to our service.
 */
const registerServiceInManifest: ConfigPlugin<IntercomPluginProps> = (
  _config
) =>
  withAndroidManifest(_config, (config) => {
    const mainApplication =
      AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

    const packageName = config.android?.package;
    if (!packageName) {
      throw new Error(
        '@intercom/intercom-react-native: android.package must be defined in your Expo config to use Android push notifications.'
      );
    }

    const serviceName = `.${SERVICE_CLASS_NAME}`;

    // Check if the service is already registered (idempotency)
    const existingService = mainApplication.service?.find(
      (s) => s.$?.['android:name'] === serviceName
    );

    if (!existingService) {
      if (!mainApplication.service) {
        mainApplication.service = [];
      }

      mainApplication.service.push({
        $: {
          'android:name': serviceName,
          'android:exported': 'false' as any,
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
    }

    return config;
  });

export const withAndroidPushNotifications: ConfigPlugin<IntercomPluginProps> = (
  config,
  props
) => {
  let newConfig = config;
  newConfig = writeFirebaseService(newConfig, props);
  newConfig = registerServiceInManifest(newConfig, props);
  return newConfig;
};
