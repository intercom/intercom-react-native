package com.intercom.reactnative;


import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;


import java.util.List;

import io.intercom.android.sdk.helpcenter.api.HelpCenterArticleSearchResult;
import io.intercom.android.sdk.helpcenter.collections.HelpCenterCollection;
import io.intercom.android.sdk.helpcenter.sections.HelpCenterArticle;
import io.intercom.android.sdk.helpcenter.sections.HelpCenterCollectionContent;
import io.intercom.android.sdk.helpcenter.sections.HelpCenterSection;

public class IntercomHelpCenterHelpers {

  public static ReadableArray parseArticlesToReadableArray(List<HelpCenterArticle> itemArticles) {
    WritableArray articles = Arguments.createArray();

    HelpCenterArticle[] articlesArray = new HelpCenterArticle[itemArticles.size()];
    articlesArray = itemArticles.toArray(articlesArray);

    for (HelpCenterArticle article : articlesArray) {
      WritableMap item = Arguments.createMap();
      item.putString("id", article.getArticleId());
      item.putString("title", article.getTitle());
      articles.pushMap(item);
    }
    return articles;
  }

  public static ReadableArray parseHelpCenterArticleSearchToReadableArray(List<HelpCenterArticleSearchResult> helpCenterArticleSearchResultList) {
    WritableArray articles = Arguments.createArray();

    HelpCenterArticleSearchResult[] articlesArray = new HelpCenterArticleSearchResult[helpCenterArticleSearchResultList.size()];
    articlesArray = helpCenterArticleSearchResultList.toArray(articlesArray);

    for (HelpCenterArticleSearchResult article : articlesArray) {
      WritableMap item = Arguments.createMap();
      item.putString("id", article.getArticleId());
      item.putString("title", article.getTitle());
      item.putString("matchingSnippet", article.getMatchingSnippet());
      item.putString("summary", article.getSummary());
      articles.pushMap(item);
    }
    return articles;
  }

  public static ReadableMap parseHelpCenterCollectionsContentToReadableMap(HelpCenterCollectionContent helpCenterCollectionContent) {
    WritableMap helpCenterCollection = Arguments.createMap();
    helpCenterCollection.putString("id", helpCenterCollectionContent.getCollectionId());
    helpCenterCollection.putString("title", helpCenterCollectionContent.getTitle());
    helpCenterCollection.putString("summary", helpCenterCollectionContent.getSummary());

    ReadableArray articles = parseArticlesToReadableArray(helpCenterCollectionContent.getHelpCenterArticles());
    helpCenterCollection.putArray("articles", articles);

    ReadableArray sections = parseHelpCenterSectionsToReadableArray(helpCenterCollectionContent.getHelpCenterSections());
    helpCenterCollection.putArray("sections", sections);


    return helpCenterCollection;
  }

  public static ReadableMap parseHelpCenterSectionToReadableMap(HelpCenterSection helpCenterSection) {
    WritableMap section = Arguments.createMap();
    section.putString("id", helpCenterSection.getTitle());


    ReadableArray articles = parseArticlesToReadableArray(helpCenterSection.getHelpCenterArticles());
    section.putArray("articles", articles);


    return section;
  }

  public static ReadableArray parseHelpCenterSectionsToReadableArray(List<HelpCenterSection> helpCenterSectionList) {
    WritableArray sections = Arguments.createArray();

    HelpCenterSection[] sectionsArray = new HelpCenterSection[helpCenterSectionList.size()];
    sectionsArray = helpCenterSectionList.toArray(sectionsArray);
    ;

    for (HelpCenterSection section : sectionsArray) {
      sections.pushMap(parseHelpCenterSectionToReadableMap(section));
    }
    return sections;
  }

  public static ReadableArray parseHelpCenterCollectionsToReadableArray(List<HelpCenterCollection> helpCenterCollections) {
    HelpCenterCollection[] collectionsArray = new HelpCenterCollection[helpCenterCollections.size()];
    collectionsArray = helpCenterCollections.toArray(collectionsArray);
    WritableArray collections = Arguments.createArray();
    for (HelpCenterCollection helpCenterCollection : collectionsArray) {
      WritableMap item = Arguments.createMap();
      item.putString("id", helpCenterCollection.getId());
      item.putString("title", helpCenterCollection.getTitle());
      item.putString("summary", helpCenterCollection.getSummary());
      collections.pushMap(item);
    }
    return collections;
  }



}
