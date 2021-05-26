#import <React/RCTBridgeModule.h>

@interface IntercomModule : NSObject <RCTBridgeModule>
+ (void)initialize:(nonnull NSString *)apiKey withAppId:(nonnull NSString *)appId;

+ (NSError *)exceptionToError:(NSException *)exception :(NSString *)code;

@end
