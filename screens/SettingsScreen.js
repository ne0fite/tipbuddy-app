import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

import { clearData, importData } from '../modules/import';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };


  clearData = async () => {
    try {
      await clearData();
      this.props.jobsActions.getJobs();
      this.props.tipsActions.getTips();
    } catch (error) {
      console.log(error);
    }
  }

  importData = async () => {
    try {
      const url = 'http://localhost/tip_bucket_export.csv';
      await importData(url);
      this.props.jobsActions.getJobs();
      this.props.tipsActions.getTips();
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity
          onPress={this.clearData}
        >
          <Text>Clear Data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.importData}
        >
          <Text>Import Data</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
