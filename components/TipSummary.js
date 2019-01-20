import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Title,
  Text,
} from 'react-native-paper';

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
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Tip Rate:</Text>
              <Text>{tipSummary.tipRateAvg}</Text>
            </View>
          </View>
          <View style={styles.detailColumn}>
            <View style={styles.detailRow}>
              <Text style={styles.label}> Hours:</Text>
              <Text>{tipSummary.hoursSum}</Text>
            </View>
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
  detailContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  detailRow: {
    marginBottom: 3,
    display: 'flex',
    flexDirection: 'row',
  },
  label: {
    paddingRight: 5,
  },
});
