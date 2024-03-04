import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import ImageGalleryView from '../screens/ImageGalleryView';
import MiscFileView from '../screens/MiscFileView';
import Browser from '../screens/Browser';
import VideoPlayer from '../screens/VideoPlayer';
import Movies from "../screens/pages/movie";
import MovieDetails from "../screens/pages/movie-details copy";
import GenreMovies from "../screens/pages/movie-genre copy";
import Trailers from "../screens/pages/trailer copy";
import SearchScreen from "../screens/SearchScreen";

type StackParamList = {
  Browser: { folderName: string; prevDir: string };
  ImageGalleryView: { folderName: string; prevDir: string };
  VideoPlayer: { folderName: string; prevDir: string };
  MiscFileView: { folderName: string; prevDir: string };
};

const Stack = createStackNavigator();

const StackNavigatorTest2: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Search"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Search"

        component={SearchScreen}
      />
      <Stack.Screen
        name="Details"
        // options={({ route }) => ({
        //   title: route?.params?.prevDir.split('/').pop() || 'Video',
        //   presentation: 'transparentModal',
        // })}
        component={MovieDetails}
      />
      <Stack.Screen
        name="List"
        // options={({ route }) => ({
        //   title: route?.params?.prevDir.split('/').pop() || 'Video',
        //   presentation: 'transparentModal',
        // })}
        component={GenreMovies}
      />
      <Stack.Screen
        name="Trailer"
        // options={({ route }) => ({
        //   title: route?.params?.prevDir.split('/').pop() || 'File View',
        //   presentation: 'transparentModal',
        // })}
        component={Trailers}
      />
      
      
    </Stack.Navigator>
  );
};

export default StackNavigatorTest2;
