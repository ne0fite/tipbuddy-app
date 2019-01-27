import React from 'react';
import {
  ScrollView,
  View,
} from 'react-native';
import {
  Appbar,
  Title,
} from 'react-native-paper';

import styles from '../theme/styles';
import AvgTipsLineChart from '../components/charts/AvgTipsLineChart';
import AvgTipPercentLineChart from '../components/charts/AvgTipPercentLineChart';
import AvgSalesLineChart from '../components/charts/AvgSalesLineChart';

export default class ReportsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  editJob = () => {
    this.props.navigation.navigate('EditJob');
  }

  render() {
    const { colors } = this.props.theme;

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Appbar.Header>
          <Appbar.Content
            title="Reports"
          />
        </Appbar.Header>
        <ScrollView>
          <View style={{ padding: 15 }}>
            <Title>Last 12 Months</Title>
            <AvgTipPercentLineChart {...this.props} />
            <AvgTipsLineChart {...this.props} />
            <AvgSalesLineChart {...this.props} />
          </View>
        </ScrollView>
      </View>
    );
  }
}
