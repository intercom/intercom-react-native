package com.intercom.reactnative;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

public class IntercomModule extends IntercomModuleSpec {

    // declare an instance of the implementation
    private IntercomModuleImpl implementation;

    IntercomModule(ReactApplicationContext context) {
        super(context);
        // initialize the implementation of the module
        implementation = new IntercomModuleImpl(context);
    }

    @Override
    @NonNull
    public String getName() {
        // NAME is a static variable, so we can access it using the class name.
        return IntercomModuleImpl.NAME;
    }

    @Override
    public void loginUnidentifiedUser(Promise promise) {
        implementation.loginUnidentifiedUser(promise);
    }

    @Override
    public void loginUserWithUserAttributes(ReadableMap userAttributes, Promise promise) {
        implementation.loginUserWithUserAttributes(userAttributes, promise);
    }

    @Override
    public void logout(Promise promise) {
        implementation.logout(promise);
    }

    @Override
    public void updateUser(ReadableMap userAttributes, Promise promise) {
        implementation.updateUser(userAttributes, promise);
    }

    @Override
    public void isUserLoggedIn(Promise promise) {
        implementation.isUserLoggedIn(promise);
    }

    @Override
    public void fetchLoggedInUserAttributes(Promise promise) {
        implementation.fetchLoggedInUserAttributes(promise);
    }

    @Override
    public void setUserHash(String userHash, Promise promise) {
        implementation.setUserHash(userHash, promise);
    }

    @Override
    public void logEvent(String eventName, ReadableMap metaData, Promise promise) {
        implementation.logEvent(eventName, metaData, promise);
    }

    @Override
    public void sendTokenToIntercom(String token, Promise promise) {
        implementation.sendTokenToIntercom(token, promise);
    }

    @Override
    public void presentIntercom(Promise promise) {
        implementation.presentIntercom(promise);
    }

    @Override
    public void presentMessageComposer(String initialMessage, Promise promise) {
        implementation.presentMessageComposer(initialMessage, promise);
    }

    @Override
    public void presentIntercomSpace(String space, Promise promise) {
        implementation.presentIntercomSpace(space, promise);
    }

    @Override
    public void presentContent(ReadableMap content, Promise promise) {
        implementation.presentContent(content, promise);
    }

    @Override
    public void fetchHelpCenterCollections(Promise promise) {
        implementation.fetchHelpCenterCollections(promise);
    }

    @Override
    public void fetchHelpCenterCollection(String collectionId, Promise promise) {
        implementation.fetchHelpCenterCollection(collectionId, promise);
    }

    @Override
    public void searchHelpCenter(String searchTerm, Promise promise) {
        implementation.searchHelpCenter(searchTerm, promise);
    }

    @Override
    public void hideIntercom(Promise promise) {
        implementation.hideIntercom(promise);
    }

    @Override
    public void setBottomPadding(double bottomPadding, Promise promise) {
        implementation.setBottomPadding(bottomPadding, promise);
    }

    @Override
    public void setLauncherVisibility(String visibility, Promise promise) {
        implementation.setLauncherVisibility(visibility, promise);
    }

    @Override
    public void setInAppMessageVisibility(String visibility, Promise promise) {
        implementation.setInAppMessageVisibility(visibility, promise);
    }

    @Override
    public void getUnreadConversationCount(Promise promise) {
        implementation.getUnreadConversationCount(promise);
    }

    @Override
    public void setUserJwt(String jwt, Promise promise) {
        implementation.setUserJwt(jwt, promise);
    }

    @Override
    public void setLogLevel(String level, Promise promise) {
        implementation.setLogLevel(level, promise);
    }

    @Override
    public void setNeedsStatusBarAppearanceUpdate(Promise promise) {
        implementation.setNeedsStatusBarAppearanceUpdate(promise);
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

    // Also add this missing @Override method:
    @Override
    public void handlePushMessage(Promise promise) {
        implementation.handlePushMessage(promise);
    }
}
