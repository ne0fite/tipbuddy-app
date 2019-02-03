import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withTheme } from 'react-native-paper';

const reportsContainer = (View) => {
  const mapStateToProps = state => ({
  });

  const mapDispatchToProps = dispatch => ({
  });

  return connect(mapStateToProps, mapDispatchToProps)(withTheme(View));
};

export default reportsContainer;
