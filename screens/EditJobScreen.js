import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Switch
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

export default class EditJobScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const title = _.get(navigation.state, 'params.title', 'Edit Job');
    return {
      title,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      showDateTimePicker: {
        clockIn: false,
        clockOut: false
      }
    };
  }

  componentWillMount() {
    const { navigation } = this.props;
    const id = _.get(navigation.state, 'params.id', null);
    this.props.jobsActions.getJob(id);
  }

  updateValue = (key, value) => {
    this.props.jobsActions.updateJob(key, value);
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

  confirmDate = (key, date) => {
    const time = moment(date).format('HH:mm');
    this.updateValue(key, time);
    this.hideDateTimePicker(key);
  }

  cancelDate = (key) => {
    this.hideDateTimePicker(key);
  }

  saveJob = () => {
    this.props.jobsActions.saveJob();
  }

  deleteJob = async () => {
    await this.props.jobsActions.deleteJob();
    this.props.navigation.navigate('Jobs');
  }

  renderDeleteButton = () => {
    const { job } = this.props.jobs;
    if (!job.id) {
      return null;
    }
    return (
      <TouchableOpacity onPress={this.deleteJob}>
        <Text style={styles.dangerButton}>Delete</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { job } = this.props.jobs;
    if (!job) {
      return null;
    }

    return (
      <View style={styles.container}>
        <View style={styles.form}>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <View style={styles.control}>
              <TextInput
                onChangeText={_.partial(this.updateValue, 'name')}
                style={styles.textInput}
                value={job.name}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Rate</Text>
            <View style={styles.control}>
              <TextInput
                keyboardType={'decimal-pad'}
                onChangeText={_.partial(this.updateValue, 'rate')}
                style={styles.textInput}
                value={`${job.rate}`}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Clock In</Text>
            <View style={styles.control}>
              <TouchableOpacity onPress={_.partial(this.showDateTimePicker, 'clockIn')}>
                <Text>{job.clockInString}</Text>
              </TouchableOpacity>
              <DateTimePicker
                date={job.clockInDate}
                isVisible={this.state.showDateTimePicker.clockIn}
                mode={'time'}
                onConfirm={_.partial(this.confirmDate, 'clockIn')}
                onCancel={_.partial(this.cancelDate, 'clockIn')}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Clock Out</Text>
            <View style={styles.control}>
              <TouchableOpacity onPress={_.partial(this.showDateTimePicker, 'clockOut')}>
                <Text>{job.clockOutString}</Text>
              </TouchableOpacity>
              <DateTimePicker
                date={job.clockOutDate}
                isVisible={this.state.showDateTimePicker.clockOut}
                mode={'time'}
                onConfirm={_.partial(this.confirmDate, 'clockOut')}
                onCancel={_.partial(this.cancelDate, 'clockOut')}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Shift Duration</Text>
            <View style={styles.control}>
              <Text>{job.durationString}</Text>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Defualt</Text>
            <View style={styles.control}>
              <Switch
                onValueChange={_.partial(this.updateValue, 'defaultJob')}
                value={job.defaultJob}
              />
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={this.saveJob}>
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
