import { Platform } from 'react-native';

/**
 * Intercom configuration
 *
 * Replace these values with your actual Intercom credentials.
 * You can find your API keys and App ID in your Intercom workspace settings:
 * https://app.intercom.com/a/apps/<your-app-id>/settings/channels/messenger/install?tab=ios
 *
 * Note: iOS and Android require different API keys.
 */
export const INTERCOM_CONFIG = {
  appId: '<your-app-id>', // Replace with your Intercom App ID
  apiKey: Platform.select({
    ios: 'ios_sdk-<your-ios-api-key>', // Replace with your iOS API key
    android: 'android_sdk-<your-android-api-key>', // Replace with your Android API key
  }) as string,
};
