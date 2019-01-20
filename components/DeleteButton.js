import React from 'react';
import {
  Button,
  withTheme,
} from 'react-native-paper';

const DeleteButton = (props) => {
  const { colors } = props.theme;
  return (
    <Button
      icon="delete"
      mode="contained"
      onPress={props.onPress}
      style={{ backgroundColor: colors.danger }}
    >
      Delete
    </Button>
  );
};

export default withTheme(DeleteButton);
