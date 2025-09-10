#import <React/RCTBridgeModule.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <IntercomReactNativeSpec/IntercomReactNativeSpec.h>
@interface IntercomModule : NSObject <NativeIntercomSpecSpec>
#else
@interface IntercomModule : NSObject <RCTBridgeModule>
#endif

+ (void)initialize:(nonnull NSString *)apiKey withAppId:(nonnull NSString *)appId;
+ (void)setDeviceToken:(nonnull NSData *)deviceToken;
+ (BOOL)isIntercomPushNotification:(nonnull NSDictionary *)userInfo;
+ (void)handleIntercomPushNotification:(nonnull NSDictionary *)userInfo;
- (NSError *)exceptionToError:(NSException *)exception :(NSString *)code :(NSString *)domain;

@end
