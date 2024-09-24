import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screenWrapper: {
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  rowWrapper: {
    flexDirection: 'row',
    marginTop: 10,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  wrapper: {
    width: '100%',
  },
  emailInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,80,0.2)',
    backgroundColor: '#f3f8ff',
    paddingVertical: 5,
    paddingLeft: 5,
    fontSize: 18,
    marginBottom: 10,
    maxWidth: '100%',
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,80,0.2)',
    paddingVertical: 5,
    paddingLeft: 5,
    fontSize: 15,
    width: '45%',
  },
  button: {
    backgroundColor: '#be2ed6',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: '#fff',
  },
  divider: {
    marginVertical: 18,
    borderWidth: 0.5,
    borderColor: '#5757ca',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '50%',
  },
});
