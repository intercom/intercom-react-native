import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export function useNotifications() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegistrationError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    Alert.alert('Error', errorMessage);
    throw new Error(errorMessage);
  }, []);

  const registerForPushNotificationsAsync = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        handleRegistrationError('Permission not granted to get push token for push notification!');
        return;
      }

      await Notifications.unregisterForNotificationsAsync();
      const pushTokenString = await Notifications.getDevicePushTokenAsync();
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    } finally {
      setIsLoading(false);
    }
  }, [handleRegistrationError]);

  const sendTestNotification = useCallback(async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Intercom Test',
          body: 'This is a test notification from Intercom demo!',
          data: { source: 'intercom-demo' },
        },
        trigger: {
          seconds: 1,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        },
      });
    } catch (e) {
      setError((e as Error).message);
      Alert.alert('Error', 'Failed to send test notification');
    }
  }, []);

  useEffect(() => {
    // Initialize notifications
    registerForPushNotificationsAsync();

    // Notification listeners
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
      }
    );

    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification response:', response);
      }
    );

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [registerForPushNotificationsAsync]);

  return {
    isLoading,
    error,
    registerForPushNotificationsAsync,
    sendTestNotification,
  };
}