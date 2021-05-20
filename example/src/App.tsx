import * as React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { useEffect } from 'react';
import Intercom from 'intercom-react-native';

export default function App() {
  useEffect(() => {
    Intercom.registerUnidentifiedUser();
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title={'Display Messenger'}
        onPress={() => {
          Intercom.displayMessenger();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
