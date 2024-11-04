#import <Foundation/Foundation.h>
#import <Intercom/Intercom.h>

@interface IntercomAttributesBuilder : NSObject
+ (ICMUserAttributes *)userAttributesForDictionary:(NSDictionary *)attributesDict;
+ (NSMutableDictionary *)dictionaryForUserAttributes:(ICMUserAttributes *)attributes;
@end
