import Intercom from '@intercom/intercom-react-native';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {storage} from './App.utils';

export function useIntercom() {
  const [userIdentifier, setUserIdentifier] = useMMKVStorage<string>(
    'id',
    storage,
    '',
  );
  const [isLoggedIn, setIsLoggedIn] = useMMKVStorage<boolean>(
    'login',
    storage,
    false,
  );

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

  return {
    setUserIdentifier,
    isLoggedIn,
    handleLoginIdentifiedUser,
    handleLoginUnidentifiedUser,
    handleLogout,
  };
}
