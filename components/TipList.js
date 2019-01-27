import React from 'react';
import _ from 'lodash';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';

import TipListItem from './TipListItem';
import TipSummary from './TipSummary';
import JobSummary from './JobSummary';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#F5FCFF',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
});

export default class TipList extends React.Component {
  state = {
    activeSections: [0]
  };

  async componentWillMount() {
    try {
      await this.props.tipsActions.getMonthlyTips();
    } catch (error) {
      console.log(error);
    }
  }

  renderHeader = (section, ndx, isActive) => (
    <View
      style={[styles.header, isActive ? styles.active : styles.inactive]}
    >
      <TipSummary
        {...this.props}
        tipSummary={section}
      />
    </View>
  )

  renderContent = (section, ndx, isActive) => {
    const tipItems = _.map(section.tips, (job) => {
      const content = [
        <JobSummary
          {...this.props}
          key={`job-${job.id}`}
          jobSummary={job}
        />
      ];

      _.each(job.tips, tip => (
        content.push(
          <TipListItem
            {...this.props}
            key={`tip-${tip.id}`}
            tip={tip}
          />
        )
      ));

      return content;
    });

    return (
      <View
        style={[styles.content, isActive ? styles.active : styles.inactive]}
      >
        {tipItems}
      </View>
    );
  }

  setSections = async (sections) => {
    const activeSections = sections || [];
    try {
      if (!_.isEmpty(activeSections)) {
        const tipSummary = this.props.tips.tips[activeSections[0]];
        const { year, month } = tipSummary;
        await this.props.tipsActions.getTips(year, month);
      }
    } catch (error) {
      console.log(error);
    }

    this.setState({
      activeSections,
    });
  }

  render() {
    const { activeSections } = this.state;
    const { tips } = this.props.tips;
    if (_.isEmpty(tips)) {
      return <Text>Empty</Text>;
    }

    return (
      <Accordion
        activeSections={activeSections}
        sections={tips}
        touchableComponent={TouchableOpacity}
        renderHeader={this.renderHeader}
        renderContent={this.renderContent}
        duration={400}
        onChange={this.setSections}
      />
    );
  }
}
