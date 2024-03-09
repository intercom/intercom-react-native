import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  type EmitterSubscription,
} from 'react-native';

const { IntercomModule, IntercomEventEmitter } = NativeModules;

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
  IntercomEventEmitter.WINDOW_DID_SHOW_NOTIFICATION,
  IntercomHelpCenterWindowDidHide:
  IntercomEventEmitter.WINDOW_DID_HIDE_NOTIFICATION,
};

type EventType =
  | 'IntercomUnreadConversationCountDidChangeNotification'
  | 'IntercomWindowDidHideNotification'
  | 'IntercomWindowDidShowNotification';

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
  it: string;
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

export enum Space {
  home = 'HOME',
  helpCenter = 'HELP_CENTER',
  messages = 'MESSAGES',
  tickets = 'TICKETS',
}

export type IntercomType = {
  /**
   * Login a unidentified user.
   * This is a user that doesn't have any identifiable information such as a `userId` or `email`.
   * @return {Promise<boolean>} A promise to the token.
   */
  loginUnidentifiedUser: () => Promise<boolean>;

  /**
   * Login a user with identifiable information.
   * Valid identifiers are `userId` and `email` which must be set in the {@link UserAttributes} object.
   * @param params The {@link UserAttributes} object that contains the user's `email` or `userId`.
   */
  loginUserWithUserAttributes: (params: UserAttributes) => Promise<boolean>;

  /**
   * Log a user out of their Intercom session.
   * This will dismiss any Intercom UI and clear Intercom's local cache.
   */
  logout(): Promise<boolean>;

  /**
   * Set `hash` string if you are using Identity Verification for your Intercom workspace.
   * @note This should be called before any user login takes place.
   *
   * Identity Verification helps to make sure that conversations between you and your users are kept private, and that one
   * user can't impersonate another. If Identity Verification is enabled for your app, Intercom for iOS will sign all requests
   * going to the Intercom servers with tokens. It requires your mobile application to have its own server which authenticates the app's users,
   * and which can store a secret.
   *
   * @see More information on Identity Verification can be found {@link https://developers.intercom.com/installing-intercom/docs/react-native-identity-verification here}
   * @param hash A HMAC digest of the user ID or email.
   */
  setUserHash(hash: string): Promise<boolean>;

  /**
   * Update a user in Intercom with data specified in {@link UserAttributes}.
   * Full details of the data data attributes that can be stored on a user can be found in {@link UserAttributes}.
   *
   * @param userAttributes The {@link UserAttributes} object with the user data.
   */
  updateUser(userAttributes: UserAttributes): Promise<boolean>;

  /**
   * Log an event with a given name and metaData.
   * You can log events in Intercom based on user actions in your app.
   *
   * @param eventName The name of the event.
   * @param metaData Metadata Objects support a few simple types that Intercom can present on your behalf,
   * see the @{https://developers.intercom.com/intercom-api-reference/reference/event-model Intercom API docs}
   */
  logEvent(eventName: string, metaData?: MetaData): Promise<boolean>;

  /**
   * Present Intercom as a modal overlay in your app.
   * The `Home` space is displayed by default.
   */
  present(): Promise<boolean>;

  /**
   * Present an Intercom `space` as a modal overlay in your app
   * @see {@link Space} for a list of valid spaces.
   *
   * @param space The Intercom space to be presented.
   */
  presentSpace(space: Space): Promise<boolean>;

  /**
   * Present Intercom content.
   *
   * An {@link IntercomContent} object.
   */
  presentContent(content: Content): Promise<boolean>;

  /**
   * Present the message composer.
   *
   * @param initialMessage An optional message that is used to pre-populate the composer with some text.
   */
  presentMessageComposer(initialMessage?: string): Promise<boolean>;

  /**
   * Fetch all Help Center collections.
   *
   * @return {Promise<Array<HelpCenterCollectionItem>>} An array of {@link HelpCenterCollectionItem} objects.
   */
  fetchHelpCenterCollections: () => Promise<Array<HelpCenterCollectionItem>>;

  /**
   * Fetch the contents of a Help Center collection.
   *
   * @param id The ID of the Help Center collection.
   *
   * @return {Promise<HelpCenterCollectionContent>} A {@link HelpCenterCollectionContent} object.
   */
  fetchHelpCenterCollection: (
    id: string,
  ) => Promise<HelpCenterCollectionContent>;

  /**
   * Search the Help Center.
   *
   * @param term The search term.
   *
   * @return {Promise<HelpCenterArticleSearchResult>} An array of {@link HelpCenterArticleSearchResult} objects.
   */
  searchHelpCenter: (
    term: string,
  ) => Promise<Array<HelpCenterArticleSearchResult>>;

  /**
   * Fetch the current number of unread conversations for the logged in User.
   * @return {Promise<number>} the number of unread conversations.
   */
  getUnreadConversationCount(): Promise<number>;

  /**
   * Hide all Intercom windows that are currently displayed.
   * This will hide the Messenger, Help Center, Articles, and in-product messages (eg. Mobile Carousels, chats, and posts).
   */
  hideIntercom(): Promise<boolean>;

  /**
   * Set a fixed bottom padding for in app messages and the Intercom Launcher.
   * @param bottomPadding The size of the bottom padding in points.
   */
  setBottomPadding(bottomPadding: number): Promise<boolean>;

  /**
   * Show or hide the Intercom InApp Messages in your app.
   * @note All InApp Messages are visible by default.
   *
   * @param visibility A boolean indicating if the InApps should be visible.
   */
  setInAppMessageVisibility(visibility: VisibilityType): Promise<boolean>;

  /**
   * Show or hide the Intercom Launcher in your app.
   * @note The Launcher is hidden by default.
   *
   * @param visibility A boolean indicating if the Intercom Launcher should be visible.
   */
  setLauncherVisibility(visibility: VisibilityType): Promise<boolean>;

  /**
   * Change the Status Bar's style or visibility while an Intercom notification is on
   * screen.
   * Call this method so that Intercom's window can reflect your app's status bar accordingly.
   */
  setNeedsStatusBarAppearanceUpdate(): Promise<boolean>;

  /**
   * Handle an Android push notification payload sent by Intercom.
   *
   * @note Android only. iOS handles push notifications automatically.
   */
  handlePushMessage(): Promise<boolean>;

  /**
   * Send a device token to Intercom to enable push notifications to be sent to the User.
   * @param token The device token to send to the server.
   */
  sendTokenToIntercom(token: string): Promise<boolean>;

  /**
   * Enable logging for Intercom.
   * @param logLevel The logging level to set.
   *
   * @note iOS will ignore the logging level and by default shows `DEBUG` logging.
   */
  setLogLevel(logLevel: LogLevelType): Promise<boolean>;

  /**
   * Add an `EventListener` to listen for `IntercomUnreadCountDidChange` events.
   *
   * @note This function is for Android only.
   */
  addEventListener: (
    event: EventType,
    callback: (response: { count?: number; visible: boolean }) => void,
  ) => EmitterSubscription;
};

const Intercom: IntercomType = {
  loginUnidentifiedUser: () => IntercomModule.loginUnidentifiedUser(),
  loginUserWithUserAttributes: (userAttributes) =>
    IntercomModule.loginUserWithUserAttributes(userAttributes),
  logout: () => IntercomModule.logout(),
  setUserHash: (hash) => IntercomModule.setUserHash(hash),
  updateUser: (userAttributes) => IntercomModule.updateUser(userAttributes),
  logEvent: (eventName, metaData = undefined) =>
    IntercomModule.logEvent(eventName, metaData),

  fetchHelpCenterCollections: () => IntercomModule.fetchHelpCenterCollections(),
  fetchHelpCenterCollection: (id = '') =>
    IntercomModule.fetchHelpCenterCollection(id),
  searchHelpCenter: (term = '') => IntercomModule.searchHelpCenter(term),

  present: () => IntercomModule.presentIntercom(),
  presentSpace: (space) => IntercomModule.presentIntercomSpace(space),
  presentContent: (content) => IntercomModule.presentContent(content),
  presentMessageComposer: (initialMessage = undefined) =>
    IntercomModule.presentMessageComposer(initialMessage),
  getUnreadConversationCount: () => IntercomModule.getUnreadConversationCount(),

  hideIntercom: () => IntercomModule.hideIntercom(),
  setBottomPadding: (paddingBottom) =>
    IntercomModule.setBottomPadding(paddingBottom),
  setInAppMessageVisibility: (visibility) =>
    IntercomModule.setInAppMessageVisibility(visibility),
  setLauncherVisibility: (visibility) =>
    IntercomModule.setLauncherVisibility(visibility),

  setNeedsStatusBarAppearanceUpdate: Platform.select({
    ios: IntercomModule.setNeedsStatusBarAppearanceUpdate,
    default: async () => true,
  }),

  handlePushMessage: Platform.select({
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
    const originalRemove = listener.remove;
    listener.remove = () => {
      event === IntercomEvents.IntercomUnreadCountDidChange &&
      Platform.OS === 'android' &&
      IntercomEventEmitter.removeEventListener();
      originalRemove();
    };
    return listener;
  },
};

export default Intercom;

export enum ContentType {
  Article = 'ARTICLE',
  Carousel = 'CAROUSEL',
  Survey = 'SURVEY',
  HelpCenterCollections = 'HELP_CENTER_COLLECTIONS',
  Conversation = 'CONVERSATION',
}

export interface Content {
  type: ContentType;
}

export interface Article extends Content {
  id: string;
}

interface Carousel extends Content {
  id: string;
}

interface Survey extends Content {
  id: string;
}

interface HelpCenterCollections extends Content {
  ids: string[];
}

interface Conversation extends Content {
  id: string;
}

export type IntercomContentType = {
  /**
   * Create
   */
  articleWithArticleId: (articleId: string) => Article;
  carouselWithCarouselId: (carouselId: string) => Carousel;
  surveyWithSurveyId: (surveyId: string) => Survey;
  helpCenterCollectionsWithIds: (
    collectionIds: string[],
  ) => HelpCenterCollections;
  conversationWithConversationId: (conversationId: string) => Conversation;
};

export const IntercomContent: IntercomContentType = {
  articleWithArticleId(articleId) {
    let articleContent = {} as Article;
    articleContent.type = ContentType.Article;
    articleContent.id = articleId;
    return articleContent;
  },

  carouselWithCarouselId(carouselId) {
    let carouselContent = {} as Carousel;
    carouselContent.type = ContentType.Carousel;
    carouselContent.id = carouselId;
    return carouselContent;
  },

  surveyWithSurveyId(surveyId) {
    let surveyContent = {} as Survey;
    surveyContent.type = ContentType.Survey;
    surveyContent.id = surveyId;
    return surveyContent;
  },

  helpCenterCollectionsWithIds(collectionIds) {
    let helpCenterCollectionsContent = {} as HelpCenterCollections;
    helpCenterCollectionsContent.type = ContentType.HelpCenterCollections;
    helpCenterCollectionsContent.ids = collectionIds;
    return helpCenterCollectionsContent;
  },

  conversationWithConversationId(conversationId) {
    let conversationContent = {} as Conversation;
    conversationContent.type = ContentType.Conversation;
    conversationContent.id = conversationId;
    return conversationContent;
  },
};
