import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Appbar } from 'react-native-paper';

import TipList from '../components/TipList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default class TipsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  newTip = () => {
    this.props.navigation.navigate('EditTip');
  }

  render() {
    const { colors } = this.props.theme;
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Appbar.Header>
          <Appbar.Content
            title="Tip Stash"
          />
          <Appbar.Action icon="add" onPress={this.newTip} />
        </Appbar.Header>
        <ScrollView>
          <TipList {...this.props} />
        </ScrollView>
      </View>
    );
  }
}
