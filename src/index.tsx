import { NativeModules, NativeEventEmitter } from 'react-native';

const { Intercom, IntercomEventEmitter } = NativeModules;

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

const Events = {
  IntercomUnreadCountDidChange:
    IntercomEventEmitter.UNREAD_COUNT_CHANGE_NOTIFICATION,
};

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

type EventCallback = (event: { count: number }) => void;

export type IntercomType = {
  displayCarousel(carouselId: string): Promise<boolean>;
  displayHelpCenter(carouselId: string): Promise<boolean>;
  displayHelpCenter(): Promise<boolean>;
  displayMessageComposer(initialMessage?: string): Promise<boolean>;
  displayMessenger(): Promise<boolean>;
  getUnreadConversationCount(): Promise<number>;
  hideMessenger(): Promise<boolean>;
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
  addOnMessageCountChangeListener: (callback: EventCallback) => () => void;
};

export default {
  displayCarousel: (carouselId: string) => Intercom.displayCarousel(carouselId),
  displayHelpCenter: () => Intercom.displayHelpCenter(),
  displayMessageComposer: (initialMessage = undefined) =>
    Intercom.displayMessageComposer(initialMessage),
  displayMessenger: () => Intercom.displayMessenger(),
  getUnreadConversationCount: () => Intercom.getUnreadConversationCount(),
  handlePushMessage: () => Intercom.handlePushMessage(),
  hideMessenger: () => Intercom.hideMessenger(),
  logEvent: (eventName, metaData = undefined) =>
    Intercom.logEvent(eventName, metaData),
  logout: () => Intercom.logout(),
  registerIdentifiedUser: (eventName) =>
    Intercom.registerIdentifiedUser(eventName),
  registerUnidentifiedUser: () => Intercom.registerUnidentifiedUser(),
  setBottomPadding: (paddingBottom) => Intercom.setBottomPadding(paddingBottom),
  setInAppMessageVisibility: (visibility) =>
    Intercom.setInAppMessageVisibility(visibility),
  setLogLevel: (logLevel) => Intercom.setLogLevel(logLevel),
  setUserHash: (hash) => Intercom.setUserHash(hash),
  updateUser: (params) => Intercom.updateUser(params),
  sendTokenToIntercom: (token) => Intercom.sendTokenToIntercom(token),
  addOnMessageCountChangeListener: (callback) => {
    IntercomEventEmitter.startEventListener();
    const eventEmitter = new NativeEventEmitter(IntercomEventEmitter);
    const listener = eventEmitter.addListener(
      Events.IntercomUnreadCountDidChange,
      callback
    );
    return () => {
      IntercomEventEmitter.removeEventListener();
      listener.remove();
    };
  },
} as IntercomType;
