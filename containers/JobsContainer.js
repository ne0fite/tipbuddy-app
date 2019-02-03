import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withTheme } from 'react-native-paper';

import {
  getJobs,
  getJob,
  saveJob,
  deleteJob,
} from '../modules/jobs';

const jobsContainer = (View) => {
  const mapStateToProps = state => ({
    jobs: state.jobs,
  });

  const mapDispatchToProps = dispatch => ({
    jobsActions: bindActionCreators({
      getJobs,
      getJob,
      saveJob,
      deleteJob,
    }, dispatch),
  });

  return connect(mapStateToProps, mapDispatchToProps)(withTheme(View));
};

export default jobsContainer;
