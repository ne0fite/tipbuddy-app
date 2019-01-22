import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import {
  View,
} from 'react-native';
import { Icon } from 'expo';
import {
  Appbar,
  Text,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from 'react-native-modal-datetime-picker';

import {
  formatTip,
  makeEmptyTip,
} from '../modules/formatters';
import styles from '../theme/styles';
import DeleteButton from '../components/DeleteButton';
import SelectJobDialog from '../components/SelectJobDialog';

class EditTipScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    showDateTimePicker: {
      jobDate: false,
      clockIn: false,
      clockOut: false
    },
    showJobPicker: false,
    tip: {
    },
  };

  componentWillMount() {
    const tip = this.loadTip();
    this.setState({
      tip
    });
  }

  loadTip = () => {
    const { navigation } = this.props;
    const tip = _.get(navigation.state, 'params.tip', null);
    if (!tip) {
      const defaultJob = this.getDefaultJob();
      return makeEmptyTip(defaultJob);
    }
    return tip;
  }

  getDefaultJob = () => {
    const { jobs } = this.props.jobs;
    const job = _.find(this.props.jobs.jobs, { defaultJob: true });
    if (!job) {
      return _.first(jobs);
    }
    return job;
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  updateValue = (key, value) => {
    const { tip } = this.state;
    tip[key] = value;
    this.setState({
      tip: formatTip(tip)
    });
  }

  showDateTimePicker = (key) => {
    const { showDateTimePicker } = this.state;
    showDateTimePicker[key] = true;
    this.setState({
      showDateTimePicker
    });
  }

  hideDateTimePicker = (key) => {
    const { showDateTimePicker } = this.state;
    showDateTimePicker[key] = false;
    this.setState({
      showDateTimePicker
    });
  }

  confirmTime = (key, date) => {
    const time = moment(date).format('HH:mm');
    this.updateValue(key, time);
    this.hideDateTimePicker(key);
  }

  confirmDate = (key, date) => {
    const jobDate = moment(date).startOf('day').toDate();
    this.updateValue(key, jobDate.getTime());
    this.hideDateTimePicker(key);
  }

  cancelDate = (key) => {
    this.hideDateTimePicker(key);
  }

  saveTip = async () => {
    const { tip } = this.state;
    try {
      this.props.tipsActions.saveTip(tip);
      this.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  deleteTip = async () => {
    const { tip } = this.state;
    try {
      await this.props.tipsActions.deleteTip(tip);
      this.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  renderDeleteButton = () => {
    const { tip } = this.state;
    if (!tip.id) {
      return null;
    }
    return (
      <DeleteButton onPress={this.deleteTip} />
    );
  }

  showJobPicker = (show) => {
    this.setState({
      showJobPicker: show
    });
  }

  selectJob = (selectedJobId) => {
    const { tip } = this.state;
    const { jobs } = this.props.jobs;
    const job = _.find(jobs, { id: selectedJobId });

    const updatedTip = {
      ...tip,
      job,
      jobId: job.id,
      clockIn: job.clockIn,
      clockOut: job.clockOut,
    };

    this.setState({
      tip: formatTip(updatedTip),
      showJobPicker: false,
    });
  }

  render() {
    const { tip } = this.state;
    if (!tip) {
      return null;
    }

    const { colors } = this.props.theme;

    const title = tip.id ? 'Edit Tip' : 'New Tip';

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>

        <Appbar.Header>
          <Appbar.BackAction onPress={this.goBack} />
          <Appbar.Content
            title={title}
          />
          <Appbar.Action icon="check" onPress={this.saveTip} />
        </Appbar.Header>

        <KeyboardAwareScrollView>
          <View style={styles.form}>

            <View style={[styles.formGroup, styles.formGroupAcross]}>
              <Text style={styles.label}>Job</Text>
              <TouchableRipple
                onPress={_.partial(this.showJobPicker, true)}
              >
                <View style={styles.textValueGroup}>
                  <Text style={styles.textValue}>{tip.jobName}</Text>
                  <Icon.Ionicons
                    color={colors.text}
                    name="ios-arrow-dropright"
                    size={24}
                    style={styles.textValueGroupIcon}
                  />
                  <SelectJobDialog
                    {...this.props}
                    onCancel={_.partial(this.showJobPicker, false)}
                    onConfirm={_.partial(this.selectJob)}
                    selectedJobId={tip.jobId}
                    visible={this.state.showJobPicker}
                  />
                </View>
              </TouchableRipple>
            </View>

            <View style={[styles.formGroup, styles.formGroupAcross]}>
              <Text style={styles.label}>Date</Text>
              <TouchableRipple
                onPress={_.partial(this.showDateTimePicker, 'jobDate')}
              >
                <View style={styles.textValueGroup}>
                  <Text style={styles.textValue}>{tip.jobDateString}</Text>
                  <Icon.Ionicons
                    color={colors.text}
                    name="ios-calendar"
                    size={24}
                    style={styles.textValueGroupIcon}
                  />
                  <DateTimePicker
                    date={tip.jobDate}
                    isVisible={this.state.showDateTimePicker.jobDate}
                    mode="date"
                    onConfirm={_.partial(this.confirmDate, 'jobDate')}
                    onCancel={_.partial(this.cancelDate, 'jobDate')}
                  />
                </View>
              </TouchableRipple>
            </View>

            <View style={[styles.formGroup, styles.formGroupAcross]}>
              <Text style={styles.label}>Clock In</Text>
              <TouchableRipple
                onPress={_.partial(this.showDateTimePicker, 'clockIn')}
              >
                <View style={styles.textValueGroup}>
                  <Text style={styles.textValue}>{tip.clockInString}</Text>
                  <Icon.Ionicons
                    color={colors.text}
                    name="ios-time"
                    size={24}
                    style={styles.textValueGroupIcon}
                  />
                  <DateTimePicker
                    date={tip.clockInDate}
                    isVisible={this.state.showDateTimePicker.clockIn}
                    mode="time"
                    onConfirm={_.partial(this.confirmTime, 'clockIn')}
                    onCancel={_.partial(this.cancelDate, 'clockIn')}
                  />
                </View>
              </TouchableRipple>
            </View>

            <View style={[styles.formGroup, styles.formGroupAcross]}>
              <Text style={styles.label}>Clock Out</Text>
              <TouchableRipple
                onPress={_.partial(this.showDateTimePicker, 'clockOut')}
              >
                <View style={styles.textValueGroup}>
                  <Text style={styles.textValue}>{tip.clockOutString}</Text>
                  <Icon.Ionicons
                    color={colors.text}
                    name="ios-time"
                    size={24}
                    style={styles.textValueGroupIcon}
                  />
                  <DateTimePicker
                    date={tip.clockOutDate}
                    isVisible={this.state.showDateTimePicker.clockOut}
                    mode="time"
                    onConfirm={_.partial(this.confirmTime, 'clockOut')}
                    onCancel={_.partial(this.cancelDate, 'clockOut')}
                  />
                </View>
              </TouchableRipple>
            </View>

            <View style={[styles.formGroup, styles.formGroupAcross]}>
              <Text style={styles.label}>Shift Duration</Text>
              <Text style={styles.textValue}>{tip.durationString}</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Amount</Text>
              <View>
                <TextInput
                  keyboardType="decimal-pad"
                  mode="outlined"
                  onChangeText={_.partial(this.updateValue, 'amount')}
                  onSubmitEditing={() => { this.salesTextInput.focus(); }}
                  ref={(input) => { this.amountTextInput = input; }}
                  returnKeyType="next"
                  value={`${tip.amount || ''}`}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Sales</Text>
              <View>
                <TextInput
                  keyboardType="decimal-pad"
                  mode="outlined"
                  onChangeText={_.partial(this.updateValue, 'sales')}
                  onSubmitEditing={() => { this.ccTipsTextInput.focus(); }}
                  ref={(input) => { this.salesTextInput = input; }}
                  returnKeyType="next"
                  value={`${tip.sales || ''}`}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Credit Card Tips</Text>
              <View>
                <TextInput
                  keyboardType="decimal-pad"
                  mode="outlined"
                  onChangeText={_.partial(this.updateValue, 'ccTips')}
                  onSubmitEditing={() => { this.tipOutTextInput.focus(); }}
                  ref={(input) => { this.ccTipsTextInput = input; }}
                  returnKeyType="next"
                  value={`${tip.ccTips || ''}`}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tip Out</Text>
              <View>
                <TextInput
                  keyboardType="decimal-pad"
                  mode="outlined"
                  onChangeText={_.partial(this.updateValue, 'tipOut')}
                  onSubmitEditing={() => { this.notesTextInput.focus(); }}
                  ref={(input) => { this.tipOutTextInput = input; }}
                  returnKeyType="next"
                  value={`${tip.tipOut || ''}`}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes</Text>
              <View>
                <TextInput
                  mode="outlined"
                  multiline
                  onChangeText={_.partial(this.updateValue, 'notes')}
                  ref={(input) => { this.notesTextInput = input; }}
                  value={tip.notes}
                />
              </View>
            </View>

            <View style={styles.buttonRow}>
              {this.renderDeleteButton()}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default EditTipScreen;
