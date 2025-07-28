#import <React/RCTBridgeModule.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "intercom_react_native.h"
#endif

#ifdef RCT_NEW_ARCH_ENABLED
@interface IntercomModule : NSObject <NativeIntercomSpec>
#else
@interface IntercomModule : NSObject <RCTBridgeModule>
#endif

+ (void)initialize:(nonnull NSString *)apiKey withAppId:(nonnull NSString *)appId;
+ (void)setDeviceToken:(nonnull NSData *)deviceToken;
+ (BOOL)isIntercomPushNotification:(nonnull NSDictionary *)userInfo;
+ (void)handleIntercomPushNotification:(nonnull NSDictionary *)userInfo;
- (NSError *)exceptionToError:(NSException *)exception :(NSString *)code :(NSString *)domain;

@end
