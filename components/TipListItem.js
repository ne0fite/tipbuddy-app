import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default class TipListItem extends React.Component {

  editTip = () => {
    const { tip } = this.props;
    this.props.navigation.navigate('EditTip', { id: tip.id })
  }

  render() {
    const { tip } = this.props;
    return (
      <TouchableOpacity
        style={styles.tip}
        onPress={this.editTip}
        key={tip.id}
      >
        <Text style={styles.heading}>{tip.jobName}</Text>
        <Text style={styles.jobDate}>{tip.jobDateString}</Text>
        <View style={styles.detailContainer}>
          <View style={styles.detailColumn}>
            <Text style={styles.detailRow}>
              Amount:
              {tip.amountString}
            </Text>
            <Text style={styles.detailRow}>
              Tip Rate:
              {tip.tipRateString}
            </Text>
            <Text style={styles.detailRow}>
              Sales:
              {tip.salesString}
            </Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.detailRow}>
              Hours:
              {tip.durationString}
            </Text>
            <Text style={styles.detailRow}>
              Wages:
              {tip.wagesString}
            </Text>
            <Text style={styles.detailRow}>
              Tip %:
              {tip.tipPercentString}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  tip: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  jobDate: {
    color: 'grey',
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
