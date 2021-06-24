#import <Foundation/Foundation.h>
#import <Intercom/Intercom.h>

@interface IntercomAttributesBuilder : NSObject
+ (ICMUserAttributes *)userAttributesForDictionary:(NSDictionary *)attributesDict;
@end
