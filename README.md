# Welcome to intercom-react-native 👋

[![Version](https://img.shields.io/npm/v/intercom-react-native.svg)](https://www.npmjs.com/package/intercom-react-native)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/intercom/intercom-react-native#readme)
[![License: Apache--2.0](https://img.shields.io/badge/License-Apache--2.0-yellow.svg)](https://github.com/intercom/intercom-react-native#readme)

> React Native wrapper to bridge our iOS and Android SDK

### 🏠 [Homepage](https://github.com/intercom/intercom-react-native#readme)

- [Installation](#installation)
  - [Android](#android)
    - [Automatic](#android-automatic-react-native-v060-and-above)
    - [Manual](#android-manual-react-native-v059-and-below)
    - [General](#android-general)
      - [Permissions](#permissions-android)
    - [Push Notifications](#android-push-notifications)
  - [iOS](#ios)
    - [Automatic](#ios-automatic-react-native-v060-and-above)
    - [Manual](#ios-manual-react-native-v059-and-below)
    - [General](#ios-general)
      - [Permissions](#permissions-ios)
    - [Push Notifications](#ios-push-notifications)
- [Deep Linking](#deep-linking)
- [Uploading token to Intercom](#upload-token-to-intercom)
- [Common methods](#methods)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Author](#author)
- [License](#license)

## Installation

```sh
npm install intercom-react-native
or
yarn add intercom-react-native
```

IOS:

```sh
cd ios
pod install
cd ..
```

### Android

### Android Automatic React Native v0.60 and above

As react-native@0.60 and above supports autolinking there is no need to run the linking.

### Android Manual React Native v0.59 and below

Make `react native link intercom-react-native`

### Or

- Add below code to `android/settings.gradle`

```
include ':intercomreactnative'
project(':intercomreactnative').projectDir = new File(rootProject.projectDir, '../../android')
```

- Then edit `android/app/build.gradle`, inside `dependencies` at very bottom add

```
implementation project(':intercomreactnative')
```

#### Android General

- Add below lines to `MainApplication.java` inside `onCreate` method.

```java
 import com.intercomreactnative.IntercomModule;
 ...
  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    IntercomModule.initialize(this, "apiKey", "appId"); <-- Add this line
    ...
```

- Open `android/build.gradle` and change `minSdkVersion` to **21**

```
buildscript {
    ext {
        buildToolsVersion = "29.0.2"
        minSdkVersion = 21 <--- Here
        compileSdkVersion = 29
        targetSdkVersion = 29
    }
    ...
```

- In `android/build.gradle` make sure that `com.android.tools.build:gradle` version is greater than `4.0.0`

```
    dependencies {
        classpath("com.android.tools.build:gradle:4.0.1")
        ...
```

### Permissions Android

You will need to include the [READ\_EXTERNAL\_STORAGE](http://developer.android.com/reference/android/Manifest.permission.html#READ_EXTERNAL_STORAGE) permission if you have enabled attachments:

```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
```

You can also include [VIBRATE](http://developer.android.com/reference/android/Manifest.permission.html#VIBRATE) to enable vibration in push notifications:

```xml
<uses-permission android:name="android.permission.VIBRATE"/>
```

### Android Push Notifications

For Push notification support add `GoogleServices` and `Firebase Cloud Messagng` to your app.

**More information about PN
setup [HERE](https://developers.intercom.com/installing-intercom/docs/android-fcm-push-notifications)**

- Inside `android/build.gradle` add

```
buildscript {
    ...
    dependencies {
      ...
      classpath 'com.google.gms:google-services:4.2.0' <-- Add this
    }
}
```

- At the very bottom of `android/app/build.gradle` add:

```
apply plugin: 'com.google.gms.google-services' <-- Add this

apply from: file("../../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesAppBuildGradle(project)
```

- Place `google-services.json` in `android/app` directory.

- Create `MainNotificationService.java` inside your app directory(`com.example.app`) with below content:

```java
package com.example.intercomreactnative;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.intercomreactnative.IntercomModule;

public class MainNotificationService extends FirebaseMessagingService {

  public void onMessageReceived(RemoteMessage remoteMessage) {
    if (IntercomModule.isIntercomPush(remoteMessage)) {
      IntercomModule.handleRemotePushMessage(getApplication(), remoteMessage);
    } else {
      //HANDLE NOT INTERCOM MESSAGE
    }
  }
}
```

- Edit `AndroidManifest.xml`. Add below content inside `<application>` below `<activity/>`

```xml

<manifest>
  <application>
    <activity>
      ...
    </activity>
    ...

    <!--    Add this-->
    <service
      android:name=".MainNotificationService">
      <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT"/>
      </intent-filter>
    </service>

    <receiver
      android:name="com.intercomreactnative.RNIntercomPushBroadcastReceiver"
      tools:replace="android:exported"
      android:exported="true"/>
    <!--    Add this-->

  </application>
</manifest>
```

- Add belo code to your React Native app

```jsx
  useEffect(() => {
    /**
     * Handle PushNotification
     */
    AppState.addEventListener(
      'change',
      (nextAppState) =>
        nextAppState === 'active' && Intercom.handlePushMessage()
    );
    return () => AppState.removeEventListener('change', () => true);
  }
  , [])
```

- To handle Push Notification deep linking add below code to `<activity>` inside `AndroidManifest.xml`

```xml

<activity
  android:name=".MainActivity"
  android:label="@string/app_name"
  android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
  android:launchMode="singleTask"
  android:windowSoftInputMode="adjustResize">
  <intent-filter>
    <action android:name="android.intent.action.MAIN"/>
    <category android:name="android.intent.category.LAUNCHER"/>
  </intent-filter>

  <!--  Add this  -->
  <intent-filter>
    <action android:name="android.intent.action.VIEW"/>
    <category android:name="android.intent.category.DEFAULT"/>
    <category android:name="android.intent.category.BROWSABLE"/>

    <data android:scheme="http" android:host="Your app url(www.app.com)"/> <!-- Edit this line -->
    <data android:scheme="Your app scheme(app)"/> <!-- Edit this line -->
  </intent-filter>
  <!--  Add this  -->

</activity>

```

### IOS

### IOS Automatic React Native v0.60 and above

Make `pod install` in ios directory

### IOS Manual React Native v0.59 and below

[How to manual link IOS Intecom SDK ](docs/IOS-MANUAL-LINKING.md)

#### IOS General

- Open `ios/AppDelegate.m` then add below code:

  - At the top of file add:

  ```
  #import "AppDelegate.h"
  #import <React/RCTBridge.h>
  #import <React/RCTBundleURLProvider.h>
  #import <React/RCTRootView.h>
  ...
  #import <IntercomModule.h> <-- Add This
  ```
  - Inside `didFinishLaunchingWithOptions` before `return YES` add:
  ```
    ...
    self.window.rootViewController = rootViewController;

    [IntercomModule initialize:@"APP KEY" withAppId:@"APP ID"]; <-- Add this (Remember to replace strings with your api keys)

    return YES;
   }
  ```

#### Permissions IOS

Add this permission to your `Info.plist`

```xml

<key>NSPhotoLibraryUsageDescription</key>
<string>Send photos to support center</string>
```

### IOS Push Notifications

Package handles Push Notification itself, you have to only
[Upload Token to intercom](#upload-token-to-intercom)
___

### Or Set up notification in native part

- In `AppDelegate.m` at the top add

```
#import <UserNotifications/UserNotifications.h>
```

- Inside `didFinishLaunchingWithOptions` before `return YES;` add below code:

```
    ...

    //Code to add
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert + UNAuthorizationOptionSound)
                          completionHandler:^(BOOL granted, NSError *_Nullable error) {
                          }];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
    //Code to add

    return YES;
```

- In same file, above `@end` add:

```
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [IntercomModule setDeviceToken:deviceToken];
}

@end
```

### Deep Links Support

Setup of React Native deep links can be found [Here](https://reactnative.dev/docs/linking#enabling-deep-links)

- Add import to `AppDelegate.m`

````
#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <React/RCTLinkingManager.h> <--Add this
````

- Add below code to `AppDelegate.m` above `@end`

```
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}


- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  return [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
}

@end
```

## Deep Linking

Deep linking example [Here](https://github.com/intercom/intercom-react-native/blob/main/example/src/App.tsx)

```jsx
 /**
 * Handle Push Notification deep links
 */
Linking.addEventListener('url', (event) => {
  if (event) {
    Alert.alert(event.url);
  }
});

Linking.getInitialURL()
  .then((url) => {
    if (url) {
      Alert.alert(url);
    }
  })
  .catch((e) => console.log(e));
```

## Upload token to Intercom

Token upload can be handled by [Intercom.sendTokenToIntercom(token)](#intercomsendtokentointercomtoken)
with token obtained
from [react-native-notifications](https://wix.github.io/react-native-notifications/api/general-events#registerremotenotificationsregistered)
___

## Methods

## Import

### `import Intercom from 'react-native-intercom';`

___

### `Intercom.setUserHash(userHash) (Optional)`

Sets the user hash necessary for validation when Identity Verification is enabled.
***This should be called before any registration calls.***

### Options

| Type    | Type        | Required |
| ------- | --------    | -------- |
| userHash   | string   |yes        |

### Returns

`Promise<boolean>`

___

### `Intercom.registerUnidentifiedUser()`

Registers an unidentified user with Intercom

### Returns

`Promise<boolean>`

___

### `Intercom.registerIdentifiedUser({email,userId})`

Registers an identified user with Intercom

### Options

One of below fields is required.

| Type    | Type     | Required |
| ------- | -------- | -------- |
| email   | string   |no        |
| userId  | string   |no        |

### Returns

`Promise<boolean>`

___

### `Intercom.updateUser(userAttributes)`

Updates a user in Intercom.

###### You can send any data you like to Intercom. Typically our customers see a lot of value in sending data that

* ###### relates to customer development, such as price plan, value of purchases, etc. Once these have been sent to
* ###### Intercom you can then apply filters based on these attributes.

```javascript
Intercom.updateUser({
  email: 'name@intercom.com',
  userId: 'userId',
  name: 'Name',
  phone: '010-1234-5678',
  languageOverride: 'languageOverride',
  signedUpAt: 1621844451,
  unsubscribedFromEmails: true,
  companies: [{
    createdAt: 1621844451,
    id: 'companyId',
    monthlySpend: 100,
    name: 'CompanyName',
    plan: "plan",
    customAttributes: {
      city: "New York"
    },
  }],
  customAttributes: {
    userCustomAttribute: 123,
    hasUserCustomAttribute: true
  }
});
```

### Options

| Type    | Type        | Required |
| ------- | --------    | -------- |
| userId   | string      |no        |
| email   | string      |no        |
| name   | string      |no        |
| phone   | string      |no        |
| languageOverride   | string      |no        |
| signedUpAt   | number (timestamp)      |no        |
| unsubscribedFromEmails   |boolean      |no        |
| companies   |array      |no        |
| customAttributes   | object `{key: boolean,string, number}`     |no        |

### Returns

`Promise<boolean>`
___

### `Intercom.logout()`

Logout is used to clear all local caches and user data the Intercom SDK has created. Use this at a time when you wish to
log a user out of your app or change a user. Once called, the SDK will no longer communicate with Intercom until a
further registration is made.

### Returns

`Promise<boolean>`
___

### `Intercom.logEvent(eventName, metaData)`

Logs an event with a given name and some metadata.

### Options

| Type    | Type        | Required |
| ------- | --------    | -------- |
| eventName| string  |yes        |
| metaData| object `{key: boolean,string,number}`  |no        |

### Returns

`Promise<boolean>`
___

### `Intercom.sendTokenToIntercom(token)`

This takes a push registration token to send to Intercom to enable this device to receive push.

### Options

| Type    | Type        | Required |
| ------- | --------    | -------- |
| token| string  |yes        |

### Returns

`Promise<boolean>`

___

### `Intercom.addOnMessageCountChangeListener(callback)`

Sets a listener that will be notified when the unread conversation count for the registered user changes.

```javascript
  useEffect(() => {
  /**
   * Handle message count changed
   */
  const event = Intercom.addOnMessageCountChangeListener(({count}) => {
    setCount(count);
  });

  return () => {
    event();
  };
}, []);

```

#### Options

| Type    | Type        | Required |
| ------- | --------    | -------- |
| callback| function `({count: number}) => void`  |yes        |

#### Returns

`removeEventListener: () => void`

___

### `Intercom.getUnreadConversationCount()`

Gets the number of unread conversations for a user.

#### Returns

`Promise<number>`
___

### `Intercom.handlePushMessage()`

Handles the opening of an Intercom push message. This will retrieve the URI from the last Intercom push message.

```javascript
  useEffect(() => {
  /**
   * Handle PushNotification Open
   */
  AppState.addEventListener(
    'change',
    (nextAppState) =>
      nextAppState === 'active' && Intercom.handlePushMessage()
  );

  return () => {
    AppState.removeEventListener('change', () => {
    });
  };
}, []);
```

### Returns

`Promise<boolean>`
___

### `Intercom.displayMessenger()`

Opens the Intercom Messenger automatically to the best place for your users.

### Returns

`Promise<boolean>`
___

### `Intercom.displayMessageComposer(initialMessage)`

Open the conversation screen with the composer pre-populated text.

### Options

| Type    | Type        | Required |
| ------- | --------    | -------- |
| initialMessage| string  |no        |

### Returns

`Promise<boolean>`

___

### `Intercom.displayHelpCenter()`

Open up your apps help center

### Returns

`Promise<boolean>`

___

### `Intercom.displayCarousel(carouselId)`

Displays carousel

### Options

| Type    | Type        | Required |
| ------- | --------    | -------- |
| carouselId| string  |yes        |

### Returns

`Promise<boolean>`

### `Intercom.displayArticle(articleId)`

Opens an article

### Options

| Type    | Type        | Required |
| ------- | --------    | -------- |
| articleId| string  |yes        |

### Returns

`Promise<boolean>`

___

### `Intercom.setInAppMessageVisibility(visibility)`

Toggles visibility of in-app messages.

### Options

| Type    | Type        | Required |
| ------- | --------    | -------- |
| visibility| string  `GONE, VISIBLE` |yes        |

### Returns

`Promise<boolean>`
___

### `Intercom.setLauncherVisibility(visibility)`

Toggles visibility of the launcher view. Set as Intercom.Visibility.GONE to hide the launcher when you don't want it to
be visible.

### Options

| Type    | Type        | Required |
| ------- | --------    | -------- |
| visibility| string  `GONE, VISIBLE` |yes        |

### Returns

`Promise<boolean>`

___

### `Intercom.setBottomPadding(bottomPadding)`

Set the bottom padding of in app messages and the launcher.

Setting the bottom padding will increase how far from the bottom of the screen the default launcher and in app messages
will appear

### Options

| Type    | Type        | Required |
| ------- | --------    | -------- |
| bottomPadding| number |yes        |

### Returns

`Promise<boolean>`

___

### `Intercom.setLogLevel(logLevel)`

Set the level of the native logger

### Options

| Type    | Type        | Required |
| ------- | --------    | -------- |
| logLevel| string(`ASSERT, DEBUG, DISABLED, ERROR, INFO, VERBOSE, WARN`) |yes        |

### Returns

`Promise<boolean>`
___

### `Intercom.addEventListener(event,callback)`

Sets a listener for listed events:

| Event    | Platform        |
| ------- | --------    |
| IntercomUnreadConversationCountDidChangeNotification| IOS, Android  |
| IntercomHelpCenterDidShowNotification| IOS  |
| IntercomHelpCenterDidHideNotification| IOS  |
| IntercomWindowDidShowNotification| IOS  |      |
| IntercomWindowDidHideNotification| IOS  |

#### Options

| Type    | Type        | Required |
| ------- | --------    | -------- |
| event| string (`IntercomEvents`)  |yes        |
| callback| function `({count?: number, visible?: boolean}) => void`  |yes        |

#### Returns

`removeEventListener: () => void`

___

## Usage

[Check example app](./example/src/App.tsx)
___

## Troubleshooting

- #### This project uses AndroidX dependencies, but the 'android.useAndroidX' property is not enabled.
  - To enable `jetifier`, add those two lines to your `gradle.properties` file:
    ```
    android.useAndroidX=true
    android.enableJetifier=true
    ```


- #### When Android app keeps stopping (E/AndroidRuntime: FATAL EXCEPTION: mqt_native_modules)
  - Add those lines to `dependencies` in `./android/app/build.gradle`:
    ```
    implementation 'androidx.appcompat:appcompat:1.1.0'
    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0-alpha03'
    ```

___

## Author

👤 **Intercom <support@intercom.com> (https://www.intercom.com/)**

* Website: (https://www.intercom.com/)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

This project is [Apache--2.0](https://github.com/intercom/intercom-react-native#readme) licensed.

***
Created with ❤️ by [Intercom](https://intercom.com/)
