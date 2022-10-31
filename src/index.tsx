import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  EmitterSubscription,
} from 'react-native';

const { IntercomModule, IntercomEventEmitter } = NativeModules;

/** 
 * @deprecated Please use `UserAttributes` instead.
 */
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
  IntercomUnreadCountDidChange: IntercomEventEmitter.UNREAD_COUNT_CHANGE_NOTIFICATION,
  IntercomWindowDidHide: IntercomEventEmitter.WINDOW_DID_HIDE_NOTIFICATION,
  IntercomWindowDidShow: IntercomEventEmitter.WINDOW_DID_SHOW_NOTIFICATION,
  IntercomHelpCenterWindowDidShow: IntercomEventEmitter.WINDOW_DID_SHOW_NOTIFICATION,
  IntercomHelpCenterWindowDidHide: IntercomEventEmitter.WINDOW_DID_HIDE_NOTIFICATION,
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

/** 
 * @deprecated Please use `UserAttributes` instead.
 */
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
  it: string; 
  title: string 
};
export type HelpCenterSection = { 
  title: string; 
  articles: HelpCenterArticle 
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

export enum Space {
  home = "HOME",
  helpCenter = "HELP_CENTER",
  messages = "MESSAGES",
}

export type IntercomType = {

  /**
   * 
   */
  loginUnidentifiedUser:() => Promise<boolean>;

  /**
   * 
   * @param params 
   */
  loginUserWithUserAttributes(params: UserAttributes): Promise<boolean>;

  /**
   * 
   */
  logout(): Promise<boolean>;

  /**
   * 
   * @param hash 
   */
  setUserHash(hash: string): Promise<boolean>;

  /**
   * 
   * @param userAttributes 
   */
  updateUser(userAttributes: UserAttributes): Promise<boolean>;

  /**
   * 
   * @param eventName 
   * @param metaData 
   */
  logEvent(eventName: string, metaData?: MetaData): Promise<boolean>;

  /**
   * 
   */
  fetchHelpCenterCollections: () => Promise<Array<HelpCenterCollectionItem>>;
  
  /**
   * TODO: Ask Peter the difference between this and the one above.
   */
  // searchHelpCenter: (term: string) => Promise<HelpCenterArticleSearchResult>;
  fetchHelpCenterCollection: (id: string) => Promise<HelpCenterCollectionContent>;
  
   /**
   * 
   * @param term 
   */
  searchHelpCenter(term: string): Promise<HelpCenterArticleSearchResult>;

  /**
   * 
   */
  presentIntercom(): Promise<boolean>;

  /**
   * 
   * @param space 
   */
  presentIntercomSpace(space: Space): Promise<boolean>;

  /**
   * 
   * @param initialMessage 
   */
  presentMessageComposer(initialMessage?: string): Promise<boolean>;
  
  /**
   * 
   */
  getUnreadConversationCount(): Promise<number>;
  
  /**
   * 
   */
  hideIntercom(): Promise<boolean>;

  /**
   * 
   * @param bottomPadding 
   */
  setBottomPadding(bottomPadding: number): Promise<boolean>;

  /**
   * 
   * @param visibility 
   */
  setInAppMessageVisibility(visibility: VisibilityType): Promise<boolean>;

  /**
   * 
   * @param visibility 
   */
  setLauncherVisibility(visibility: VisibilityType): Promise<boolean>;
  

  /**
   * 
   */
  setNeedsStatusBarAppearanceUpdate(): Promise<boolean>

  /**
   * 
   */
  handlePushMessage(): Promise<boolean>;

  /**
   * 
   * @param token 
   */
  sendTokenToIntercom(token: string): Promise<boolean>;

  /**
   * 
   * @param logLevel 
   */
  setLogLevel(logLevel: LogLevelType): Promise<boolean>;

  /**
   * 
   */
  addEventListener: (
  event: EventType,
  callback: (response: { count?: number; visible: boolean }) => void
) => EmitterSubscription;


  //////////////////////////
  // Depreacted functions //
  //////////////////////////
  /**
   * @deprecated `registerIdentifiedUser` is deprecated and will be removed in a future release.  Use `loginUserWithUserAttributes` instead.
   */
  registerIdentifiedUser(params: Registration): Promise<boolean>;

  /**
  * @deprecated `registerUnidentifiedUser` is deprecated and will be removed in a future release.  Use `loginUnidentifiedUserWithSuccess` instead.
  */
  registerUnidentifiedUser(): Promise<boolean>;

  /**
  * @deprecated `updateUser` is deprecated and will be removed in a future release.  Use `updateUser` instead.
  */
  updateUser(params: UpdateUserParamList): Promise<boolean>;
  
  /**
  * @deprecated `displayMessenger` is deprecated and will be removed in a future release.  Use `presentIntercom` instead.
  */
  displayMessenger(): Promise<boolean>;

  /**
   * @deprecated `displayHelpCenter` is deprecated and will be removed in a future release.  Use `presentIntercom` instead.
   */
  displayHelpCenter(): Promise<boolean>;

  /**
  * @deprecated `displayMessageComposer` is deprecated and will be removed in a future release.  Use `presentMessageComposer` instead.
  * @see presentMessageComposer for details
  */
  displayMessageComposer(initialMessage?: string): Promise<boolean>;
  
  /**
  * @deprecated `displayArticle` is deprecated and will be removed in a future release.  Use `presentContent` instead.
  */
  displayArticle(articleId: string): Promise<boolean>;

  /**
  * @deprecated `displayCarousel` is deprecated and will be removed in a future release.  Use `presentContent` instead.
  */
  displayCarousel(carouselId: string): Promise<boolean>;

  /**
  * @deprecated `displaySurvey` is deprecated and will be removed in a future release.  Use `presentContent` instead.
  */
  displaySurvey(surveyId: string): Promise<boolean>;

  /**
  * @deprecated `displayHelpCenterCollections` is deprecated and will be removed in a future release.  Use `presentContent` instead.
  */
  displayHelpCenterCollections(collections?: string[]): Promise<boolean>;
};

const Intercom = {

  loginUnidentifiedUser: () => IntercomModule.loginUnidentifiedUser(),
  loginUserWithUserAttributes: (userAttributes) => IntercomModule.loginUserWithUserAttributes(userAttributes),
  logout: () => IntercomModule.logout(),
  setUserHash: (hash) => IntercomModule.setUserHash(hash),
  updateUser: (userAttributes) => IntercomModule.updateUser(userAttributes),
  logEvent: (eventName, metaData = undefined) => IntercomModule.logEvent(eventName, metaData),

  fetchHelpCenterCollections: () => IntercomModule.fetchHelpCenterCollections(),
  fetchHelpCenterCollection: (id = '') => IntercomModule.fetchHelpCenterCollection(id),
  searchHelpCenter: (term = '') => IntercomModule.searchHelpCenter(term),

  presentIntercom: () => IntercomModule.presentIntercom(),
  presentIntercomSpace: (space) => IntercomModule.presentIntercomSpace(space),
  presentMessageComposer: (initialMessage = undefined) => IntercomModule.presentMessageComposer(initialMessage),
  getUnreadConversationCount: () => IntercomModule.getUnreadConversationCount(),
  
  hideIntercom: () => IntercomModule.hideIntercom(),
  setBottomPadding: (paddingBottom) => IntercomModule.setBottomPadding(paddingBottom),
  setInAppMessageVisibility: (visibility) => IntercomModule.setInAppMessageVisibility(visibility),
  setLauncherVisibility: (visibility) => IntercomModule.setLauncherVisibility(visibility),
  setNeedsStatusBarAppearanceUpdate: Platform.select({
    ios: IntercomModule.setNeedsStatusBarAppearanceUpdate,
    default: async () => true
  }),

  handlePushMessage:  Platform.select({
    android: IntercomModule.handlePushMessage,
    default: async () => true,
  }),
  
  sendTokenToIntercom: (token) => IntercomModule.sendTokenToIntercom(token),
  setLogLevel: (logLevel) => IntercomModule.setLogLevel(logLevel),

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

  /**
   * @depreacted methods
   */
  registerIdentifiedUser: (registrationParams) => IntercomModule.loginUserWithUserAttributes(registrationParams),
  registerUnidentifiedUser: () => IntercomModule.loginUnidentifiedUser(),
  displayMessenger: () => IntercomModule.presentIntercom(),
  displayHelpCenter: () => IntercomModule.displayHelpCenter(),// TODO: corect API
  displayMessageComposer: (initialMessage = undefined) => IntercomModule.presentMessageComposer(initialMessage),
  displayArticle: (articleId: string) => IntercomModule.displayArticle(articleId),// TODO: corect API
  displayCarousel: (carouselId: string) => IntercomModule.displayCarousel(carouselId),// TODO: corect API
  displaySurvey: (surveyId: string) => IntercomModule.displaySurvey(surveyId),// TODO: corect API
  displayHelpCenterCollections: (collections = [] as string[]) => IntercomModule.displayHelpCenterCollections(collections),// TODO: corect API
} as IntercomType;

export default Intercom;
