package com.intercom.reactnative;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class IntercomModule extends ReactContextBaseJavaModule {

    // declare an instance of the implementation
    private IntercomModuleImpl implementation;

    IntercomModule(ReactApplicationContext context) {
        super(context);
        // initialize the implementation of the module
        implementation = new IntercomModuleImpl(context);
    }

    // Static methods for compatibility with existing usage
    public static void initialize(android.app.Application application, String apiKey, String appId) {
        IntercomModuleImpl.initialize(application, apiKey, appId);
    }

    public static boolean isIntercomPush(com.google.firebase.messaging.RemoteMessage remoteMessage) {
        return IntercomModuleImpl.isIntercomPush(remoteMessage);
    }

    public static void handleRemotePushMessage(android.app.Application application, com.google.firebase.messaging.RemoteMessage remoteMessage) {
        IntercomModuleImpl.handleRemotePushMessage(application, remoteMessage);
    }

    public static void sendTokenToIntercom(android.app.Application application, String token) {
        IntercomModuleImpl.sendTokenToIntercom(application, token);
    }

    @Override
    @NonNull
    public String getName() {
        // NAME is a static variable, so we can access it using the class name.
        return IntercomModuleImpl.NAME;
    }

    @ReactMethod
    public void loginUnidentifiedUser(Promise promise) {
        implementation.loginUnidentifiedUser(promise);
    }

    @ReactMethod
    public void loginUserWithUserAttributes(ReadableMap userAttributes, Promise promise) {
        implementation.loginUserWithUserAttributes(userAttributes, promise);
    }

    @ReactMethod
    public void logout(Promise promise) {
        implementation.logout(promise);
    }

    @ReactMethod
    public void updateUser(ReadableMap userAttributes, Promise promise) {
        implementation.updateUser(userAttributes, promise);
    }

    @ReactMethod
    public void isUserLoggedIn(Promise promise) {
        implementation.isUserLoggedIn(promise);
    }

    @ReactMethod
    public void fetchLoggedInUserAttributes(Promise promise) {
        implementation.fetchLoggedInUserAttributes(promise);
    }

    @ReactMethod
    public void setUserHash(String userHash, Promise promise) {
        implementation.setUserHash(userHash, promise);
    }

    @ReactMethod
    public void logEvent(String eventName, ReadableMap metaData, Promise promise) {
        implementation.logEvent(eventName, metaData, promise);
    }

    @ReactMethod
    public void sendTokenToIntercom(String token, Promise promise) {
        implementation.sendTokenToIntercom(token, promise);
    }

    @ReactMethod
    public void presentIntercom(Promise promise) {
        implementation.presentIntercom(promise);
    }

    @ReactMethod
    public void presentMessageComposer(String initialMessage, Promise promise) {
        implementation.presentMessageComposer(initialMessage, promise);
    }

    @ReactMethod
    public void presentIntercomSpace(String space, Promise promise) {
        implementation.presentIntercomSpace(space, promise);
    }

    @ReactMethod
    public void presentContent(ReadableMap content, Promise promise) {
        implementation.presentContent(content, promise);
    }

    @ReactMethod
    public void fetchHelpCenterCollections(Promise promise) {
        implementation.fetchHelpCenterCollections(promise);
    }

    @ReactMethod
    public void fetchHelpCenterCollection(String collectionId, Promise promise) {
        implementation.fetchHelpCenterCollection(collectionId, promise);
    }

    @ReactMethod
    public void searchHelpCenter(String searchTerm, Promise promise) {
        implementation.searchHelpCenter(searchTerm, promise);
    }

    @ReactMethod
    public void hideIntercom(Promise promise) {
        implementation.hideIntercom(promise);
    }

    @ReactMethod
    public void setBottomPadding(double bottomPadding, Promise promise) {
        implementation.setBottomPadding(bottomPadding, promise);
    }

    @ReactMethod
    public void setLauncherVisibility(String visibility, Promise promise) {
        implementation.setLauncherVisibility(visibility, promise);
    }

    @ReactMethod
    public void setInAppMessageVisibility(String visibility, Promise promise) {
        implementation.setInAppMessageVisibility(visibility, promise);
    }

    @ReactMethod
    public void getUnreadConversationCount(Promise promise) {
        implementation.getUnreadConversationCount(promise);
    }

    @ReactMethod
    public void setUserJwt(String jwt, Promise promise) {
        implementation.setUserJwt(jwt, promise);
    }

    @ReactMethod
    public void setLogLevel(String level, Promise promise) {
        implementation.setLogLevel(level, promise);
    }

    @ReactMethod
    public void setNeedsStatusBarAppearanceUpdate(Promise promise) {
        implementation.setNeedsStatusBarAppearanceUpdate(promise);
    }

    @ReactMethod
    public void handlePushMessage(Promise promise) {
        implementation.handlePushMessage(promise);
    }
}
