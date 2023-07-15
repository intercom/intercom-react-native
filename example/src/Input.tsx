import type { TextInputProps } from 'react-native';
import React from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';

const Input = ({
  title,
  style,
  ...props
}: TextInputProps & { title: string }) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <TextInput {...props} style={[styles.input, style]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  title: { 
    marginBottom: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'white',
    color: '#808080'
  },
});

export default Input;
