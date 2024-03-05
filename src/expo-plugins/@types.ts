export type IntercomRegion = 'US' | 'EU' | 'AU';

export type IntercomPluginProps = {
  iosApiKey: string;
  androidApiKey: string;
  appId: string;
  intercomRegion?: IntercomRegion;
};
