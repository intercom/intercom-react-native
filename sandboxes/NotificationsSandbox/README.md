# Intercom React Native Push Notification Sandbox

[Setup](#setup)

[Running the app](#running-the-the-app)

[Local notifications testing](#local-notifications-testing)

[Deep Links Testing](#deep-links-testing)

# Setup

## Step 1: Install dependencies

```shell
# using npm
npm run setup:npm

# OR using Yarn
yarn run setup:yarn
```


## Step 2: Rename to match your package name and bundle ID

This should match the package name for the project in Firebase and Intercom configured apps.


```shell
yarn rename -b "my.identifier"    # Set bundle ID and package name for iOS and Android

# or

yarn rename --iosBundleID "my.ios.bundle.id"    # Set iOS Bundle ID
yarn rename --androidBundleID "my.android.package.name"     # Set Android PackageName
```

>**Note**: This package does not attempt to properly rename build artifacts such as ios/build or Cocoa Pod installation targets. After renaming your project you should clean, build, and reinstall third party dependencies to get it running properly with the new name.


## Step 3: Run pod install

```shell
# using npm
npm run pod

# OR using Yarn
yarn run pod
```


## Step 4: Initialize Intercom

### Android
>**MainApplication.kt**

```kotlin
@Override
public void onCreate() {
  super.onCreate();
  SoLoader.init(this, /* native exopackage */ false);

  // ...

  IntercomModule.initialize(this, "apiKey", "appId"); // <-- Add your configuration here

  // ...
}
```

### iOS
>**AppDelegate.mm**

```objective-c
// ...
[[UIApplication sharedApplication] registerForRemoteNotifications];

[IntercomModule initialize:@"apiKey" withAppId:@"appId"];  // <-- Add your Intercom configurations here

return [super application:application didFinishLaunchingWithOptions:launchOptions];
}
```


## Step 5: Setup Push Notifications

### Android
> Move your **google-services.json** file into the **android/app** directory

> You can find more details on how to configure firebase with Intercom [here](https://developers.intercom.com/installing-intercom/react-native/push-notifications).


# Running the the app

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

```
cd ios && bundle exec pod install
```

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```shell
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```shell
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

>**Note**: Remote push notifications do not work on iOS Simulator. Run the app on a physical device.

```shell
# using npm
npm run ios

# OR using Yarn
yarn ios
```


# Local notifications testing

>**Note**: We can use this method to test if notifications are working locally (e.g. debugging issue with notification permissions).

## Option 1: Drag payload.apns to the running simulator.

Modify the bundle ID inside `payload.apns` to match yours.


## Option 2: Terminal
```shell
xcrun simctl push booted my.bundle.id payload.json
```


# (Local) Deep Links Testing

By default, this sandbox is configured to handle the following links with React Navigation:

```shell
**app://** for deep link

**app.fake** for iOS Universal Link and Android App Link (Only works when linked on a message from within the app.)
```

```shell
Configured Paths:
  /settings
```

>**Note:** Universal and App Links require setup in the server to work.

[Apple - Supporting Associated Domains](https://developer.apple.com/documentation/xcode/supporting-associated-domains)

[Android - Verify App Links](https://developer.android.com/training/app-links/verify-android-applinks)

[React Navigation Documentation - Setup Deep Links](https://reactnavigation.org/docs/deep-linking)

[React Navigation Documentation - Configuring Links](https://reactnavigation.org/docs/configuring-links)

## Option 1: uri-scheme
The uri-scheme package can be used to test deep links on both Android and iOS.

```shell
npx uri-scheme open [your deep link] --[ios|android]
```

Example:
```shell
npx uri-scheme open "app://settings" --ios

npx uri-scheme open "https://app.fake/settings" --ios
```


## Option 2: xcrun for iOS
The xcrun command can be used to test deep links with the iOS simulator:

```shell
xcrun simctl openurl booted [your deep link]
```

Example:
```shell
xcrun simctl openurl booted "app://settings"

xcrun simctl openurl booted "https://app.fake/settings"
```


## Option 3: adb for Android
The adb command can be used to test deep links with the Android emulator or a connected device:

```shell
adb shell am start -W -a android.intent.action.VIEW -d [your deep link] [your android package name]
```

Example:
```shell
adb shell am start -W -a android.intent.action.VIEW -d "app://settings" com.example.app

adb shell am start -W -a android.intent.action.VIEW -d "https://app.fake/settings" com.example.app
```
