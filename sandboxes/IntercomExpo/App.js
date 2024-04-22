import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  AppState,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Intercom, { Visibility } from '@intercom/intercom-react-native';
import { useIntercom } from './useIntercom';
import { styles } from './App.styles';

export default function App() {
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextStatus) => nextStatus === 'active' && Intercom.handlePushMessage()
    );
    return subscription.remove;
  }, []);

  useEffect(() => {
    (async () => {
      await Intercom.setLauncherVisibility(Visibility.VISIBLE);
    })();
  }, []);

  const {
    handleLoginIdentifiedUser,
    handleLoginUnidentifiedUser,
    handleLogout,
    setUserIdentifier,
    isLoggedIn,
    openHelpCenter,
    openMessages,
    openTicketsSpace,
  } = useIntercom();

  return (
    <View style={styles.screenWrapper}>
      <Text style={styles.title}>Push Notifications Sandbox</Text>
      <View style={styles.wrapper}>
        <>
          <TextInput
            style={styles.input}
            onChangeText={setUserIdentifier}
            placeholder="Enter email"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleLoginIdentifiedUser}
          >
            <Text style={styles.buttonText}>REGISTER IDENTIFIED</Text>
          </TouchableOpacity>
          <View style={styles.rowWrapper}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleLoginUnidentifiedUser}
            >
              <Text style={styles.buttonText}>REGISTER UNIDENTIFIED</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLoginUnidentifiedUser}
            >
              <Text style={styles.buttonText}>RESET</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rowWrapper}>
            <TouchableOpacity style={styles.button} onPress={openMessages}>
              <Text style={styles.buttonText}>OPEN MESSAGES</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={openHelpCenter}>
              <Text style={styles.buttonText}>HELP CENTER</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rowWrapper}>
            <TouchableOpacity style={styles.button} onPress={openTicketsSpace}>
              <Text style={styles.buttonText}>TICKETS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLoginUnidentifiedUser}
            >
              <Text style={styles.buttonText}>TICKET ID</Text>
            </TouchableOpacity>
          </View>
        </>
      </View>
    </View>
  );
}
