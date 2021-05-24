# Welcome to intercom-react-native 👋
[![Version](https://img.shields.io/npm/v/intercom-react-native.svg)](https://www.npmjs.com/package/intercom-react-native)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/intercom/intercom-react-native#readme)
[![License: Apache--2.0](https://img.shields.io/badge/License-Apache--2.0-yellow.svg)](https://github.com/intercom/intercom-react-native#readme)

> React Native wrapper to bridge our iOS and Android SDK

### 🏠 [Homepage](https://github.com/intercom/intercom-react-native#readme)


- [Installation](#installation)
  - [Android](#android)
    - [General](#general)
    - [Automatic](#automatic-react-native-v0.60-and-above)
    - [Manual](#manual-react-native-v0.59-and-below)
    - [Push Notifications](#push-notifications)
  - [iOS](#ios)
- [Common methods](#methods)
- [Usage](#usage)
- [Example App](#methods)
- [Author](#author)
- [License](#license)


## Installation

```sh
npm install intercom-react-native
or
yarn add intercom-react-native
```
### Android
#### General
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
### Permissions
Add those permissions to your `AndroidManifest.xml`
```xml
 <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
 <uses-permission android:name="android.permission.VIBRATE"/>
```

### Automatic React Native v0.60 and above
As react-native@0.60 and above supports autolinking there is no need to run the linking.
### Manual React Native v0.59 and below
 - Add below code to `android/settings.gradle`
```
include ':intercomreactnative'
project(':intercomreactnative').projectDir = new File(rootProject.projectDir, '../../android')
```

- Then edit `android/app/build.gradle`, inside `dependencies` at very bottom add
```
implementation project(':intercomreactnative')
```
###Push Notifications
For Push notification support add `GoogleServices` and `Firebase Cloud Messagng` to your app.

**More information about PN setup [HERE](https://developers.intercom.com/installing-intercom/docs/android-fcm-push-notifications)**
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
      ...
      </activity>

      <service
        android:name=".MainNotificationService">
        <intent-filter>
          <action android:name="com.google.firebase.MESSAGING_EVENT" />
        </intent-filter>
      </service>

      <receiver
        android:name="com.intercomreactnative.RNIntercomPushBroadcastReceiver"
        tools:replace="android:exported"
        android:exported="true" />

  </application>
  </manifest>

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
    <action android:name="android.intent.action.MAIN" />
    <category android:name="android.intent.category.LAUNCHER" />
  </intent-filter>

  <!--  Add this  -->
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />

    <data android:scheme="http" android:host="Your app url(www.app.com)"/> <!-- Edit this line -->
    <data android:scheme="Your app scheme(app)"/> <!-- Edit this line -->
  </intent-filter>
  <!--  Add this  -->

</activity>

```

### IOS
TODO


## Methods
TODO

## Usage

```sh
TODO
```

## Author

👤 **Intercom <support@intercom.com> (https://www.intercom.com/)**

* Website: (https://www.intercom.com/)

## Show your support

Give a ⭐️ if this project helped you!


## 📝 License

This project is [Apache--2.0](https://github.com/intercom/intercom-react-native#readme) licensed.

***
Created with ❤️ by [Intercom](https://intercom.com/)
