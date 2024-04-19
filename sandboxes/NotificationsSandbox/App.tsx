import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {HomeScreen} from './HomeScreen.tsx';
import {SettingsScreen} from './SettingsScreen.tsx';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer
        // Handling deep linking
        linking={{
          prefixes: [
            'app://',
            'app.fake',
            'https://app.fake',
            'http://app.fake',
          ],
          config: {
            screens: {
              Settings: 'settings',
            },
          },
        }}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
