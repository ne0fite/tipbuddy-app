import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    height: '100%',
    padding: 15,
  },
  formGroup: {
    marginBottom: 16
  },
  formGroupAcross: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 20,
  },
  textValueGroup: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  textValueGroupIcon: {
    marginLeft: 15,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5
  },
  textValue: {
    fontSize: 20,
    textAlign: 'right',
  },
  buttonRow: {
    marginBottom: 15,
    marginRight: 15,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end'
  }
});
