import { updateAppDelegateLocationPermission } from '../src/expo-plugins/withIosLocationPermission';

const swiftAppDelegate = `import Expo
import React
import ReactAppDependencyProvider

@UIApplicationMain
public class AppDelegate: ExpoAppDelegate {
  var window: UIWindow?

  public override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
`;

const objcAppDelegate = `#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"main";
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

@end
`;

const swiftRegistration =
  'Intercom.setLocationPermissionProvider(IntercomLocationPermissionProvider())';
const objcRegistration =
  '[Intercom setLocationPermissionProvider:[IntercomLocationPermissionProvider new]];';

const occurrences = (haystack: string, needle: string) =>
  haystack.split(needle).length - 1;

describe('updateAppDelegateLocationPermission', () => {
  it('adds the Swift provider before the app delegate and registers it before the launch return', () => {
    const result = updateAppDelegateLocationPermission(
      swiftAppDelegate,
      'swift',
      true
    );

    expect(
      result.indexOf('final class IntercomLocationPermissionProvider')
    ).toBeLessThan(result.indexOf('@UIApplicationMain'));
    expect(result.indexOf(swiftRegistration)).toBeLessThan(
      result.indexOf('return super.application')
    );
    expect(result.indexOf(swiftRegistration)).toBeGreaterThan(
      result.indexOf('let delegate = ReactNativeDelegate()')
    );
  });

  it('adds the Objective-C provider before @implementation AppDelegate and registers it', () => {
    const result = updateAppDelegateLocationPermission(
      objcAppDelegate,
      'objcpp',
      true
    );

    expect(
      result.indexOf('@implementation IntercomLocationPermissionProvider')
    ).toBeLessThan(result.indexOf('@implementation AppDelegate'));
    expect(result.indexOf(objcRegistration)).toBeLessThan(
      result.indexOf('return [super application')
    );
  });

  it('does not duplicate code when run again', () => {
    const once = updateAppDelegateLocationPermission(
      swiftAppDelegate,
      'swift',
      true
    );
    const twice = updateAppDelegateLocationPermission(once, 'swift', true);

    expect(twice).toEqual(once);
    expect(occurrences(twice, swiftRegistration)).toBe(1);
  });

  it('removes previously generated code when disabled', () => {
    const enabled = updateAppDelegateLocationPermission(
      objcAppDelegate,
      'objcpp',
      true
    );

    expect(
      updateAppDelegateLocationPermission(enabled, 'objcpp', false)
    ).toEqual(objcAppDelegate);
  });

  it('leaves the app delegate untouched when not enabled', () => {
    expect(
      updateAppDelegateLocationPermission(swiftAppDelegate, 'swift', false)
    ).toEqual(swiftAppDelegate);
  });
});
