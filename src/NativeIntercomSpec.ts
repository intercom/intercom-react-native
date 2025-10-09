import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface UserAttributes {
  companies?: Array<{
    createdAt?: number;
    customAttributes?: Object; // { [key: string]: boolean | string | number };
    id: string;
    monthlySpend?: number;
    name?: string;
    plan?: string;
  }>;
  customAttributes?: Object; // { [key: string]: boolean | string | number };
  email?: string;
  languageOverride?: string;
  name?: string;
  phone?: string;
  signedUpAt?: number;
  unsubscribedFromEmails?: boolean;
  userId?: string;
}

interface TurboModuleContent {
  type: string; // ARTICLE, CAROUSEL, SURVEY, HELP_CENTER_COLLECTIONS, CONVERSATION
  id?: string;
  ids?: Array<string>;
}

export interface Spec extends TurboModule {
  loginUnidentifiedUser(): Promise<boolean>;
  loginUserWithUserAttributes(userAttributes: UserAttributes): Promise<boolean>;
  logout(): Promise<boolean>;
  setUserHash(hash: string): Promise<boolean>;
  updateUser(userAttributes: UserAttributes): Promise<boolean>;
  isUserLoggedIn(): Promise<boolean>;
  fetchLoggedInUserAttributes(): Promise<UserAttributes>;
  logEvent(eventName: string, metaData?: Object): Promise<boolean>;

  presentIntercom(): Promise<boolean>;
  presentIntercomSpace(space: string): Promise<boolean>;
  presentContent(content: TurboModuleContent): Promise<boolean>;
  presentMessageComposer(initialMessage?: string): Promise<boolean>;

  fetchHelpCenterCollections(): Promise<
    Array<{
      id: string;
      title: string;
      summary: string;
    }>
  >;
  fetchHelpCenterCollection(id: string): Promise<{
    id: string;
    title: string;
    summary: string;
    articles: Array<{
      id: string;
      title: string;
    }>;
    sections: Array<{
      title: string;
      articles: {
        id: string;
        title: string;
      };
    }>;
  }>;
  searchHelpCenter(term: string): Promise<
    Array<{
      id: string;
      title: string;
      matchingSnippet: string;
      summary: string;
    }>
  >;

  getUnreadConversationCount(): Promise<number>;
  hideIntercom(): Promise<boolean>;
  setBottomPadding(paddingBottom: number): Promise<boolean>;
  setInAppMessageVisibility(visibility: string): Promise<boolean>;
  setLauncherVisibility(visibility: string): Promise<boolean>;
  setNeedsStatusBarAppearanceUpdate(): Promise<boolean>;
  handlePushMessage(): Promise<boolean>;
  sendTokenToIntercom(token: string): Promise<boolean>;
  setLogLevel(logLevel: string): Promise<boolean>;
  setThemeMode(themeMode: string): Promise<boolean>;
  setUserJwt(jwt: string): Promise<boolean>;
  setAuthTokens(authTokens: Object): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('IntercomModule');
