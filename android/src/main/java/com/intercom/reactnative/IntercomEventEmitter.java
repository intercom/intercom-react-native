package com.intercom.reactnative;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nullable;

import java.util.Map;
import java.util.HashMap;

import io.intercom.android.sdk.Intercom;
import io.intercom.android.sdk.UnreadConversationCountListener;

public class IntercomEventEmitter extends ReactContextBaseJavaModule {

  private static final String NAME = "IntercomEventEmitter";
  private static final String UNREAD_COUNT_CHANGE_NOTIFICATION = "IntercomUnreadCountDidChange";
  private int activeListenersCount = 0;
  private final UnreadConversationCountListener unreadConversationCountListener = new UnreadConversationCountListener() {
    @Override
    public void onCountUpdate(int conversationCount) {
      updateUnreadCount();
    }
  };

  public IntercomEventEmitter(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @ReactMethod
  public void addListener(String eventName) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  @ReactMethod
  public void removeListeners(Integer count) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  @ReactMethod
  public void startEventListener() {
    try {
      if (activeListenersCount == 0) {
        Intercom.client().addUnreadConversationCountListener(unreadConversationCountListener);
      }
      activeListenersCount += 1;
    } catch (Exception e) {
      Log.e(NAME, "startEventListener error:");
      Log.e(NAME, e.toString());
    }
  }

  @ReactMethod
  public void removeEventListener() {
    try {
      activeListenersCount -= 1;
      if (activeListenersCount == 0) {
        Intercom.client().removeUnreadConversationCountListener(unreadConversationCountListener);
      }
    } catch (Exception e) {
      Log.e(NAME, "removeEventListener error:");
      Log.e(NAME, e.toString());
    }
  }

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put("UNREAD_COUNT_CHANGE_NOTIFICATION", UNREAD_COUNT_CHANGE_NOTIFICATION);
    return constants;
  }

  private void updateUnreadCount() {
    try {
      WritableMap params = Arguments.createMap();
      params.putInt("count", Intercom.client().getUnreadConversationCount());
      Log.d(NAME, "handleUpdateUnreadCount");
      sendEvent(UNREAD_COUNT_CHANGE_NOTIFICATION, params);
    } catch (Exception e) {
      Log.e(NAME, "client called before Intercom initialization");
    }
  }

  private void sendEvent(String eventName, @Nullable WritableMap params) {
    if (getReactApplicationContext().hasActiveCatalystInstance()) {
      try {
        getReactApplicationContext()
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, params);
      } catch (Exception e) {
        Log.e(NAME, "sendEvent called before bundle loaded");
      }
    }
  }


}
