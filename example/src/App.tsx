import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Alert,
  AppState,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Intercom, { IntercomEvents, Visibility } from 'intercom-react-native';
import Button from './Button';
import type { Registration } from '../../lib/typescript';

const CAROUSEL_ID = ''; //Provide carouselId
const EVENT_NAME = ''; //Provide eventName
const ARTICLE_ID = ''; //Provide articleId
const COLLECTIONS: string[] = []; //Provide help center collections ids

export default function App() {
  const [count, setCount] = useState<number>(0);
  const [loggedUser, setLoggedUser] = useState<boolean>(false);
  const [bottomPadding, setBottomPadding] = useState<number>(0);
  const [inAppMessageVisibility, setInAppMessageVisibility] =
    useState<boolean>(true);
  const [launcherVisibility, setLauncherVisibility] = useState<boolean>(true);
  const [user, setUser] = useState<Registration>({ email: '' });

  useEffect(() => {
    /**
     * Handle PushNotification
     */
    AppState.addEventListener(
      'change',
      (nextAppState) =>
        nextAppState === 'active' && Intercom.handlePushMessage()
    );

    /**
     * Handle Push Notification deep links
     */
    Linking.addEventListener('url', (event) => {
      if (event) {
        Alert.alert(event.url);
      }
    });

    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          Alert.alert(url);
        }
      })
      .catch((e) => console.log(e));

    /**
     * Handle message count changed
     */
    const countListener = Intercom.addEventListener(
      IntercomEvents.IntercomUnreadCountDidChange,
      ({ count }) => {
        setCount(count as number);
      }
    );

    return () => {
      countListener.remove();
      Linking.removeEventListener('url', () => {});
      AppState.removeEventListener('change', () => {});
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={styles.row}>
          <View style={styles.visibilityContainer}>
            <Text style={[styles.text, styles.textCenter]}>
              In App Message Visibility:{' \n'}
              <Text style={styles.boldText}>
                {inAppMessageVisibility ? Visibility.VISIBLE : Visibility.GONE}
              </Text>
            </Text>
          </View>
          <View style={styles.visibilityContainer}>
            <Text style={[styles.text, styles.textCenter]}>
              Launcher Visibility:{' \n'}
              <Text style={styles.boldText}>
                {launcherVisibility ? Visibility.VISIBLE : Visibility.GONE}
              </Text>
            </Text>
          </View>
        </View>
        <Text style={styles.text}>
          Bottom padding: <Text style={styles.boldText}>{bottomPadding}</Text>
        </Text>
        <Text style={styles.text}>
          Unread messages count: <Text style={styles.boldText}>{count}</Text>
        </Text>
      </View>
      <ScrollView>
        <Button
          disabled={loggedUser}
          title={'Login unidentified User'}
          onPress={() => {
            Intercom.registerUnidentifiedUser().then(() => setLoggedUser(true));
          }}
        />
        <TextInput
          style={styles.input}
          value={user.email}
          onChangeText={(val) => {
            setUser((prev) => ({ ...prev, email: val }));
          }}
          keyboardType={'email-address'}
          placeholder={'Provide user email'}
          editable={!loggedUser}
        />
        <Button
          disabled={loggedUser && user.email !== ''}
          title={'Login identified User'}
          onPress={() => {
            if (user.email?.includes('@')) {
              Intercom.registerIdentifiedUser(user).then(() =>
                setLoggedUser(true)
              );
            } else {
              Alert.alert(
                'Not email',
                'Provide correct email: example@intercom.io'
              );
            }
          }}
        />
        <Button
          disabled={!loggedUser}
          title={'Display Messenger'}
          onPress={() => {
            Intercom.displayMessenger();
          }}
        />
        <Button
          disabled={!loggedUser}
          title={'Display Article'}
          onPress={() => {
            Intercom.displayArticle(ARTICLE_ID);
          }}
        />
        <Button
          disabled={!loggedUser}
          title={'Display Message Composer'}
          onPress={() => {
            Intercom.displayMessageComposer();
          }}
        />
        <Button
          disabled={!loggedUser}
          title={'Display Help Center'}
          onPress={() => {
            Intercom.displayHelpCenter();
          }}
        />
        <Button
          disabled={!loggedUser}
          title={'Display Help Center Collections'}
          onPress={() => {
            Intercom.displayHelpCenterCollections(COLLECTIONS);
          }}
        />
        <Button
          disabled={!loggedUser}
          title={'Display Carousel'}
          onPress={() => {
            Intercom.displayCarousel(CAROUSEL_ID);
          }}
        />
        <Button
          disabled={!loggedUser}
          title={'Get Unread Conversation Count'}
          onPress={() => {
            Intercom.getUnreadConversationCount().then((count) =>
              Alert.alert('Unread Conversation count is', count.toString())
            );
          }}
        />
        <Button
          title={'Toggle In App Message Visibility'}
          onPress={() => {
            Intercom.setInAppMessageVisibility(
              inAppMessageVisibility ? Visibility.GONE : Visibility.VISIBLE
            ).then(() => setInAppMessageVisibility((v) => !v));
          }}
        />
        <Button
          title={'Toggle In Launcher Visibility'}
          onPress={() => {
            Intercom.setLauncherVisibility(
              launcherVisibility ? Visibility.GONE : Visibility.VISIBLE
            ).then(() => setLauncherVisibility((v) => !v));
          }}
        />
        <Button
          title={'Set Bottom Padding'}
          onPress={() => {
            const paddingToSet =
              bottomPadding + 10 > 300 ? 0 : bottomPadding + 10;
            Intercom.setBottomPadding(paddingToSet).then(() =>
              setBottomPadding(paddingToSet)
            );
          }}
        />
        <Button
          disabled={!loggedUser}
          title={'Log Event'}
          onPress={() => {
            Intercom.logEvent(EVENT_NAME);
          }}
        />
        <Button
          disabled={!loggedUser}
          title={'Logout user'}
          onPress={() => {
            Intercom.logout().then(() => setLoggedUser(false));
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    paddingTop:
      Platform.OS === 'ios'
        ? (StatusBar.currentHeight ?? 0) + 24
        : StatusBar.currentHeight ?? 0,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  text: { marginVertical: 6, fontSize: 18 },
  textCenter: { textAlign: 'center' },
  boldText: { fontWeight: 'bold', color: '#242d38' },
  textContainer: { justifyContent: 'center', paddingVertical: 16 },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  row: { flexDirection: 'row' },
  visibilityContainer: { flex: 1, padding: 4 },
});
