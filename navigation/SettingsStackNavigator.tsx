import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import Settings from '../screens/Settings/Settings';
import SetPassCodeScreen from '../screens/Settings/SetPassCodeScreen';
import Watchlist from '../screens/movie-watchlist'

const SettingsStack = createStackNavigator();

export const SettingsStackNavigator: React.FC = () => {
  return (
    <SettingsStack.Navigator
      initialRouteName="SettingsMain"
      screenOptions={{
        headerShown: false,
      }}
    >
      <SettingsStack.Screen name="SettingsMain" component={Settings} />
      <SettingsStack.Screen
        name="SetPassCodeScreen"
        component={SetPassCodeScreen}
      />
      <SettingsStack.Screen
        name="WatchList"
        component={Watchlist}
      />
    </SettingsStack.Navigator>
  );
};

export default SettingsStackNavigator;
