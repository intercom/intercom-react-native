#import "IntercomModule.h"
#import "IntercomAttributesBuilder.h"
#import "IntercomHelpCenterHelpers.h"
#import <React/RCTLog.h>
@import Intercom;

@interface Intercom (Intercom)
+ (void)setReactNativeVersion:(NSString *)v;
@end

@implementation IntercomModule
NSString *UNIDENTIFIED_REGISTRATION = @"101";
NSString *IDENTIFIED_REGISTRATION = @"102";
NSString *SET_USER_HASH = @"103";
NSString *UPDATE_USER = @"104";
NSString *LOG_EVENT = @"105";
NSString *UNREAD_CONVERSATION_COUNT = @"107";
NSString *SET_USER_JWT = @"109";
NSString *SET_AUTH_TOKENS = @"110";
NSString *SEND_TOKEN_TO_INTERCOM = @"302";
NSString *FETCH_HELP_CENTER_COLLECTIONS = @"901";
NSString *FETCH_HELP_CENTER_COLLECTION = @"902";
NSString *SEARCH_HELP_CENTER = @"903";

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

+ (void)initialize:(nonnull NSString *)apiKey withAppId:(nonnull NSString *)appId {
    NSString *version = @"0";

    NSString *path = [[NSBundle mainBundle] pathForResource:@"IntercomFramework" ofType:@"bundle"];
    NSBundle *bundle = [NSBundle bundleWithPath:path];
    if (bundle != nil) {
        NSString *v = [bundle objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
        if (v != nil) {
            version = v;
        }
    } else {
        bundle = [NSBundle mainBundle];
        NSString *v = [bundle objectForInfoDictionaryKey:@"IntercomRnVersion"];
        if (v != nil) {
            version = v;
        }
    }

    [Intercom setReactNativeVersion:version];
    [Intercom setApiKey:apiKey forAppId:appId];
    NSLog(@"initialized Intercom module");
}

+ (void)setDeviceToken:(nonnull NSData *)deviceToken {
    [Intercom setDeviceToken:deviceToken
                     success:^{
                         NSLog(@"Device token registered successfully");
                     }
                     failure:^(NSError * _Nullable error) {
                         NSLog(@"Failed to register device token: %@", error.localizedDescription);
                     }];
}

+ (BOOL)isIntercomPushNotification:(NSDictionary *)userInfo {

    return [Intercom isIntercomPushNotification:userInfo];
}

+ (void)handleIntercomPushNotification:(NSDictionary *)userInfo {
    [Intercom handleIntercomPushNotification:userInfo];
}

- (NSData *)dataFromHexString:(NSString *)string {
    NSString *command = [string stringByReplacingOccurrencesOfString:@" " withString:@""];
    NSMutableData *commandToSend = [[NSMutableData alloc] init];
    unsigned char whole_byte;
    char byte_chars[3] = {'\0', '\0', '\0'};
    int i;
    for (i = 0; i < [command length] / 2; i++) {
        byte_chars[0] = [command characterAtIndex:i * 2];
        byte_chars[1] = [command characterAtIndex:i * 2 + 1];
        whole_byte = strtol(byte_chars, NULL, 16);
        [commandToSend appendBytes:&whole_byte length:1];
    }
    return commandToSend;
}

RCT_EXPORT_METHOD(sendTokenToIntercom:(NSString *)token
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        NSData *data = [self dataFromHexString:token];
        [Intercom setDeviceToken:data
                         success:^{
                             resolve(@(YES));
                         }
                         failure:^(NSError * _Nullable error) {
                             reject(SEND_TOKEN_TO_INTERCOM, @"Error in sendTokenToIntercom", error);
                         }];
    } @catch (NSException *exception) {
        reject(SEND_TOKEN_TO_INTERCOM, @"Error in sendTokenToIntercom", [self exceptionToError:exception :SEND_TOKEN_TO_INTERCOM :@"sendTokenToIntercom"]);
    }
};


#pragma mark - User

RCT_EXPORT_METHOD(loginUnidentifiedUser:(RCTPromiseResolveBlock)successCallback
                                failure:(RCTPromiseRejectBlock)failureCallback) {
    [Intercom loginUnidentifiedUserWithSuccess:^{
        successCallback(@(YES));
    } failure:^(NSError * _Nonnull error) {
        failureCallback(UNIDENTIFIED_REGISTRATION, @"Error in loginUnidentifiedUser", [self removeNullUnderlyingError:error]);
    }];
};

RCT_EXPORT_METHOD(loginUserWithUserAttributes:(NSDictionary *)userAttributes
                                      success:(RCTPromiseResolveBlock)successCallback
                                      failure:(RCTPromiseRejectBlock)failureCallback) {
    ICMUserAttributes *attributes = [IntercomAttributesBuilder userAttributesForDictionary:userAttributes];

    [Intercom loginUserWithUserAttributes:attributes success:^{
        successCallback(@(YES));
    } failure:^(NSError * _Nonnull error) {
        failureCallback(IDENTIFIED_REGISTRATION, @"Error in loginUserWithUserAttributes", [self removeNullUnderlyingError:error]);
    }];
}

RCT_EXPORT_METHOD(logout:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [Intercom logout];
    resolve(@(YES));
};

RCT_EXPORT_METHOD(updateUser:(NSDictionary *)userAttributesDict
                  resolver:(RCTPromiseResolveBlock)resolve
              failureBlock:(RCTPromiseRejectBlock)failureCallback) {
    ICMUserAttributes *userAttributes = [IntercomAttributesBuilder userAttributesForDictionary:userAttributesDict];
    [Intercom updateUser:userAttributes success:^{
        resolve(@(YES));
    } failure:^(NSError * _Nonnull error) {
        failureCallback(UPDATE_USER, @"Error in updateUser", [self removeNullUnderlyingError:error]);
    }];
};

RCT_EXPORT_METHOD(isUserLoggedIn:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    BOOL loggedIn = [Intercom isUserLoggedIn];
    resolve(@(loggedIn));
};

RCT_EXPORT_METHOD(fetchLoggedInUserAttributes:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    ICMUserAttributes *attributes = [Intercom fetchLoggedInUserAttributes];
    resolve([IntercomAttributesBuilder dictionaryForUserAttributes:attributes]);
};

RCT_EXPORT_METHOD(setUserHash:(NSString *)userHash
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        [Intercom setUserHash:userHash];
        resolve(@(YES));
    } @catch (NSException *exception) {
        reject(UPDATE_USER, @"Error in setUserHash", [self exceptionToError:exception :SET_USER_HASH :@"setUserHash"]);
    }
};

#pragma mark - Events

RCT_EXPORT_METHOD(logEvent:(NSString *)eventName
                  metaData:(nullable NSDictionary*)metaData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        if (eventName == @"") {
            @throw[NSException exceptionWithName:@"Invalid eventName" reason:@"eventName can't be empty" userInfo:nil];
        }

        if ([metaData isKindOfClass:[NSDictionary class]] && metaData.count > 0) {
            [Intercom logEventWithName:eventName metaData:metaData];
        } else {
            [Intercom logEventWithName:eventName];
        }
        resolve(@(YES));
    } @catch (NSException *exception) {
        reject(LOG_EVENT, @"Error in logEvent", [self exceptionToError:exception :LOG_EVENT :@"logEvent"]);
    }
};


#pragma mark - Intercom presentation

RCT_EXPORT_METHOD(presentIntercom:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    [Intercom presentIntercom];
    resolve(@(YES));
};

RCT_EXPORT_METHOD(presentMessageComposer:(NSString *)initialMessage
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {

    [Intercom presentMessageComposer:initialMessage];
    NSLog(@"displayMessageComposer");
    resolve(@(YES));
};

RCT_EXPORT_METHOD(presentIntercomSpace:(NSString *)space
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    Space selectedSpace = home;
    if ([space isEqualToString:@"HOME"]) {
        selectedSpace = home;
    } else if ([space isEqualToString:@"HELP_CENTER"]) {
        selectedSpace = helpCenter;
    } else if ([space isEqualToString:@"MESSAGES"]) {
        selectedSpace = messages;
    } else if ([space isEqualToString:@"TICKETS"]) {
        selectedSpace = tickets;
    }
    [Intercom presentIntercom:selectedSpace];
    RCTLog(@"Presenting Intercom Space : %@", space);
    resolve(@(YES));
};

RCT_EXPORT_METHOD(presentContent:(NSDictionary *)content
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    IntercomContent *intercomContent;
    NSString *contentType = content[@"type"];
    if ([contentType isEqualToString:@"ARTICLE"]) {
        intercomContent = [IntercomContent articleWithId:content[@"id"]];
    } else if ([contentType isEqualToString:@"CAROUSEL"]) {
        intercomContent = [IntercomContent carouselWithId:content[@"id"]];
    } else if ([contentType isEqualToString:@"SURVEY"]) {
        intercomContent = [IntercomContent surveyWithId:content[@"id"]];
    } else if ([contentType isEqualToString:@"HELP_CENTER_COLLECTIONS"]) {
        NSArray<NSString *> *collectionIds = content[@"ids"];
        intercomContent = [IntercomContent helpCenterCollectionsWithIds:collectionIds];
    } else if ([contentType isEqualToString:@"CONVERSATION"]) {
        intercomContent = [IntercomContent conversationWithId:content[@"id"]];
    }
    if (intercomContent) {
        [Intercom presentContent:intercomContent];
        resolve(@(YES));
    }
};


#pragma mark - Help Center Data API

RCT_EXPORT_METHOD(fetchHelpCenterCollections:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [Intercom fetchHelpCenterCollectionsWithCompletion:^(NSArray<ICMHelpCenterCollection *> *_Nullable collections, NSError *_Nullable error) {

        if (collections != nil) {
            NSArray *parsedCollections = [IntercomHelpCenterHelpers parseCollectionsToArray:collections];
            resolve(parsedCollections);
        } else {
            reject(FETCH_HELP_CENTER_COLLECTIONS, @"Error in fetchHelpCenterCollections", error);
        }
    }];
};

RCT_EXPORT_METHOD(fetchHelpCenterCollection:(NSString *)collectionId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if (!collectionId || [collectionId isEqualToString:@""]) {
        NSError *error = [NSError errorWithDomain:@"fetchHelpCenterCollection" code:[FETCH_HELP_CENTER_COLLECTION intValue] userInfo:nil];
        reject(FETCH_HELP_CENTER_COLLECTION, @"Error in fetchHelpCenterCollection, collectionId can't be empty", error);
    } else {
        [Intercom fetchHelpCenterCollection:collectionId withCompletion:^(ICMHelpCenterCollectionContent *_Nullable collectionContent, NSError *_Nullable error) {
            if (collectionContent) {
                resolve([IntercomHelpCenterHelpers parseHelpCenterCollectionToDictionary:collectionContent]);
            } else {
                reject(FETCH_HELP_CENTER_COLLECTION, @"Error in fetchHelpCenterCollection", error);
            }
        }];
    }
};

RCT_EXPORT_METHOD(searchHelpCenter:(NSString *)searchTerm
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if (!searchTerm || [searchTerm isEqualToString:@""]) {
        NSError *error = [NSError errorWithDomain:@"searchHelpCenter" code:[SEARCH_HELP_CENTER intValue] userInfo:nil];
        reject(SEARCH_HELP_CENTER, @"Error in searchHelpCenter, searchTerm can't be empty", error);
    } else {
        [Intercom searchHelpCenter:searchTerm withCompletion:^(NSArray<ICMHelpCenterArticleSearchResult *> * _Nullable articleSearchResults, NSError * _Nullable error) {
            if(articleSearchResults){
                resolve([IntercomHelpCenterHelpers parseHelpCenterArticleSearchResultToArray:articleSearchResults]);
            } else{
                reject(SEARCH_HELP_CENTER, @"Error in searchHelpCenter", error);
            }
        }];
    }
};


#pragma mark - Intercom UI Visibility

RCT_EXPORT_METHOD(hideIntercom:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [Intercom hideIntercom];
    resolve(@(YES));
};

RCT_EXPORT_METHOD(setBottomPadding:(nonnull NSNumber *)bottomPadding
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {

    [Intercom setBottomPadding:[bottomPadding doubleValue]];
    resolve(@(YES));
};

RCT_EXPORT_METHOD(setLauncherVisibility:(NSString *)visibility
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {

    BOOL isVisible = NO;
    if (visibility && [visibility isEqualToString:@"VISIBLE"]) {
        isVisible = YES;
    }
    [Intercom setLauncherVisible:isVisible];
    resolve(@(YES));
};

RCT_EXPORT_METHOD(setUserJwt:(NSString *)jwt
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        [Intercom setUserJwt:jwt];
        resolve(@(YES));
    } @catch (NSException *exception) {
        reject(SET_USER_JWT, @"Error in setUserJwt", [self exceptionToError:exception :@"SET_USER_JWT" :@"setUserJwt"]);
    }
};

RCT_EXPORT_METHOD(setAuthTokens:(NSDictionary *)authTokens
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        [Intercom setAuthTokens:authTokens
                        success:^{
                            resolve(@(YES));
                        }
                        failure:^(NSError * _Nonnull error) {
                            reject(SET_AUTH_TOKENS, @"Error in setAuthTokens", [self removeNullUnderlyingError:error]);
                        }];
    } @catch (NSException *exception) {
        reject(SET_AUTH_TOKENS, @"Error in setAuthTokens", [self exceptionToError:exception :SET_AUTH_TOKENS :@"setAuthTokens"]);
    }
};

RCT_EXPORT_METHOD(setInAppMessageVisibility:(NSString *)visibility
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {

    BOOL isVisible = NO;
    if (visibility && [visibility isEqualToString:@"VISIBLE"]) {
        isVisible = YES;
    }
    [Intercom setInAppMessagesVisible:isVisible];
    resolve(@(YES));
};


#pragma mark - Unread Conversation Count

RCT_EXPORT_METHOD(getUnreadConversationCount:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        NSUInteger count = [Intercom unreadConversationCount];
        resolve(@(count));
    } @catch (NSException *exception) {
        reject(UPDATE_USER, @"Error in unreadConversationCount", [self exceptionToError:exception :UNREAD_CONVERSATION_COUNT :@"unreadConversationCount"]);
    }
};


#pragma mark - Logging

/// We ignore `level` here. Android accepts various log levels but iOS doesn't. To simplify the JS API
/// we just have one logging API that accepts a logging level that can be used on Android. But for iOS we just ignore it.
RCT_EXPORT_METHOD(setLogLevel:(NSString *)level
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    [Intercom enableLogging];
    resolve(@(YES));
};

RCT_EXPORT_METHOD(setNeedsStatusBarAppearanceUpdate:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [Intercom setNeedsStatusBarAppearanceUpdate];
    resolve(@(YES));
};

RCT_EXPORT_METHOD(setThemeMode:(NSString *)themeMode
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    @try {
        if (themeMode == nil || [themeMode isKindOfClass:[NSNull class]] || [themeMode length] == 0) {
            reject(@"SET_THEME_MODE", @"Theme mode cannot be null or empty. Use 'LIGHT', 'DARK', or 'SYSTEM'.", nil);
            return;
        }

        ICMThemeOverride themeOverride;

        if ([themeMode isEqualToString:@"LIGHT"]) {
            themeOverride = ICMThemeOverrideLight;
        } else if ([themeMode isEqualToString:@"DARK"]) {
            themeOverride = ICMThemeOverrideDark;
        } else if ([themeMode isEqualToString:@"SYSTEM"]) {
            themeOverride = ICMThemeOverrideSystem;
        } else {
            reject(@"SET_THEME_MODE", [NSString stringWithFormat:@"Invalid theme mode: '%@'. Use 'LIGHT', 'DARK', or 'SYSTEM'.", themeMode], nil);
            return;
        }

        [Intercom setThemeOverride:themeOverride];
        resolve(@(YES));
    } @catch (NSException *exception) {
        reject(@"SET_THEME_MODE", @"Error in setThemeMode", [self exceptionToError:exception :@"SET_THEME_MODE" :@"setThemeMode"]);
    }
};

- (NSError *)exceptionToError:(NSException *)exception :(NSString *)code :(NSString *)domain {
    NSMutableDictionary *info = [NSMutableDictionary dictionary];
    [info setValue:exception.name forKey:@"ExceptionName"];
    [info setValue:exception.reason forKey:@"ExceptionReason"];
    [info setValue:exception.callStackReturnAddresses forKey:@"ExceptionCallStackReturnAddresses"];
    [info setValue:exception.callStackSymbols forKey:@"ExceptionCallStackSymbols"];
    [info setValue:exception.userInfo forKey:@"ExceptionUserInfo"];

    return [[NSError alloc] initWithDomain:domain code:[code integerValue] userInfo:info];
};


/// Remove `NSUnderlyingErrorKey` from the `userInfo` if its value is  of type `NSNull`
///
/// NSErrors that are return from Intercom can have a value of `NSNull`. ReactNative is unable to handle this so we
/// strip them out to avoid crashing the app.
/// - Parameter error: the `NSError` object.
- (NSError *)removeNullUnderlyingError:(NSError *)error {
    NSMutableDictionary *userInfo = [NSMutableDictionary dictionary];
    NSError *underlyingError = [error.userInfo objectForKey:NSUnderlyingErrorKey];
    [userInfo addEntriesFromDictionary:error.userInfo];
    if([underlyingError isKindOfClass:[NSNull class]]) {
        [userInfo removeObjectForKey:NSUnderlyingErrorKey];
    }
    return [[NSError alloc] initWithDomain:error.domain code:error.code userInfo:userInfo];
};

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeIntercomSpecSpecJSI>(params);
}
#endif

@end
