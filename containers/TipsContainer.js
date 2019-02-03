import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withTheme } from 'react-native-paper';

import {
  getMonthlyTips,
  getTips,
  saveTip,
  deleteTip,
} from '../modules/tips';

const tipsContainer = (View) => {
  const mapStateToProps = state => ({
    tips: state.tips,
  });

  const mapDispatchToProps = dispatch => ({
    tipsActions: bindActionCreators({
      getMonthlyTips,
      getTips,
      saveTip,
      deleteTip,
    }, dispatch),
  });

  return connect(mapStateToProps, mapDispatchToProps)(withTheme(View));
};

export default tipsContainer;
