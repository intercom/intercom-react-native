package io.intercom.android.sdk.api;

import android.content.Context;
import android.util.Log;

public class ReactNativeHeaderInterceptor {
  public static void setReactNativeVersion(Context context, String rnVersion) {
    HeaderInterceptor.setReactNativeVersion(context, rnVersion);
    Log.d("ReactNativeHeader", "Registered RN Header");
    Log.d("ReactNativeHeader", rnVersion);
  }
}
