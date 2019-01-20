import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Appbar } from 'react-native-paper';

import JobList from '../components/JobList';

export default class JobsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  newJob = () => {
    this.props.navigation.navigate('EditJob');
  }

  render() {
    const { colors } = this.props.theme;
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Appbar.Header>
          <Appbar.Content
            title="Jobs"
          />
          <Appbar.Action icon="add" onPress={this.newJob} />
        </Appbar.Header>
        <ScrollView>
          <JobList {...this.props} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    marginRight: 15
  }
});
