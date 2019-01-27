import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import {
  Dimensions,
  View,
} from 'react-native';
import {
  withTheme,
  Subheading,
} from 'react-native-paper';
import {
  LineChart,
} from 'react-native-chart-kit';

import styles from '../../theme/styles';

class AvgTipPercentLineChart extends Component {
  getLabels = (tips) => {
    return _.map(tips, (tipSummary, ndx) => {
      if (ndx % 2 !== 0) return '|';
      return moment(tipSummary.monthDate).format('MMM YY');
    });
  }

  getData = tips => (
    _.map(tips, tipSummary => tipSummary.tipPercentAvg * 100)
  )

  render() {
    const { tips } = this.props.tips;
    if (_.isEmpty(tips)) {
      return null;
    }

    const { colors } = this.props.theme;

    const last12tips = _.reverse(_.slice(tips, 0, 12));

    const labels = this.getLabels(last12tips);
    const data = this.getData(last12tips);
    const chartData = {
      labels,
      datasets: [{
        data
      }]
    };

    const chartConfig = {
      backgroundGradientFrom: '#fff',
      backgroundGradientTo: '#fff',
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
    };

    const chartWidth = Dimensions.get('window').width - 30;

    return (
      <View>
        <Subheading>Average Tip Percentage</Subheading>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={180}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>
    );
  }
}

export default withTheme(AvgTipPercentLineChart);
