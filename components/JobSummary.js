import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Subheading,
  Text,
} from 'react-native-paper';

import Change from './Change';
import { formatTipSummary } from '../modules/formatters';

const styles = StyleSheet.create({
  jobSummary: {
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

const JobSummary = (props) => {
  const { jobSummary } = props;
  const formatted = formatTipSummary(jobSummary);

  const { colors } = props.theme;
  return (
    <View
      style={[styles.jobSummary, { backgroundColor: colors.background, }]}
    >
      <Subheading>{formatted.jobName}</Subheading>
      <View style={styles.detailContainer}>
        <View style={styles.detailColumn}>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Total Tips:</Text>
            <View style={styles.value}>
              <Text style={styles.valueText}>{formatted.amountSum}</Text>
              <Change change={formatted.amountSumChange} />
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Tip Rate:</Text>
            <View style={styles.value}>
              <Text style={styles.valueText}>{formatted.tipRateAvg}</Text>
              <Change change={formatted.tipRateAvgChange} />
            </View>
          </View>

        </View>
        <View style={styles.detailColumn}>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Total Sales:</Text>
            <View style={styles.value}>
              <Text style={styles.valueText}>{formatted.salesSum}</Text>
              <Change change={formatted.salesSumChange} />
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Avg Tip %:</Text>
            <View style={styles.value}>
              <Text style={styles.valueText}>{formatted.tipPercentAvg}</Text>
              <Change change={formatted.tipPercentAvgChange} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default JobSummary;
