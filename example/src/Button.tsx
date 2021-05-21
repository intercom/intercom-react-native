import type { ButtonProps } from 'react-native';
import React from 'react';
import { StyleSheet, View, Button as Btn } from 'react-native';

const Button = (props: ButtonProps) => {
  return (
    <View style={styles.buttonContainer}>
      <Btn {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: { marginVertical: 8 },
});

export default Button;
