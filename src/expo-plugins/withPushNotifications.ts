import {
  type ConfigPlugin,
  withAppDelegate,
  withInfoPlist,
} from '@expo/config-plugins';
import type { IntercomPluginProps } from './@types';
import {
  findObjcFunctionCodeBlock,
  insertContentsInsideObjcFunctionBlock,
} from '@expo/config-plugins/build/ios/codeMod';

const appDelegate: ConfigPlugin<IntercomPluginProps> = (_config) =>
  withAppDelegate(_config, (config) => {
    const setDeviceTokenCode = '[IntercomModule setDeviceToken:deviceToken];';

    let stringContents = config.modResults.contents;

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
