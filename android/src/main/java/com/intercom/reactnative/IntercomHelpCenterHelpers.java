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

public class IntercomHelpCenterHelpers {

  public static WritableArray parseArticlesToReadableArray(List<HelpCenterArticle> itemArticles) {
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

  public static WritableArray parseHelpCenterArticleSearchToReadableArray(List<HelpCenterArticleSearchResult> helpCenterArticleSearchResultList) {
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

  public static WritableMap parseHelpCenterCollectionsContentToReadableMap(HelpCenterCollectionContent helpCenterCollectionContent) {
    WritableMap helpCenterCollection = Arguments.createMap();
    helpCenterCollection.putString("id", helpCenterCollectionContent.getCollectionId());
    helpCenterCollection.putString("title", helpCenterCollectionContent.getTitle());
    helpCenterCollection.putString("summary", helpCenterCollectionContent.getSummary());

    WritableArray articles = parseArticlesToReadableArray(helpCenterCollectionContent.getHelpCenterArticles());
    helpCenterCollection.putArray("articles", articles);

    WritableArray collections = parseHelpCenterCollectionsToReadableArray(helpCenterCollectionContent.getSubCollections());
    helpCenterCollection.putArray("collections", collections);


    return helpCenterCollection;
  }

  public static WritableArray parseHelpCenterCollectionsToReadableArray(List<HelpCenterCollection> helpCenterCollections) {
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
