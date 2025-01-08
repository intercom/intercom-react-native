#import "IntercomHelpCenterHelpers.h"
#import <Intercom/Intercom.h>

@implementation IntercomHelpCenterHelpers

+ (NSMutableArray<NSMutableDictionary *> *)parseCollectionsToArray:(NSArray<ICMHelpCenterCollection *> *)collections {
    NSMutableArray<NSMutableDictionary *> *parsedCollections = [NSMutableArray arrayWithCapacity:[collections count]];

    for (ICMHelpCenterCollection *collectionObject in collections) {
        NSMutableDictionary *item = [NSMutableDictionary dictionary];
        [item setValue:[collectionObject collectionId] forKey:@"id"];
        [item setValue:[collectionObject title] forKey:@"title"];
        [item setValue:[collectionObject summary] forKey:@"summary"];
        [parsedCollections addObject:item];
    }
    return parsedCollections;
}

+ (NSMutableArray<NSMutableDictionary *> *)parseArticlesToArray:(NSArray<ICMHelpCenterArticle *> *)articlesArray {

    NSMutableArray *parsedArticles = [NSMutableArray arrayWithCapacity:[articlesArray count]];
    for (ICMHelpCenterArticle *articleObject in articlesArray) {
        NSMutableDictionary *articleItem = [NSMutableDictionary dictionary];
        [articleItem setValue:[articleObject articleId] forKey:@"id"];
        [articleItem setValue:[articleObject title] forKey:@"title"];
        [parsedArticles addObject:articleItem];
    }

    return parsedArticles;
}

+ (NSMutableDictionary *)parseHelpCenterCollectionToDictionary:(ICMHelpCenterCollectionContent *)collectionContent {

    NSMutableDictionary *item = [NSMutableDictionary dictionary];
    [item setValue:[collectionContent collectionId] forKey:@"id"];
    [item setValue:[collectionContent title] forKey:@"title"];
    [item setValue:[collectionContent summary] forKey:@"summary"];
    [item setValue:[self parseArticlesToArray:[collectionContent articles]] forKey:@"articles"];
    [item setValue:[self parseCollectionsToArray:[collectionContent collections]] forKey:@"collections"];

    return item;
}

+ (NSMutableArray<NSMutableDictionary *> *)parseHelpCenterArticleSearchResultToArray:(NSArray<ICMHelpCenterArticleSearchResult *>*)articleArray {

    NSMutableArray *parsedArticles = [NSMutableArray arrayWithCapacity:[articleArray count]];
    for (ICMHelpCenterArticleSearchResult *articleObject in articleArray) {
        NSMutableDictionary *articleItem = [NSMutableDictionary dictionary];
        [articleItem setValue:[articleObject title] forKey:@"title"];
        [articleItem setValue:[articleObject articleId] forKey:@"id"];
        [articleItem setValue:[articleObject matchingSnippet] forKey:@"matchingSnippet"];
        [articleItem setValue:[articleObject summary] forKey:@"summary"];
        [parsedArticles addObject:articleItem];
    }

    return parsedArticles;
}


@end

