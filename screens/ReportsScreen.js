import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Appbar,
  Title,
} from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default class ReportsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  editJob = () => {
    this.props.navigation.navigate('EditJob');
  }

  render() {
    const { colors } = this.props.theme;
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Appbar.Header>
          <Appbar.Content
            title="Reports"
          />
        </Appbar.Header>
        <ScrollView>
          <Title>Reports!</Title>
        </ScrollView>
      </View>
    );
  }
}
