#import "IntercomModule.h"
#import "IntercomAttributesBuilder.h"
#import "IntercomHelpCenterHelpers.h"
#import <React/RCTLog.h>
@import Intercom;

@interface Intercom (Intercom)
+ (void)setReactNativeVersion:(NSString *)v;
@end

@implementation IntercomModule
NSString *IDENTIFIED_REGISTRATION = @"102";
NSString *SET_USER_HASH = @"103";
NSString *UPDATE_USER = @"104";
NSString *LOG_EVENT = @"105";
NSString *UNREAD_CONVERSATION_COUNT = @"107";
NSString *SEND_TOKEN_TO_INTERCOM = @"302";
NSString *FETCH_HELP_CENTER_COLLECTIONS = @"901";
NSString *FETCH_HELP_CENTER_COLLECTION = @"902";
NSString *SEARCH_HELP_CENTER = @"903";

RCT_EXPORT_MODULE()

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
    [Intercom setDeviceToken:deviceToken failure:nil];
    NSLog(@"setDeviceToken");
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
        [Intercom setDeviceToken:data failure:^(NSError * _Nullable error) {
            reject(SEND_TOKEN_TO_INTERCOM, @"Error in sendTokenToIntercom", error);
        }];

        resolve(@(YES));
    } @catch (NSException *exception) {
        reject(SEND_TOKEN_TO_INTERCOM, @"Error in sendTokenToIntercom", [self exceptionToError:exception :SEND_TOKEN_TO_INTERCOM :@"sendTokenToIntercom"]);
    }
};


#pragma mark - User

RCT_EXPORT_METHOD(loginUnidentifiedUser:(RCTPromiseResolveBlock)successCallback
                                           failure:(RCTResponseErrorBlock)failureCallback) {
    [Intercom loginUnidentifiedUserWithSuccess:^{
        successCallback(@(YES));
    } failure:^(NSError * _Nonnull error) {
        failureCallback(error);
    }];
};

RCT_EXPORT_METHOD(loginUserWithUserAttributes:(NSDictionary *)userAttributes
                                      success:(RCTPromiseResolveBlock)successCallback
                                      failure:(RCTResponseErrorBlock)failureCallback) {
    NSString *userId = userAttributes[@"userId"];
    NSString *userEmail = userAttributes[@"email"];

    if ([userId isKindOfClass:[NSNumber class]]) {
        userId = [(NSNumber *) userId stringValue];
    }
    ICMUserAttributes *attributes = [ICMUserAttributes new];
    attributes.userId = userId;
    attributes.email = userEmail;
    [Intercom loginUserWithUserAttributes:attributes success:^{
        successCallback(@(YES));
    } failure:^(NSError * _Nonnull error) {
        failureCallback(error);
    }];
}

RCT_EXPORT_METHOD(logout:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [Intercom logout];
    resolve(@(YES));
};

RCT_EXPORT_METHOD(updateUser:(NSDictionary *)userAttributesDict
                  resolver:(RCTPromiseResolveBlock)resolve
                  failureBlock:(RCTResponseErrorBlock)failureCallback) {
    ICMUserAttributes *userAttributes = [IntercomAttributesBuilder userAttributesForDictionary:userAttributesDict];
    [Intercom updateUser:userAttributes success:^{
        resolve(@(YES));
    } failure:^(NSError * _Nonnull error) {
        failureCallback(error);
    }];
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
        intercomContent = [IntercomContent helpCenterCollectionsWithIds:content[@"ids"]];
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

- (NSError *)exceptionToError:(NSException *)exception :(NSString *)code :(NSString *)domain {
    NSMutableDictionary *info = [NSMutableDictionary dictionary];
    [info setValue:exception.name forKey:@"ExceptionName"];
    [info setValue:exception.reason forKey:@"ExceptionReason"];
    [info setValue:exception.callStackReturnAddresses forKey:@"ExceptionCallStackReturnAddresses"];
    [info setValue:exception.callStackSymbols forKey:@"ExceptionCallStackSymbols"];
    [info setValue:exception.userInfo forKey:@"ExceptionUserInfo"];

    return [[NSError alloc] initWithDomain:domain code:[code integerValue] userInfo:info];
};
@end
