import React from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import {
  Appbar,
  Text,
} from 'react-native-paper';

import { clearData, importData } from '../modules/import';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    header: null,
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
    const { colors } = this.props.theme;
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Appbar.Header>
          <Appbar.Content
            title="Settings"
          />
          <Appbar.Action icon="add" onPress={this.newTip} />
        </Appbar.Header>
        <ScrollView>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
