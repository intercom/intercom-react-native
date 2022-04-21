import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  EmitterSubscription,
} from 'react-native';

const { IntercomModule, IntercomEventEmitter } = NativeModules;

export type Registration = Partial<{
  email: string;
  userId: string;
}>;

export enum Visibility {
  GONE = 'GONE',
  VISIBLE = 'VISIBLE',
}

type VisibilityType = keyof typeof Visibility;

export enum LogLevel {
  ASSERT = 'ASSERT',
  DEBUG = 'DEBUG',
  DISABLED = 'DISABLED',
  ERROR = 'ERROR',
  INFO = 'INFO',
  VERBOSE = 'VERBOSE',
  WARN = 'WARN',
}

type LogLevelType = keyof typeof LogLevel;

export const IntercomEvents = {
  IntercomUnreadCountDidChange:
    IntercomEventEmitter.UNREAD_COUNT_CHANGE_NOTIFICATION,
  IntercomWindowDidHide: IntercomEventEmitter.WINDOW_DID_HIDE_NOTIFICATION,
  IntercomWindowDidShow: IntercomEventEmitter.WINDOW_DID_SHOW_NOTIFICATION,
  IntercomHelpCenterWindowDidShow:
    IntercomEventEmitter.HELP_CENTER_WINDOW_DID_SHOW_NOTIFICATION,
  IntercomHelpCenterWindowDidHide:
    IntercomEventEmitter.HELP_CENTER_WINDOW_DID_HIDE_NOTIFICATION,
};

type EventType =
  | 'IntercomUnreadConversationCountDidChangeNotification'
  | 'IntercomHelpCenterDidShowNotification'
  | 'IntercomHelpCenterDidHideNotification'
  | 'IntercomWindowDidHideNotification'
  | 'IntercomWindowDidShowNotification';

export type CustomAttributes = {
  [key: string]: boolean | string | number;
};
export type MetaData = {
  [key: string]: any;
};

export type UpdateUserParamList = {
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

export type HelpCenterArticle = { it: string; title: string };
export type HelpCenterSection = { title: string; articles: HelpCenterArticle };
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

export type IntercomType = {
  fetchHelpCenterCollections: () => Promise<Array<HelpCenterCollectionItem>>;
  searchHelpCenter: (term: string) => Promise<HelpCenterArticleSearchResult>;
  fetchHelpCenterCollection: (
    id: string
  ) => Promise<HelpCenterCollectionContent>;
  displayArticle(articleId: string): Promise<boolean>;
  displayCarousel(carouselId: string): Promise<boolean>;
  displayHelpCenter(): Promise<boolean>;
  displayHelpCenterCollections(collections?: string[]): Promise<boolean>;
  displayMessageComposer(initialMessage?: string): Promise<boolean>;
  displayMessenger(): Promise<boolean>;
  getUnreadConversationCount(): Promise<number>;
  hideIntercom(): Promise<boolean>;
  logEvent(eventName: string, metaData?: MetaData): Promise<boolean>;
  logout(): Promise<boolean>;
  registerIdentifiedUser(params: Registration): Promise<boolean>;
  registerUnidentifiedUser(): Promise<boolean>;
  setBottomPadding(bottomPadding: number): Promise<boolean>;
  setInAppMessageVisibility(visibility: VisibilityType): Promise<boolean>;
  setLauncherVisibility(visibility: VisibilityType): Promise<boolean>;
  setLogLevel(logLevel: LogLevelType): Promise<boolean>;
  setUserHash(hash: string): Promise<boolean>;
  updateUser(params: UpdateUserParamList): Promise<boolean>;
  handlePushMessage(): Promise<boolean>;
  sendTokenToIntercom(token: string): Promise<boolean>;
  addEventListener: (
    event: EventType,
    callback: (response: { count?: number; visible: boolean }) => void
  ) => EmitterSubscription;
};

const Intercom = {
  searchHelpCenter: (term = '') => IntercomModule.searchHelpCenter(term),
  fetchHelpCenterCollections: () => IntercomModule.fetchHelpCenterCollections(),
  fetchHelpCenterCollection: (id = '') =>
    IntercomModule.fetchHelpCenterCollection(id),
  displayArticle: (articleId: string) =>
    IntercomModule.displayArticle(articleId),
  displayCarousel: (carouselId: string) =>
    IntercomModule.displayCarousel(carouselId),
  displayHelpCenter: () => IntercomModule.displayHelpCenter(),
  displayHelpCenterCollections: (collections = [] as string[]) =>
    IntercomModule.displayHelpCenterCollections(collections),
  displayMessageComposer: (initialMessage = undefined) =>
    IntercomModule.displayMessageComposer(initialMessage),
  displayMessenger: () => IntercomModule.displayMessenger(),
  getUnreadConversationCount: () => IntercomModule.getUnreadConversationCount(),
  handlePushMessage: Platform.select({
    android: IntercomModule.handlePushMessage,
    default: async () => true,
  }),
  hideIntercom: () => IntercomModule.hideIntercom(),
  logEvent: (eventName, metaData = undefined) =>
    IntercomModule.logEvent(eventName, metaData),
  logout: () => IntercomModule.logout(),
  registerIdentifiedUser: (eventName) =>
    IntercomModule.registerIdentifiedUser(eventName),
  registerUnidentifiedUser: () => IntercomModule.registerUnidentifiedUser(),
  setBottomPadding: (paddingBottom) =>
    IntercomModule.setBottomPadding(paddingBottom),
  setInAppMessageVisibility: (visibility) =>
    IntercomModule.setInAppMessageVisibility(visibility),
  setLauncherVisibility: (visibility) =>
    IntercomModule.setLauncherVisibility(visibility),
  setLogLevel: (logLevel) => IntercomModule.setLogLevel(logLevel),
  setUserHash: (hash) => IntercomModule.setUserHash(hash),
  updateUser: (params) => IntercomModule.updateUser(params),
  sendTokenToIntercom: (token) => IntercomModule.sendTokenToIntercom(token),
  addEventListener: (event, callback) => {
    event === IntercomEvents.IntercomUnreadCountDidChange &&
      Platform.OS === 'android' &&
      IntercomEventEmitter.startEventListener();
    const eventEmitter = new NativeEventEmitter(IntercomEventEmitter);
    const listener = eventEmitter.addListener(event, callback);
    return {
      ...listener,
      remove: () => {
        event === IntercomEvents.IntercomUnreadCountDidChange &&
          Platform.OS === 'android' &&
          IntercomEventEmitter.removeEventListener();
        listener.remove();
      },
    };
  },
} as IntercomType;

export default Intercom;
