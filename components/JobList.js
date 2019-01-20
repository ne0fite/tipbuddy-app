import React from 'react';
import { StyleSheet, FlatList } from 'react-native';

import JobListItem from './JobListItem';

export default class JobsScreen extends React.Component {
  componentDidMount() {
    this.props.jobsActions.getJobs();
  }

  renderJobRow = ({ item: job }) => (
    <JobListItem {...this.props} job={job} />
  );

  jobKeyExtractor = job => `job-${job.id}`;

  render() {
    const { jobs } = this.props.jobs;
    return (
      <FlatList
        data={jobs}
        keyExtractor={this.jobKeyExtractor}
        renderItem={this.renderJobRow}
        styles={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
});
