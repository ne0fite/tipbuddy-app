import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Icon } from 'expo';

import TipList from '../components/TipList';

export default class TipsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Tips',
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.navigate('EditTip', { title: 'New Tip' })}
        style={styles.headerButton}
      >
        <Icon.Ionicons
          name={
            Platform.OS === 'ios'
              ? 'ios-add'
              : 'md-add'
          }
          size={26}
        />
      </TouchableOpacity>
    )
  });

  render() {
    return (
      <ScrollView style={styles.container}>
        <TipList {...this.props} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerButton: {
    marginRight: 15
  }
});
