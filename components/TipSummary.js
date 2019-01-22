import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Title,
  Text,
} from 'react-native-paper';

import Change from './Change';

const styles = StyleSheet.create({
  tipSummary: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  detailContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  detailColumn: {
    width: '49%',
  },
  detailRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 3,
    justifyContent: 'space-between',
  },
  label: {
    marginRight: 5,
  },
  value: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueText: {
    marginRight: 5,
  }
});

export default class TipSummary extends React.Component {
  render() {
    const { tipSummary } = this.props;
    const { colors } = this.props.theme;
    return (
      <View
        style={[styles.tipSummary, { backgroundColor: colors.background, }]}
        key={`tip-summary-${tipSummary.monthString}`}
      >
        <Title>{tipSummary.monthString}</Title>
        <View style={styles.detailContainer}>
          <View style={styles.detailColumn}>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Avg Tips:</Text>
              <View style={styles.value}>
                <Text style={styles.valueText}>{tipSummary.amountAvg}</Text>
                <Change change={tipSummary.amountAvgChange} />
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Tip Rate:</Text>
              <View style={styles.value}>
                <Text style={styles.valueText}>{tipSummary.tipRateAvg}</Text>
                <Change change={tipSummary.tipRateAvgChange} />
              </View>
            </View>

          </View>
          <View style={styles.detailColumn}>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Avg Sales:</Text>
              <View style={styles.value}>
                <Text style={styles.valueText}>{tipSummary.salesAvg}</Text>
                <Change change={tipSummary.salesAvgChange} />
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Avg Tip %:</Text>
              <View style={styles.value}>
                <Text style={styles.valueText}>{tipSummary.tipPercentAvg}</Text>
                <Change change={tipSummary.tipPercentAvgChange} />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
