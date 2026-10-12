package com.intercom.reactnative;

import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import io.intercom.android.sdk.Intercom;
import io.intercom.android.sdk.IntercomUserJwtCallback;

class IntercomUserJwtProviderBridge {
  private static final String TAG = "IntercomUserJwtProvider";
  private static final Map<String, IntercomUserJwtCallback> pendingRequests = new ConcurrentHashMap<>();
  private static final AtomicLong nextRequestId = new AtomicLong();

  static void setProvider(ReactApplicationContext reactContext) {
    Intercom.client().setUserJwtProvider(callback -> {
      String requestId = String.valueOf(nextRequestId.incrementAndGet());
      pendingRequests.put(requestId, callback);
      if (!emitRequest(reactContext, requestId)) {
        complete(requestId, null);
      }
    });
  }

  static void removeProvider() {
    Intercom.client().removeUserJwtProvider();
    failPendingRequests();
  }

  static void complete(String requestId, @Nullable String jwt) {
    IntercomUserJwtCallback callback = pendingRequests.remove(requestId);
    if (callback == null) {
      return;
    }
    if (jwt == null || jwt.isEmpty()) {
      callback.onFailure();
    } else {
      callback.onSuccess(jwt);
    }
  }

  static void invalidate() {
    try {
      removeProvider();
    } catch (Exception err) {
      failPendingRequests();
    }
  }

  private static void failPendingRequests() {
    for (String requestId : pendingRequests.keySet()) {
      complete(requestId, null);
    }
  }

  private static boolean emitRequest(ReactApplicationContext reactContext, String requestId) {
    if (!reactContext.hasActiveReactInstance()) {
      return false;
    }
    try {
      WritableMap params = Arguments.createMap();
      params.putString("requestId", requestId);
      reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(IntercomEventEmitter.USER_JWT_REQUESTED_NOTIFICATION, params);
      return true;
    } catch (Exception err) {
      Log.e(TAG, "Unable to request a user JWT: " + err);
      return false;
    }
  }
}
