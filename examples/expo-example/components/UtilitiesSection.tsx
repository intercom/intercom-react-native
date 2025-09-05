import React, { useState } from 'react';
import { Alert } from 'react-native';
import Intercom from '@intercom/intercom-react-native';
import Button from './ui/Button';
import Input from './ui/Input';
import Section from './ui/Section';

const EVENT_NAME = 'user_action';

interface UtilitiesSectionProps {
  loggedUser: boolean;
  architectureType: string;
}

export default function UtilitiesSection({
  loggedUser,
  architectureType,
}: UtilitiesSectionProps) {
  const [eventName, setEventName] = useState<string>(EVENT_NAME);

  const showResponseAlert = (obj: any) => {
    Alert.alert('RESPONSE', JSON.stringify(obj));
  };

  const showErrorAlert = (e: Error) => {
    Alert.alert('ERROR', JSON.stringify(e));
  };

  const handleLogEvent = () => {
    if (eventName) {
      Intercom.logEvent(eventName, {
        platform: 'expo',
        architecture: architectureType,
      });
    }
  };

  const handleGetUnreadCount = () => {
    Intercom.getUnreadConversationCount().then((response) =>
      Alert.alert('Unread Count', response.toString())
    );
  };

  const handleFetchCollections = () => {
    Intercom.fetchHelpCenterCollections()
      .then((items) => showResponseAlert(items))
      .catch(showErrorAlert);
  };

  return (
    <Section title="🔧 Utilities">
      <Input
        label="Event Name"
        value={eventName}
        onChangeText={setEventName}
        placeholder="user_action"
      />

      <Button
        title="Log Event"
        onPress={handleLogEvent}
        disabled={!loggedUser}
      />

      <Button
        title="Get Unread Count"
        onPress={handleGetUnreadCount}
        disabled={!loggedUser}
      />

      <Button
        title="Fetch Help Center Collections"
        onPress={handleFetchCollections}
        disabled={!loggedUser}
      />
    </Section>
  );
}
