import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default class JobListItem extends React.Component {

  editJob = () => {
    const { job } = this.props;
    this.props.navigation.navigate('EditJob', { id: job.id })
  }

  render() {
    const { job } = this.props;
    return (
      <TouchableOpacity
        style={styles.job}
        onPress={this.editJob}
        key={job.id}
      >
        <Text>{job.name}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  job: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
});
