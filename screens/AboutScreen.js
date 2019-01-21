import React from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Title } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
});

export default class AboutScreen extends React.Component {
  static navigationOptions = {
    title: 'About Tip Stash',
  };

  render() {
    const { colors } = this.props.theme;
    return (
      <ScrollView style={[styles.container, { backgroundColor: colors.background, }]}>
        <Title>About Tip Stash</Title>
      </ScrollView>
    );
  }
}
