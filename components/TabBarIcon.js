import React from 'react';
import { Icon } from 'expo';
import { withTheme } from 'react-native-paper';

const TabBarIcon = (props) => {
  const { colors } = props.theme;

  return (
    <Icon.Ionicons
      name={props.name}
      size={26}
      style={{ marginBottom: -3, paddingTop: 5, paddingBottom: 5 }}
      color={props.focused ? colors.text : colors.inactive}
    />
  );
};

export default withTheme(TabBarIcon);
