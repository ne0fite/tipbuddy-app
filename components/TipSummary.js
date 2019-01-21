import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Title,
  Text,
} from 'react-native-paper';

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
    width: '45%',
  },
  detailRow: {
    marginBottom: 3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    marginRight: 5,
  },
  change: {
    fontSize: 10,
    marginLeft: 5,
    textAlign: 'right',
  },
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
              <Text style={styles.label}>Tips:</Text>
              <Text>{tipSummary.amountSum}</Text>
              <Text style={styles.change}>{tipSummary.amountChange}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Tip Rate:</Text>
              <Text>{tipSummary.tipRateAvg}</Text>
              <Text style={styles.change}>{tipSummary.tipRateAvgChange}</Text>
            </View>
          </View>
          <View style={styles.detailColumn}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Sales:</Text>
              <Text>{tipSummary.salesSum}</Text>
              <Text style={styles.change}>{tipSummary.salesChange}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Tip %:</Text>
              <Text>{tipSummary.tipPercentAvg}</Text>
              <Text style={styles.change}>{tipSummary.tipPercentAvgChange}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
