# Welcome to intercom-react-native 👋

[![Version](https://img.shields.io/npm/v/intercom-react-native.svg)](https://www.npmjs.com/package/intercom-react-native)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/intercom/intercom-react-native#readme)
[![License: Apache--2.0](https://img.shields.io/badge/License-Apache--2.0-yellow.svg)](https://github.com/intercom/intercom-react-native#readme)

> React Native wrapper to bridge our iOS and Android SDK

### 🏠 [Homepage](https://github.com/intercom/intercom-react-native#readme)

- [Installation](#installation)
  - [Android](#android)
    - [General](#general)
      - [Permissions](#permissions)
    - [Automatic](#automatic-react-native-v060-and-above)
    - [Manual](#manual-react-native-v059-and-below)
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

### Push Notifications

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

TODO

## Methods

## Import

### `import Intercom from 'react-native-intercom';`

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

### `Intercom.setUserHash(userHash)`

Sets the user hash necessary for validation when Identity Verification is enabled.

### Options

| Type    | Type        | Required |
| ------- | --------    | -------- |
| userHash   | string   |yes        |

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

## Usage

```jsx
export default function App() {
  const [count, setCount] = useState < number > (0);
  const [loggedUser, setLoggedUser] = useState < boolean > (false);
  const [bottomPadding, setBottomPadding] = useState < number > (0);
  const [inAppMessageVisibility, setInAppMessageVisibility] =
  useState < boolean > (true);

  useEffect(() => {
    /**
     * Handle PushNotification
     */
    AppState.addEventListener(
      'change',
      (nextAppState) =>
        nextAppState === 'active' && Intercom.handlePushMessage()
    );

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

    /**
     * Handle message count changed
     */
    const event = Intercom.addOnMessageCountChangeListener(({count}) => {
      setCount(count);
    });

    return () => {
      Linking.removeEventListener('url', () => {
      });
      AppState.removeEventListener('change', () => {
      });
      event();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          In App Message Visibility:{' '}
          <Text style={styles.boldText}>
            {inAppMessageVisibility ? Visibility.GONE : Visibility.VISIBLE}
          </Text>
        </Text>
        <Text style={styles.text}>
          Bottom padding: <Text style={styles.boldText}>{bottomPadding}</Text>
        </Text>
        <Text style={styles.text}>
          Unread messages count: <Text style={styles.boldText}>{count}</Text>
        </Text>
      </View>
      <ScrollView>
        <Button
          disabled={loggedUser}
          title={'Login User'}
          onPress={() => {
            Intercom.registerUnidentifiedUser().then(() => setLoggedUser(true));
          }}
        />
        <Button
          disabled={!loggedUser}
          title={'Display Messenger'}
          onPress={() => {
            Intercom.displayMessenger();
          }}
        />
        <Button
          disabled={!loggedUser}
          title={'Display Message Composer'}
          onPress={() => {
            Intercom.displayMessageComposer();
          }}
        />
        <Button
          disabled={!loggedUser}
          title={'Display Help Center'}
          onPress={() => {
            Intercom.displayHelpCenter();
          }}
        />
        <Button
          disabled={!loggedUser}
          title={'Display Carousel'}
          onPress={() => {
            Intercom.displayCarousel(CAROUSEL_ID);
          }}
        />
        <Button
          disabled={!loggedUser}
          title={'Get Unread Conversation Count'}
          onPress={() => {
            Intercom.getUnreadConversationCount().then((count) =>
              Alert.alert('Unread Conversation count is', count.toString())
            );
          }}
        />
        <Button
          title={'Toggle In App Message Visibility'}
          onPress={() => {
            Intercom.setInAppMessageVisibility(
              inAppMessageVisibility ? Visibility.GONE : Visibility.VISIBLE
            ).then(() => setInAppMessageVisibility((v) => !v));
          }}
        />
        <Button
          title={'Set Bottom Padding'}
          onPress={() => {
            const paddingToSet =
              bottomPadding + 10 > 300 ? 0 : bottomPadding + 10;
            Intercom.setBottomPadding(paddingToSet).then(() =>
              setBottomPadding(paddingToSet)
            );
          }}
        />
        <Button
          disabled={!loggedUser}
          title={'Log Event'}
          onPress={() => {
            Intercom.logEvent(EVENT_NAME);
          }}
        />
        <Button
          disabled={!loggedUser}
          title={'Logout user'}
          onPress={() => {
            Intercom.logout().then(() => setLoggedUser(false));
          }}
        />
      </ScrollView>
    </View>
  );
}

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
