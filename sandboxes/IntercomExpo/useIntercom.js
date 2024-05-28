import Intercom, {
  Space,
  IntercomContent,
} from '@intercom/intercom-react-native';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { storage } from './App.utils';

export function useIntercom() {
  const [userIdentifier, setUserIdentifier] = useMMKVStorage('id', storage, '');

  const [isLoggedIn, setIsLoggedIn] = useMMKVStorage('login', storage, false);

  const handleLoginIdentifiedUser = async () => {
    setIsLoggedIn(true);
    await Intercom.loginUserWithUserAttributes({
      email: userIdentifier,
    });
  };

  const handleLoginUnidentifiedUser = async () => {
    setIsLoggedIn(true);
    await Intercom.loginUnidentifiedUser();
  };

  const handleLogout = async () => {
    await Intercom.logout();
    setIsLoggedIn(false);
  };

  const openMessages = () => {
    Intercom.presentSpace(Space.messages);
  };

  const openHelpCenter = () => {
    Intercom.presentSpace(Space.helpCenter);
  };

  const openTicketsSpace = () => {
    Intercom.presentSpace(Space.tickets);
  };

  const openMessenger = () => {
    Intercom.present();
  };

  const openHelpCenterCollection = (collectionIds) => {
    let helpCenterCollectionsContent =
      IntercomContent.helpCenterCollectionsWithIds(collectionIds);
    Intercom.presentContent(helpCenterCollectionsContent);
  };

  const openConversation = (conversationId) => {
    let conversationContent =
      IntercomContent.conversationWithConversationId(conversationId);
    Intercom.presentContent(conversationContent);
  };

  const openArticle = (articleId) => {
    let articleContent = IntercomContent.articleWithArticleId(articleId);
    Intercom.presentContent(articleContent);
  };

  const openCarousel = (carouselId) => {
    let carouselContent = IntercomContent.carouselWithCarouselId(carouselId);
    Intercom.presentContent(carouselContent);
  };

  const openSurvey = (surveyId) => {
    let surveyContent = IntercomContent.surveyWithSurveyId(surveyId);
    Intercom.presentContent(surveyContent);
  };

  const toggleLauncher = (visibility) => {
    Intercom.setLauncherVisibility(visibility);
  };

  const openMessageComposer = () => {
    Intercom.presentMessageComposer('initial message');
  };

  return {
    setUserIdentifier,
    isLoggedIn,
    handleLoginIdentifiedUser,
    handleLoginUnidentifiedUser,
    handleLogout,
    openMessages,
    openHelpCenter,
    openTicketsSpace,
    openMessenger,
    openHelpCenterCollection,
    openConversation,
    openArticle,
    openCarousel,
    openSurvey,
    toggleLauncher,
    openMessageComposer,
  };
}
