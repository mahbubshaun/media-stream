import React from 'react';

import { Ionicons } from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStackNavigator from './HomeStackNavigator';
import HomeStackNavigatorTest from './HomeStackNavigator copy';
import SettingsStackNavigator from './SettingsStackNavigator';

import Web from '../screens/Web';
import FileTransfer from '../screens/FileTransfer';

import { useAppSelector } from '../hooks/reduxHooks';
import GeneralSettingsScreen from "../components/GeneralSettingsScreen";

import Movies from "../screens/pages/movie";
import MovieDetails from "../screens/pages/movie-details";

const Tab = createBottomTabNavigator();

export const MainNavigator: React.FC = () => {
  const { colors } = useAppSelector((state) => state.theme.theme);
  const { visible } = useAppSelector((state) => state.tabbarStyle);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          display: visible ? 'flex' : 'none',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'Home') {
            iconName = focused ? 'ios-home' : 'ios-home';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'ios-list' : 'ios-list';
          } else if (route.name === 'Downloads') {
            iconName = 'ios-cloud-download';
          } else if (route.name === 'Web') {
            iconName = 'ios-globe';
          } else if (route.name === 'FileTransfer') {
            iconName = 'ios-documents-outline';
          }
         else if (route.name === 'General Settings') {
          iconName = 'ios-documents-outline';

        }
        else if (route.name === 'Movies') {
          iconName = 'ios-documents-outline';
        }
        
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveBackgroundColor: colors.background,
        tabBarInactiveBackgroundColor: colors.background,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Web" component={Web} />
      <Tab.Screen name="FileTransfer" component={FileTransfer} />
      <Tab.Screen name="Settings" component={SettingsStackNavigator} />
      <Tab.Screen name="General Settings" component={GeneralSettingsScreen} />
      <Tab.Screen name="Movies" component={HomeStackNavigatorTest} options={{headerShown: false}}/>
      
    </Tab.Navigator>
  );
};
