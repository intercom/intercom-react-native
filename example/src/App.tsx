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
  type UserAttributes,
  Visibility,
  IntercomContent,
} from '@intercom/intercom-react-native';

import {
  CAROUSEL_ID,
  SURVEY_ID,
  EVENT_NAME,
  ARTICLE_ID,
  USER_NAME,
  COLLECTION_ID,
  SEARCH_TERM,
  TOKEN,
  CONVERSATION_ID,
} from './constants';

import Button from './components/Button';
import Input from './components/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTK_KEY = 'auth';
const COLLECTIONS: string[] = []; //Provide help center collections ids

export default function App() {
  const [count, setCount] = useState<number>(0);
  const [loggedUser, setLoggedUser] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | undefined>(USER_NAME);
  const [bottomPadding, setBottomPadding] = useState<number>(0);
  const [inAppMessageVisibility, setInAppMessageVisibility] =
    useState<boolean>(true);
  const [launcherVisibility, setLauncherVisibility] = useState<boolean>(false);
  const [user, setUser] = useState<UserAttributes>({ email: '' });

  const [conversationId, setConversationId] = useState<string | undefined>(
    CONVERSATION_ID
  );
  const [articleId, setArticleId] = useState<string | undefined>(ARTICLE_ID);
  const [carouselId, setCarouselId] = useState<string | undefined>(CAROUSEL_ID);
  const [surveyId, setSurveyId] = useState<string | undefined>(SURVEY_ID);
  const [eventName, setEventName] = useState<string | undefined>(EVENT_NAME);
  const [collectionId, setCollectionId] = useState<string | undefined>(
    COLLECTION_ID
  );
  const [searchTerm, setSearchTerm] = useState<string | undefined>(SEARCH_TERM);

  const showErrorAlert = (e: Error) => {
    Alert.alert('ERROR', JSON.stringify(e));
  };

  const showResponseAlert = (obj: any) => {
    Alert.alert('RESPONSE', JSON.stringify(obj));
  };

  const showEmptyAlertMessage = (field: string) => {
    Alert.alert(field, `Please provide ${field}`);
  };

  const showIncorrectFieldMessage = (field: string) => {
    Alert.alert(field, `Provided ${field} is not of correct format`);
  };

  const showLoggedInStatusAlert = () => {
    Intercom.isUserLoggedIn().then((res) => {
      Alert.alert(`Logged in status: ${res ? 'Yes' : 'No'}`);
    });
  };

  const showLoggedInUserAttributes = () => {
    Intercom.fetchLoggedInUserAttributes().then((res) => {
      Alert.alert('User Attributes', JSON.stringify(res));
    });
  };

  const validateEmail = (email: string | undefined) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const resetAttributes = () => {
    setCount(0);
    Intercom.setBottomPadding(0).then(() => setBottomPadding(0));
    Intercom.setLauncherVisibility(Visibility.GONE).then(() =>
      setLauncherVisibility(false)
    );
    Intercom.setInAppMessageVisibility(Visibility.VISIBLE).then(() =>
      setInAppMessageVisibility(true)
    );
    setConversationId(CONVERSATION_ID);
    setArticleId(ARTICLE_ID);
    setCarouselId(CAROUSEL_ID);
    setSurveyId(SURVEY_ID);
    setEventName(EVENT_NAME);
    setCollectionId(COLLECTION_ID);
    setSearchTerm(SEARCH_TERM);
    setUserName(USER_NAME);
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
      <View style={styles.stickyHeaderContainer}>
        <Text
          style={styles.text}
          accessibilityLabel={loggedUser ? 'authenticated' : 'unauthenticated'}
        >
          {`Logged In: ${loggedUser ? 'Yes' : 'No'}`}
        </Text>
        <Text style={styles.text}>Unread messages count: {count}</Text>
      </View>
      <ScrollView>
        <Button
          intercom_accessibilityLabel="login-unidentified"
          intercom_disabled={loggedUser}
          intercom_title="Login as an Unidentified User"
          intercom_onPress={() => {
            Intercom.loginUnidentifiedUser()
              .then(() => {
                console.log('logged in');
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
          intercom_accessibilityLabel="login-identified"
          intercom_disabled={loggedUser || user.email === ''}
          intercom_title="Login identified User"
          intercom_onPress={() => {
            if (validateEmail(user.email)) {
              Intercom.loginUserWithUserAttributes(user)
                .then(() => {
                  AsyncStorage.setItem(AUTK_KEY, user.email ?? '');
                  setLoggedUser(true);
                })
                .catch((e) => {
                  showErrorAlert(e);
                  console.error(e);
                });
            } else {
              showIncorrectFieldMessage('Email');
            }
          }}
        />
        <Button
          intercom_accessibilityLabel="display-messenger"
          intercom_disabled={!loggedUser}
          intercom_title="Present Intercom"
          intercom_onPress={() => {
            Intercom.present();
          }}
        />
        <Button
          intercom_accessibilityLabel="display-message-composer"
          intercom_disabled={!loggedUser}
          intercom_title="Present Message Composer"
          intercom_onPress={() => {
            Intercom.presentMessageComposer('initial message');
          }}
        />
        <Button
          intercom_accessibilityLabel="display-help-center"
          intercom_disabled={!loggedUser}
          intercom_title="Present Help Center"
          intercom_onPress={() => {
            Intercom.presentSpace(Space.helpCenter);
          }}
        />
        <Button
          intercom_accessibilityLabel="display-messages"
          intercom_disabled={!loggedUser}
          intercom_title="Present Messages"
          intercom_onPress={() => {
            Intercom.presentSpace(Space.messages);
          }}
        />
        <Button
          intercom_accessibilityLabel="display-tickets"
          intercom_disabled={!loggedUser}
          intercom_title="Present Tickets"
          intercom_onPress={() => {
            Intercom.presentSpace(Space.tickets);
          }}
        />
        <Button
          intercom_accessibilityLabel="display-help-center-collections"
          intercom_disabled={!loggedUser}
          intercom_title={'Display Help Center Collections'}
          intercom_onPress={() => {
            let helpCenterCollectionsContent =
              IntercomContent.helpCenterCollectionsWithIds(COLLECTIONS);
            Intercom.presentContent(helpCenterCollectionsContent);
          }}
        />
        <Button
          intercom_accessibilityLabel="fetch-help-center-collections"
          intercom_disabled={!loggedUser}
          intercom_title="Fetch Help Center Collections"
          intercom_onPress={() => {
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
        <Button
          intercom_accessibilityLabel="show-logged-in-status"
          intercom_title="Show logged in status"
          intercom_onPress={() => {
            showLoggedInStatusAlert();
          }}
        />
        <Button
          intercom_accessibilityLabel="show-logged-in-attributes"
          // intercom_disabled={!loggedUser}
          intercom_title="Show logged in attributes"
          intercom_onPress={() => {
            showLoggedInUserAttributes();
          }}
        />

        <Input
          title="Conversation Id"
          accessibilityLabel="conversation-id"
          value={conversationId}
          onChangeText={(val) => {
            setConversationId(val);
          }}
          placeholder="Conversation Id"
        />
        <Button
          intercom_accessibilityLabel="present-conversation"
          intercom_disabled={!loggedUser}
          intercom_title="Display Conversation"
          intercom_onPress={() => {
            if (conversationId) {
              let conversationContent =
                IntercomContent.conversationWithConversationId(conversationId);
              Intercom.presentContent(conversationContent);
            } else {
              showEmptyAlertMessage('Conversation Id');
            }
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
          intercom_accessibilityLabel="display-article"
          intercom_disabled={!loggedUser}
          intercom_title="Display Article"
          intercom_onPress={() => {
            if (articleId) {
              let articleContent =
                IntercomContent.articleWithArticleId(articleId);
              Intercom.presentContent(articleContent);
            } else {
              showEmptyAlertMessage('Article id');
            }
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
          intercom_accessibilityLabel="fetch-help-center-collection"
          intercom_disabled={!loggedUser}
          intercom_title="Fetch Help Center Collection"
          intercom_onPress={() => {
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
          intercom_accessibilityLabel="search-help-center"
          intercom_disabled={!loggedUser}
          intercom_title="Search Help Center"
          intercom_onPress={() => {
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
          intercom_accessibilityLabel="display-carousel"
          intercom_disabled={!loggedUser}
          intercom_title={'Display Carousel'}
          intercom_onPress={() => {
            if (carouselId) {
              let carouselContent =
                IntercomContent.carouselWithCarouselId(carouselId);
              Intercom.presentContent(carouselContent);
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
          intercom_accessibilityLabel="display-survey"
          intercom_disabled={!loggedUser}
          intercom_title={'Display Survey'}
          intercom_onPress={() => {
            if (surveyId) {
              let surveyContent = IntercomContent.surveyWithSurveyId(surveyId);
              Intercom.presentContent(surveyContent);
            } else {
              showEmptyAlertMessage('Survey Id');
            }
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
          intercom_accessibilityLabel="log-event"
          intercom_disabled={!loggedUser}
          intercom_title="Log Event"
          intercom_onPress={() => {
            if (eventName) {
              Intercom.logEvent(eventName);
            } else {
              showEmptyAlertMessage('Event Name');
            }
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
          intercom_accessibilityLabel="update-user"
          intercom_disabled={!loggedUser}
          intercom_title="Update user's name"
          intercom_onPress={() => {
            if (userName) {
              Intercom.updateUser({ name: userName })
                .then(() => {
                  console.log('updated User');
                  showResponseAlert('Updated User');
                })
                .catch((e) => {
                  showErrorAlert(e);
                  console.error(e);
                });
            } else {
              showEmptyAlertMessage('User Name');
            }
          }}
        />
        <Button
          intercom_accessibilityLabel="get-unreads"
          intercom_disabled={!loggedUser}
          intercom_title="Get Unread Conversation Count"
          intercom_onPress={() => {
            Intercom.getUnreadConversationCount().then((response) =>
              Alert.alert('Unread Conversation count is', response.toString())
            );
          }}
        />
        <Button
          intercom_accessibilityLabel="toggle-message-visibility"
          intercom_title={`Toggle In App Message Visibility: ${
            inAppMessageVisibility ? Visibility.VISIBLE : Visibility.GONE
          }`}
          intercom_onPress={() => {
            Intercom.setInAppMessageVisibility(
              inAppMessageVisibility ? Visibility.GONE : Visibility.VISIBLE
            ).then(() => setInAppMessageVisibility((v) => !v));
          }}
        />
        <Button
          intercom_title={`Toggle In Launcher Visibility: ${
            launcherVisibility ? Visibility.VISIBLE : Visibility.GONE
          }`}
          intercom_accessibilityLabel="toggle-launcher-visibility"
          intercom_onPress={() => {
            Intercom.setLauncherVisibility(
              launcherVisibility ? Visibility.GONE : Visibility.VISIBLE
            ).then(() => setLauncherVisibility((v) => !v));
          }}
        />
        <Button
          intercom_accessibilityLabel="set-bottom-padding"
          intercom_title={`Increase Bottom Padding: ${bottomPadding}`}
          intercom_onPress={() => {
            const paddingToSet =
              bottomPadding + 10 > 300 ? 0 : bottomPadding + 10;
            Intercom.setBottomPadding(paddingToSet).then(() =>
              setBottomPadding(paddingToSet)
            );
          }}
        />
        <Button
          intercom_accessibilityLabel="send-token"
          intercom_disabled={!loggedUser}
          intercom_title="Send Token"
          intercom_onPress={() => {
            Intercom.sendTokenToIntercom(TOKEN);
          }}
        />
        <Button
          intercom_accessibilityLabel="reset-attributes"
          intercom_disabled={!loggedUser}
          intercom_title="Reset Attributes"
          intercom_onPress={() => {
            resetAttributes();
          }}
        />
        <Button
          intercom_accessibilityLabel="logout"
          intercom_disabled={!loggedUser}
          intercom_title="Logout user"
          intercom_onPress={() => {
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
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 15,
    backgroundColor: 'white',
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
  text: { marginVertical: 4, fontSize: 10, color: 'white', padding: 5 },
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
  header: { marginBottom: 8, marginTop: 8 },
  stickyHeaderContainer: {
    backgroundColor: 'green',
    borderRadius: 3,
    marginBottom: 5,
  },
});
