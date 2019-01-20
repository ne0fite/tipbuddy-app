import _ from 'lodash';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';

import TipListItem from './TipListItem';
import TipSummary from './TipSummary';

export default class TipList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSections: [0]
    };
  }

  componentDidMount() {
    this.props.tipsActions.getTips();
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
    const tipItems = section.tips.map(tip => (
      <TipListItem
        {...this.props}
        key={`tip-${tip.id}`}
        tip={tip}
      />
    ));

    return (
      <Animatable.View
        duration={400}
        style={[styles.content, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
        {tipItems}
      </Animatable.View>
    );
  }

  setSections = sections => this.setState({
    activeSections: _.isEmpty(sections) ? [] : sections,
  });

  render() {
    const { activeSections } = this.state;
    const { tips } = this.props.tips;
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
