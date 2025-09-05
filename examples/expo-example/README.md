# Welcome to @intercom/intercom-react-native Expo Example App 👋

This is an [Expo](https://expo.dev) project demonstrating the integration of @intercom/intercom-react-native with React Native's New Architecture (TurboModules/Fabric).

## Prerequisites

1. Install [Expo CLI](https://docs.expo.dev/get-started/installation/#installing-expo-cli):

   ```bash
   npm install -g @expo/cli
   ```

2. Set up your React Native development environment as described in:
   - [Android environment setup](https://reactnative.dev/docs/environment-setup?package-manager=yarn&guide=native&platform=android)
   - [iOS environment setup](https://reactnative.dev/docs/environment-setup?package-manager=yarn&guide=native&platform=ios)

## Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

## Configuration

1. Update `app.json` with your Intercom credentials:

   ```json
   {
     "plugins": [
       [
         "@intercom/intercom-react-native",
         {
           "appId": "YOUR_APP_ID",
           "androidApiKey": "android_sdk-YOUR_ANDROID_API_KEY",
           "iosApiKey": "ios_sdk-YOUR_IOS_API_KEY"
         }
       ]
     ]
   }
   ```

2. Update the bundle identifier and package name:

   - iOS: Change `ios.bundleIdentifier` in `app.json`
   - Android: Change `android.package` in `app.json`

3. (Optional) For push notifications:
   - iOS: Update `ios.entitlements.aps-environment` to `development` or `production`
   - Android: Uncomment and configure `android.googleServicesFile` if using Google Services

## Running the App

### Development Build (Recommended)

1. Create a development build:

   ```bash
   # For iOS
   npx expo run:ios

   # For Android
   npx expo run:android
   ```

2. Start the development server:
   ```bash
   pnpm start
   ```

### Expo Go (Limited functionality)

Note: Push notifications and some native features may not work in Expo Go.

```bash
pnpm start
```

Then scan the QR code with Expo Go app on your device.

## Features Demonstrated

This example app demonstrates all major Intercom features:

- **User Management**: Login, logout, update user attributes
- **Messaging**: Open messenger, conversations, help center
- **Content Display**: Articles, carousels, surveys
- **Push Notifications**: Setup and handling
- **Architecture Detection**: Shows whether New Architecture is enabled
- **Modern UI**: Built with NativeWind/TailwindCSS

## Architecture Support

This example supports both:

- **New Architecture** (TurboModules/Fabric) - React Native 0.79+
- **Legacy Architecture** (Bridge) - React Native 0.68+

The app automatically detects and displays which architecture is active.

## Troubleshooting

1. **Build errors**: Try clearing cache and rebuilding:

   ```bash
   npx expo run:ios --clear
   npx expo run:android --clear
   ```

2. **Pod install issues** (iOS):

   ```bash
   cd ios && pod install --repo-update
   ```

3. **Metro bundler issues**:

   ```bash
   npx expo start --clear
   ```

4. **IntercomEventEmitter null errors**: Ensure you're using a development build, not Expo Go, as native modules require compilation.

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [Intercom React Native SDK](https://github.com/intercom/intercom-react-native)
- [React Native New Architecture](https://reactnative.dev/docs/new-architecture-intro)
