import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withTheme } from 'react-native-paper';

import {
  getJobs,
  getJob,
  saveJob,
  deleteJob,
} from '../modules/jobs';
import {
  getMonthlyTips,
  getTips,
  saveTip,
  deleteTip,
} from '../modules/tips';

const appContainer = (View) => {
  const mapStateToProps = state => ({
    jobs: state.jobs,
    tips: state.tips,
  });

  const mapDispatchToProps = dispatch => ({
    jobsActions: bindActionCreators({
      getJobs,
      getJob,
      saveJob,
      deleteJob,
    }, dispatch),
    tipsActions: bindActionCreators({
      getMonthlyTips,
      getTips,
      saveTip,
      deleteTip,
    }, dispatch),
  });

  return connect(mapStateToProps, mapDispatchToProps)(withTheme(View));
};

export default appContainer;
