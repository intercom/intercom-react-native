package com.intercom.reactnative;

import android.app.Activity;
import android.app.Application;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.google.firebase.messaging.RemoteMessage;

import org.jetbrains.annotations.NotNull;

import java.util.List;
import java.util.Map;

import io.intercom.android.sdk.Intercom;
import io.intercom.android.sdk.UserAttributes;
import io.intercom.android.sdk.api.ReactNativeHeaderInterceptor;
import io.intercom.android.sdk.helpcenter.api.CollectionContentRequestCallback;
import io.intercom.android.sdk.helpcenter.api.CollectionRequestCallback;
import io.intercom.android.sdk.helpcenter.api.HelpCenterArticleSearchResult;
import io.intercom.android.sdk.helpcenter.api.SearchRequestCallback;
import io.intercom.android.sdk.helpcenter.collections.HelpCenterCollection;
import io.intercom.android.sdk.helpcenter.sections.HelpCenterCollectionContent;
import io.intercom.android.sdk.identity.Registration;
import io.intercom.android.sdk.push.IntercomPushClient;

@ReactModule(name = IntercomModule.NAME)
public class IntercomModule extends ReactContextBaseJavaModule {
  public static final String NAME = "IntercomModule";

  private static final IntercomPushClient intercomPushClient = new IntercomPushClient();

  public IntercomModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  public static boolean isIntercomPush(RemoteMessage remoteMessage) {
    try {
      Map message = remoteMessage.getData();
      return intercomPushClient.isIntercomPush(message);
    } catch (Exception err) {
      Log.e(NAME, "isIntercomPush error:");
      Log.e(NAME, err.toString());
      return false;
    }
  }

  public static void handleRemotePushMessage(@NonNull Application application, RemoteMessage
    remoteMessage) {
    try {
      Map message = remoteMessage.getData();
      intercomPushClient.handlePush(application, message);
    } catch (Exception err) {
      Log.e(NAME, "handleRemotePushMessage error:");
      Log.e(NAME, err.toString());
    }
  }

  public static void sendTokenToIntercom(Application application, @NonNull String token) {
    intercomPushClient.sendTokenToIntercom(application, token);
    Log.d(NAME, "sendTokenToIntercom");
  }

  @ReactMethod
  public void handlePushMessage(Promise promise) {
    try {
      Intercom.client().handlePushMessage();
      promise.resolve(true);
      Log.d(NAME, "handlePushMessage");
    } catch (Exception err) {
      Log.e(NAME, "handlePushMessage error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.HANDLE_PUSH_MESSAGE, err.toString());
    }
  }

  @ReactMethod
  public void sendTokenToIntercom(@NonNull String token, Promise promise) {
    try {
      Activity activity = getCurrentActivity();
      if (activity != null) {
        intercomPushClient.sendTokenToIntercom(activity.getApplication(), token);
        Log.d(NAME, "sendTokenToIntercom");
        promise.resolve(true);
      } else {
        Log.e(NAME, "sendTokenToIntercom");
        Log.e(NAME, "no current activity");
      }

    } catch (
      Exception err) {
      Log.e(NAME, "sendTokenToIntercom error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.SEND_TOKEN_TO_INTERCOM, err.toString());
    }
  }

  @ReactMethod
  public void registerUnidentifiedUser(Promise promise) {
    try {
      Intercom.client().registerUnidentifiedUser();
      Log.d(NAME, "registerUnidentifiedUser");
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "registerUnidentifiedUser error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.UNIDENTIFIED_REGISTRATION, err.toString());
    }
  }

  @ReactMethod
  public void registerIdentifiedUser(ReadableMap params, Promise promise) {
    try {
      Boolean hasEmail = params.hasKey("email") && params.getString("email").length() > 0;
      Boolean hasUserId = params.hasKey("userId") && params.getString("userId").length() > 0;

      if (hasEmail && hasUserId) {
        Intercom.client().registerIdentifiedUser(
          new Registration().withEmail(params.getString("email")).withUserId(params.getString("userId"))
        );
        Log.d(NAME, "registerIdentifiedUser with userEmail and userId");
        promise.resolve(true);
      } else if (hasEmail) {
        Intercom.client().registerIdentifiedUser(
          Registration.create().withEmail(params.getString("email"))
        );
        Log.d(NAME, "registerIdentifiedUser with userEmail");
        promise.resolve(true);
      } else if (hasUserId) {
        Intercom.client().registerIdentifiedUser(
          Registration.create().withUserId(params.getString("userId"))
        );
        Log.d(NAME, "registerIdentifiedUser with userId");
        promise.resolve(true);
      } else {
        Log.e(NAME, "registerIdentifiedUser called with invalid userId or email");
        Log.e(NAME, "You must provide userId or email");
        promise.reject(IntercomErrorCodes.IDENTIFIED_REGISTRATION, "Invalid userId or email");
      }
    } catch (Exception err) {
      Log.e(NAME, "registerIdentifiedUser error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.IDENTIFIED_REGISTRATION, err.toString());
    }
  }

  @ReactMethod
  public void setUserHash(String userHash, Promise promise) {
    try {
      Intercom.client().setUserHash(userHash);
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "setUserHash error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.SET_USER_HASH, err.toString());
    }
  }

  @ReactMethod
  public void updateUser(ReadableMap params, Promise promise) {
    try {
      UserAttributes userAttributes = IntercomHelpers.buildUserAttributes(params);
      Intercom.client().updateUser(userAttributes);
      Log.d(NAME, "updateUser");
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "updateUser error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.UPDATE_USER_HASH, err.toString());
    }
  }

  @ReactMethod
  public void logout(Promise promise) {
    try {
      Intercom.client().logout();
      Log.d(NAME, "logout");
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "logout error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.LOGOUT, err.toString());
    }
  }

  @ReactMethod
  public void getUnreadConversationCount(Promise promise) {
    try {
      promise.resolve(Intercom.client().getUnreadConversationCount());
      Log.d(NAME, "getUnreadConversationCount");
    } catch (Exception err) {
      Log.e(NAME, "getUnreadConversationCount error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.GET_UNREAD_CONVERSATION, err.toString());
    }
  }

  @ReactMethod
  public void setLogLevel(String logLevel, Promise promise) {
    try {
      Intercom.setLogLevel(IntercomHelpers.stringToLogLevel(logLevel));
      Log.d(NAME, "setLogLevel");
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "getUnreadConversationCount error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.SET_LOG_LEVEL, err.toString());
    }
  }

  @ReactMethod
  public void logEvent(String eventName, @Nullable ReadableMap metaData, Promise promise) {
    try {
      if (metaData != null) {
        Intercom.client().logEvent(eventName, IntercomHelpers.deconstructReadableMap(metaData, false));
      } else {
        Intercom.client().logEvent(eventName);
      }
      Log.d(NAME, "logEvent");
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "logEvent error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.LOG_EVENT_HASH, err.toString());
    }
  }

  @ReactMethod
  public void displayMessenger(Promise promise) {
    try {
      Intercom.client().displayMessenger();
      Log.d(NAME, "displayMessenger");
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "displayMessenger error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.DISPLAY_MESSENGER, err.toString());
    }
  }

  @ReactMethod
  public void displayMessageComposer(@Nullable String initialMessage, Promise promise) {
    try {
      if (initialMessage != null) {
        Intercom.client().displayMessageComposer(initialMessage);
      } else {
        Intercom.client().displayMessageComposer();
      }
      Log.d(NAME, "displayMessageComposer");
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "displayMessageComposer error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.DISPLAY_MESSENGER_COMPOSER, err.toString());
    }
  }

  @ReactMethod
  public void displayHelpCenter(Promise promise) {
    try {
      Intercom.client().displayHelpCenter();
      Log.d(NAME, "displayHelpCenter");
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "displayHelpCenter error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.DISPLAY_HELP_CENTER, err.toString());
    }
  }

  @ReactMethod
  public void displayHelpCenterCollections(ReadableArray collectionsId, Promise promise) {
    try {
      List<String> list = IntercomHelpers.readableArrayToStringList(collectionsId);
      Intercom.client().displayHelpCenterCollections(list);
      Log.d(NAME, "displayHelpCenterCollections");
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "displayHelpCenterCollections error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.DISPLAY_HELP_CENTER_COLLECTIONS, err.toString());
    }
  }

  @ReactMethod
  public void fetchHelpCenterCollections(Promise promise) {
    try {

      CollectionRequestCallback collectionRequestCallback = new CollectionRequestCallback() {
        @Override
        public void onComplete(@NotNull List<HelpCenterCollection> list) {
          promise.resolve(IntercomHelpCenterHelpers.parseHelpCenterCollectionsToReadableArray(list));
        }

        @Override
        public void onError(int i) {
          Log.e(NAME, "fetchHelpCenterCollections error");
          promise.reject(String.valueOf(i), "fetchHelpCenterCollections error");
        }

        @Override
        public void onFailure() {
          Log.e(NAME, "fetchHelpCenterCollections failure");
          promise.reject(IntercomErrorCodes.FETCH_HELP_CENTER_COLLECTIONS, "fetchHelpCenterCollections failure");
        }
      };
      Log.d(NAME, "fetchHelpCenterCollections");
      Intercom.client().fetchHelpCenterCollections(collectionRequestCallback);

    } catch (Exception err) {
      Log.e(NAME, "fetchHelpCenterCollections error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.FETCH_HELP_CENTER_COLLECTIONS, err.toString());
    }
  }

  @ReactMethod
  public void fetchHelpCenterCollection(String collectionId, Promise promise) {
    try {
      if (collectionId.equals("") ) {
        promise.reject(IntercomErrorCodes.FETCH_HELP_CENTER_COLLECTION, "collectionID can\'t be empty");
      } else {
        CollectionContentRequestCallback collectionContentCallback = new CollectionContentRequestCallback() {
          @Override
          public void onComplete(@NotNull HelpCenterCollectionContent helpCenterCollectionContent) {
            promise.resolve(IntercomHelpCenterHelpers.parseHelpCenterCollectionsContentToReadableMap(helpCenterCollectionContent));
          }

          @Override
          public void onError(int i) {
            Log.e(NAME, "fetchHelpCenterCollection error");
            promise.reject(String.valueOf(i), "fetchHelpCenterCollection error");
          }

          @Override
          public void onFailure() {
            Log.e(NAME, "fetchHelpCenterCollection failure");
            promise.reject(IntercomErrorCodes.FETCH_HELP_CENTER_COLLECTION, "fetchHelpCenterCollection failure");
          }
        };
        Log.d(NAME, "fetchHelpCenterCollection");
        Intercom.client().fetchHelpCenterCollection(collectionId, collectionContentCallback);
      }

    } catch (Exception err) {
      Log.e(NAME, "fetchHelpCenterCollection error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.FETCH_HELP_CENTER_COLLECTION, err.toString());
    }
  }

  @ReactMethod
  public void searchHelpCenter(String searchTerm, Promise promise) {
    try {

      SearchRequestCallback collectionContentCallback = new SearchRequestCallback() {
        @Override
        public void onComplete(@NotNull List<HelpCenterArticleSearchResult> helpCenterArticleSearchResult) {
          promise.resolve(IntercomHelpCenterHelpers.parseHelpCenterArticleSearchToReadableArray(helpCenterArticleSearchResult));
        }

        @Override
        public void onError(int i) {
          Log.e(NAME, "searchHelpCenter error");
          promise.reject(String.valueOf(i), "searchHelpCenter error");
        }

        @Override
        public void onFailure() {
          Log.e(NAME, "searchHelpCenter failure");
          promise.reject(IntercomErrorCodes.SEARCH_HELP_CENTER, "searchHelpCenter failure");
        }
      };
      Log.d(NAME, "searchHelpCenter");
      Intercom.client().searchHelpCenter(searchTerm, collectionContentCallback);

    } catch (Exception err) {
      Log.e(NAME, "searchHelpCenter error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.SEARCH_HELP_CENTER, err.toString());
    }
  }


  @ReactMethod
  public void displayCarousel(String carouselId, Promise promise) {
    try {
      Intercom.client().displayCarousel(carouselId);
      Log.d(NAME, "displayCarousel");
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "displayCarousel error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.DISPLAY_CAROUSEL, err.toString());
    }
  }

  @ReactMethod
  public void displayArticle(String articleId, Promise promise) {
    try {
      Intercom.client().displayArticle(articleId);
      Log.d(NAME, "displayArticle");
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "displayArticle error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.DISPLAY_ARTICLE, err.toString());
    }
  }

  @ReactMethod
  public void setInAppMessageVisibility(String visibility, Promise promise) {
    try {
      Intercom.client().setInAppMessageVisibility(IntercomHelpers.stringToVisibility(visibility));
      Log.d(NAME, "setInAppMessageVisibility");
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "setInAppMessageVisibility error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.SET_IN_APP_MESSAGE_VISIBILITY, err.toString());
    }
  }

  @ReactMethod
  public void hideIntercom(Promise promise) {
    try {
      Intercom.client().hideIntercom();
      Log.d(NAME, "hideIntercom");
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "hideIntercom error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.HIDE_INTERCOM, err.toString());
    }
  }

  @ReactMethod
  public void setLauncherVisibility(String visibility, Promise promise) {
    try {
      Intercom.client().setLauncherVisibility(IntercomHelpers.stringToVisibility(visibility));
      Log.d(NAME, "setInAppMessageVisibility");
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "setInAppMessageVisibility error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.SET_LAUNCHER_VISIBILITY, err.toString());
    }
  }

  @ReactMethod
  public void setBottomPadding(int paddingBottom, Promise promise) {
    try {
      Intercom.client().setBottomPadding(paddingBottom);
      Log.d(NAME, "setBottomPadding");
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "setBottomPadding error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.SET_BOTTOM_PADDING, err.toString());
    }
  }

  public static synchronized void initialize(Application application, String apiKey, String appId) {
    String sdkVersion = BuildConfig.VERSION_NAME;
    ReactNativeHeaderInterceptor.setReactNativeVersion(application.getApplicationContext(), sdkVersion);
    Intercom.initialize(application, apiKey, appId);
  }

}
