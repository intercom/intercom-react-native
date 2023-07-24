import Config from 'react-native-config';
import { Platform } from 'react-native';

export const CAROUSEL_ID = Config.CAROUSEL_ID;
export const SURVEY_ID = Config.SURVEY_ID;
export const EVENT_NAME = Config.EVENT_NAME;
export const ARTICLE_ID = Config.ARTICLE_ID;
export const USER_NAME = Config.USER_NAME;
export const COLLECTION_ID = Config.COLLECTION_ID;
export const SEARCH_TERM = Config.SEARCH_TERM;
export const TOKEN = Platform.select({
  ios: 'RN-IOS-TOKEN',
  default: 'RN-ANDROID-TOKEN',
});
