import React from 'react';
import Intercom, { Space } from '@intercom/intercom-react-native';
import Button from './ui/Button';
import Section from './ui/Section';

interface MessagingSectionProps {
  loggedUser: boolean;
}

export default function MessagingSection({ loggedUser }: MessagingSectionProps) {
  return (
    <Section title="💬 Messaging">
      <Button
        title="Open Messenger"
        onPress={() => Intercom.present()}
        disabled={!loggedUser}
      />

      <Button
        title="Message Composer"
        onPress={() => Intercom.presentMessageComposer('Hello from Expo!')}
        disabled={!loggedUser}
      />

      <Button
        title="Help Center"
        onPress={() => Intercom.presentSpace(Space.helpCenter)}
        disabled={!loggedUser}
      />

      <Button
        title="Messages"
        onPress={() => Intercom.presentSpace(Space.messages)}
        disabled={!loggedUser}
      />

      <Button
        title="Tickets"
        onPress={() => Intercom.presentSpace(Space.tickets)}
        disabled={!loggedUser}
      />
    </Section>
  );
}
