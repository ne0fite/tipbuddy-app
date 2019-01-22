import React, { Component } from 'react';
import _ from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  withTheme,
} from 'react-native-paper';
import { Icon } from 'expo';

class Change extends Component {
  render() {
    const { change } = this.props;
    if (!_.isNumber(change)) {
      return null;
    }

    console.log(change);
    const { colors } = this.props.theme;
    return (
      <Icon.Ionicons
        color={change > 0 ? colors.success : colors.danger}
        name={change > 0 ? 'md-arrow-dropup' : 'md-arrow-dropdown'}
        size={20}
      />
    );
  }
}

export default withTheme(Change);
