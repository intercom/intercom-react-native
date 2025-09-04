import React from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';
import * as Notifications from 'expo-notifications';

import { useIntercom } from '../../hooks/useIntercom';
import { useNotifications } from '../../hooks/useNotifications';

import Header from '../../components/Header';
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
            registerForPushNotificationsAsync={notifications.registerForPushNotificationsAsync}
            sendTestNotification={notifications.sendTestNotification}
            isLoading={notifications.isLoading}
          />

          <ArchitectureInfo architectureType={intercom.architectureType} />
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
