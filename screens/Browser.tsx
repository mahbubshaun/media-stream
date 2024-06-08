import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
  BackHandler,
  TextInput,
  Text,
} from 'react-native';

import Dialog from 'react-native-dialog';
import ptn from 'parse-torrent-name';
import {
  Dialog as GalleryDialog,
  ProgressDialog,
} from 'react-native-simple-dialogs';
import { AntDesign, Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import FileItem from '../components/Browser/Files/FileItem';
import Pickimages from '../components/Browser/PickImages';
import ActionSheet from '../components/ActionSheet';

import useSelectionChange from '../hooks/useSelectionChange';
import allProgress from '../utils/promiseProgress';

import { NewFolderDialog } from '../components/Browser/NewFolderDialog';
import { DownloadDialog } from '../components/Browser/DownloadDialog';
import { ServerDialog } from '../components/Browser/ServerDialog';
import { FileTransferDialog } from '../components/Browser/FileTransferDialog';

import axios, { AxiosError } from 'axios';
import moment from 'moment';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';
import * as mime from 'react-native-mime-types';
import { StackScreenProps } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { ExtendedAsset, fileItem } from '../types';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { setImages } from '../features/files/imagesSlice';
import { setSnack, snackActionPayload } from '../features/files/snackbarSlice';
import { HEIGHT, imageFormats, reExt, SIZE } from '../utils/Constants';
import DOMParser from 'react-native-html-parser';
import RNFS from 'react-native-fs';
import { Storage } from '../components/Storage';
import { encode as base64Encode } from 'base-64';
import {
  db,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from '../config/firebase';
import { AuthenticatedUserProvider } from '../providers';
import { AuthenticatedUserContext } from '../providers';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config';


type BrowserParamList = {
  Browser: { prevDir: string; folderName: string };
};

type IBrowserProps = StackScreenProps<BrowserParamList, 'Browser'>;

const Browser = ({ route }: IBrowserProps) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { colors } = useAppSelector((state) => state.theme.theme);
  const docDir: string = FileSystem.documentDirectory || '';
  const [currentDir, setCurrentDir] = useState<string>(
    route?.params?.prevDir !== undefined ? route?.params?.prevDir : docDir
  );
  const [moveDir, setMoveDir] = useState('');
  const [files, setFiles] = useState<fileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<fileItem[]>([]);
  const [folderDialogVisible, setFolderDialogVisible] = useState(false);
  const [downloadDialogVisible, setDownloadDialogVisible] = useState(false);
  const [downloadDialogVisibleForServer, setDownloadDialogVisibleForServer] =
    useState(false);
  const [renameDialogVisible, setRenameDialogVisible] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [renamingFile, setRenamingFile] = useState<fileItem>();
  const renameInputRef = useRef<TextInput>(null);
  const [multiImageVisible, setMultiImageVisible] = useState(false);
  const [importProgressVisible, setImportProgressVisible] = useState(false);
  const [destinationDialogVisible, setDestinationDialogVisible] =
    useState(false);
  const [newFileActionSheet, setNewFileActionSheet] = useState(false);
  const [moveOrCopy, setMoveOrCopy] = useState('');
  const { multiSelect, allSelected } = useSelectionChange(files);
  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const linkListString = Storage.getString('linklist');
  const linkList = linkListString ? JSON.parse(linkListString) : {};
  const [mediaCount, setMediaCount] = useState(0);
  const { user, setUser } = useContext(AuthenticatedUserContext);

  let videoArray = [];
  let parser = '';
  let parsed = '';
  parser = new DOMParser.DOMParser();

  let media_count = 0;

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
    }else{
      console.log('Not logged in!'); 
    }

    return unsubscribeAuthStateChanged;
  }, []);
  console.log(user);

  if (user) {
    console.log(user.uid);
  }

  const incrementMediaCount = () => {
    setMediaCount(prevCount => prevCount + 1);
  };

  useEffect(() => {
    getFiles();
  }, [currentDir]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getFiles();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route?.params?.folderName !== undefined) {
      setCurrentDir((prev) =>
        prev?.endsWith('/')
          ? prev + route.params.folderName
          : prev + '/' + route.params.folderName
      );
    }
  }, [route]);

  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  function extractMediaName(url) {
    const match = url.match(/\/([^/]+)\.\w+$/);

    if (match) {
      const [_, mediaName] = match;
      return decodeURIComponent(mediaName).replace(/%20/g, ' ');
    }

    // Return a default value or handle unrecognized URLs
    return 'Unknown';
  }

  const renderItem = ({ item }: { item: fileItem }) => (
    <FileItem
      item={item}
      currentDir={currentDir}
      toggleSelect={toggleSelect}
      multiSelect={multiSelect}
      setTransferDialog={setDestinationDialogVisible}
      setMoveOrCopy={setMoveOrCopy}
      deleteSelectedFiles={deleteSelectedFiles}
      setRenamingFile={setRenamingFile}
      setRenameDialogVisible={setRenameDialogVisible}
      setNewFileName={setNewFileName}
    ></FileItem>
  );
  const IDOMParser = require('advanced-html-parser');

  const handleDownload = (downloadUrl: string) => {
    axios
      .get(downloadUrl)
      .then((res) => {
        const fileExt = mime.extension(res.headers['content-type']);
        FileSystem.downloadAsync(
          downloadUrl,
          currentDir + '/DL_' + moment().format('DDMMYHmmss') + '.' + fileExt
        )
          .then(() => {
            getFiles();
            setDownloadDialogVisible(false);
            handleSetSnack({
              message: 'Download complete',
            });
          })
          .catch((_) => {
            handleSetSnack({
              message: 'Please provide a correct url',
            });
          });
      })
      .catch((error: AxiosError) =>
        handleSetSnack({
          message: error.message,
        })
      );
  };
  let requestCounter = 0;
  const maxRequests = 500; // Set your desired maximum request limit
  let baseUrl; // Variable to store the base URL
  const accessedSet = new Set();
  let serverUrl = '';
  let serverUsername = '';
  let serverPassword = '';
  let credentials = '';
  async function findValidVideoLink(url) {
    if (requestCounter >= maxRequests) {
      console.log('Maximum request limit reached. Stopping further requests.');
      return;
    }
    
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

              
              incrementMediaCount();

              

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
                getFiles();
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
                  getFiles();
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
              requestCounter++;
              console.log('Request counter:', requestCounter);

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

  const handleServer = async (downloadUrl: string, serverAuth: string) => {
    if (!baseUrl) {
      const matches = downloadUrl.match(/^(https?:\/\/[^/]+)/);
      baseUrl = matches && matches[1];
      console.log('Base URL:', baseUrl);
    }
    let auth_array = serverAuth.split(':');
    let username = auth_array[0];
    let password = auth_array[1];
    console.log('server url', downloadUrl);
    console.log('server password', username, password);

    setMediaCount(0);

    const serverlistString = Storage.getString('serverlist');
    const serverlist = serverlistString ? JSON.parse(serverlistString) : {};
    
    Object.assign(serverlist, {
      [downloadUrl]: {
        server_user: username,
        server_pass: password,
      },
    });
    console.log('saving server url', serverlist);
    Storage.set('serverlist', JSON.stringify(serverlist));
    serverUrl = downloadUrl;
    serverUsername = username;
    serverPassword = password;
    try {
      credentials = base64Encode(`${username}:${password}`);
      console.log(credentials);
    } catch (err) {
      console.log(err);
    }

    setImportProgressVisible(true); // Set visibility to true when starting the process

    try {
      await findValidVideoLink(downloadUrl);
      setImportProgressVisible(false);
      // setTimeout(() => {
      //   setImportProgressVisible(false); // Set visibility to false when the process is complete
      // }, 1000);
    } catch (error) {
      console.error('Error during findValidVideoLink:', error);
    } finally {
      // setImportProgressVisible(false); // Set visibility to false when the process is complete
    }
    console.log('Printing all video links found', videoArray.length);
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

    //     axios
    //       .get(downloadUrl)
    //       .then((res) => {
    //         console.log(res.data);
    //         try{
    //         const parser = new DOMParser.DOMParser();
    //         const parsed = parser.parseFromString(res.data, 'text/html');

    //         const aElements = parsed.getElementsByTagName('a');
    // for (let i = 0; i < aElements.length; i++) {
    //   // console.log('Text Content of <a>:', aElements[i].getAttribute('href'));
    //   const href = aElements[i].getAttribute('href');
    //   // Check if href is a subpath
    //   if (href && href.startsWith('/') && !href.startsWith('//')) {
    //     console.log('This link is a subpath.: ', href);
    //     axios.get('http://index2.circleftp.net'+href)
    //       .then(response => {
    //         console.log(`Axios Response for ${href}:`, response.data);
    //         const parsed = parser.parseFromString(response.data, 'text/html');

    //         const aElements = parsed.getElementsByTagName('a');
    //         for (let i = 0; i < aElements.length; i++) {
    //           // console.log('Text Content of <a>:', aElements[i].getAttribute('href'));
    //           const href = aElements[i].getAttribute('href');
    //           // Check if href is a subpath
    //           if (href && href.startsWith('/') && !href.startsWith('//')) {
    //             console.log('This link is a subpath.: ', href);
    //         }
    //       }
    //       })
    //       .catch(error => {
    //         console.error(`Axios Error for ${href}:`, error.message);
    //       });
    //   } else {

    //   }
    // }

    //         }catch(err)
    //         {
    //           console.log(err);
    //         }
    //       })

    // const fileExt = mime.extension(res.headers['content-type']);
    // FileSystem.downloadAsync(
    //   downloadUrl,
    //   currentDir + '/DL_' + moment().format('DDMMYHmmss') + '.' + fileExt
    // )
    //   .then(() => {
    //     getFiles();
    //     setDownloadDialogVisible(false);
    //     handleSetSnack({
    //       message: 'Download complete',
    //     });
    //   })
    //   .catch((_) => {
    //     handleSetSnack({
    //       message: 'Please provide a correct url',
    //     });
    //   });

    // .catch((error) =>
    //   handleSetSnack({
    //     message: error.message,
    //   })
    // );
  };

  const toggleSelect = (item: fileItem) => {
    if (item.selected && selectedFiles.includes(item)) {
      const index = selectedFiles.indexOf(item);
      if (index > -1) {
        selectedFiles.splice(index, 1);
      }
    } else if (!item.selected && !selectedFiles.includes(item)) {
      setSelectedFiles((prev) => [...prev, item]);
    }
    setFiles(
      files.map((i) => {
        if (item === i) {
          i.selected = !i.selected;
        }
        return i;
      })
    );
  };

  const toggleSelectAll = () => {
    if (!allSelected) {
      setFiles(
        files.map((item) => {
          item.selected = true;
          return item;
        })
      );
      setSelectedFiles(files);
    } else {
      setFiles(
        files.map((item) => {
          item.selected = false;
          return item;
        })
      );
      setSelectedFiles([]);
    }
  };

  const getFiles = async () => {
    FileSystem.readDirectoryAsync(currentDir)
      .then((dirFiles) => {
        if (currentDir !== route?.params?.prevDir) {
          const filteredFiles = dirFiles.filter(
            (file) => file !== 'RCTAsyncLocalStorage'
          );
          const filesProms = filteredFiles.map((fileName) =>
            FileSystem.getInfoAsync(currentDir + '/' + fileName)
          );
          Promise.all(filesProms).then((results) => {
            let tempfiles: fileItem[] = results.map((file) => {
              const name = file.uri.endsWith('/')
                ? file.uri
                    .slice(0, file.uri.length - 1)
                    .split('/')
                    .pop()
                : file.uri.split('/').pop();
              return Object({
                ...file,
                name,
                selected: false,
              });
            });
            setFiles(tempfiles);
            const tempImageFiles = results.filter((file) => {
              let fileExtension = file.uri
                .split('/')
                .pop()
                .split('.')
                .pop()
                .toLowerCase();
              if (imageFormats.includes(fileExtension)) {
                return file;
              }
            });
            dispatch(setImages(tempImageFiles));
          });
        }
      })
      .catch((_) => {});
  };

  async function createDirectory(name: string) {
    FileSystem.makeDirectoryAsync(currentDir + '/' + name)
      .then(() => {
        getFiles();
        setFolderDialogVisible(false);
      })
      .catch(() => {
        handleSetSnack({
          message: 'Folder could not be created or already exists.',
        });
      });
  }

  const pickImage = async () => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          handleSetSnack({
            message:
              'Sorry, we need camera roll permissions to make this work!',
          });
        }
        MediaLibrary.requestPermissionsAsync();
      }
    })();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const { uri, type } = result as ImageInfo;
      const filename: string = uri.replace(/^.*[\\\/]/, '');
      const ext: string | null = reExt.exec(filename)![1];
      const fileNamePrefix = type === 'image' ? 'IMG_' : 'VID_';
      FileSystem.moveAsync({
        from: uri,
        to:
          currentDir +
          '/' +
          fileNamePrefix +
          moment().format('DDMMYHmmss') +
          '.' +
          ext,
      })
        .then((_) => getFiles())
        .catch((err) => console.log(err));
    }
  };

  async function handleCopy(
    from: string,
    to: string,
    successMessage: string,
    errorMessage: string
  ): Promise<void> {
    FileSystem.copyAsync({ from, to })
      .then(() => {
        getFiles();
        handleSetSnack({
          message: successMessage,
        });
      })
      .catch(() =>
        handleSetSnack({
          message: errorMessage,
        })
      );
  }

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
    });

    if (result.type === 'success') {
      const { exists: fileExists } = await FileSystem.getInfoAsync(
        currentDir + '/' + result.name
      );
      if (fileExists) {
        Alert.alert(
          'Conflicting File',
          `The destination folder has a file with the same name ${result.name}`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Replace the file',
              onPress: () => {
                handleCopy(
                  result.uri,
                  currentDir + '/' + result.name,
                  `${result.name} successfully copied.`,
                  'An unexpected error importing the file.'
                );
              },
              style: 'default',
            },
          ]
        );
      } else {
        handleCopy(
          result.uri,
          currentDir + '/' + result.name,
          `${result.name} successfully copied.`,
          'An unexpected error importing the file.'
        );
      }
    }
  };

  const onMultiSelectSubmit = async (data: ExtendedAsset[]) => {
    const transferPromises = data.map((file) =>
      FileSystem.copyAsync({
        from: file.uri,
        to: currentDir + '/' + file.filename,
      })
    );
    Promise.all(transferPromises).then(() => {
      setMultiImageVisible(false);
      getFiles();
    });
  };

  const moveSelectedFiles = async (destination: string) => {
    const selectedFiles = files.filter((file) => file.selected);
    const destinationFolderFiles = await FileSystem.readDirectoryAsync(
      destination
    );
    function executeTransfer() {
      const transferPromises = selectedFiles.map((file) => {
        if (moveOrCopy === 'Copy')
          return FileSystem.copyAsync({
            from: currentDir + '/' + file.name,
            to: destination + '/' + file.name,
          });
        else
          return FileSystem.moveAsync({
            from: currentDir + '/' + file.name,
            to: destination + '/' + file.name,
          });
      });
      allProgress(transferPromises, (p) => {}).then((_) => {
        setDestinationDialogVisible(false);
        setMoveDir('');
        setMoveOrCopy('');
        getFiles();
      });
    }
    const conflictingFiles = selectedFiles.filter((file) =>
      destinationFolderFiles.includes(file.name)
    );
    const confLen = conflictingFiles.length;
    if (confLen > 0) {
      Alert.alert(
        'Conflicting Files',
        `The destination folder has ${confLen} ${
          confLen === 1 ? 'file' : 'files'
        } with the same ${confLen === 1 ? 'name' : 'names'}.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Replace the files',
            onPress: () => {
              executeTransfer();
            },
            style: 'default',
          },
        ]
      );
    } else {
      executeTransfer();
    }
  };

  const deleteSelectedFiles = async (file?: fileItem) => {
    const filestoBeDeleted = file ? [file] : selectedFiles;
    const deleteProms = filestoBeDeleted.map((file) =>
      FileSystem.deleteAsync(file.uri)
    );
    Promise.all(deleteProms)
      .then((_) => {
        handleSetSnack({
          message: 'Files deleted!',
        });
        getFiles();
        setSelectedFiles([]);
      })
      .catch((err) => {
        console.log(err);
        getFiles();
      });
  };

  const [initialSelectionDone, setInitialSelectionDone] = useState(false);

  useEffect(() => {
    if (renameDialogVisible && Platform.OS === 'android') {
      setTimeout(() => {
        renameInputRef.current?.focus();
      }, 100);
    }
    if (!renameDialogVisible)
      setTimeout(() => {
        setInitialSelectionDone(false);
      }, 500);
  }, [renameDialogVisible]);

  const onRename = async () => {
    const filePathSplit = renamingFile.uri.split('/');
    const fileFolderPath = filePathSplit
      .slice(0, filePathSplit.length - 1)
      .join('/');
    FileSystem.getInfoAsync(fileFolderPath + '/' + newFileName).then((res) => {
      if (res.exists)
        handleSetSnack({
          message: 'A folder or file with the same name already exists.',
        });
      else
        FileSystem.moveAsync({
          from: renamingFile.uri,
          to: fileFolderPath + '/' + newFileName,
        })
          .then(() => {
            setRenameDialogVisible(false);
            getFiles();
          })
          .catch((_) =>
            handleSetSnack({
              message: 'Error renaming the file/folder',
            })
          );
    });
  };

  const handleSetSnack = (data: snackActionPayload) => {
    dispatch(setSnack(data));
  };

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <ActionSheet
        title={'Link Your Server'}
        numberOfLinesTitle={undefined}
        visible={newFileActionSheet}
        actionItems={['Add server', 'Cancel']}
        itemIcons={['file-download', 'close']}
        onClose={setNewFileActionSheet}
        onItemPressed={(buttonIndex) => {
          // if (buttonIndex === 0) {
          //   pickImage();
          // } else if (buttonIndex === 1) {
          //   setMultiImageVisible(true);
          // } else if (buttonIndex === 2) {
          //   pickDocument();
          // if (buttonIndex === 0) {
          //   setDownloadDialogVisible(true);
          // } else 
          
          if (buttonIndex === 0) {
            setDownloadDialogVisibleForServer(true);
          }
        }}
        cancelButtonIndex={2}
        modalStyle={{ backgroundColor: colors.background2 }}
        itemTextStyle={{ color: colors.text }}
        titleStyle={{ color: colors.secondary }}
      />
      <FileTransferDialog
        isVisible={destinationDialogVisible}
        setIsVisible={setDestinationDialogVisible}
        currentDir={docDir}
        moveDir={moveDir}
        setMoveDir={setMoveDir}
        moveSelectedFiles={moveSelectedFiles}
        moveOrCopy={moveOrCopy}
        setMoveOrCopy={setMoveOrCopy}
      />
      <NewFolderDialog
        visible={folderDialogVisible}
        createDirectory={createDirectory}
        setFolderDialogVisible={setFolderDialogVisible}
      />
      <DownloadDialog
        visible={downloadDialogVisible}
        handleDownload={handleDownload}
        setDownloadDialog={setDownloadDialogVisible}
      />

      <ServerDialog
        visible={downloadDialogVisibleForServer}
        handleServer={handleServer}
        setDownloadDialog={setDownloadDialogVisibleForServer}
      />
      <Dialog.Container visible={renameDialogVisible}>
        <Dialog.Title style={{ color: 'black' }}>Rename file</Dialog.Title>
        <Dialog.Input
          textInputRef={renameInputRef}
          value={decodeURI(newFileName)}
          onChangeText={(text) => {
            setNewFileName(text);
          }}
          onKeyPress={() => {
            setInitialSelectionDone(true);
          }}
          selection={
            !initialSelectionDone
              ? { start: 0, end: decodeURI(newFileName).split('.')[0].length }
              : undefined
          }
          style={{ color: 'black' }}
        ></Dialog.Input>
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setRenameDialogVisible(false);
          }}
        />
        <Dialog.Button label="Rename" onPress={() => onRename()} />
      </Dialog.Container>
      <GalleryDialog
        dialogStyle={{
          backgroundColor: colors.background2,
        }}
        animationType="slide"
        contentStyle={styles.contentStyle}
        overlayStyle={styles.overlayStyle}
        visible={multiImageVisible}
        onTouchOutside={() => setMultiImageVisible(false)}
      >
        <Pickimages
          onMultiSelectSubmit={onMultiSelectSubmit}
          onClose={() => setMultiImageVisible(false)}
        />
      </GalleryDialog>

      <ProgressDialog
        visible={importProgressVisible}
        title="Importing Assets"
        message={`Please, wait... \nMedia contents found so far: ${mediaCount}`}
      />

      <View style={styles.topButtons}>
        <View style={styles.topLeft}>
          <TouchableOpacity onPress={() => setNewFileActionSheet(true)}>
            <AntDesign name="addfile" size={30} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFolderDialogVisible(true)}>
            <Feather name="folder-plus" size={30} color={colors.primary} />
          </TouchableOpacity>
        </View>
        {multiSelect && (
          <View style={styles.topRight}>
            <TouchableOpacity
              onPress={() => {
                setDestinationDialogVisible(true);
                setMoveOrCopy('Move');
              }}
            >
              <MaterialCommunityIcons
                name="file-move-outline"
                size={30}
                color={colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleSelectAll}>
              <Feather
                style={{ marginLeft: 10 }}
                name={allSelected ? 'check-square' : 'square'}
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={{ ...styles.fileList, borderTopColor: colors.primary }}>
        <FlatList
          data={files}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={_keyExtractor}
        />
      </View>

      {/* {videoLinks.length > 0 && (
        <View >
          <Text>
            Video Links:
          </Text>
          {videoLinks.map((link, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                // Add your logic to handle the click on the video link
                console.log('Clicked on video link:', link);
              }}
            >
              <Text>{link}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )} */}

      {multiSelect && (
        <View
          style={{ ...styles.bottomMenu, backgroundColor: colors.background }}
        >
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="export-variant"
              size={28}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const _keyExtractor = (item: fileItem) => item.name;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SIZE,
    paddingTop: Constants.statusBarHeight,
  },
  topButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 10,
  },
  topLeft: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '25%',
  },
  topRight: {
    width: '75%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  fileList: {
    flex: 1,
    borderTopWidth: 0.5,
    marginTop: 15,
    marginHorizontal: 5,
  },
  bottomMenu: {
    height: 45,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  contentStyle: {
    width: SIZE,
    height: HEIGHT * 0.8,
    padding: 0,
    margin: 0,
  },
  overlayStyle: {
    width: SIZE,
    padding: 0,
    margin: 0,
  },
});

export default Browser;
