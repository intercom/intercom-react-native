# Welcome to @intercom/intercom-react-native example app 👋

## Installation

To get started with the @intercom/intercom-react-native example app, please follow the instructions below:

1. Install XCode before you setup the app.
>Please note that there is a known bug that prevents the iOS app from building on the latest Xcode. Therefore, it's recommended to use Xcode 14.2.


2. Setup the app using:
```sh
./script/setup
```
This command will install all the dependencies required to run the example app.

3. Generate a new .env file by running the following command in your terminal:
```sh
sh scripts/generateEnv.sh
```
This command will create a .env file <b>inside the example directory</b>.
Fill in the required App ID in the .env file. Other variables are optional.



## Running the app

To run the app on Android, execute the following command:

```sh
yarn example android --variant=fossDebug
```

To run the app on Android, execute the following command:

```sh
yarn example ios
```

## Troubleshooting

1. If you are facing issues related to pods, you can install them separately using:
```sh
pod install
```

2. For issues related to android, try opening and running the example app from the android studio.

3. For general iOS build errors, opening and running the example app from XCode also helps.