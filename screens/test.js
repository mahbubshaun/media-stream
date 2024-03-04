import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking, AsyncStorage } from 'react-native';
import axios from 'axios';

const VideoListScreen = () => {
  const [videoLinks, setVideoLinks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Your axios requests to get video links here...

      // Sample data for demonstration purposes
      const links = [
        'http://video1.com',
        'http://video2.com',
        'http://video3.com',
      ];

      setVideoLinks(links);

      // Save the links to AsyncStorage
      try {
        await AsyncStorage.setItem('videoLinks', JSON.stringify(links));
      } catch (error) {
        console.error('Error saving links to AsyncStorage:', error);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => {
    console.log('Item:', item);
    return (
      <TouchableOpacity onPress={() => Linking.openURL(item)}>
        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc', backgroundColor:'white' }}>
          <Text>{item}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  

  return (
    <FlatList
      data={videoLinks}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default VideoListScreen;
