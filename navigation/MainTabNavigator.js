import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import theme from '../theme';
import TabBarIcon from '../components/TabBarIcon';
import appContainer from '../containers/AppContainer';
import TipsScreen from '../screens/TipsScreen';
import EditTipScreen from '../screens/EditTipScreen';
import ReportsScreen from '../screens/ReportsScreen';
import JobsScreen from '../screens/JobsScreen';
import EditJobScreen from '../screens/EditJobScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';

const TipsStack = createStackNavigator({
  Tips: appContainer(TipsScreen),
  EditTip: appContainer(EditTipScreen),
});

TipsStack.navigationOptions = {
  tabBarLabel: 'Tips',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
      Platform.OS === 'ios'
        ? 'ios-beer'
        : 'md-beer'
      }
    />
  ),
};

const ReportsStack = createStackNavigator({
  Tips: appContainer(ReportsScreen),
});

ReportsStack.navigationOptions = {
  tabBarLabel: 'Reports',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
      Platform.OS === 'ios'
        ? 'ios-analytics'
        : 'md-analytics'
      }
    />
  ),
};

const JobsStack = createStackNavigator({
  Jobs: appContainer(JobsScreen),
  EditJob: appContainer(EditJobScreen),
});

JobsStack.navigationOptions = {
  tabBarLabel: 'Jobs',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-cash' : 'md-cash'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: appContainer(SettingsScreen),
  About: appContainer(AboutScreen),
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
      Platform.OS === 'ios'
        ? 'ios-cog'
        : 'md-cog'
      }
    />
  ),
};

const { colors } = theme;

export default createBottomTabNavigator({
  TipsStack,
  ReportsStack,
  JobsStack,
  SettingsStack,
}, {
  tabBarOptions: {
    // inactiveBackgroundColor: colors.background,
    // activeBackgroundColor: colors.activeBackground,
    activeTintColor: colors.text,
    inactiveTintColor: colors.inactive,
    style: {
      backgroundColor: colors.background,
      borderTopColor: colors.text,
    }
  }
});
