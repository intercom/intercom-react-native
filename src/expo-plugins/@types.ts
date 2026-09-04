export type IntercomRegion = 'US' | 'EU' | 'AU';
export type AndroidPushFallback = 'expo-notifications' | 'none';

type BasePluginProps = {
  /** Data hosting region for your Intercom workspace. Defaults to 'US' */
  intercomRegion?: IntercomRegion;
  /**
   * What the generated Android messaging service does with push messages that
   * are not from Intercom.
   *
   * - 'expo-notifications': forwards them to expo-notifications for handling
   *   and display. Requires expo-notifications to be installed.
   * - 'none': ignores them. Use this when another push provider (e.g.
   *   OneSignal, Braze) displays its own notifications; otherwise each of its
   *   pushes may be displayed twice (once by the provider and once by
   *   expo-notifications). Note that 'none' also stops forwarding new FCM
   *   tokens to expo-notifications, so Notifications.addPushTokenListener
   *   will no longer fire on token rotation.
   *
   * Defaults to 'expo-notifications' when expo-notifications is installed,
   * 'none' otherwise.
   */
  androidPushFallback?: AndroidPushFallback;
};

type AutoInitPluginProps = BasePluginProps & {
  appId: string;
  iosApiKey: string;
  androidApiKey: string;
  useManualInit?: false | undefined;
};

type ManualInitPluginProps = BasePluginProps & {
  /**
   * When true, prevents automatic SDK initialization at app startup.
   * You'll need to manually call Intercom.initialize() in your JavaScript code.
   * All initialization parameters (apiKey and appId) should be provided at runtime.
   */
  useManualInit: true;
};

export type IntercomPluginProps = AutoInitPluginProps | ManualInitPluginProps;
