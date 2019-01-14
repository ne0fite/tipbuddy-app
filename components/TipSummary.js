import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class TipSummary extends React.Component {
  render() {
    const { tipSummary } = this.props;
    return (
      <View
        style={styles.tipSummary}
        key={`tip-summary-${tipSummary.monthString}`}
      >
        <Text style={styles.heading}>{tipSummary.monthString}</Text>
        <View style={styles.detailContainer}>
          <View style={styles.detailColumn}>
            <Text style={styles.detailRow}>
              Tips:
              {tipSummary.amountSum}
            </Text>
            <Text style={styles.detailRow}>
              Tip Rate:
              {tipSummary.tipRateAvg}
            </Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.detailRow}>
              Hours:
              {tipSummary.hoursSum}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tipSummary: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  detailRow: {
    marginBottom: 3,
  }
});
