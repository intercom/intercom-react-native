import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Alert,
  AppState,
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Intercom, {
  IntercomEvents,
  Space,
  UserAttributes,
  Visibility,
} from '@intercom/intercom-react-native';
import Button from './Button';
import Input from './Input';
// import type { UserAttributes } from '../../lib/typescript';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTK_KEY = 'auth';

const COLLECTIONS: string[] = []; //Provide help center collections ids
// To change, replace values in .env
const CAROUSEL_ID = Config.CAROUSEL_ID;
const SURVEY_ID = Config.SURVEY_ID;
const EVENT_NAME = Config.EVENT_NAME;
const ARTICLE_ID = Config.ARTICLE_ID;
const USER_NAME = Config.USER_NAME;
const COLLECTION_ID = Config.COLLECTION_ID;
const SEARCH_TERM = Config.SEARCH_TERM;
const TOKEN = Platform.select({
  ios: 'RN-IOS-TOKEN',
  default: 'RN-ANDROID-TOKEN',
});

export default function App() {
  const [count, setCount] = useState<number>(0);
  const [loggedUser, setLoggedUser] = useState<boolean>(false);
  const [bottomPadding, setBottomPadding] = useState<number>(0);
  const [inAppMessageVisibility, setInAppMessageVisibility] =
    useState<boolean>(true);
  const [launcherVisibility, setLauncherVisibility] = useState<boolean>(false);
  const [user, setUser] = useState<UserAttributes>({ email: '' });

  const [articleId, setArticleId] = useState<string | undefined>(ARTICLE_ID);
  const [carouselId, setCarouselId] = useState<string | undefined>(CAROUSEL_ID);
  const [surveyId, setSurveyId] = useState<string | undefined>(SURVEY_ID);
  const [eventName, setEventName] = useState<string | undefined>(EVENT_NAME);
  const [collectionId, setCollectionId] = useState<string | undefined>(
    COLLECTION_ID
  );
  const [searchTerm, setSearchTerm] = useState<string | undefined>(SEARCH_TERM);
  const [userName, setUserName] = useState<string | undefined>(USER_NAME);

  const showErrorAlert = (e: Error) => {
    Alert.alert('ERROR', JSON.stringify(e));
  };

  const showResponseAlert = (obj: any) => {
    Alert.alert('RESPONSE', JSON.stringify(obj));
  };

  const showEmptyAlertMessage = (field: string) => {
    Alert.alert(field, `Please provide ${field}`);
  };

  useEffect(() => {
    /**
     * Restore user login status
     */
    AsyncStorage.getItem(AUTK_KEY).then((it) => {
      it === 'true' && setLoggedUser(true);
      if (it && it !== 'true') {
        setUser((u) => ({ ...u, email: it }));
      }
    });

    /**
     * Handle PushNotification
     */
    const appChangeListener = AppState.addEventListener(
      'change',
      (nextAppState) =>
        nextAppState === 'active' && Intercom.handlePushMessage()
    );

    /**
     * Handle Push Notification deep links
     */
    const urlListener = Linking.addEventListener('url', (event) => {
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
      (response) => {
        setCount(response.count as number);
      }
    );

    return () => {
      countListener.remove();

      // @ts-ignore - type definitions haven't been updated to 0.65 yet
      urlListener.remove(); // <- for RN 0.65+
      // Linking.removeEventListener('url', () => {}); <- for RN < 0.65

      // @ts-ignore - type definitions haven't been updated to 0.65 yet
      appChangeListener.remove(); // <- for RN 0.65+
      //AppState.removeEventListener('change', () => {}); <- for RN < 0.65
    };
  }, []);

  return (
    <View style={styles.container} accessibilityLabel="app-root">
      <StatusBar translucent={true} />
      <View style={[styles.row, styles.alignCenter, styles.header]}>
        <Image source={require('../assets/intercom.png')} style={styles.logo} />
        <Text style={styles.title}>Intercom Example App</Text>
      </View>
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
        <Text
          style={styles.text}
          accessibilityLabel={loggedUser ? 'authenticated' : 'unauthenticated'}
        >
          Is logged in:
          <Text style={styles.boldText}>{loggedUser ? 'YES' : 'NO'}</Text>
        </Text>
      </View>
      <ScrollView>
        <Button
          accessibilityLabel="login-unidentified"
          disabled={loggedUser}
          title="Login unidentified User"
          onPress={() => {
            Intercom.loginUnidentifiedUser()
            .then(() => {
              console.log("logged in")
              setLoggedUser(true);
              AsyncStorage.setItem(AUTK_KEY, 'true');
            })
            .catch((e) => {
              showErrorAlert(e);
              console.error(e);
            });
          }}
        />
        <Input
          title="Email"
          accessibilityLabel="user-email"
          value={user.email}
          onChangeText={(val) => {
            setUser((prev) => ({ ...prev, email: val }));
          }}
          keyboardType="email-address"
          placeholder="Provide user email"
          editable={!loggedUser}
        />
        <Button
          accessibilityLabel="login-identified"
          disabled={loggedUser || user.email === ''}
          title="Login identified User"
          onPress={() => {
            if (user.email?.includes('@')) {
              Intercom.loginUserWithUserAttributes(user).then(() => {
                AsyncStorage.setItem(AUTK_KEY, user.email ?? '');
                setLoggedUser(true);
              })
              .catch((e) => {
                showErrorAlert(e);
                console.error(e);
              });
            } else {
              showEmptyAlertMessage('Email');
            }
          }}
        />
        <Button
          accessibilityLabel="display-messenger"
          disabled={!loggedUser}
          title="Present Intercom"
          onPress={() => {
            Intercom.presentIntercom();
          }}
        />
        <Input
          title="Article Id"
          accessibilityLabel="article-id"
          value={articleId}
          onChangeText={(val) => {
            setArticleId(val);
          }}
          placeholder="Article Id"
        />
        <Button
          accessibilityLabel="display-article"
          disabled={!loggedUser}
          title="Display Article"
          onPress={() => {
            if (articleId) {
              Intercom.displayArticle(articleId);
            } else {
              showEmptyAlertMessage('Article id');
            }
          }}
        />
        <Button
          accessibilityLabel="display-message-composer"
          disabled={!loggedUser}
          title="Present Message Composer"
          onPress={() => {
            Intercom.presentMessageComposer();
          }}
        />
        <Button
          accessibilityLabel="display-help-center"
          disabled={!loggedUser}
          title="Present Help Center"
          onPress={() => {
            Intercom.presentIntercomSpace(Space.helpCenter);
          }}
        />
        <Button
          accessibilityLabel="display-help-center"
          disabled={!loggedUser}
          title="Present Messages"
          onPress={() => {
            Intercom.displayMessageComposer("")
            Intercom.presentIntercomSpace(Space.messages);
          }}
        />
        <Button
          accessibilityLabel="display-help-center-collections"
          disabled={!loggedUser}
          title={'Display Help Center Collections'}
          onPress={() => {
            Intercom.displayHelpCenterCollections(COLLECTIONS);
          }}
        />
        <Button
          accessibilityLabel="fetch-help-center-collections"
          disabled={!loggedUser}
          title="Fetch Help Center Collections"
          onPress={() => {
            Intercom.fetchHelpCenterCollections()
              .then((items) => {
                console.log(items);
                showResponseAlert(items);
              })
              .catch((e) => {
                showErrorAlert(e);
                console.error(e);
              });
          }}
        />
        <Input
          title="Help Center Collection Id"
          accessibilityLabel="search-term"
          value={collectionId}
          onChangeText={(val) => {
            setCollectionId(val);
          }}
          placeholder="Help Center Collection Id"
        />
        <Button
          accessibilityLabel="fetch-help-center-collection"
          disabled={!loggedUser}
          title="Fetch Help Center Collection"
          onPress={() => {
            if (collectionId) {
              Intercom.fetchHelpCenterCollection(collectionId)
                .then((item) => {
                  console.log(item);
                  showResponseAlert(item);
                })
                .catch((e) => {
                  showErrorAlert(e);
                  console.error(e);
                });
            } else {
              showEmptyAlertMessage('Collection id');
            }
          }}
        />
        <Input
          title="Search term"
          accessibilityLabel="search-term"
          value={searchTerm}
          onChangeText={(val) => {
            setSearchTerm(val);
          }}
          placeholder="Search term"
        />
        <Button
          accessibilityLabel="search-help-center"
          disabled={!loggedUser}
          title="Search Help Center"
          onPress={() => {
            if (searchTerm) {
              
              Intercom.searchHelpCenter(searchTerm)
                .then((item) => {
                  console.log(item);
                  showResponseAlert(item);
                })
                .catch((e) => {
                  showErrorAlert(e);
                  console.error(e);
                });
            } else {
              showEmptyAlertMessage('Search Term');
            }
          }}
        />
        <Input
          title="Carousel Id"
          accessibilityLabel="carousel-id"
          value={carouselId}
          onChangeText={(val) => {
            setCarouselId(val);
          }}
          placeholder="Carousel Id"
        />
        <Button
          accessibilityLabel="display-carousel"
          disabled={!loggedUser}
          title={'Display Carousel'}
          onPress={() => {
            if (carouselId) {
              Intercom.displayCarousel(carouselId);
            } else {
              showEmptyAlertMessage('Carousel Id');
            }
          }}
        />
        <Input
          title="Survey Id"
          accessibilityLabel="survey-id"
          value={surveyId}
          onChangeText={(val) => {
            setSurveyId(val);
          }}
          placeholder="Survey Id"
        />
        <Button
          accessibilityLabel="display-survey"
          disabled={!loggedUser}
          title={'Display Survey'}
          onPress={() => {
            if (surveyId) {
              Intercom.displaySurvey(surveyId);
            } else {
              showEmptyAlertMessage('Survey Id');
            }
          }}
        />
        <Button
          accessibilityLabel="get-unreads"
          disabled={!loggedUser}
          title="Get Unread Conversation Count"
          onPress={() => {
            Intercom.getUnreadConversationCount().then((response) =>
              Alert.alert('Unread Conversation count is', response.toString())
            );
          }}
        />
        <Button
          accessibilityLabel="toggle-message-visibility"
          title="Toggle In App Message Visibility"
          onPress={() => {
            Intercom.setInAppMessageVisibility(
              inAppMessageVisibility ? Visibility.GONE : Visibility.VISIBLE
            ).then(() => setInAppMessageVisibility((v) => !v));
          }}
        />
        <Button
          title="Toggle In Launcher Visibility"
          accessibilityLabel="toggle-launcher-visibility"
          onPress={() => {
            Intercom.setLauncherVisibility(
              launcherVisibility ? Visibility.GONE : Visibility.VISIBLE
            ).then(() => setLauncherVisibility((v) => !v));
          }}
        />
        <Button
          accessibilityLabel="set-bottom-padding"
          title="Set Bottom Padding"
          onPress={() => {
            const paddingToSet =
              bottomPadding + 10 > 300 ? 0 : bottomPadding + 10;
            Intercom.setBottomPadding(paddingToSet).then(() =>
              setBottomPadding(paddingToSet)
            );
          }}
        />
        <Input
          title="Event name"
          accessibilityLabel="event-name"
          value={eventName}
          onChangeText={(val) => {
            setEventName(val);
          }}
          placeholder="Event name"
        />
        <Button
          accessibilityLabel="log-event"
          disabled={!loggedUser}
          title="Log Event"
          onPress={() => {
            if (eventName) {
              Intercom.logEvent(eventName);
            } else {
              showEmptyAlertMessage('Event Name');
            }
          }}
        />
        <Button
          accessibilityLabel="send-token"
          disabled={!loggedUser}
          title="Send Token"
          onPress={() => {
            Intercom.sendTokenToIntercom(TOKEN);
          }}
        />

        <Input
          title="User Name"
          accessibilityLabel="user-name"
          value={userName}
          onChangeText={(val) => {
            setUserName(val);
          }}
          placeholder="User Name"
        />
        <Button
          accessibilityLabel="update-user"
          disabled={!loggedUser}
          title="Update user's name"
          onPress={() => {
            if (userName) {
              Intercom.updateUser({ name: userName });
            } else {
              showEmptyAlertMessage('User Name');
            }
          }}
        />
        <Button
          accessibilityLabel="logout"
          disabled={!loggedUser}
          title="Logout user"
          onPress={() => {
            Intercom.logout().then(() => {
              AsyncStorage.removeItem(AUTK_KEY);
              setLoggedUser(false);
            });
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 8,
    paddingTop:
      Platform.OS === 'ios'
        ? (StatusBar.currentHeight ?? 0) + 35
        : (StatusBar.currentHeight ?? 0) + 8,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  text: { marginVertical: 4, fontSize: 7 },
  textCenter: { textAlign: 'center' },
  boldText: { fontWeight: 'bold', color: '#242d38' },
  textContainer: { justifyContent: 'center', paddingVertical: 8 },
  row: { flexDirection: 'row' },
  visibilityContainer: { flex: 1, padding: 4 },
  logo: {
    width: '10%',
    height: undefined,
    aspectRatio: 1,
  },
  alignCenter: { alignItems: 'center' },
  title: { fontWeight: 'bold', fontSize: 17, marginLeft: 8 },
  header: { marginBottom: 8 },
});
