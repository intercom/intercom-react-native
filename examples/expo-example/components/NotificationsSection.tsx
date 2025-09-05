import React from 'react';
import { Alert } from 'react-native';
import Intercom from '@intercom/intercom-react-native';
import Button from './ui/Button';
import Section from './ui/Section';

interface NotificationsSectionProps {
  loggedUser: boolean;
  registerForPushNotificationsAsync: () => Promise<any>;
  sendTestNotification: () => Promise<void>;
  isLoading: boolean;
}

export default function NotificationsSection({
  loggedUser,
  registerForPushNotificationsAsync,
  sendTestNotification,
  isLoading,
}: NotificationsSectionProps) {
  const handleRequestPermissions = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        Alert.alert(
          'Success',
          `Push token: ${token.data.toString().substring(0, 20)}...`
        );
      }
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  const handleSendToken = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        Intercom.sendTokenToIntercom(token.data.toString());
        Alert.alert('Success', 'Token sent');
      } else {
        Alert.alert('Error', 'No token found');
      }
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  return (
    <Section title="🔔 Push Notifications">
      <Button
        title="Request Push Permissions"
        onPress={handleRequestPermissions}
        variant="success"
        disabled={isLoading}
      />

      <Button
        title="Send Token"
        onPress={handleSendToken}
        variant="success"
        disabled={!loggedUser || isLoading}
      />

      <Button
        title="Send Test Notification"
        onPress={sendTestNotification}
        variant="success"
        disabled={isLoading}
      />
    </Section>
  );
}
