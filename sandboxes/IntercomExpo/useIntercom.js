import Intercom, { Space } from '@intercom/intercom-react-native';
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

  return {
    setUserIdentifier,
    isLoggedIn,
    handleLoginIdentifiedUser,
    handleLoginUnidentifiedUser,
    handleLogout,
    openMessages,
    openHelpCenter,
    openTicketsSpace,
  };
}
