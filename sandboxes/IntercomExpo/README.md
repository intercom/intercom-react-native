# Intercom React Native Expo Sandbox

# Setup

## Step 1: Install dependencies

```shell
# using npm
npm install

# OR using Yarn
yarn install
```

## Step 2: Add your app id and api keys

Go to `app.json` and replace the `appId`, `androidApiKey` and `iosApiKey` under `plugins`.
You can also change the intercomRegion to US, EU or AU.
Check our docs for a detailed explanation about these fields [here](https://developers.intercom.com/installing-intercom/react-native/installation/#using-intercom-with-expo)

```shell
"plugins": [
      [
        "@intercom/intercom-react-native",
        {
          "appId": "<app-id>",
          "androidApiKey": "<android-api-key>",
          "iosApiKey": "<ios-api-key>",
          "intercomRegion": "US"
        }
      ]
    ],
```

## Step 3: Prebuild the app

```shell
# using npx
npx expo prebuild

# OR using Yarn
yarn expo prebuild
```

## Step 4: Run pod install

Go to the `ios` folder and run pod install

```shell
npx pod install
```

## Step 5: Run the app

### For Android

```shell
# using npm
npx expo run:android

# OR using Yarn
yarn expo run:android
```

### For iOS

```shell
# using npm
npx expo run:ios

# OR using Yarn
yarn expo run:ios
```
