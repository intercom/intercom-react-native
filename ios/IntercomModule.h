#import <React/RCTBridgeModule.h>

@interface IntercomModule : NSObject <RCTBridgeModule>
+ (void)initialize:(nonnull NSString *)apiKey withAppId:(nonnull NSString *)appId;
+ (void)setDeviceToken:(nonnull NSString *)deviceToken;
+ (BOOL)isIntercomPushNotification:(nonnull NSDictionary *)userInfo;
+ (void)handleIntercomPushNotification:(nonnull NSDictionary *)userInfo;
+ (NSError *)exceptionToError:(NSException *)exception :(NSString *)code;

@end
