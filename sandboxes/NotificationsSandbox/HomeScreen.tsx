import React, {useEffect} from 'react';
import {AppState, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Intercom, {Visibility} from '@intercom/intercom-react-native';
import {requestNotifications} from 'react-native-permissions';
import {useIntercom} from './useIntercom.tsx';
import {styles} from './App.styles.ts';

export function HomeScreen(): React.JSX.Element {
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      nextStatus => nextStatus === 'active' && Intercom.handlePushMessage(),
    );
    return subscription.remove;
  }, []);

  useEffect(() => {
    (async () => {
      // Request permissions
      await requestNotifications([
        'alert',
        'sound',
        'criticalAlert',
        'badge',
        'provisional',
        'carPlay',
        'providesAppSettings',
      ]);

      await Intercom.setLauncherVisibility(Visibility.VISIBLE);
    })();
  }, []);

  const {
    handleLoginIdentifiedUser,
    handleLoginUnidentifiedUser,
    handleLogout,
    setUserIdentifier,
    isLoggedIn,
  } = useIntercom();

  return (
    <View style={styles.screenWrapper}>
      <Text style={styles.title}>Push Notifications Sandbox</Text>
      <View style={styles.wrapper}>
        {!isLoggedIn ? (
          <>
            <TextInput style={styles.input} onChangeText={setUserIdentifier} />
            <TouchableOpacity
              style={styles.button}
              onPress={handleLoginIdentifiedUser}>
              <Text style={styles.buttonText}>Login Identified User</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.button}
              onPress={handleLoginUnidentifiedUser}>
              <Text style={styles.buttonText}>Login Unidentified User</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
