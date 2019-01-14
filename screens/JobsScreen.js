import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Icon } from 'expo';

import JobList from '../components/JobList';

export default class JobsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Jobs',
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.navigate('EditJob', { title: 'New Job' })}
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
        <JobList {...this.props} />
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
