import React, { Component } from 'react';
import _ from 'lodash';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Dialog,
  Portal,
  RadioButton,
  Subheading,
  TouchableRipple,
  withTheme,
} from 'react-native-paper';

class SelectJobDialog extends Component {
  constructor(props) {
    super(props);
    const { selectedJobId } = this.props;
    this.state = {
      selectedJobId,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedJobId !== prevProps.selectedJobId) {
      const { selectedJobId } = this.props;
      this.selectJob(selectedJobId);
    }
  }

  selectJob = (selectedJobId) => {
    if (selectedJobId !== this.state.selectedJobId) {
      this.setState({
        selectedJobId
      });
    }
  }

  cancel = () => {
    this.props.onCancel();
  }

  confirm = () => {
    this.props.onConfirm(this.state.selectedJobId);
  }

  renderJobOption = (job) => {
    const { selectedJobId } = this.state;
    const checked = job.id === selectedJobId ? 'checked' : 'unchecked';

    return (
      <TouchableRipple
        key={`job-option-${job.id}`}
        onPress={_.partial(this.selectJob, job.id)}
      >
        <View style={styles.row}>
          <View pointerEvents="none">
            <RadioButton
              value={job.id}
              status={checked}
            />
          </View>
          <Subheading style={styles.text}>
            {job.name}
          </Subheading>
        </View>
      </TouchableRipple>
    );
  }

  render() {
    const { visible } = this.props;

    const { jobs } = this.props.jobs;
    const jobItems = _.map(jobs, job => (
      this.renderJobOption(job)
    ));

    return (
      <Portal>
        <Dialog onDismiss={this.cancel} visible={visible}>
          <Dialog.Title>Choose Job</Dialog.Title>
          <Dialog.ScrollArea style={{ maxHeight: 170, paddingHorizontal: 0 }}>
            <ScrollView>
              <View>
                {jobItems}
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={this.cancel}>Cancel</Button>
            <Button onPress={this.confirm}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }
}

export default withTheme(SelectJobDialog);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: {
    paddingLeft: 8,
  },
});
