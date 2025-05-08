module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'detox/jest.config.js',
    },
    jest: {
      setupTimeout: 180000,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Debug-iphonesimulator/IntercomReactNativeExample.app',
      build:
        'xcodebuild -workspace ios/IntercomReactNativeExample.xcworkspace -scheme IntercomReactNativeExample -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
      permissions: {
        notifications: 'YES',
      },
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build:
        'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
      reversePorts: [8081],
      launchTimeout: 180000,
      permissions: {
        notifications: 'YES',
        camera: 'YES',
        microphone: 'YES',
        location: 'YES',
      },
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_3a_API_33_arm64-v8a',
        bootArgs: '-no-snapshot-load',
        coldBoot: true,
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
      behavior: {
        init: {
          launchApp: true,
          reinstall: true,
        },
      },
    },
  },
};
