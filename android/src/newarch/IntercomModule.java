package com.intercom.reactnative;

import android.app.Activity;
import android.app.Application;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.ProcessLifecycleOwner;

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
import io.intercom.android.sdk.IntercomContent;
import io.intercom.android.sdk.IntercomError;
import io.intercom.android.sdk.IntercomSpace;
import io.intercom.android.sdk.IntercomStatusCallback;
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
import io.intercom.android.sdk.ui.theme.ThemeMode;
import android.app.TaskStackBuilder;

@ReactModule(name = IntercomModule.NAME)
public class IntercomModule extends NativeIntercomSpecSpec {
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

  public static void handleRemotePushWithCustomStack(@NonNull Application application, RemoteMessage remoteMessage,
      TaskStackBuilder customStack) {
    try {
      if (remoteMessage == null) {
        Log.w(NAME, "handleRemotePushWithCustomStack: remoteMessage is null");
        return;
      }
      Map<String, String> message = remoteMessage.getData();
      if (message == null) {
        Log.w(NAME, "handleRemotePushWithCustomStack: message is null");
        return;
      }
      intercomPushClient.handlePushWithCustomStack(application, message, customStack);
    } catch (Exception err) {
      Log.e(NAME, "handlePushWithCustomStack error:");
      Log.e(NAME, err.toString());
    }
  }

  public static void handleRemotePushMessage(@NonNull Application application, RemoteMessage remoteMessage) {
    try {
      TaskStackBuilder customStack = TaskStackBuilder.create(application);

      if (!isAppInForeground(application)) {
        Intent launchIntent = application.getPackageManager().getLaunchIntentForPackage(application.getPackageName());
        if (launchIntent != null) {
          customStack.addNextIntent(launchIntent);
        }
      }

      handleRemotePushWithCustomStack(application, remoteMessage, customStack);
    } catch (Exception err) {
      Log.e(NAME, "handleRemotePushMessage error:");
      Log.e(NAME, err.toString());
    }
  }

  private static boolean isAppInForeground(@NonNull Application application) {
    try {
      return ProcessLifecycleOwner.get()
          .getLifecycle()
          .getCurrentState()
          .isAtLeast(Lifecycle.State.STARTED);
    } catch (Exception err) {
      Log.e(NAME, "isAppInForeground error:");
      Log.e(NAME, err.toString());
      return false;
    }
  }

  public static void sendTokenToIntercom(Application application, @NonNull String token) {
    if (application == null || token == null || token.isEmpty()) {
      Log.w(NAME, "sendTokenToIntercom: application or token is null or empty");
      return;
    }
    try {
      intercomPushClient.sendTokenToIntercom(application, token);
      Log.d(NAME, "sendTokenToIntercom");
    } catch (Exception err) {
      Log.e(NAME, "sendTokenToIntercom error:");
      Log.e(NAME, err.toString());
    }
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
      if (token == null || token.isEmpty()) {
        Log.w(NAME, "sendTokenToIntercom: token is null or empty");
        promise.reject(IntercomErrorCodes.SEND_TOKEN_TO_INTERCOM, "token is null or empty");
        return;
      }
      Activity activity = getCurrentActivity();
      if (activity != null && activity.getApplication() != null) {
        intercomPushClient.sendTokenToIntercom(activity.getApplication(), token);
        Log.d(NAME, "sendTokenToIntercom");
        promise.resolve(true);
      } else {
        Log.e(NAME, "sendTokenToIntercom");
        Log.e(NAME, "no current activity");
        promise.reject(IntercomErrorCodes.SEND_TOKEN_TO_INTERCOM, "no current activity");
      }

    } catch (Exception err) {
      Log.e(NAME, "sendTokenToIntercom error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.SEND_TOKEN_TO_INTERCOM, err.toString());
    }
  }

  @ReactMethod
  public void loginUnidentifiedUser(Promise promise) {
    Intercom.client().loginUnidentifiedUser(new IntercomStatusCallback() {
      @Override
      public void onSuccess() {
        promise.resolve(true);
      }

      @Override
      public void onFailure(@NonNull IntercomError intercomError) {
        Log.e("ERROR", intercomError.getErrorMessage());
        promise.reject(String.valueOf(intercomError.getErrorCode()), intercomError.getErrorMessage());
      }
    });
  }

  @ReactMethod
  public void loginUserWithUserAttributes(ReadableMap params, Promise promise) {
    Boolean hasEmail = params.hasKey("email") && IntercomHelpers.getValueAsStringForKey(params, "email").length() > 0;
    Boolean hasUserId = params.hasKey("userId")
        && IntercomHelpers.getValueAsStringForKey(params, "userId").length() > 0;
    Registration registration = null;
    if (hasEmail && hasUserId) {
      String email = IntercomHelpers.getValueAsStringForKey(params, "email");
      String userId = IntercomHelpers.getValueAsStringForKey(params, "userId");
      registration = new Registration().withEmail(email).withUserId(userId);
    } else if (hasEmail) {
      String email = IntercomHelpers.getValueAsStringForKey(params, "email");
      registration = new Registration().withEmail(email);
    } else if (hasUserId) {
      String userId = IntercomHelpers.getValueAsStringForKey(params, "userId");
      registration = new Registration().withUserId(userId);
    } else {
      Log.e(NAME, "loginUserWithUserAttributes called with invalid userId or email");
      Log.e(NAME, "You must provide userId or email");
      promise.reject(IntercomErrorCodes.IDENTIFIED_REGISTRATION, "Invalid userId or email");
    }
    if (registration != null) {
      Intercom.client().loginIdentifiedUser(registration, new IntercomStatusCallback() {
        @Override
        public void onSuccess() {
          promise.resolve(true);
        }

        @Override
        public void onFailure(@NonNull IntercomError intercomError) {
          Log.e("ERROR", intercomError.getErrorMessage());
          promise.reject(String.valueOf(intercomError.getErrorCode()), intercomError.getErrorMessage());
        }
      });
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
    UserAttributes userAttributes = IntercomHelpers.buildUserAttributes(params);
    Intercom.client().updateUser(userAttributes, new IntercomStatusCallback() {
      @Override
      public void onSuccess() {
        promise.resolve(true);
      }

      @Override
      public void onFailure(@NonNull IntercomError intercomError) {
        Log.e("ERROR", intercomError.getErrorMessage());
        promise.reject(String.valueOf(intercomError.getErrorCode()), intercomError.getErrorMessage());
      }
    });
  }

  @ReactMethod
  public void isUserLoggedIn(Promise promise) {
    promise.resolve(Intercom.client().isUserLoggedIn());
  }

  @ReactMethod
  public void fetchLoggedInUserAttributes(Promise promise) {
    Registration registration = Intercom.client().fetchLoggedInUserAttributes();
    promise.resolve(IntercomHelpers.deconstructRegistration(registration));
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
      Log.e(NAME, "setLogLevel error:");
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
  public void presentIntercom(Promise promise) {
    try {
      Intercom.client().present();
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "presentMessenger error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.DISPLAY_MESSENGER, err.toString());
    }
  }

  @ReactMethod
  public void presentIntercomSpace(String space, Promise promise) {
    try {
      IntercomSpace selectedSpace = IntercomSpace.Home;
      switch (space) {
        case "TICKETS":
          selectedSpace = IntercomSpace.Tickets;
          break;
        case "MESSAGES":
          selectedSpace = IntercomSpace.Messages;
          break;
        case "HELP_CENTER":
          selectedSpace = IntercomSpace.HelpCenter;
          break;
        default:
          selectedSpace = IntercomSpace.Home;
      }
      Intercom.client().present(selectedSpace);
      promise.resolve(true);
    } catch (Exception error) {
      Log.e(NAME, "presentIntercomSpace error:");
      Log.e(NAME, error.toString());
      promise.reject(IntercomErrorCodes.DISPLAY_MESSENGER, error.toString());
    }
  }

  @ReactMethod
  public void presentMessageComposer(@Nullable String initialMessage, Promise promise) {
    try {
      if (initialMessage != null) {
        Intercom.client().displayMessageComposer(initialMessage);
      } else {
        Intercom.client().displayMessageComposer();
      }
      Log.d(NAME, "presentMessageComposer");
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "presentMessageComposer error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.DISPLAY_MESSENGER_COMPOSER, err.toString());
    }
  }

  @ReactMethod
  public void presentContent(ReadableMap params, Promise promise) {
    try {
      Boolean hasContentType = params.hasKey("type") && params.getString("type").length() > 0;
      if (hasContentType) {
        IntercomContent content = null;
        String contentType = params.getString("type");

        switch (contentType) {
          case "ARTICLE":
            content = new IntercomContent.Article(params.getString("id"));
            break;
          case "CAROUSEL":
            content = new IntercomContent.Carousel(params.getString("id"));
            break;
          case "SURVEY":
            content = new IntercomContent.Survey(params.getString("id"));
            break;
          case "HELP_CENTER_COLLECTIONS":
            List<String> collectionIds = IntercomHelpers.readableArrayToStringList(params.getArray("ids"));
            content = new IntercomContent.HelpCenterCollections(collectionIds);
            break;
          case "CONVERSATION":
            content = new IntercomContent.Conversation(params.getString("id"));
            break;
        }
        if (content != null) {
          Intercom.client().presentContent(content);
          promise.resolve(true);
        } else {
          promise.reject(IntercomErrorCodes.DISPLAY_CONTENT, "Invalid content type");
        }
      } else {
        promise.reject(IntercomErrorCodes.DISPLAY_CONTENT, "Intercom content must have a type");
      }
    } catch (Exception error) {
      Log.e(NAME, error.toString());
      promise.reject(IntercomErrorCodes.DISPLAY_CONTENT, error.toString());
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
      if (collectionId.equals("")) {
        promise.reject(IntercomErrorCodes.FETCH_HELP_CENTER_COLLECTION, "collectionID can\'t be empty");
      } else {
        CollectionContentRequestCallback collectionContentCallback = new CollectionContentRequestCallback() {
          @Override
          public void onComplete(@NotNull HelpCenterCollectionContent helpCenterCollectionContent) {
            promise.resolve(
                IntercomHelpCenterHelpers.parseHelpCenterCollectionsContentToReadableMap(helpCenterCollectionContent));
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
    if (searchTerm.equals("")) {
      promise.reject(IntercomErrorCodes.SEARCH_HELP_CENTER, "searchTerm can\'t be empty");
    } else {
      try {
        SearchRequestCallback collectionContentCallback = new SearchRequestCallback() {
          @Override
          public void onComplete(@NotNull List<HelpCenterArticleSearchResult> helpCenterArticleSearchResult) {
            promise.resolve(
                IntercomHelpCenterHelpers.parseHelpCenterArticleSearchToReadableArray(helpCenterArticleSearchResult));
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
  public void setBottomPadding(double paddingBottom, Promise promise) {
    try {
      Intercom.client().setBottomPadding((int) paddingBottom);
      Log.d(NAME, "setBottomPadding");
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "setBottomPadding error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.SET_BOTTOM_PADDING, err.toString());
    }
  }

  @ReactMethod
  public void setThemeMode(String themeMode, Promise promise) {
    try {
      ThemeMode themeModeEnum = null;

      if (themeMode == null || themeMode.trim().isEmpty()) {
        promise.reject(IntercomErrorCodes.SET_THEME_MODE,
            "Theme mode cannot be null or empty. Use 'LIGHT', 'DARK', or 'SYSTEM'.");
        return;
      }

      switch (themeMode) {
        case "SYSTEM":
          themeModeEnum = ThemeMode.SYSTEM;
          break;
        case "LIGHT":
          themeModeEnum = ThemeMode.LIGHT;
          break;
        case "DARK":
          themeModeEnum = ThemeMode.DARK;
          break;
        default:
          promise.reject(IntercomErrorCodes.SET_THEME_MODE,
              "Invalid theme mode: '" + themeMode + "'. Use 'LIGHT', 'DARK', or 'SYSTEM'.");
          return;
      }

      Intercom.client().setThemeMode(themeModeEnum);
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "setThemeMode error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.SET_THEME_MODE, "Error in setThemeMode: " + err.toString());
    }
  }

  @ReactMethod
  public void setUserJwt(String jwt, Promise promise) {
    try {
      Intercom.client().setUserJwt(jwt);
      Log.d(NAME, "Setting JWT");
      promise.resolve(true);
    } catch (Exception err) {
      Log.e(NAME, "Error Setting JWT:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.SET_USER_JWT, err.toString());
    }
  }

  @ReactMethod
  public void setAuthTokens(ReadableMap authTokens, Promise promise) {
    try {
      List<io.intercom.android.sdk.AuthToken> authTokensList = IntercomHelpers.buildAuthTokensList(authTokens);
      Intercom.client().setAuthTokens(authTokensList, new IntercomStatusCallback() {
        @Override
        public void onSuccess() {
          promise.resolve(true);
        }

        @Override
        public void onFailure(@NonNull IntercomError intercomError) {
          Log.e("ERROR", intercomError.getErrorMessage());
          promise.reject(String.valueOf(intercomError.getErrorCode()), intercomError.getErrorMessage());
        }
      });
    } catch (Exception err) {
      Log.e(NAME, "setAuthTokens error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.SET_AUTH_TOKENS, err.toString());
    }
  }

  @ReactMethod
  public void initialize(String apiKey, String appId, Promise promise) {
    try {
      Activity activity = getCurrentActivity();
      if (activity != null && activity.getApplication() != null) {
        IntercomModule.initialize(activity.getApplication(), apiKey, appId);
        promise.resolve(true);
      } else {
        promise.reject(IntercomErrorCodes.INITIALIZE_ERROR, "Activity is null");
      }
    } catch (Exception err) {
      Log.e(NAME, "initialize error:");
      Log.e(NAME, err.toString());
      promise.reject(IntercomErrorCodes.INITIALIZE_ERROR, err.toString());
    }
  }

  @ReactMethod
  public void setNeedsStatusBarAppearanceUpdate(Promise promise) {
    // iOS-only method, no-op on Android
    promise.resolve(true);
  }

  public static synchronized void initialize(Application application, String apiKey, String appId) {
    String sdkVersion = BuildConfig.INTERCOM_VERSION_NAME;
    ReactNativeHeaderInterceptor.setReactNativeVersion(application.getApplicationContext(), sdkVersion);
    Intercom.initialize(application, apiKey, appId);
  }

}
