#import "IntercomModule.h"
#import "IntercomAttributesBuilder.h"
#import <Intercom/Intercom.h>

@implementation IntercomModule
NSString *IDENTIFIED_REGISTRATION = @"102";
NSString *SET_USER_HASH = @"103";
NSString *UPDATE_USER = @"104";
NSString *LOG_EVENT = @"105";
NSString *UNREAD_CONVERSATION_COUNT = @"107";
NSString *SEND_TOKEN_TO_INTERCOM = @"302";

RCT_EXPORT_MODULE()

+ (void)initialize:(nonnull NSString *)apiKey withAppId:(nonnull NSString *)appId {
    [Intercom setApiKey:apiKey forAppId:appId];
    NSLog(@"initialized Intercom module");
}

+ (void)setDeviceToken:(nonnull NSData *)deviceToken {
    [Intercom setDeviceToken:deviceToken];
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

RCT_EXPORT_METHOD(sendTokenToIntercom :
    (NSString *) token:
(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock)reject) {
    @try {
        NSData *data = [self dataFromHexString:token];
        [Intercom setDeviceToken:data];

        NSLog(@"sendTokenToIntercom");
        resolve(@(YES));
    } @catch (NSException *exception) {
        reject(UPDATE_USER, @"Error in sendTokenToIntercom", [self exceptionToError:exception :SEND_TOKEN_TO_INTERCOM :@"sendTokenToIntercom"]);
    }
};

RCT_EXPORT_METHOD(registerUnidentifiedUser :
    (RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock)reject) {

    [Intercom registerUnidentifiedUser];
    NSLog(@"registerUnidentifiedUser");
    resolve(@(YES));
};

RCT_EXPORT_METHOD(registerIdentifiedUser:
    (NSDictionary *) options:
(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock)reject)
{
    NSString *userId = options[@"userId"];
    NSString *userEmail = options[@"email"];

    if ([userId isKindOfClass:[NSNumber class]]) {
        userId = [(NSNumber *) userId stringValue];
    }

    if (userId.length > 0 && userEmail.length > 0) {
        [Intercom registerUserWithUserId:userId email:userEmail];
        NSLog(@"registerUserWithUserId");
        resolve(@(YES));
    } else if (userId.length > 0) {
        [Intercom registerUserWithUserId:userId];
        NSLog(@"registerUserWithUserId");
        resolve(@(YES));
    } else if (userEmail.length > 0) {
        [Intercom registerUserWithEmail:userEmail];
        NSLog(@"registerUserWithEmail");
        resolve(@(YES));
    } else {
        NSLog(@"[Intercom] ERROR - No user registered. You must supply an email, a userId or both");
        NSError *error = [NSError errorWithDomain:@"registerIdentifiedUser" code:[IDENTIFIED_REGISTRATION intValue] userInfo:@{@"Error reason": @"Invalid Input. No user registered. You must supply an email, a userId or both"}];
        reject(IDENTIFIED_REGISTRATION, @"No user registered. You must supply an email, a userId or both", error);
    }
}

RCT_EXPORT_METHOD(logout :
    (RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock)reject) {

    [Intercom logout];
    NSLog(@"logout");
    resolve(@(YES));
};

RCT_EXPORT_METHOD(updateUser :
    (NSDictionary *) options: (RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock)reject) {
    @try {
        ICMUserAttributes *userAttributes = [IntercomAttributesBuilder userAttributesForDictionary:options];
        [Intercom updateUser:userAttributes];

        NSLog(@"updateUser");
        resolve(@(YES));
    } @catch (NSException *exception) {
        reject(UPDATE_USER, @"Error in updateUser", [self exceptionToError:exception :UPDATE_USER :@"updateUser"]);
    }


};

RCT_EXPORT_METHOD(setUserHash :
    (NSString *) userHash: (RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock)reject) {
    @try {
        [Intercom setUserHash:userHash];

        NSLog(@"setUserHash");
        resolve(@(YES));
    } @catch (NSException *exception) {
        reject(UPDATE_USER, @"Error in setUserHash", [self exceptionToError:exception :SET_USER_HASH :@"setUserHash"]);
    }
};

RCT_EXPORT_METHOD(logEvent :
    (NSString *) eventName:
(nullable NSDictionary *)metaData:
(RCTPromiseResolveBlock) resolve :
(RCTPromiseRejectBlock)reject) {
    @try {
        if (eventName == @"") {
            @throw[NSException exceptionWithName:@"Invalid eventName" reason:@"eventName can't be empty" userInfo:nil];
        }

        if ([metaData isKindOfClass:[NSDictionary class]] && metaData.count > 0) {
            [Intercom logEventWithName:eventName metaData:metaData];
        } else {
            [Intercom logEventWithName:eventName];
        }

        NSLog(@"logEvent");
        resolve(@(YES));
    } @catch (NSException *exception) {
        reject(LOG_EVENT, @"Error in logEvent", [self exceptionToError:exception :LOG_EVENT :@"logEvent"]);
    }
};

RCT_EXPORT_METHOD(getUnreadConversationCount :
    (RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock)reject) {
    @try {
        NSUInteger count = [Intercom unreadConversationCount];

        NSLog(@"unreadConversationCount");
        resolve(@(count));
    } @catch (NSException *exception) {
        reject(UPDATE_USER, @"Error in unreadConversationCount", [self exceptionToError:exception :UNREAD_CONVERSATION_COUNT :@"unreadConversationCount"]);
    }
};

RCT_EXPORT_METHOD(displayMessenger :
    (RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock)reject) {

    [Intercom presentMessenger];
    NSLog(@"displayMessenger");
    resolve(@(YES));
};

RCT_EXPORT_METHOD(displayMessageComposer :
    (NSString *) initialMessage:
(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock)reject) {

    [Intercom presentMessageComposer:initialMessage];
    NSLog(@"displayMessageComposer");
    resolve(@(YES));
};

RCT_EXPORT_METHOD(displayHelpCenter :
    (RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock)reject) {

    [Intercom presentHelpCenter];
    NSLog(@"displayHelpCenter");
    resolve(@(YES));
};

RCT_EXPORT_METHOD(displayCarousel :
    (NSString *) carouselId:
(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock)reject) {

    [Intercom presentCarousel:carouselId];
    NSLog(@"displayCarousel");
    resolve(@(YES));
};

RCT_EXPORT_METHOD(displayArticle :
    (NSString *) articleId:
(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock)reject) {

    [Intercom presentArticle:articleId];
    NSLog(@"displayArticle");
    resolve(@(YES));
};

RCT_EXPORT_METHOD(displayHelpCenterCollections :
    (NSArray *) collectionsId:
(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock)reject) {

    [Intercom presentHelpCenterCollections:collectionsId];
    NSLog(@"displayHelpCenterCollections");
    resolve(@(YES));
};

RCT_EXPORT_METHOD(hideMessenger :
    (RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock)reject) {

    [Intercom hideMessenger];
    NSLog(@"hideMessenger");
    resolve(@(YES));
};

RCT_EXPORT_METHOD(setBottomPadding :
    (nonnull NSNumber *) bottomPadding:
(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock)reject) {

    [Intercom setBottomPadding:[bottomPadding doubleValue]];
    NSLog(@"setBottomPadding");
    resolve(@(YES));
};

RCT_EXPORT_METHOD(setLauncherVisibility :
    (NSString *) visibility:
(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock)reject) {

    BOOL visible = NO;
    if ([visibility isEqualToString:@"VISIBLE"]) {
        visible = YES;
    }
    [Intercom setLauncherVisible:visible];
    NSLog(@"setLauncherVisibility");
    resolve(@(YES));
};

RCT_EXPORT_METHOD(setInAppMessageVisibility :
    (NSString *) visibility:
(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock)reject) {

    BOOL visible = NO;
    if ([visibility isEqualToString:@"VISIBLE"]) {
        visible = YES;
    }
    [Intercom setInAppMessagesVisible:visible];
    NSLog(@"setInAppMessageVisibility");
    resolve(@(YES));
};

RCT_EXPORT_METHOD(setLogLevel:
    (NSString *) param:
(RCTPromiseResolveBlock) resolve :(RCTPromiseRejectBlock)reject) {

    [Intercom enableLogging];
    NSLog(@"setLogLevel");
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
