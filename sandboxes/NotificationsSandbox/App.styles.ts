import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 25,
    fontWeight: 'bold',
    fontSize: 20,
  },
  wrapper: {
    width: '50%',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,80,0.2)',
    backgroundColor: '#f3f8ff',
    paddingVertical: 10,
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#7284c5',
    paddingVertical: 13,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  divider: {
    marginVertical: 18,
    borderWidth: 0.5,
    borderColor: '#5757ca',
  },
});
