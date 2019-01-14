import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import {
  Picker,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

export default class EditTipScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const title = _.get(navigation.state, 'params.title', 'Edit Tip');
    return {
      title,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      showDateTimePicker: {
        jobDate: false,
        clockIn: false,
        clockOut: false
      },
      showJobPicker: false,
    };
  }

  componentWillMount() {
    const { navigation } = this.props;
    const id = _.get(navigation.state, 'params.id', null);
    this.props.tipsActions.getTip(id);
    this.props.jobsActions.getJobs();
  }

  updateValue = (key, value) => {
    this.props.tipsActions.updateTip(key, value);
  }

  updateJob = (value) => {
    this.updateValue('jobId', value);
    this.showJobPicker(false);
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
    const jobDate = date.getTime();
    this.updateValue(key, jobDate);
    this.hideDateTimePicker(key);
  }

  cancelDate = (key) => {
    this.hideDateTimePicker(key);
  }

  saveTip = () => {
    this.props.tipsActions.saveTip();
  }

  deleteTip = async () => {
    await this.props.tipsActions.deleteTip();
    this.props.navigation.navigate('Tips');
  }

  renderDeleteButton = () => {
    const { tip } = this.props.tips;
    if (!tip.id) {
      return null;
    }
    return (
      <TouchableOpacity onPress={this.deleteTip}>
        <Text style={styles.dangerButton}>Delete</Text>
      </TouchableOpacity>
    );
  }

  showJobPicker = (show) => {
    this.setState({
      showJobPicker: show
    });
  }

  renderJobPicker = (tip) => {
    if (!this.state.showJobPicker) {
      return null;
    }

    const { jobs } = this.props.jobs;

    const jobItems = _.map(jobs, job => (
      <Picker.Item label={job.name} value={job.id} key={`job-${job.id}`} />
    ));

    return (
      <Picker
        onValueChange={this.updateJob}
        prompt={'Select Job'}
        selectedValue={tip.jobId}
      >
        {jobItems}
      </Picker>
    );
  }

  render() {
    const { tip } = this.props.tips;
    if (!tip) {
      return null;
    }

    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.label}>Job</Text>
          <View style={styles.formGroup}>
            <TouchableOpacity onPress={_.partial(this.showJobPicker, !this.state.showJobPicker)}>
              <Text>{tip.jobName}</Text>
            </TouchableOpacity>
            <View style={styles.control}>
              {this.renderJobPicker(tip)}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.control}>
              <TouchableOpacity onPress={_.partial(this.showDateTimePicker, 'jobDate')}>
                <Text>{tip.jobDateString}</Text>
              </TouchableOpacity>
              <DateTimePicker
                date={tip.jobDate}
                isVisible={this.state.showDateTimePicker.jobDate}
                mode={'date'}
                onConfirm={_.partial(this.confirmDate, 'jobDate')}
                onCancel={_.partial(this.cancelDate, 'jobDate')}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Clock In</Text>
            <View style={styles.control}>
              <TouchableOpacity onPress={_.partial(this.showDateTimePicker, 'clockIn')}>
                <Text>{tip.clockInString}</Text>
              </TouchableOpacity>
              <DateTimePicker
                date={tip.clockInDate}
                isVisible={this.state.showDateTimePicker.clockIn}
                mode={'time'}
                onConfirm={_.partial(this.confirmTime, 'clockIn')}
                onCancel={_.partial(this.cancelDate, 'clockIn')}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Clock Out</Text>
            <View style={styles.control}>
              <TouchableOpacity onPress={_.partial(this.showDateTimePicker, 'clockOut')}>
                <Text>{tip.clockOutString}</Text>
              </TouchableOpacity>
              <DateTimePicker
                date={tip.clockOutDate}
                isVisible={this.state.showDateTimePicker.clockOut}
                mode={'time'}
                onConfirm={_.partial(this.confirmTime, 'clockOut')}
                onCancel={_.partial(this.cancelDate, 'clockOut')}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Shift Duration</Text>
            <View style={styles.control}>
              <Text>{tip.durationString}</Text>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.control}>
              <TextInput
                keyboardType={'decimal-pad'}
                onChangeText={_.partial(this.updateValue, 'amount')}
                style={styles.textInput}
                value={`${tip.amount}`}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Sales</Text>
            <View style={styles.control}>
              <TextInput
                keyboardType={'decimal-pad'}
                onChangeText={_.partial(this.updateValue, 'sales')}
                style={styles.textInput}
                value={`${tip.sales}`}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Credit Card Tips</Text>
            <View style={styles.control}>
              <TextInput
                keyboardType={'decimal-pad'}
                onChangeText={_.partial(this.updateValue, 'ccTips')}
                style={styles.textInput}
                value={`${tip.ccTips}`}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tip Out</Text>
            <View style={styles.control}>
              <TextInput
                keyboardType={'decimal-pad'}
                onChangeText={_.partial(this.updateValue, 'tipOut')}
                style={styles.textInput}
                value={`${tip.tipOut}`}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Notes</Text>
            <View style={styles.control}>
              <TextInput
                keyboardType={'decimal-pad'}
                onChangeText={_.partial(this.updateValue, 'notes')}
                style={styles.textInput}
                value={tip.notes}
              />
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={this.saveTip}>
              <Text style={styles.primaryButton}>Save</Text>
            </TouchableOpacity>
            {this.renderDeleteButton()}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  form: {
    padding: 15,
    display: 'flex',
    justifyContent: 'space-between',
    height: '100%'
  },
  formGroup: {
    // marginTop: 15,
    // marginBottom: 15
  },
  label: {
    fontWeight: 'bold'
  },
  control: {
    marginTop: 5
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5
  },
  buttonRow: {
    marginTop: 15,
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  primaryButton: {
    backgroundColor: 'blue',
    borderWidth: 1,
    color: 'white',
    fontWeight: 'bold',
    overflow: 'hidden',
    padding: 10,
    textAlign: 'center',
    width: 150,
  },
  dangerButton: {
    backgroundColor: 'red',
    borderWidth: 1,
    color: 'white',
    fontWeight: 'bold',
    overflow: 'hidden',
    padding: 10,
    textAlign: 'center',
    width: 150,
  }
});
