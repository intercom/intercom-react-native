#import <Foundation/Foundation.h>
#import <Intercom/Intercom.h>

@interface IntercomHelpCenterHelpers : NSObject
+ (NSMutableArray<NSMutableDictionary *> *)parseCollectionsToArray:(NSArray<ICMHelpCenterCollection *> *)collections;
+ (NSMutableArray<NSMutableDictionary *> *)parseArticlesToArray:(NSArray<ICMHelpCenterArticle *> *)articlesArray;
+ (NSMutableDictionary *)parseHelpCenterCollectionToDictionary:(ICMHelpCenterCollectionContent *)collectionContent;
+ (NSMutableArray<NSMutableDictionary *> *)parseHelpCenterArticleSearchResultToArray:(NSArray<ICMHelpCenterArticleSearchResult *>*)articleArray;

@end
