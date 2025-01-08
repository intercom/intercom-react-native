package com.intercom.reactnative;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.intercom.android.sdk.Company;
import io.intercom.android.sdk.Intercom;
import io.intercom.android.sdk.UserAttributes;
import io.intercom.android.sdk.identity.Registration;

public class IntercomHelpers {

  public static Intercom.Visibility stringToVisibility(String visibility) {
    if (visibility.equalsIgnoreCase("VISIBLE")) {
      return Intercom.Visibility.VISIBLE;
    } else {
      return Intercom.Visibility.GONE;
    }
  }

  public static int stringToLogLevel(String logLevel) {

    switch (logLevel) {
      case "VERBOSE": {
        return Intercom.LogLevel.VERBOSE;
      }
      case "ASSERT": {
        return Intercom.LogLevel.ASSERT;
      }
      case "DEBUG": {
        return Intercom.LogLevel.DEBUG;
      }
      case "DISABLED": {
        return Intercom.LogLevel.DISABLED;
      }
      case "ERROR": {
        return Intercom.LogLevel.ERROR;
      }
      case "INFO": {
        return Intercom.LogLevel.INFO;
      }
      case "WARN": {
        return Intercom.LogLevel.WARN;
      }
      default:
        return Intercom.LogLevel.DISABLED;
    }

  }

  public static Date parseDateFromTimestamp(Number timestamp) {
    return new Date((timestamp.longValue() * 1000));
  }

  @Nullable
  public static Company buildCompany(ReadableMap companyObject) {
    if (companyObject.hasKey("id")) {
      Company.Builder companyBuilder = new Company.Builder();
      companyBuilder.withCompanyId(companyObject.getString("id"));
      if (companyObject.hasKey("name")) {
        companyBuilder.withName(companyObject.getString("name"));
      }
      if (companyObject.hasKey("plan")) {
        companyBuilder.withPlan(companyObject.getString("plan"));
      }
      if (companyObject.hasKey("monthlySpend")) {
        companyBuilder.withMonthlySpend(companyObject.getInt("monthlySpend"));
      }
      if (companyObject.hasKey("createdAt")) {
        companyBuilder.withCreatedAt((long) companyObject.getInt("createdAt"));
      }
      if (companyObject.hasKey("customAttributes")) {
        companyBuilder.withCustomAttributes(deconstructReadableMap(companyObject.getMap("customAttributes"), false));
      }
      return companyBuilder.build();
    }
    return null;
  }

  public static Map<String, Object> deconstructReadableMap(ReadableMap readableMap, Boolean deconstructNested) {
    ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
    Map<String, Object> deconstructedMap = new HashMap<>();
    while (iterator.hasNextKey()) {
      String key = iterator.nextKey();
      ReadableType type = readableMap.getType(key);
      switch (type) {
        case Null:
          deconstructedMap.put(key, null);
          break;
        case Boolean:
          deconstructedMap.put(key, readableMap.getBoolean(key));
          break;
        case Number:
          deconstructedMap.put(key, readableMap.getDouble(key));
          break;
        case String:
          deconstructedMap.put(key, readableMap.getString(key));
          break;
        case Map:
          if (deconstructNested) {
            deconstructedMap.put(key, deconstructReadableMap(readableMap.getMap(key), true));
          }
          break;
        case Array:
          if (deconstructNested) {
            deconstructedMap.put(key, recursivelyDeconstructReadableArray(readableMap.getArray(key)));
          }
          break;
        default:
          throw new IllegalArgumentException("Could not convert object with key: " + key + ".");
      }

    }
    return deconstructedMap;
  }

  public static List<Object> recursivelyDeconstructReadableArray(ReadableArray readableArray) {
    List<Object> deconstructedList = new ArrayList<>(readableArray.size());
    for (int i = 0; i < readableArray.size(); i++) {
      ReadableType indexType = readableArray.getType(i);
      switch (indexType) {
        case Null:
          deconstructedList.add(i, null);
          break;
        case Boolean:
          deconstructedList.add(i, readableArray.getBoolean(i));
          break;
        case Number:
          deconstructedList.add(i, readableArray.getDouble(i));
          break;
        case String:
          deconstructedList.add(i, readableArray.getString(i));
          break;
        case Map:
          deconstructedList.add(i, deconstructReadableMap(readableArray.getMap(i), true));
          break;
        case Array:
          deconstructedList.add(i, recursivelyDeconstructReadableArray(readableArray.getArray(i)));
          break;
        default:
          throw new IllegalArgumentException("Could not convert object at index " + i + ".");
      }
    }
    return deconstructedList;
  }

  public static List<String> readableArrayToStringList(ReadableArray readableArray) {
    List<String> deconstructedList = new ArrayList<>();
    for (int i = 0; i < readableArray.size(); i++) {
      ReadableType indexType = readableArray.getType(i);
      switch (indexType) {
        case String:
          deconstructedList.add(i, readableArray.getString(i));
          break;
      }
    }
    return deconstructedList;
  }

  public static UserAttributes buildUserAttributes(ReadableMap readableMap) {
    UserAttributes.Builder builder = new UserAttributes.Builder();
    ReadableMapKeySetIterator iterator = readableMap.keySetIterator();

    while (iterator.hasNextKey()) {
      String key = iterator.nextKey();
      switch (key) {
        case "email": {
          builder.withEmail(readableMap.getString(key));
          break;
        }
        case "userId": {
          builder.withUserId(readableMap.getString(key));
          break;
        }
        case "name": {
          builder.withName(readableMap.getString(key));
          break;
        }
        case "phone": {
          builder.withPhone(readableMap.getString(key));
          break;
        }
        case "languageOverride": {
          builder.withLanguageOverride(readableMap.getString(key));
          break;
        }
        case "unsubscribedFromEmails": {
          builder.withUnsubscribedFromEmails(readableMap.getBoolean(key));
          break;
        }
        case "companies": {
          ReadableArray companiesArray = readableMap.getArray(key);

          for (int index = 0; index < companiesArray.size(); index++) {
            Company company = IntercomHelpers.buildCompany(companiesArray.getMap(index));
            if (company != null) {
              builder.withCompany(company);
            }
          }
          break;
        }
        case ("signedUpAt"): {
          builder.withSignedUpAt(IntercomHelpers.parseDateFromTimestamp(readableMap.getInt(key)));
          break;
        }
        case "customAttributes": {
          if (readableMap.getType(key) == ReadableType.Map) {
            builder.withCustomAttributes(IntercomHelpers.deconstructReadableMap(readableMap.getMap(key), false));
          }
          break;
        }
      }
    }
    return builder.build();
  }

  public static String getValueAsStringForKey(ReadableMap map, String key) {
    ReadableType type = map.getType(key);
    String value = "";
    switch (type) {
      case Number: {
        value = String.valueOf(map.getInt(key));
        break;
      }
      case String: {
        value = map.getString(key);
        break;
      }
      default: {
        throw new IllegalArgumentException("Value for Key: \""+key+"\" should be a String");
      }
    }
    return value;
  }

  public static WritableMap deconstructRegistration(Registration registration) {
    WritableMap registrationMap = Arguments.createMap();
    if (registration.getEmail() != null) {
      registrationMap.putString("email", registration.getEmail());
    }
    if (registration.getUserId() != null) {
      registrationMap.putString("userId", registration.getUserId());
    }
    return registrationMap;
  }
}
