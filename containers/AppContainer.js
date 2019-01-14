import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  getJobs,
  getJob,
  updateJob,
  saveJob,
  deleteJob
} from '../modules/jobs';
import {
  getTips,
  getTip,
  updateTip,
  saveTip,
  deleteTip
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
      updateJob,
      saveJob,
      deleteJob
    }, dispatch),
    tipsActions: bindActionCreators({
      getTips,
      getTip,
      updateTip,
      saveTip,
      deleteTip
    }, dispatch),
  });

  return connect(mapStateToProps, mapDispatchToProps)(View);
};

export default appContainer;
