import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  sendTokenToIntercom(token: string): Promise<boolean>;
  loginUnidentifiedUser(): Promise<boolean>;
  loginUserWithUserAttributes(userAttributes: Object): Promise<boolean>;
  logout(): Promise<boolean>;
  updateUser(userAttributes: Object): Promise<boolean>;
  isUserLoggedIn(): Promise<boolean>;
  fetchLoggedInUserAttributes(): Promise<Object>;
  setUserHash(userHash: string): Promise<boolean>;
  logEvent(eventName: string, metaData?: Object): Promise<boolean>;
  presentIntercom(): Promise<boolean>;
  presentMessageComposer(initialMessage: string): Promise<boolean>;
  presentIntercomSpace(space: string): Promise<boolean>;
  presentContent(content: Object): Promise<boolean>;
  fetchHelpCenterCollections(): Promise<Array<Object>>;
  fetchHelpCenterCollection(collectionId: string): Promise<Object>;
  searchHelpCenter(searchTerm: string): Promise<Array<Object>>;
  hideIntercom(): Promise<boolean>;
  setBottomPadding(bottomPadding: number): Promise<boolean>;
  setLauncherVisibility(visibility: string): Promise<boolean>;
  setUserJwt(jwt: string): Promise<boolean>;
  setInAppMessageVisibility(visibility: string): Promise<boolean>;
  getUnreadConversationCount(): Promise<number>;
  setLogLevel(level: string): Promise<boolean>;
  setNeedsStatusBarAppearanceUpdate(): Promise<boolean>;
}

export default TurboModuleRegistry.get<Spec>('IntercomModule');
