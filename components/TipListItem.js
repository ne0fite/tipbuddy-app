import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Subheading,
  Text,
  Title,
} from 'react-native-paper';

export default class TipListItem extends React.Component {

  editTip = () => {
    const { tip } = this.props;
    this.props.navigation.navigate('EditTip', { id: tip.id })
  }

  render() {
    const { tip } = this.props;
    const { colors, fonts } = this.props.theme;
    return (
      <TouchableOpacity
        style={[styles.tip, { backgroundColor: colors.background, }]}
        onPress={this.editTip}
        key={tip.id}
      >
        <Subheading>{tip.jobName}</Subheading>
        <Text style={{ fontFamily: fonts.thin, fontSize: 16, marginBottom: 5 }}>{tip.jobDateString}</Text>
        <View style={styles.detailContainer}>
          <View style={styles.detailColumn}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Amount:</Text>
              <Text>{tip.amountString}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Tip Rate:</Text>
              <Text>{tip.tipRateString}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Sales:</Text>
              <Text>{tip.salesString}</Text>
            </View>
          </View>
          <View style={styles.detailColumn}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Hours:</Text>
              <Text>{tip.durationString}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Wages:</Text>
              <Text>{tip.wagesString}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Tip %:</Text>
              <Text>{tip.tipPercentString}</Text>
            </View>
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
