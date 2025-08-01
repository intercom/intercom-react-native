import { NativeEventEmitter, NativeModules } from 'react-native';

const IntercomTurboModule = require('./NativeIntercom').default;

// Re-export types and enums that consumers might need
export enum Visibility {
  GONE = 'GONE',
  VISIBLE = 'VISIBLE',
}

export enum LogLevel {
  ASSERT = 'ASSERT',
  DEBUG = 'DEBUG',
  DISABLED = 'DISABLED',
  ERROR = 'ERROR',
  INFO = 'INFO',
  VERBOSE = 'VERBOSE',
  WARN = 'WARN',
}

export enum Space {
  home = 'HOME',
  helpCenter = 'HELP_CENTER',
  messages = 'MESSAGES',
  tickets = 'TICKETS',
}

export enum ContentType {
  Article = 'ARTICLE',
  Carousel = 'CAROUSEL',
  Survey = 'SURVEY',
  HelpCenterCollections = 'HELP_CENTER_COLLECTIONS',
  Conversation = 'CONVERSATION',
}

// Type definitions
export type CustomAttributes = {
  [key: string]: boolean | string | number;
};

export type MetaData = {
  [key: string]: any;
};

export type UserAttributes = {
  companies?: Company[];
  customAttributes?: CustomAttributes;
  email?: string;
  languageOverride?: string;
  name?: string;
  phone?: string;
  signedUpAt?: number;
  unsubscribedFromEmails?: boolean;
  userId?: string;
};

export type Company = {
  createdAt?: number;
  customAttributes?: CustomAttributes;
  id: string;
  monthlySpend?: number;
  name?: string;
  plan?: string;
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

export interface Content {
  type: ContentType;
}

// Export IntercomContent and IntercomEvents for backward compatibility
export const IntercomContent = {
  articleWithArticleId: (articleId: string) => ({
    type: ContentType.Article,
    id: articleId,
  }),
  carouselWithCarouselId: (carouselId: string) => ({
    type: ContentType.Carousel,
    id: carouselId,
  }),
  surveyWithSurveyId: (surveyId: string) => ({
    type: ContentType.Survey,
    id: surveyId,
  }),
  helpCenterCollectionsWithIds: (collectionIds: string[]) => ({
    type: ContentType.HelpCenterCollections,
    ids: collectionIds,
  }),
  conversationWithConversationId: (conversationId: string) => ({
    type: ContentType.Conversation,
    id: conversationId,
  }),
};

export const IntercomEvents = {
  IntercomUnreadCountDidChange:
    'IntercomUnreadConversationCountDidChangeNotification',
  IntercomWindowDidHide: 'IntercomWindowDidHideNotification',
  IntercomWindowDidShow: 'IntercomWindowDidShowNotification',
  IntercomHelpCenterWindowDidShow: 'IntercomWindowDidShowNotification',
  IntercomHelpCenterWindowDidHide: 'IntercomWindowDidHideNotification',
};

// Custom event handling implementation
const eventEmitter = new NativeEventEmitter(NativeModules.IntercomEventEmitter);

// Create a combined object that includes both TurboModule methods and event handling
const Intercom = {
  ...IntercomTurboModule,
  addEventListener: (event: string, callback: (response: any) => void) => {
    return eventEmitter.addListener(event, callback);
  },
  removeEventListener: (event: string, _callback: (response: any) => void) => {
    eventEmitter.removeAllListeners(event);
  },
};

export default Intercom;
