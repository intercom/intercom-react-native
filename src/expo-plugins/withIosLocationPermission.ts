import { type ConfigPlugin, withAppDelegate } from '@expo/config-plugins';
import {
  mergeContents,
  removeContents,
} from '@expo/config-plugins/build/utils/generateCode';
import {
  insertContentsInsideObjcFunctionBlock,
  insertContentsInsideSwiftFunctionBlock,
} from '@expo/config-plugins/build/ios/codeMod';
import type { IntercomPluginProps } from './@types';

const PROVIDER_TAG = 'Intercom location permission provider';

const SWIFT_PROVIDER = `import CoreLocation
import Intercom

final class IntercomLocationPermissionProvider: NSObject, ICMLocationPermissionProvider, CLLocationManagerDelegate {
  private let locationManager = CLLocationManager()

  var authorizationStatusDidChange: ((ICMLocationAuthorizationStatus) -> Void)?

  override init() {
    super.init()
    locationManager.delegate = self
  }

  func currentAuthorizationStatus() -> ICMLocationAuthorizationStatus {
    ICMLocationAuthorizationStatus(rawValue: Int(locationManager.authorizationStatus.rawValue)) ?? .notDetermined
  }

  func requestWhenInUsePermission() {
    locationManager.requestWhenInUseAuthorization()
  }

  func requestAlwaysPermission() {
    locationManager.requestAlwaysAuthorization()
  }

  func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
    authorizationStatusDidChange?(currentAuthorizationStatus())
  }
}
`;

const OBJC_PROVIDER = `#import <CoreLocation/CoreLocation.h>
#import <Intercom/Intercom.h>

@interface IntercomLocationPermissionProvider : NSObject <ICMLocationPermissionProvider, CLLocationManagerDelegate>
@end

@implementation IntercomLocationPermissionProvider {
  CLLocationManager *_locationManager;
}

@synthesize authorizationStatusDidChange = _authorizationStatusDidChange;

- (instancetype)init {
  if ((self = [super init])) {
    _locationManager = [CLLocationManager new];
    _locationManager.delegate = self;
  }
  return self;
}

- (ICMLocationAuthorizationStatus)currentAuthorizationStatus {
  return (ICMLocationAuthorizationStatus)_locationManager.authorizationStatus;
}

- (void)requestWhenInUsePermission {
  [_locationManager requestWhenInUseAuthorization];
}

- (void)requestAlwaysPermission {
  [_locationManager requestAlwaysAuthorization];
}

- (void)locationManagerDidChangeAuthorization:(CLLocationManager *)manager {
  if (self.authorizationStatusDidChange) {
    self.authorizationStatusDidChange([self currentAuthorizationStatus]);
  }
}

@end
`;

const SWIFT_REGISTRATION =
  'Intercom.setLocationPermissionProvider(IntercomLocationPermissionProvider())';
const OBJC_REGISTRATION =
  '[Intercom setLocationPermissionProvider:[IntercomLocationPermissionProvider new]];';

export function updateAppDelegateLocationPermission(
  contents: string,
  language: string,
  enabled: boolean
): string {
  const isSwift = language === 'swift';
  const registration = isSwift ? SWIFT_REGISTRATION : OBJC_REGISTRATION;

  if (!enabled) {
    return removeContents({ src: contents, tag: PROVIDER_TAG })
      .contents.split('\n')
      .filter((line) => !line.includes(registration))
      .join('\n');
  }

  const src = mergeContents({
    src: contents,
    newSrc: isSwift ? SWIFT_PROVIDER : OBJC_PROVIDER,
    tag: PROVIDER_TAG,
    comment: '//',
    anchor: isSwift
      ? /^(@UIApplicationMain|@main)\b/m
      : /^@implementation AppDelegate\b/m,
    offset: 0,
  }).contents;

  if (src.includes(registration)) {
    return src;
  }

  return isSwift
    ? insertContentsInsideSwiftFunctionBlock(
        src,
        'application(_:didFinishLaunchingWithOptions:)',
        registration,
        { position: 'tailBeforeLastReturn' }
      )
    : insertContentsInsideObjcFunctionBlock(
        src,
        'application didFinishLaunchingWithOptions:',
        registration,
        { position: 'tailBeforeLastReturn' }
      );
}

export const withIosLocationPermission: ConfigPlugin<IntercomPluginProps> = (
  _config,
  props
) =>
  withAppDelegate(_config, (config) => {
    config.modResults.contents = updateAppDelegateLocationPermission(
      config.modResults.contents,
      config.modResults.language,
      props.iosLocationPermission === true
    );
    return config;
  });
