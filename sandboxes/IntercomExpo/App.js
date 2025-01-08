import React, { useEffect, useState, useCallback } from 'react';
import {
  AppState,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
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

  const [conversationId, setConversationId] = useState(null);
  const [articleId, setArticleId] = useState(null);
  const [carouselId, setCarouselId] = useState(null);
  const [surveyId, setSurveyId] = useState(null);
  const [collectionId, setCollectionId] = useState(null);
  const [launcherVisibility, setLauncherVisibility] = useState(false);

  const showConversation = useCallback(() => {
    openConversation(conversationId);
  }, [conversationId]);

  const showCarousel = useCallback(() => {
    openCarousel(carouselId);
  });

  const showArticle = useCallback(() => {
    openArticle(articleId);
  }, [articleId]);

  const showSurvey = useCallback(() => {
    openSurvey(surveyId);
  }, [articleId]);

  const showHelpCenterCollection = useCallback(() => {
    openHelpCenterCollection(collectionId);
  }, [articleId]);

  const toggleLauncherVisibility = useCallback(() => {
    Intercom.setLauncherVisibility(
      launcherVisibility ? Visibility.GONE : Visibility.VISIBLE
    ).then(() => setLauncherVisibility((v) => !v));
  });

  const {
    handleLoginIdentifiedUser,
    handleLoginUnidentifiedUser,
    handleLogout,
    setUserIdentifier,
    openHelpCenter,
    openMessages,
    openTicketsSpace,
    openConversation,
    openHelpCenterCollection,
    openArticle,
    openCarousel,
    openSurvey,
    openMessageComposer,
    openMessenger,
  } = useIntercom();

  return (
    <View style={styles.screenWrapper}>
      <ScrollView>
        <Text style={styles.title}>Push Notifications Sandbox</Text>
        <View style={styles.wrapper}>
          <>
            <TextInput
              style={styles.emailInput}
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

              <TouchableOpacity style={styles.button} onPress={handleLogout}>
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
              <TouchableOpacity
                style={styles.button}
                onPress={openTicketsSpace}
              >
                <Text style={styles.buttonText}>TICKETS</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={openMessenger}
              >
                <Text style={styles.buttonText}>MESSENGER</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rowWrapper}>
              <TextInput
                style={styles.input}
                onChangeText={setCollectionId}
                placeholder="Collection Id"
              />
              <TouchableOpacity
                style={styles.button}
                onPress={showHelpCenterCollection}
                disabled={!collectionId}
              >
                <Text style={styles.buttonText}>HELP CENTER COLLECTION</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rowWrapper}>
              <TextInput
                style={styles.input}
                onChangeText={setConversationId}
                placeholder="Conversation Id..."
              />
              <TouchableOpacity
                style={styles.button}
                onPress={showConversation}
                disabled={!conversationId}
              >
                <Text style={styles.buttonText}>SHOW CONVERSATION</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TextInput
                style={styles.input}
                onChangeText={setArticleId}
                placeholder="Article Id..."
              />
              <TouchableOpacity
                style={styles.button}
                onPress={showArticle}
                disabled={!articleId}
              >
                <Text style={styles.buttonText}>SHOW ARTICLE</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TextInput
                style={styles.input}
                onChangeText={setCarouselId}
                placeholder="Carousel Id..."
              />
              <TouchableOpacity
                style={styles.button}
                onPress={showCarousel}
                disabled={!carouselId}
              >
                <Text style={styles.buttonText}>SHOW CAROUSEL</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TextInput
                style={styles.input}
                onChangeText={setSurveyId}
                placeholder="Survey Id..."
              />
              <TouchableOpacity
                style={styles.button}
                onPress={showSurvey}
                disabled={!surveyId}
              >
                <Text style={styles.buttonText}>SHOW SURVEY</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TouchableOpacity
                style={styles.button}
                onPress={openMessageComposer}
              >
                <Text style={styles.buttonText}>SHOW COMPOSER</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={toggleLauncherVisibility}
              >
                <Text style={styles.buttonText}>TOGGLE MESSENGER</Text>
              </TouchableOpacity>
            </View>
          </>
        </View>
      </ScrollView>
    </View>
  );
}
