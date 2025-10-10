import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, Text } from 'react-native';
import * as Notifications from 'expo-notifications';

import { useIntercom } from '../../hooks/useIntercom';
import { useNotifications } from '../../hooks/useNotifications';
import { INTERCOM_CONFIG } from '../../config/intercom.config';

import Header from '../../components/Header';
import Intercom from '@intercom/intercom-react-native';
import AuthenticationSection from '../../components/AuthenticationSection';
import MessagingSection from '../../components/MessagingSection';
import ContentSection from '../../components/ContentSection';
import SettingsSection from '../../components/SettingsSection';
import UtilitiesSection from '../../components/UtilitiesSection';
import NotificationsSection from '../../components/NotificationsSection';
import ArchitectureInfo from '../../components/ArchitectureInfo';
import ErrorBoundary from '../../components/ErrorBoundary';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const intercom = useIntercom();
  const notifications = useNotifications();
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeIntercom() {
      try {
        console.log('Initializing Intercom...');
        if (!INTERCOM_CONFIG.apiKey || !INTERCOM_CONFIG.appId) {
          console.error('Intercom API key and app ID are required');
          return;
        }
        if (!isInitialized) {
          await Intercom.initialize(
            INTERCOM_CONFIG.apiKey,
            INTERCOM_CONFIG.appId
          );
          setIsInitialized(true);
          console.log('Intercom initialized successfully');
        }
      } catch (error) {
        console.error('Failed to initialize Intercom:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown error');
      }
    }

    initializeIntercom();
  }, [isInitialized]);

  return (
    <ErrorBoundary>
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

        <Header
          architectureType={intercom.architectureType}
          loggedUser={intercom.loggedUser}
          count={intercom.count}
        />

        <ScrollView className="flex-1 px-6 py-4">
          <View className="mb-4 p-3 rounded-lg bg-gray-100">
            <Text className="text-sm font-semibold text-gray-700">
              Intercom Status:{' '}
              {initError && (
                <Text className="text-red-600">Failed: {initError}</Text>
              )}
              {isInitialized ? (
                <Text className="text-green-600">Initialized</Text>
              ) : (
                <Text className="text-yellow-600">Initializing...</Text>
              )}
            </Text>
          </View>

          <AuthenticationSection
            loggedUser={intercom.loggedUser}
            email={intercom.email}
            setEmail={intercom.setEmail}
            loginUnidentifiedUser={intercom.loginUnidentifiedUser}
            loginWithEmail={intercom.loginWithEmail}
            logout={intercom.logout}
            isLoading={intercom.isLoading}
          />

          <MessagingSection loggedUser={intercom.loggedUser} />

          <ContentSection loggedUser={intercom.loggedUser} />

          <SettingsSection
            currentTheme={intercom.currentTheme}
            setTheme={intercom.setTheme}
            launcherVisibility={intercom.launcherVisibility}
            toggleLauncherVisibility={intercom.toggleLauncherVisibility}
            bottomPadding={intercom.bottomPadding}
            updateBottomPadding={intercom.updateBottomPadding}
          />

          <UtilitiesSection
            loggedUser={intercom.loggedUser}
            architectureType={intercom.architectureType}
          />

          <NotificationsSection
            loggedUser={intercom.loggedUser}
            registerForPushNotificationsAsync={
              notifications.registerForPushNotificationsAsync
            }
            sendTestNotification={notifications.sendTestNotification}
            isLoading={notifications.isLoading}
          />

          <ArchitectureInfo architectureType={intercom.architectureType} />
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
