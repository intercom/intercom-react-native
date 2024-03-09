import {
  type ConfigPlugin,
  createRunOncePlugin,
  withAppDelegate,
  AndroidConfig,
  withMainApplication,
  withAndroidManifest,
  withInfoPlist,
} from '@expo/config-plugins';
import {
  addImports,
  appendContentsInsideDeclarationBlock,
} from '@expo/config-plugins/build/android/codeMod';
import {
  addObjcImports,
  insertContentsInsideObjcFunctionBlock,
} from '@expo/config-plugins/build/ios/codeMod';
import type { IntercomPluginProps, IntercomRegion } from './@types';

const mainApplication: ConfigPlugin<IntercomPluginProps> = (_config, props) =>
  withMainApplication(_config, (config) => {
    let stringContents = config.modResults.contents;
    stringContents = addImports(
      stringContents,
      ['com.intercom.reactnative.IntercomModule;'],
      false
    );
    stringContents = appendContentsInsideDeclarationBlock(
      stringContents,
      'onCreate',
      `IntercomModule.initialize(this, "${props.androidApiKey}", "${props.appId}");`
    );
    config.modResults.contents = stringContents;
    return config;
  });

const androidManifest: ConfigPlugin<IntercomPluginProps> = (
  _config,
  { intercomRegion = 'US' }
) => {
  let newConfig = AndroidConfig.Permissions.withPermissions(
    _config,
    [
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.VIBRATE',
    ].filter(Boolean)
  );

  newConfig = withAndroidManifest(newConfig, (config) => {
    const currentMainApplication =
      AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
    const androidRegionMapper: Record<IntercomRegion, string> = {
      US: '@integer/intercom_server_region_us',
      EU: '@integer/intercom_server_region_eu',
      AU: '@integer/intercom_server_region_aus',
    };

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      currentMainApplication,
      'io.intercom.android.sdk.server.region',
      androidRegionMapper[intercomRegion]
    );

    return config;
  });

  return newConfig;
};

const withIntercomAndroid: ConfigPlugin<IntercomPluginProps> = (
  config,
  props
) => {
  let newConfig = config;
  newConfig = mainApplication(newConfig, props);
  newConfig = androidManifest(newConfig, props);
  return newConfig;
};

const appDelegate: ConfigPlugin<IntercomPluginProps> = (_config, props) =>
  withAppDelegate(_config, (config) => {
    let stringContents = config.modResults.contents;
    stringContents = addObjcImports(stringContents, ['<IntercomModule.h>']);
    stringContents = insertContentsInsideObjcFunctionBlock(
      stringContents,
      'application didFinishLaunchingWithOptions:',
      `[IntercomModule initialize:@"${props.iosApiKey}" withAppId:@"${props.appId}"];`,
      { position: 'tailBeforeLastReturn' }
    );
    config.modResults.contents = stringContents;
    return config;
  });

const infoPlist: ConfigPlugin<IntercomPluginProps> = (
  _config,
  { intercomRegion }
) => {
  const newConfig = withInfoPlist(_config, (config) => {
    if (intercomRegion) {
      config.modResults.IntercomRegion = intercomRegion;
    }

    return config;
  });

  return newConfig;
};
const withIntercomIOS: ConfigPlugin<IntercomPluginProps> = (config, props) => {
  let newConfig = appDelegate(config, props);
  newConfig = infoPlist(newConfig, props);
  return newConfig;
};

const withIntercomReactNative: ConfigPlugin<IntercomPluginProps> = (
  config,
  props
) => {
  let newConfig = config;
  newConfig = withIntercomAndroid(newConfig, props);
  newConfig = withIntercomIOS(newConfig, props);
  return newConfig;
};

const configPlugin = (pkg: { name: string; version: string }) =>
  createRunOncePlugin(withIntercomReactNative, pkg.name, pkg.version);

export default configPlugin;
