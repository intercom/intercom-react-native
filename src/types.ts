export type CustomAttributes = {
  [key: string]: boolean | string | number;
};

export type Company = {
  createdAt?: number;
  customAttributes?: CustomAttributes;
  id: string;
  monthlySpend?: number;
  name?: string;
  plan?: string;
};

export type MetaData = {
  [key: string]: any;
};

export type HelpCenterArticle = {
  id: string;
  title: string;
};

export type HelpCenterSection = {
  title: string;
  articles: HelpCenterArticle;
};

export type HelpCenterCollectionItem = {
  id: string;
  title: string;
  summary: string;
};

export type HelpCenterCollectionContent = {
  id: string;
  title: string;
  summary: string;
  articles: HelpCenterArticle[];
  sections: HelpCenterSection[];
};

export type HelpCenterArticleSearchResult = {
  id: string;
  title: string;
  matchingSnippet: string;
  summary: string;
};
