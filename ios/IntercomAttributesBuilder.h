#import <Foundation/Foundation.h>

@class ICMUserAttributes;


@interface IntercomAttributesBuilder : NSObject
+ (ICMUserAttributes *)userAttributesForDictionary:(NSDictionary *)attributesDict;
@end