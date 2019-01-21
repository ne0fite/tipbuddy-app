import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import {
  Subheading,
} from 'react-native-paper';

const styles = StyleSheet.create({
  job: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
});

export default class JobListItem extends React.Component {
  editJob = () => {
    const { job } = this.props;
    this.props.navigation.navigate('EditJob', { job });
  }

  render() {
    const { job } = this.props;
    const { colors } = this.props.theme;
    return (
      <TouchableOpacity
        style={[styles.job, { backgroundColor: colors.background, }]}
        onPress={this.editJob}
        key={job.id}
      >
        <Subheading>{job.name}</Subheading>
      </TouchableOpacity>
    );
  }
}
