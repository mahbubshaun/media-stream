import React from 'react';

import { Ionicons } from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStackNavigator from './HomeStackNavigator';
import StackNavigatorTest from './HomeStackNavigator copy';
import StackNavigatorTest2 from './HomeStackNavigator copy 2';
import StackNavigatorTest3 from './HomeStackNavigator copy 3';
import SettingsStackNavigator from './SettingsStackNavigator';
import {LoginScreen} from '../screens/LoginScreen';
import {SignupScreen} from '../screens/SignupScreen';
import Web from '../screens/Web';
import FileTransfer from '../screens/FileTransfer';

import { useAppSelector } from '../hooks/reduxHooks';
import GeneralSettingsScreen from "../components/GeneralSettingsScreen";
import Setting from "../components/settingCom";

import Movies from "../screens/pages/movie";
import MovieDetails from "../screens/pages/movie-details";
import SearchScreen from "../screens/SearchScreen";
import Watchlist from "../screens/movie-watchlist";
import WatchlistScreen from '../screens/WatchlistScreen';
import MultiUrlInput from '../screens/test2';


const Tab = createBottomTabNavigator();

export const MainNavigator: React.FC = (navigation) => {
  const { colors } = useAppSelector((state) => state.theme.theme);
  const { visible } = useAppSelector((state) => state.tabbarStyle);
  return (
    <Tab.Navigator
      initialRouteName="MoviesMain"
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
          } else if (route.name === 'Server') {
            iconName = 'ios-documents-outline';
          }
         else if (route.name === 'General Settings') {
          iconName = 'ios-documents-outline';

        }
        else if (route.name === 'MoviesMain') {
          iconName = 'ios-documents-outline';
        }
        else if (route.name === 'Search') {
          iconName = 'ios-documents-outline';
        }
        
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveBackgroundColor: colors.background,
        tabBarInactiveBackgroundColor: colors.background,
      })}
    >
      <Tab.Screen name="Home" component={StackNavigatorTest} options={{headerShown: false}}/>
      <Tab.Screen name="Web" component={Web} />
      <Tab.Screen name="Server" component={HomeStackNavigator} />
      <Tab.Screen name="Settings" component={SettingsStackNavigator} />
      {/* <Tab.Screen name="Login" component={LoginScreen} />
      <Tab.Screen name="Signup" component={SignupScreen} /> */}
      
      
    </Tab.Navigator>
  );
};
