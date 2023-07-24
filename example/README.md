# Welcome to @intercom/intercom-react-native example app 👋

## Installation

To get started with the @intercom/intercom-react-native example app, please follow the instructions below:

1. Generate a new .env file by running the following command in your terminal:
```sh
sh scripts/generateEnv.sh
```

This command will create a .env file inside the example directory.

1. Fill in the required Android and iOS API keys and workspace IDs in the .env file. Other variables are optional.

2. Install the dependencies by running the following command in the project directory:

```sh
yarn
```

### Android

To run the app on Android, execute the following command:


```sh
yarn example android --variant=fossDebug
```

### iOS
For iOS, you need to install the necessary pods. Go to the example/ios directory in your terminal and run:

```sh
pod install
```

Once the pods are installed, go back to the project's root directory and execute the following command to run the app on iOS:

```sh
yarn example ios
```

### Notes:
Please note that there is a known bug that prevents the iOS app from building on the latest Xcode. Therefore, it's recommended to use Xcode 14.2.
