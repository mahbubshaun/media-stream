import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import useLock from '../../hooks/useLock';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setDarkTheme, setLightTheme } from '../../features/files/themeSlice';

import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import useBiometrics from '../../hooks/useBiometrics';
import { setSnack } from '../../features/files/snackbarSlice';
import { SIZE } from '../../utils/Constants';
import { AuthenticatedUserProvider } from '../../providers';
import { AuthenticatedUserContext } from '../../providers';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config';
import ToggleSwitch from 'toggle-switch-react-native';
import { Storage } from '../../components/Storage';
import { Button } from '@rneui/themed';
import { Fontisto } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { Picker } from '@react-native-picker/picker';

import BackgroundService from 'react-native-background-actions';
import { encode as base64Encode } from 'base-64';
import DOMParser from 'react-native-html-parser';
import axios, { AxiosError } from 'axios';
import ptn from 'parse-torrent-name';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';
import * as mime from 'react-native-mime-types';

import FileItem from '../../components/Browser/Files/FileItem';

import {
  db,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from '../../config/firebase';

function Settings({ route }) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { theme } = useAppSelector((state) => state.theme);
  const { pinActive } = useLock();
  const { biometricsActive, hasHardware, isEnrolled, handleBiometricsStatus } =
    useBiometrics();
  const dispatch = useAppDispatch();
  const { user, setUser } = useContext(AuthenticatedUserContext);

  const watchlistString = Storage.getString('watchlist');
  const historylistString = Storage.getString('historylist');
  const ratedlistString = Storage.getString('ratinglist');
  const watchlist = watchlistString ? JSON.parse(watchlistString) : {};
  const historylist = historylistString ? JSON.parse(historylistString) : {};
  const ratedlist = ratedlistString ? JSON.parse(ratedlistString) : {};

  const serverlistString = Storage.getString('serverlist');
  const serverlist = serverlistString ? JSON.parse(serverlistString) : {};

  console.log(serverlist);

  const [exportState, setExportState] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const [snackbarVisibleImport, setSnackbarVisibleImport] = useState(false);

  const [snackbarVisibleForNotLoggedIn, setSnackbarVisibleForNotLoggedIn] =
    useState(false);

  const [selectedLServerType, setSelectedServerType] = useState();

  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const linkListString = Storage.getString('linklist');
  const linkList = linkListString ? JSON.parse(linkListString) : {};

  const scheduledValue = Storage.getString('schedule');
  const scheduledValueString = scheduledValue ? scheduledValue : '1 hour';

  const timeOptions = [
    '1 hour',
    '2 hours',
    '3 hours',
    '6 hours',
    '12 hours',
    '24 hours',
  ];
  const [selectedTime, setSelectedTime] = useState(scheduledValueString); // default to '1 hour'

  const [isSchedulingEnabled, setIsSchedulingEnabled] = useState(false);
  const docDir: string = FileSystem.documentDirectory || '';
  const [currentDir, setCurrentDir] = useState<string>(
    route?.params?.prevDir !== undefined ? route?.params?.prevDir : docDir
  );

  console.log(user);

  let requestCounter = 0;
  const maxRequests = 500; // Set your desired maximum request limit
  let baseUrl; // Variable to store the base URL
  const accessedSet = new Set();
  let serverUrl = '';
  let serverUsername = '';
  let serverPassword = '';
  let credentials = '';

  let videoArray = [];
  let parser = '';
  let parsed = '';
  parser = new DOMParser.DOMParser();
  const IDOMParser = require('advanced-html-parser');

  const handleServer = async (downloadUrl) => {
 

    const traverseAndPrint = async (obj) => {
      for (const url in obj) {
        if (obj.hasOwnProperty(url)) {
          console.log("URL:", url);
          const innerObj = obj[url];
          console.log('server user', innerObj['server_user']);
          console.log('server pass', innerObj['server_pass']);
          // for (const key in innerObj) {
          //   if (innerObj.hasOwnProperty(key)) {
          //     console.log(key + ": " + innerObj[key]);
          //   }
          // }

          if (!baseUrl) {
      const matches = url.match(/^(https?:\/\/[^/]+)/);
      baseUrl = matches && matches[1];
      console.log('Base URL:', baseUrl);
    }


    const serverlistString = Storage.getString('serverlist');
    const serverlist = serverlistString ? JSON.parse(serverlistString) : {};
    serverUrl = url;
    serverUsername = innerObj['server_user'];
    serverPassword = innerObj['server_pass'];
    try {
      credentials = base64Encode(`${serverUsername}:${serverPassword}`);
      console.log(credentials);
    } catch (err) {
      console.log(err);
    }

    try {
      await findValidVideoLink(url);
      // setTimeout(() => {
      //   setImportProgressVisible(false); // Set visibility to false when the process is complete
      // }, 1000);
    } catch (error) {
      console.error('Error during findValidVideoLink:', error);
    } finally {
      // setImportProgressVisible(false); // Set visibility to false when the process is complete
    }
    console.log('Printing all video links found', videoArray.length);
    const linkListString = Storage.getString('linklist');
  const linkList = linkListString ? JSON.parse(linkListString) : {};
    for (let i = 0; i < videoArray.length; i++) {
      console.log(videoArray[i]);
      console.log(i);
      let movie = extractMediaName(videoArray[i]);
      let title = ptn(movie).title;
      console.log(title);
      Object.assign(linkList, {
        [title]: {
          media_link: videoArray[i],
          title: title,
        },
      });
    }
    // console.log('saving found media links: ', JSON.stringify(linkList));
    Storage.set('linklist', JSON.stringify(linkList));
    videoArray.length = 0;
    accessedSet.clear();
        }
      }
    };
    await traverseAndPrint(downloadUrl);
    

  };
  function extractMediaName(url) {
    const match = url.match(/\/([^/]+)\.\w+$/);

    if (match) {
      const [_, mediaName] = match;
      return decodeURIComponent(mediaName).replace(/%20/g, ' ');
    }

    // Return a default value or handle unrecognized URLs
    return 'Unknown';
  }

 async function findValidVideoLink(url) {

    console.log('Inside findValidU', url);

    if (!url.match(/\.[a-z0-9]+$/i)) {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        });
        // console.log(response.data);

        let doc;

        try {
          // or import IDOMParser from 'advanced-html-parser'
          doc = IDOMParser.parse(response.data);
        } catch (er) {
          console.error('Error parsing HTML:', er);
          // console.log('HTML content causing the error:', response.data);
          return; // Exit the function on parsing error
        }

        let aElements = doc.documentElement.getElementsByTagName('a');
        // for (let i = 0; i < aElements.length; i++) {
        //   let href = aElements[i].getAttribute('href');
        //   console.log(href);
        // }
        for (let i = 0; i < aElements.length; i++) {
          let href = aElements[i].getAttribute('href');
          console.log('link found ', href);
          console.log(href);
          let subpathUrl = '';
          if (href == '/') {
            continue;
          }
          if (href) {
            if (href.startsWith('/')) {
              //   if (url.endsWith('/')) {
              //     url = url.slice(0, -1);
              // }
              subpathUrl = baseUrl + href;
            } else {
              console.log('url ', url);
              subpathUrl = url + href;
            }
          }
          console.log('subpath url: ', subpathUrl);

          if (accessedSet.has(subpathUrl)) {
            console.log('Already accessed');
            continue;
          } else {
          }

          const isSub = await isSubPath(baseUrl, subpathUrl);
          // if (href && href.startsWith('/') && !href.startsWith('//')) {
          if (isSub) {
            console.log('This link is a subpath:', href);

            console.log(isValidVideoLink(subpathUrl));

            const isValid = await isValidVideoLink(subpathUrl);

            if (isValid) {
              console.log('Found valid video link:', subpathUrl);

          
              

              // Extracting domain and folder names
              const urlParts = url.split('/');
              if (urlParts.length >= 3) {
                const domain = urlParts[2].replace(/[^a-zA-Z0-9]/g, '_');
                const folderNames = urlParts
                  .slice(3)
                  .filter((part) => part && !/\.[a-z0-9]+$/i.test(part))
                  .map((part) => decodeURIComponent(part));

                // Creating folders based on the extracted names
                let currentPath = docDir + '/' + domain;

                try {
                  FileSystem.makeDirectoryAsync(currentPath);

                  for (const folderName of folderNames) {
                    currentPath += '/' + folderName;
                    try {
                      console.log('Creating directory:', currentPath);
                      FileSystem.makeDirectoryAsync(currentPath);
                    } catch (err) {}
                  }
                } catch (err) {
                  console.log(err);
                }

                // Writing dummy MP4 file
               
                let final_subpath_with_authentication = '';
                if (serverUsername) {
                  let subpath_array = subpathUrl.split('//');
                  console.log(subpath_array[0]);
                  console.log(subpath_array[1]);
                  final_subpath_with_authentication =
                    subpath_array[0] +
                    '//' +
                    serverUsername +
                    ':' +
                    serverPassword +
                    '@' +
                    subpath_array[1];
                } else {
                  final_subpath_with_authentication = subpathUrl;
                }
                console.log(final_subpath_with_authentication);
                const fileContent = `Click this link: ${final_subpath_with_authentication}`;
                currentPath += '/' + 'medialink.txt';

                try {
                  FileSystem.writeAsStringAsync(currentPath, fileContent);
                  console.log('Dummy MP4 file created:', currentPath);
                 
                } catch (error) {
                  console.error('Error creating dummy MP4 file:', error);
                }

                // Handle the valid video link here
                // if (await isValidVideoLink(subpathUrl))
                // {

                // }
                videoArray.push(subpathUrl);
              }

              // Increment the request counter
  

              // Recursive call to continue searching in the subpath
            } else {
              console.log('Not valid:', href);
              if (subpathUrl.endsWith('/')) {
                accessedSet.add(subpathUrl);
                await findValidVideoLink(subpathUrl);
              }
            }

            // await findValidVideoLink(subpathUrl);
          } else {
            console.log('does not meet condition', subpathUrl);
            console.log(subpathUrl.startsWith('http://' + baseUrl));
            console.log(baseUrl);
          }
          // await findValidVideoLink(subpathUrl);
        }
      } catch (error) {
        console.error('Error during findValidVideoLink:', error);
      }
    } else {
      console.log('URL should not end with a file extension');
    }
  }

  async function isSubPath(domain, link) {
    // Extract the domain part from the link
    const matches = link.match(/^(https?:\/\/[^/]+)/);
    const linkDomain = matches && matches[1];
    // Check if the link's domain matches the given domain
    return linkDomain === domain;
  }

  async function isValidVideoLink(href) {
    // Add your logic to determine if the href is a valid video link with the proper extension
    // Example: Check if the href ends with a specific video file extension like '.mp4'
    return href.endsWith('.mp4') || href.endsWith('.mkv');
  }

  

  // const sleep = (time) =>
  //   new Promise((resolve) => setTimeout(() => resolve(), time));

  const sleep = (seconds) => {
      return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    };  

  // You can do anything in your task such as network requests, timers and so on,
  // as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
  // React Native will go into "paused" mode (unless there are other tasks running,
  // or there is a foreground app).
  const veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {

      while (BackgroundService.isRunning()) {

      if (selectedTime === '1 hour') {
        handleServer(serverlist);
        console.log('waiting 1 hour');
        await sleep(3600);
       
      }

      if (selectedTime === '2 hours') {
        console.log('waiting 2 hour');
        await sleep(3600 * 2);
      }

      if (selectedTime === '3 hours') {
        console.log('waiting 3 hour');
        await sleep(3600 * 3);
      }

      if (selectedTime === '6 hours') {
        console.log('waiting 6 hour');
        await sleep(3600 * 6);
      }
      if (selectedTime === '12 hours') {
        console.log('waiting 12 hour');
        await sleep(3600 * 12);
      }

      if (selectedTime === '24 hours') {
        console.log('waiting 24 hour');
        await sleep(3600 * 24);
      }
    }
    });
  };

  const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
      delay: 1000,
    },
  };

  useEffect(() => {

    const intervalSwitch = Storage.getString('SCHEDULING_ENABLED');
    console.log('saved value as', JSON.stringify(intervalSwitch));
    console.log(intervalSwitch);
  const intervalSwitchValue= intervalSwitch;
  console.log(intervalSwitchValue);
  if (intervalSwitchValue === 'true')
  {
    setIsSchedulingEnabled(true);
  }

  }, []);

  useEffect(() => {
    // Store user preferences
    const storePreferences = async () => {
      console.log('storing value as', JSON.stringify(isSchedulingEnabled));
      console.log(JSON.stringify(isSchedulingEnabled));
      Storage.set('SCHEDULING_ENABLED', JSON.stringify(isSchedulingEnabled));
      // await AsyncStorage.setItem('SELECTED_TIME', selectedTime);
    };

    storePreferences();

    // Initialize BackgroundFetch only once
    initBackgroundFetch();
  }, [isSchedulingEnabled]);

  const initBackgroundFetch = async () => {
    // Configure Background Fetch

    // Read user preferences
    const schedulingEnabled = Storage.getString('SCHEDULING_ENABLED');
    // const timeSetting = await AsyncStorage.getItem('SELECTED_TIME');

    if (schedulingEnabled === 'true' && !BackgroundService.isRunning()) {
      // Perform your task here based on the selectedTime
      console.log('Performing background task based on user settings.');
      await BackgroundService.start(veryIntensiveTask, options);
      await BackgroundService.updateNotification({
        taskDesc: 'New ExampleTask description',
      }); // Only Android, iOS will ignore this call
      // iOS will also run everything here in the background until .stop() is called
      // await BackgroundService.stop();
    }

    if (schedulingEnabled === 'true' && BackgroundService.isRunning()) {
      console.log('App is already running in the background!');

    }

    if(schedulingEnabled === 'false' && BackgroundService.isRunning())
    {
   
        console.log('stopping background service')
        BackgroundService.stop();
      
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut(); // Sign out the user
      console.log('User signed out successfully');
      // You may want to navigate to the login screen or update the user context here
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuthStateChanged = onAuthStateChanged(
      auth,
      (authenticatedUser) => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
      }
    );

    // unsubscribe auth listener on unmount
    console.log(user);
    if (user) {
      console.log('Already logged in!'); // Print something if login succeeds
    }

    return unsubscribeAuthStateChanged;
  }, [user]);
  console.log(user);

  if (user) {
    console.log(user.uid);
  }
  const uploadWatchListData = async () => {
    if (!user) {
      // console.error('User is not logged in');
      setSnackbarVisibleForNotLoggedIn(true);
      setTimeout(() => setSnackbarVisibleForNotLoggedIn(false), 2500);
      return;
    } else {
      console.log(user.uid);
      console.log('Calling update');
      updateUserOrAdd(user.uid);
    }
  };

  const updateUserOrAdd = async (userId) => {
    await setDoc(doc(db, 'users', userId), {
      watchlist: watchlist,
      historylist: historylist,
      ratedlist: ratedlist,
      serverlist: serverlist,
    });
    console.log('User updated!');

    setSnackbarVisible(true);
    setTimeout(() => setSnackbarVisible(false), 2500);
  };

  const importData = async () => {
    if (!user) {
      // console.error('User is not logged in');
      setSnackbarVisibleForNotLoggedIn(true);
      setTimeout(() => setSnackbarVisibleForNotLoggedIn(false), 2500);
      return;
    } else {
      console.log(user.uid);
      console.log('Calling import');
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data()['watchlist']);
        Storage.set('watchlist', JSON.stringify(docSnap.data()['watchlist']));
        Storage.set(
          'historylist',
          JSON.stringify(docSnap.data()['historylist'])
        );
        Storage.set('ratinglist', JSON.stringify(docSnap.data()['ratedlist']));
        Storage.set('serverlist ', JSON.stringify(docSnap.data()['serverlist']));
        setSnackbarVisibleImport(true);
        setTimeout(() => setSnackbarVisibleImport(false), 2500);
      } else {
        // docSnap.data() will be undefined in this case
        console.log('No such document!');
      }
      console.log('User imported');

      setSnackbarVisible(true);
      setTimeout(() => setSnackbarVisible(false), 2500);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#31364A' }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          Profile
        </Text>
        <TouchableOpacity
          onPress={() => {
            {
              user
                ? handleSignOut()
                : navigation.navigate('AuthStack', { name: 'AuthStack' });
            }
          }}
        >
          <View
            style={[
              styles.sectionItem,
              { backgroundColor: theme.colors.background2 },
            ]}
          >
            <View style={styles.sectionItemLeft}>
              <Feather
                name={'bookmark'}
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.sectionItemCenter}>
              <Text
                style={[
                  styles.sectionItemText,
                  { color: theme.colors.primary },
                ]}
              >
                {user ? 'Logged in \n' + user.email : 'Not logged in'}
              </Text>
            </View>
            <View style={styles.sectionItemRight}>
              <Feather
                name={'chevron-right'}
                size={24}
                color={theme.colors.primary}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          Lists
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('WatchList', { name: 'WatchList' });
          }}
        >
          <View
            style={[
              styles.sectionItem,
              { backgroundColor: theme.colors.background2 },
            ]}
          >
            <View style={styles.sectionItemLeft}>
              <Feather
                name={'bookmark'}
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.sectionItemCenter}>
              <Text
                style={[
                  styles.sectionItemText,
                  { color: theme.colors.primary },
                ]}
              >
                Watchlist
              </Text>
            </View>
            <View style={styles.sectionItemRight}>
              <Feather
                name={'chevron-right'}
                size={24}
                color={theme.colors.primary}
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('WatchList', { name: 'HistoryList' });
          }}
        >
          <View
            style={[
              styles.sectionItem,
              { backgroundColor: theme.colors.background2 },
            ]}
          >
            <View style={styles.sectionItemLeft}>
              <FontAwesome5
                name="history"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.sectionItemCenter}>
              <Text
                style={[
                  styles.sectionItemText,
                  { color: theme.colors.primary },
                ]}
              >
                History
              </Text>
            </View>
            <View style={styles.sectionItemRight}>
              <Feather
                name={'chevron-right'}
                size={24}
                color={theme.colors.primary}
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('WatchList', { name: 'RatedList' });
          }}
        >
          <View
            style={[
              styles.sectionItem,
              { backgroundColor: theme.colors.background2 },
            ]}
          >
            <View style={styles.sectionItemLeft}>
              <MaterialIcons
                name="star-rate"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.sectionItemCenter}>
              <Text
                style={[
                  styles.sectionItemText,
                  { color: theme.colors.primary },
                ]}
              >
                Rated
              </Text>
            </View>
            <View style={styles.sectionItemRight}>
              <Feather
                name={'chevron-right'}
                size={24}
                color={theme.colors.primary}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          SECURITY
        </Text>
        <View
          style={[
            styles.sectionItem,
            { backgroundColor: theme.colors.background2 },
          ]}
        >
          <View style={styles.sectionItemLeft}>
            <Feather
              name={pinActive ? 'lock' : 'unlock'}
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.sectionItemCenter}>
            <Text
              style={[styles.sectionItemText, { color: theme.colors.primary }]}
            >
              PIN Code
            </Text>
          </View>
          <View style={styles.sectionItemRight}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SetPassCodeScreen');
              }}
            >
              <Feather
                name={'chevron-right'}
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* 
        <View
          style={[
            styles.sectionItem,
            { backgroundColor: theme.colors.background2 },
          ]}
        >
          <View style={styles.sectionItemLeft}>
            <FontAwesome5
              name="fingerprint"
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.sectionItemCenter}>
            <Text
              style={[styles.sectionItemText, { color: theme.colors.primary }]}
            >
              Unlock with Biometrics
            </Text>
          </View>
          <View style={styles.sectionItemRight}>
            <Switch
              value={biometricsActive}
              onTouchStart={() => {
                if (!hasHardware) {
                  dispatch(
                    setSnack({ message: 'Device has no biometrics hardware' })
                  );
                }
              }}
              disabled={!hasHardware}
              trackColor={{
                false: theme.colors.switchFalse,
                true: 'tomato',
              }}
              thumbColor={theme.colors.switchThumb}
              onChange={() => {
                if (hasHardware && isEnrolled) {
                  handleBiometricsStatus();
                } else if (hasHardware && !isEnrolled) {
                  dispatch(setSnack({ message: 'No biometrics enrolled!' }));
                }
              }}
            />
          </View>
        </View> */}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Backup
          </Text>
          <View
            style={[
              styles.sectionItem,
              { backgroundColor: theme.colors.background2 },
            ]}
          >
            <View style={styles.sectionItemLeft}>
              <FontAwesome5
                name="file-export"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.sectionItemCenter}>
              <Text
                style={[
                  styles.sectionItemText,
                  { color: theme.colors.primary },
                ]}
              >
                Export Lists
              </Text>
            </View>
            <View style={styles.sectionItemRight}>
              <Button
                title="Export"
                type="clear"
                onPress={uploadWatchListData}
              />
            </View>
          </View>

          <View
            style={[
              styles.sectionItem,
              { backgroundColor: theme.colors.background2 },
            ]}
          >
            <View style={styles.sectionItemLeft}>
              <Fontisto name="import" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.sectionItemCenter}>
              <Text
                style={[
                  styles.sectionItemText,
                  { color: theme.colors.primary },
                ]}
              >
                Import Lists
              </Text>
            </View>
            <View style={styles.sectionItemRight}>
              <Button title="Import" type="clear" onPress={importData} />
            </View>
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.primary }]}
            >
              Update Settings
            </Text>
            <View style={styles.subSection}>
              <Text
                style={[
                  styles.subSectionTitle,
                  { color: theme.colors.primary },
                ]}
              >
                Server Update Interval
              </Text>
              <Picker
                selectedValue={selectedTime}
                dropdownIconColor='white'
                dropdownIconRippleColor='white'
                onValueChange={(itemValue) => {
                  setSelectedTime(itemValue);
                  Storage.set('schedule', itemValue);
                }}
                style={styles.picker}
                mode="dropdown" // Android only
              >
                {timeOptions.map((time) => (
                  <Picker.Item key={time} label={time} value={time} />
                ))}
              </Picker>
            </View>
            <View style={styles.subSection}>
              <Text
                style={[
                  styles.subSectionTitle,
                  { color: theme.colors.primary },
                ]}
              >
                Enable Scheduling
              </Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isSchedulingEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() =>
                  setIsSchedulingEnabled((previousState) => !previousState)
                }
                value={isSchedulingEnabled}
              />
            </View>
          </View>
        </View>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => console.log('snack bar displayed')}
      >
        Lists Have Been Exported Successfully!
      </Snackbar>

      <Snackbar
        visible={snackbarVisibleImport}
        onDismiss={() => console.log('snack bar displayed')}
      >
        Lists Have Been Imported Successfully!
      </Snackbar>

      <Snackbar
        visible={snackbarVisibleForNotLoggedIn}
        onDismiss={() => console.log('snack bar displayed')}
      >
        You need to logged in to backup your lists!
      </Snackbar>
    </View>
  );
}

const _keyExtractor = (item: fileItem) => item.name;

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 40,
  },
  section: {
    width: SIZE,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  sectionItem: {
    display: 'flex',
    flexDirection: 'row',
    height: 45,
  },
  sectionItemText: {
    fontFamily: 'Poppins_500Medium',
  },
  sectionItemLeft: {
    width: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionItemCenter: {
    width: '60%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sectionItemRight: {
    width: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
    // color: Colors.white,
    justifyContent: 'center',
  },
  subSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  subSectionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    marginLeft: 10,
  },
  picker: {
    width: 150,
    height: 44,
    color: 'white',
  },
});
