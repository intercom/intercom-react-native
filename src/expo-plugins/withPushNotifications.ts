import {
  ConfigPlugin,
  withAppDelegate,
  withInfoPlist,
} from '@expo/config-plugins';
import type { IntercomPluginProps } from './@types';
import {
  addObjcImports,
  findObjcFunctionCodeBlock,
  insertContentsInsideObjcFunctionBlock,
} from '@expo/config-plugins/build/ios/codeMod';

const appDelegate: ConfigPlugin<IntercomPluginProps> = (_config) =>
  withAppDelegate(_config, (config) => {
    const pushCode = `
  // START INTERCOM PUSH
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert + UNAuthorizationOptionSound)
                          completionHandler:^(BOOL granted, NSError *_Nullable error) {
                          }];
  [[UIApplication sharedApplication] registerForRemoteNotifications];
  // END INTERCOM PUSH
`;

    const setDeviceTokenCode = '[IntercomModule setDeviceToken:deviceToken];';

    let stringContents = config.modResults.contents;
    stringContents = addObjcImports(stringContents, [
      '<UserNotifications/UserNotifications.h>',
    ]);

    if (!stringContents.includes(pushCode.trim())) {
      stringContents = insertContentsInsideObjcFunctionBlock(
        stringContents,
        'application didFinishLaunchingWithOptions:',
        pushCode,
        { position: 'tailBeforeLastReturn' }
      );
    }

    const didRegisterBlock = findObjcFunctionCodeBlock(
      stringContents,
      'application didRegisterForRemoteNotificationsWithDeviceToken:'
    );

    if (!didRegisterBlock?.code.includes(setDeviceTokenCode)) {
      stringContents = insertContentsInsideObjcFunctionBlock(
        stringContents,
        'application didRegisterForRemoteNotificationsWithDeviceToken:',
        setDeviceTokenCode,
        { position: 'tailBeforeLastReturn' }
      );
    }

    config.modResults.contents = stringContents;
    return config;
  });

const infoPlist: ConfigPlugin<IntercomPluginProps> = (_config) => {
  const newConfig = withInfoPlist(_config, (config) => {
    const keys = { remoteNotification: 'remote-notification' };

    if (!config.modResults.UIBackgroundModes) {
      config.modResults.UIBackgroundModes = [];
    }

    if (
      config.modResults.UIBackgroundModes?.indexOf(keys.remoteNotification) ===
      -1
    ) {
      config.modResults.UIBackgroundModes?.push(keys.remoteNotification);
    }

    return config;
  });

  return newConfig;
};

export const withIntercomPushNotification: ConfigPlugin<IntercomPluginProps> = (
  config,
  props
) => {
  let newConfig = config;
  newConfig = appDelegate(config, props);
  newConfig = infoPlist(config, props);
  return newConfig;
};
