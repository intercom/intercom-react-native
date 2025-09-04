import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  NativeEventEmitter,
  NativeModules,
  TurboModuleRegistry,
} from 'react-native';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import Intercom, {
  IntercomEvents,
  ThemeMode,
  Visibility,
} from '@intercom/intercom-react-native';
import { storage } from '../utils/storage';

export function useIntercom() {
  const [count, setCount] = useState<number>(0);
  const [loggedUser, setLoggedUser] = useMMKVStorage<boolean>(
    'isLoggedIn',
    storage,
    false
  );
  const [email, setEmail] = useMMKVStorage<string>('userEmail', storage, '');
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(ThemeMode.SYSTEM);
  const [architectureType, setArchitectureType] =
    useState<string>('Detecting...');
  const [bottomPadding, setBottomPadding] = useState<number>(0);
  const [launcherVisibility, setLauncherVisibility] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = useCallback((email: string | undefined) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }, []);

  const handleError = useCallback((e: Error) => {
    setError(e.message);
    Alert.alert('ERROR', JSON.stringify(e));
  }, []);

  const loginUnidentifiedUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await Intercom.loginUnidentifiedUser();
      setLoggedUser(true);
      Alert.alert('Success', 'Logged in as unidentified user');
    } catch (e) {
      handleError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [setLoggedUser, handleError]);

  const loginWithEmail = useCallback(
    async (email: string) => {
      if (!validateEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        await Intercom.loginUserWithUserAttributes({ email });
        setLoggedUser(true);
        Alert.alert('Success', 'Logged in with email');
      } catch (e) {
        handleError(e as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [setLoggedUser, validateEmail, handleError]
  );

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await Intercom.logout();
      setLoggedUser(false);
      setEmail('');
      Alert.alert('Success', 'Logged out');
    } catch (e) {
      handleError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [setLoggedUser, setEmail, handleError]);

  const setTheme = useCallback(
    async (theme: ThemeMode) => {
      try {
        await Intercom.setThemeMode(theme);
        setCurrentTheme(theme);
      } catch (e) {
        handleError(e as Error);
      }
    },
    [handleError]
  );

  const toggleLauncherVisibility = useCallback(async () => {
    try {
      const newVisibility = launcherVisibility
        ? Visibility.GONE
        : Visibility.VISIBLE;
      await Intercom.setLauncherVisibility(newVisibility);
      setLauncherVisibility(!launcherVisibility);
    } catch (e) {
      handleError(e as Error);
    }
  }, [launcherVisibility, handleError]);

  const updateBottomPadding = useCallback(async () => {
    try {
      const newPadding = bottomPadding + 20 > 100 ? 0 : bottomPadding + 20;
      await Intercom.setBottomPadding(newPadding);
      setBottomPadding(newPadding);
    } catch (e) {
      handleError(e as Error);
    }
  }, [bottomPadding, handleError]);

  useEffect(() => {
    // Architecture detection
    try {
      const hasIntercomTurboModule =
        TurboModuleRegistry.get('IntercomModule') != null;
      setArchitectureType(
        hasIntercomTurboModule
          ? 'New Architecture (TurboModules)'
          : 'Old Architecture (Bridge)'
      );
    } catch {
      setArchitectureType('Old Architecture (Bridge)');
    }

    const cleanupIntercomEventListeners = Intercom.bootstrapEventListeners();

    const eventEmitter = new NativeEventEmitter(
      NativeModules.IntercomEventEmitter
    );

    const unreadCountEventName = IntercomEvents.IntercomUnreadCountDidChange;
    const countListener = eventEmitter.addListener(
      unreadCountEventName,
      (response) => {
        setCount(response.count as number);
      }
    );

    return () => {
      countListener.remove();
      cleanupIntercomEventListeners();
    };
  }, []);

  return {
    // State
    count,
    loggedUser,
    email,
    setEmail,
    currentTheme,
    architectureType,
    bottomPadding,
    launcherVisibility,
    isLoading,
    error,

    // Actions
    loginUnidentifiedUser,
    loginWithEmail,
    logout,
    setTheme,
    toggleLauncherVisibility,
    updateBottomPadding,
    validateEmail,
  };
}
