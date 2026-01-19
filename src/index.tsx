import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  type EmitterSubscription,
} from 'react-native';

const { IntercomModule, IntercomEventEmitter } = NativeModules;

const createUnavailableError = (methodName: string) =>
  new Error(
    `Intercom native module is unavailable. Cannot call ${methodName}. ` +
      'Make sure the native module is correctly linked and initialized.'
  );

const rejectUnavailable = (methodName: string) =>
  Promise.reject(createUnavailableError(methodName));

const safeNativeCall = <T,>(
  methodName: string,
  call?: () => Promise<T>
): Promise<T> => {
  if (!call) {
    return rejectUnavailable(methodName);
  }
  try {
    return call();
  } catch (error) {
    return Promise.reject(error);
  }
};

const ensureString = (value: string, fallback = '') =>
  typeof value === 'string' ? value : fallback;

const ensureNumber = (value: number, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const ensureArray = <T,>(value: T[] | undefined, fallback: T[] = []) =>
  Array.isArray(value) ? value : fallback;

const ensureObject = function <T extends object>(
  value: T | undefined,
  fallback: T
): T {
  return value && typeof value === 'object' ? value : fallback;
};

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
    IntercomEventEmitter?.UNREAD_COUNT_CHANGE_NOTIFICATION ??
    'IntercomUnreadConversationCountDidChangeNotification',
  IntercomWindowDidHide:
    IntercomEventEmitter?.WINDOW_DID_HIDE_NOTIFICATION ??
    'IntercomWindowDidHideNotification',
  IntercomWindowDidShow:
    IntercomEventEmitter?.WINDOW_DID_SHOW_NOTIFICATION ??
    'IntercomWindowDidShowNotification',
  IntercomHelpCenterWindowDidShow:
    IntercomEventEmitter?.WINDOW_DID_SHOW_NOTIFICATION ??
    'IntercomWindowDidShowNotification',
  IntercomHelpCenterWindowDidHide:
    IntercomEventEmitter?.WINDOW_DID_HIDE_NOTIFICATION ??
    'IntercomWindowDidHideNotification',
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
   * Determines if there is currently a user logged in.
   */
  isUserLoggedIn(): Promise<boolean>;

  /**
   * Gets a logged in user's attributes
   *
   * @return {Promise<UserAttributes>} A promise to the user's attributes with `email`and/or `userId` populated..
   */
  fetchLoggedInUserAttributes: () => Promise<UserAttributes>;

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
    id: string
  ) => Promise<HelpCenterCollectionContent>;

  /**
   * Search the Help Center.
   *
   * @param term The search term.
   *
   * @return {Promise<HelpCenterArticleSearchResult>} An array of {@link HelpCenterArticleSearchResult} objects.
   */
  searchHelpCenter: (
    term: string
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
   * Add an event listener for the supported event types.
   */
  addEventListener: (
    event: EventType,
    callback: (response: { count?: number; visible: boolean }) => void
  ) => EmitterSubscription;
};

const Intercom: IntercomType = {
  loginUnidentifiedUser: () =>
    safeNativeCall(
      'loginUnidentifiedUser',
      IntercomModule?.loginUnidentifiedUser
    ),
  loginUserWithUserAttributes: (userAttributes) =>
    safeNativeCall(
      'loginUserWithUserAttributes',
      () =>
        IntercomModule?.loginUserWithUserAttributes?.(
          ensureObject(userAttributes, {})
        )
    ),
  logout: () => safeNativeCall('logout', IntercomModule?.logout),
  setUserHash: (hash) =>
    safeNativeCall(
      'setUserHash',
      () => IntercomModule?.setUserHash?.(ensureString(hash))
    ),
  updateUser: (userAttributes) =>
    safeNativeCall(
      'updateUser',
      () => IntercomModule?.updateUser?.(ensureObject(userAttributes, {}))
    ),
  isUserLoggedIn: () =>
    safeNativeCall('isUserLoggedIn', IntercomModule?.isUserLoggedIn),
  fetchLoggedInUserAttributes: () =>
    safeNativeCall(
      'fetchLoggedInUserAttributes',
      IntercomModule?.fetchLoggedInUserAttributes
    ),
  logEvent: (eventName, metaData = undefined) =>
    safeNativeCall(
      'logEvent',
      () =>
        IntercomModule?.logEvent?.(
          ensureString(eventName),
          metaData === undefined ? undefined : ensureObject(metaData, {})
        )
    ),

  fetchHelpCenterCollections: () =>
    safeNativeCall(
      'fetchHelpCenterCollections',
      IntercomModule?.fetchHelpCenterCollections
    ),
  fetchHelpCenterCollection: (id = '') =>
    safeNativeCall(
      'fetchHelpCenterCollection',
      () => IntercomModule?.fetchHelpCenterCollection?.(ensureString(id))
    ),
  searchHelpCenter: (term = '') =>
    safeNativeCall(
      'searchHelpCenter',
      () => IntercomModule?.searchHelpCenter?.(ensureString(term))
    ),

  present: () =>
    safeNativeCall('presentIntercom', IntercomModule?.presentIntercom),
  presentSpace: (space) =>
    safeNativeCall(
      'presentIntercomSpace',
      () => IntercomModule?.presentIntercomSpace?.(space)
    ),
  presentContent: (content) =>
    safeNativeCall(
      'presentContent',
      () =>
        IntercomModule?.presentContent?.(
          ensureObject(content, { type: ContentType.Article })
        )
    ),
  presentMessageComposer: (initialMessage = undefined) =>
    safeNativeCall(
      'presentMessageComposer',
      () =>
        IntercomModule?.presentMessageComposer?.(
          initialMessage === undefined
            ? undefined
            : ensureString(initialMessage)
        )
    ),
  getUnreadConversationCount: () =>
    safeNativeCall(
      'getUnreadConversationCount',
      IntercomModule?.getUnreadConversationCount
    ),

  hideIntercom: () =>
    safeNativeCall('hideIntercom', IntercomModule?.hideIntercom),
  setBottomPadding: (paddingBottom) =>
    safeNativeCall(
      'setBottomPadding',
      () => IntercomModule?.setBottomPadding?.(ensureNumber(paddingBottom))
    ),
  setInAppMessageVisibility: (visibility) =>
    safeNativeCall(
      'setInAppMessageVisibility',
      () => IntercomModule?.setInAppMessageVisibility?.(visibility)
    ),
  setLauncherVisibility: (visibility) =>
    safeNativeCall(
      'setLauncherVisibility',
      () => IntercomModule?.setLauncherVisibility?.(visibility)
    ),

  setNeedsStatusBarAppearanceUpdate: Platform.select({
    ios: () =>
      safeNativeCall(
        'setNeedsStatusBarAppearanceUpdate',
        IntercomModule?.setNeedsStatusBarAppearanceUpdate
      ),
    default: async () => true,
  }),

  handlePushMessage: Platform.select({
    android: () =>
      safeNativeCall('handlePushMessage', IntercomModule?.handlePushMessage),
    default: async () => true,
  }),

  sendTokenToIntercom: (token) =>
    safeNativeCall(
      'sendTokenToIntercom',
      () => IntercomModule?.sendTokenToIntercom?.(ensureString(token))
    ),
  setLogLevel: (logLevel) =>
    safeNativeCall(
      'setLogLevel',
      () => IntercomModule?.setLogLevel?.(logLevel)
    ),

  addEventListener: (event, callback) => {
    if (!IntercomEventEmitter) {
      return {
        remove: () => undefined,
      } as EmitterSubscription;
    }
    event === IntercomEvents.IntercomUnreadCountDidChange &&
      Platform.OS === 'android' &&
      IntercomEventEmitter.startEventListener?.();
    const eventEmitter = new NativeEventEmitter(IntercomEventEmitter);
    const safeCallback =
      typeof callback === 'function' ? callback : () => undefined;
    const listener = eventEmitter.addListener(event, safeCallback);
    const originalRemove = listener.remove;
    listener.remove = () => {
      event === IntercomEvents.IntercomUnreadCountDidChange &&
        Platform.OS === 'android' &&
        IntercomEventEmitter.removeEventListener?.();
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
    collectionIds: string[]
  ) => HelpCenterCollections;
  conversationWithConversationId: (conversationId: string) => Conversation;
};

export const IntercomContent: IntercomContentType = {
  articleWithArticleId(articleId) {
    let articleContent = {} as Article;
    articleContent.type = ContentType.Article;
    articleContent.id = ensureString(articleId);
    return articleContent;
  },

  carouselWithCarouselId(carouselId) {
    let carouselContent = {} as Carousel;
    carouselContent.type = ContentType.Carousel;
    carouselContent.id = ensureString(carouselId);
    return carouselContent;
  },

  surveyWithSurveyId(surveyId) {
    let surveyContent = {} as Survey;
    surveyContent.type = ContentType.Survey;
    surveyContent.id = ensureString(surveyId);
    return surveyContent;
  },

  helpCenterCollectionsWithIds(collectionIds) {
    let helpCenterCollectionsContent = {} as HelpCenterCollections;
    helpCenterCollectionsContent.type = ContentType.HelpCenterCollections;
    helpCenterCollectionsContent.ids = ensureArray(collectionIds);
    return helpCenterCollectionsContent;
  },

  conversationWithConversationId(conversationId) {
    let conversationContent = {} as Conversation;
    conversationContent.type = ContentType.Conversation;
    conversationContent.id = ensureString(conversationId);
    return conversationContent;
  },
};
