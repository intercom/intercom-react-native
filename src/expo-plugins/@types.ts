export type IntercomRegion = 'US' | 'EU' | 'AU';

type BasePluginProps = {
  /** Data hosting region for your Intercom workspace. Defaults to 'US' */
  intercomRegion?: IntercomRegion;
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
