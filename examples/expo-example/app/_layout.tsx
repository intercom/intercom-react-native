import '../global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Alert, AppState, Linking } from 'react-native';
import 'react-native-reanimated';

import Intercom from '@intercom/intercom-react-native';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Handle push notifications when app is active
    const subscription = AppState.addEventListener(
      'change',
      (nextStatus) => nextStatus === 'active' && Intercom.handlePushMessage()
    );

    // Handle deep links
    const urlListener = Linking.addEventListener('url', (event) => {
      if (event) {
        Alert.alert('Deep Link', event.url);
      }
    });

    return () => {
      subscription.remove();
      urlListener.remove();
    };
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
