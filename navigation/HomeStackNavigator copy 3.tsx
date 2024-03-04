import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import ImageGalleryView from '../screens/ImageGalleryView';
import MiscFileView from '../screens/MiscFileView';
import Browser from '../screens/Browser';
import VideoPlayer from '../screens/VideoPlayer';
import Movies from "../screens/pages/movie";
import MovieDetails from "../screens/pages/movie-details";
import GenreMovies from "../screens/pages/movie-genre";
import PlayMovie from "../screens/pages/play-movie";
import Trailers from "../screens/pages/trailer";
import SearchScreen from "../screens/SearchScreen";
import Watchlist from "../screens/movie-watchlist";
type StackParamList = {
  Browser: { folderName: string; prevDir: string };
  ImageGalleryView: { folderName: string; prevDir: string };
  VideoPlayer: { folderName: string; prevDir: string };
  MiscFileView: { folderName: string; prevDir: string };
};

const Stack = createStackNavigator();

const StackNavigatorTest3: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Watchlist"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="History"
        // options={({ route }) => ({
        //   title: route?.params?.folderName || 'File Manager',
        // })}
        component={Watchlist}
      />
      <Stack.Screen
        name="Details2"

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
        name="Movie"
        // options={({ route }) => ({
        //   title: route?.params?.prevDir.split('/').pop() || 'File View',
        //   presentation: 'transparentModal',
        // })}
        component={PlayMovie}
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

export default StackNavigatorTest3;
