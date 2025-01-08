#import "IntercomAttributesBuilder.h"
#import <Intercom/Intercom.h>

@implementation IntercomAttributesBuilder

+ (ICMUserAttributes *)userAttributesForDictionary:(NSDictionary *)attributesDict {
    ICMUserAttributes *attributes = [ICMUserAttributes new];
    if ([self stringValueForKey:@"email" inDictionary:attributesDict]) {
        attributes.email = [self stringValueForKey:@"email" inDictionary:attributesDict];
    }
    if ([self stringValueForKey:@"userId" inDictionary:attributesDict]) {
        attributes.userId = [self stringValueForKey:@"userId" inDictionary:attributesDict];
    }
    if ([self stringValueForKey:@"name" inDictionary:attributesDict]) {
        attributes.name = [self stringValueForKey:@"name" inDictionary:attributesDict];
    }
    if ([self stringValueForKey:@"phone" inDictionary:attributesDict]) {
        attributes.phone = [self stringValueForKey:@"phone" inDictionary:attributesDict];
    }
    if ([self stringValueForKey:@"languageOverride" inDictionary:attributesDict]) {
        attributes.languageOverride = [self stringValueForKey:@"languageOverride" inDictionary:attributesDict];
    }
    if ([self dateValueForKey:@"signedUpAt" inDictionary:attributesDict]) {
        attributes.signedUpAt = [self dateValueForKey:@"signedUpAt" inDictionary:attributesDict];
    }
    if ([self stringValueForKey:@"unsubscribedFromEmails" inDictionary:attributesDict]) {
        attributes.unsubscribedFromEmails = [self boolValueForKey:@"unsubscribedFromEmails" inDictionary:attributesDict];
    }
    if (attributesDict[@"customAttributes"]) {
        attributes.customAttributes = attributesDict[@"customAttributes"];
    }
    if (attributesDict[@"companies"]) {
        NSMutableArray<ICMCompany *> *companies = [NSMutableArray new];
        for (NSDictionary *companyDict in attributesDict[@"companies"]) {
            [companies addObject:[self companyForDictionary:companyDict]];
        }
        attributes.companies = companies;
    }
    return attributes;
}

+ (NSMutableDictionary *)dictionaryForUserAttributes:(ICMUserAttributes *)attributes {
    NSMutableDictionary *attributesDict = [NSMutableDictionary new];
    if (attributes.email) {
        attributesDict[@"email"] = attributes.email;
    }
    if (attributes.userId) {
        attributesDict[@"userId"] = attributes.userId;
    }
    if (attributes.name) {
        attributesDict[@"name"] = attributes.name;
    }
    if (attributes.phone) {
        attributesDict[@"phone"] = attributes.phone;
    }
    if (attributes.languageOverride) {
        attributesDict[@"languageOverride"] = attributes.languageOverride;
    }
    if (attributes.signedUpAt) {
        attributesDict[@"signedUpAt"] = @([attributes.signedUpAt timeIntervalSince1970]);
    }
    if (attributes.unsubscribedFromEmails) {
        attributesDict[@"unsubscribedFromEmails"] = @(attributes.unsubscribedFromEmails);
    }
    if (attributes.customAttributes) {
        attributesDict[@"customAttributes"] = attributes.customAttributes;
    }
    return attributesDict;
}   

+ (ICMCompany *)companyForDictionary:(NSDictionary *)attributesDict {
    ICMCompany *company = [ICMCompany new];
    if ([self stringValueForKey:@"id" inDictionary:attributesDict]) {
        company.companyId = [self stringValueForKey:@"id" inDictionary:attributesDict];
    }
    if ([self stringValueForKey:@"name" inDictionary:attributesDict]) {
        company.name = [self stringValueForKey:@"name" inDictionary:attributesDict];
    }
    if ([self dateValueForKey:@"createdAt" inDictionary:attributesDict]) {
        company.createdAt = [self dateValueForKey:@"createdAt" inDictionary:attributesDict];
    }
    if ([self numberValueForKey:@"monthlySpend" inDictionary:attributesDict]) {
        company.monthlySpend = [self numberValueForKey:@"monthlySpend" inDictionary:attributesDict];
    }
    if ([self stringValueForKey:@"plan" inDictionary:attributesDict]) {
        company.plan = [self stringValueForKey:@"plan" inDictionary:attributesDict];
    }
    if (attributesDict[@"customAttributes"]) {
        company.customAttributes = attributesDict[@"customAttributes"];
    }
    return company;
}

+ (NSString *)stringValueForKey:(NSString *)key inDictionary:(NSDictionary *)dictionary {
    NSString *value = dictionary[key];
    if ([value isKindOfClass:[NSString class]]) {
        return value;
    }
    if ([value isKindOfClass:[NSNumber class]]) {
        return [NSString stringWithFormat:@"%@", value];
    }
    if ([value isKindOfClass:[NSNull class]]) {
        return [ICMUserAttributes nullStringAttribute];
    }
    return nil;
}

+ (NSNumber *)numberValueForKey:(NSString *)key inDictionary:(NSDictionary *)dictionary {
    NSNumber *value = dictionary[key];
    if ([value isKindOfClass:[NSNumber class]]) {
        return value;
    }
    if ([value isKindOfClass:[NSNull class]]) {
        return [ICMUserAttributes nullNumberAttribute];
    }
    return nil;
}

+ (NSDate *)dateValueForKey:(NSString *)key inDictionary:(NSDictionary *)dictionary {
    NSNumber *value = dictionary[key];
    if ([value isKindOfClass:[NSNumber class]]) {
        return [NSDate dateWithTimeIntervalSince1970:[value doubleValue]];
    }
    if ([value isKindOfClass:[NSNull class]]) {
        return [ICMUserAttributes nullDateAttribute];
    }
    return nil;
}

+ (BOOL)boolValueForKey:(NSString *)key inDictionary:(NSDictionary *)dictionary {
    id value = dictionary[key];
    if ([value isKindOfClass:[NSNumber class]]) {
        return [value boolValue];
    }
    if ([value isKindOfClass:[NSString class]]) {
        return [value boolValue];
    }
    return NO;
}


@end
