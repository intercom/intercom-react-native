import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Alert,
  AppState,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Intercom, { Visibility } from 'intercom-react-native';
import Button from './Button';

const CAROUSEL_ID = ''; //Provide carouselId
const EVENT_NAME = ''; //Provide eventName

export default function App() {
  const [count, setCount] = useState<number>(0);
  const [loggedUser, setLoggedUser] = useState<boolean>(false);
  const [bottomPadding, setBottomPadding] = useState<number>(0);
  const [inAppMessageVisibility, setInAppMessageVisibility] =
    useState<boolean>(true);

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
    const event = Intercom.addOnMessageCountChangeListener(({ count }) => {
      setCount(count);
    });

    return () => {
      Linking.removeEventListener('url', () => {});
      AppState.removeEventListener('change', () => {});
      event();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          In App Message Visibility:{' '}
          <Text style={styles.boldText}>
            {inAppMessageVisibility ? Visibility.GONE : Visibility.VISIBLE}
          </Text>
        </Text>
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
          title={'Login User'}
          onPress={() => {
            Intercom.registerUnidentifiedUser().then(() => setLoggedUser(true));
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
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  text: { marginVertical: 6, fontSize: 18 },
  boldText: { fontWeight: 'bold', color: '#242d38' },
  textContainer: { justifyContent: 'center', paddingVertical: 16 },
});
