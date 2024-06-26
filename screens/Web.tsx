import React, { useState, useEffect, useRef, Component, Fragment } from 'react';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Modal,
  FlatList,
  Text,
  SafeAreaView,
  BackHandler,
} from 'react-native';

import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { Storage } from '../components/Storage';
import Constants from 'expo-constants';
import App from './Appvv'; 
import { useAppSelector } from '../hooks/reduxHooks';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';



const items = [
  { id: 1, name: 'JavaScript' },
  { id: 2, name: 'Java' },
  { id: 3, name: 'Ruby' },
  { id: 4, name: 'React Native' },
  { id: 5, name: 'PHP' },
  { id: 6, name: 'Python' },
  { id: 7, name: 'Go' },
  { id: 8, name: 'Swift' },
];
const Web: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState([
    { id: 7, name: 'Go' },
    { id: 8, name: 'Swift' },
  ]);

  const handleItemSelect = (item) => {
    setSelectedItems([...selectedItems, item]);
  };

  const handleRemoveItem = (item) => {
    setSelectedItems(selectedItems.filter((sitem) => sitem.id !== item.id));
  };

  
  const { colors } = useAppSelector((state) => state.theme.theme);
  const [videoUrl, setVideoUrl] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingBarVisible, setLoadingBarVisible] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFlatList, setFlatList] = useState(false);
  const browserRef = useRef<WebView>();
  const [receivedData, setReceivedData] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [showWebViewAgain, setShowWebViewAgain] = useState(true);
  const [history, setHistory] = useState('');
  const historytString = Storage.getString('history');
  const historyist = historytString ? historytString : "https://google.com";
  const [target, setTarget] = useState(historyist);
  const [url, setUrl] = useState(target);

  
  // Define your list of predetermined URLs
const predeterminedURLs = [
  'https://example.com',
  'https://example.org',
  'https://example.net',
];
const [suggestions, setSuggestions] = useState(predeterminedURLs);

const [modalVisible, setModalVisible] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

  const handleUrlSelection = (selectedUrl) => {
    setUrl(selectedUrl);
    setModalVisible(false);
  };
  const initialValues = {
    url: "",
    time: ""
  };

  const [data, setData] = useState(initialValues);

  useEffect(() => {
    console.log('saving history url', url);
    Storage.set('history', url);
    const historytString = Storage.getString('history');
    const historyist = historytString ? historytString : "https://google.com";
    console.log('current history url', historyist);
    const backAction = () => {
      browserRef.current.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    console.log('saving history url', url);
    Storage.set('history', url);
    const historytString = Storage.getString('history');
    const historyist = historytString ? historytString : "https://google.com";
    console.log('current history url', historyist);
    
  }, [url]);

  const searchEngines = {
    google: (uri: string) => `https://www.google.com/search?q=${uri}`,
  };

  function upgradeURL(uri: string, searchEngine = 'google') {
    console.log('received data in upgrade url', uri);
    const isURL = uri.split(' ').length === 1 && uri.includes('.');
    if (isURL) {
      // if (!uri.startsWith('http')) {
      //   return 'https://' + uri;
      // }
      return uri;
    }
    const encodedURI = encodeURI(uri);
    return searchEngines[searchEngine](encodedURI);
  }

  const goForward = () => {
    if (browserRef && canGoForward) {
      browserRef.current.goForward();
    }
  };

  const goBack = () => {
    if (browserRef && canGoBack) {
      browserRef.current.goBack();
    }
  };

  const reloadPage = () => {
    if (browserRef) {
      browserRef.current.reload();
    }
  };
  useEffect(() => {
    console.log('received data in useEffect');
    console.log(data.url);
    console.log('received data time');
    console.log(data.time);
    if(data.url)
    {console.log("new data receiving");
    setVideoUrl(data.url);
    setShowWebViewAgain(false);
  }
    // Specify dependencies to ensure the effect is re-run when the onMessage function changes
  }, [data.time]);
  
  const handleShowWebViewAgain = () => {
    setVideoUrl('');
    setShowWebViewAgain(true);
    setTarget(upgradeURL(url))

  };

//   const getLink = `
//   var Anchors = document.getElementsByTagName("*");

//   for (var i = 0; i < Anchors.length; i++) {
//       Anchors[i].addEventListener("click",
//           function (event) {
//             //event.preventDefault(); // Prevent default action (e.g., following the link)

//                   // Set controlsList attribute to "nodownload" for video links
//                   event.target.controlsList = "nodownload";

//                   var clickedElement = {
//                     elementType: event.target.tagName,
//                     href: event.target.href,
//                     parentElement: {
//                         tagName: event.target.parentElement ? event.target.parentElement.tagName : null,
//                         href: event.target.parentElement && event.target.parentElement.href,
//                     },
//                     timestamp: new Date(new Date().setMilliseconds(0)).toISOString(), // Add timestamp

//                     window.ReactNativeWebView.postMessage(JSON.stringify(clickedElement));
//               if (event.target.href) {
//                   // Check if the link points to a video (you can modify this condition based on your video types)
                  

//               }

//               // var clickedElement = {
//               //     elementType: event.target.tagName,
//               //     href: event.target.href,
//               //     parentElement: {
//               //         tagName: event.target.parentElement ? event.target.parentElement.tagName : null,
//               //         href: event.target.parentElement && event.target.parentElement.href,
//               //     },
//               // };
//               // window.ReactNativeWebView.postMessage(JSON.stringify(clickedElement));
//           },
//           true);
//   }

// function isExpectedVideoType(href) {
//     // Add your logic to determine whether the href is of the expected video type
//     // For example, check if the href ends with ".mp4" or ".webm" or any other video format
//     return href.endsWith(".mp4") || href.endsWith(".webm") || href.endsWith(".mkv");
// }
// `;
const getLink = `
var Anchors = document.getElementsByTagName("*");

for (var i = 0; i < Anchors.length; i++) {
    Anchors[i].addEventListener("click",
        function (event) {
          try{
            if (event.target.href.endsWith(".mp4") || event.target.href.endsWith(".webm") || event.target.href.endsWith(".mkv") || event.target.href.endsWith(".avi") || event.target.href.endsWith(".mov") || event.target.href.endsWith(".flv")) {
                // Check if the link points to a video (you can modify this condition based on your video types)
                event.preventDefault(); 

                // Set controlsList attribute to "nodownload" for video links
                event.target.href.controlsList = "nodownload";
            }
          }catch(err)
          {

          }

            var clickedElement = {
                elementType: event.target.tagName,
                href: event.target.href,
                parentElement: {
                    tagName: event.target.parentElement ? event.target.parentElement.tagName : null,
                    href: event.target.parentElement && event.target.parentElement.href,
                },
                timestamp: new Date(new Date().setMilliseconds(0)).toISOString(), // Add timestamp
            };
            window.ReactNativeWebView.postMessage(JSON.stringify(clickedElement));
        },
        true); break;
}
`; 

// Note: Adjust the isExpectedVideoType function based on the criteria for your expected video type.

const findHrefRecursively = (element) => {
  urlv = ''
  const traverseElement = (el) => {
    if (el && typeof el === 'object') {
      if (el.href) {
        // If the element has an href property, add it to the array
        // urls.push(el.href);
        urlv = el.href;
        
      }

      // Recursively traverse nested elements
      for (const key in el) {
        if (el.hasOwnProperty(key)) {
          traverseElement(el[key]);
        }
      }
    }
  };

  // Start the traversal
  traverseElement(element);

  // Return the array of URLs
  console.log('returning url:', urlv);
  return urlv;
};

// Filter URLs based on input text
const filterURLs = (text) => {
  const filteredURLs = predeterminedURLs.filter(url =>
    url.toLowerCase().includes(text.toLowerCase())
  );
  setSuggestions(filteredURLs);
};

const onMessage =async (payload) => {
  let dataPayload;
  
  try {
    dataPayload = JSON.parse(payload.nativeEvent.data);
    
  } catch (e) {}

  if (dataPayload) {
    const message = dataPayload;
    
    // Extract href from the message
    // console.log(message);
    // console.log(href);
    const jsonString = message;

    const text = message;

    
    

    

    const url = findHrefRecursively(dataPayload);
    
    const newData = dataPayload;
    // Clear the previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    const newTimeoutId = setTimeout(() => {
      // Check if no new data has been received within the timeout
      if (newData === receivedData) {
        // No new data, perform actions accordingly
        console.log('No new data received within the timeout');
      }else{
        console.log('Receiving new data');
      }
    }, 1000); // Adjust the timeout duration as needed (in milliseconds)

    // Save the new timeout ID
    setTimeoutId(newTimeoutId);

    console.log(newTimeoutId);
    const href = url;
    console.log("url in onmessage");
    console.log(href);

      // Check if the href contains a certain video format extension (e.g., '.avi')
      if (
        (href && (href.toLowerCase().endsWith('.avi') ||
                  href.toLowerCase().endsWith('.mkv') ||
                  href.toLowerCase().endsWith('.mp4') ||
                  href.toLowerCase().endsWith('.mov') ||
                  href.toLowerCase().endsWith('.wmv') ||
                  href.toLowerCase().endsWith('.mpg') ||
                  href.toLowerCase().endsWith('.mpeg') ||
                  href.toLowerCase().endsWith('.flv') ||
                  href.toLowerCase().endsWith('.webm') ||
                  href.toLowerCase().endsWith('.ogg') ||
                  href.toLowerCase().endsWith('.ogv') ||
                  href.toLowerCase().endsWith('.m4v')))
      ) {
        // Set the urls state and hide the WebView
        console.log('Blocked navigation to in onMessage:', href);
        newDatau = {
          url: href,
          time: dataPayload.timestamp
        };
    
        setData(newDatau);
    
        //setReceivedData(url, dataPayload.timestamp);
        
          // console.log(extractMediaName(href));
    //  setTitle(extractMediaName(href));
    // webViewRef.stopLoading();
    // if(name)
    // {
    //   console.log("already got name");

    // }else{
    //   console.log("inserting  name");
    //   // dispatch(setName(extractMediaName(href)));
    //   //  dispatch(urlDis(href));
    //   //  dispatch(webviewStateDis(false));
    //   //  dispatch(bottomBarDis(false));

    // }
   
    //     if (webViewRef.current)
    //     {
          
    // //  dispatch(urlDis(href));
    //       // dispatch(setAge(age));
    //       // setToggleBar(false);
    //       // toggleBottomTab(false);
    //       // setShowWebView(false);
          
          
    //       // webViewRef.current.stopLoading();
    //       // setUrls(href);
    //       // setShowWebView(false);
          
          
          
     
    //   // setUrls(href);
      
      
     
    //     }
        
      } else {
        console.log('Not a valid video URL:', href);
      }
    if (dataPayload.type === 'Console') {
      console.info(`[Console] ${JSON.stringify(dataPayload.data)}`);
    } 
    else if (dataPayload.type === 'ClickedElement') {
        // Handle the clicked element information
        const href = dataPayload.data.href;
  
        // Update the state or perform other actions based on the href value
        
        // setShowWebView(false);
  
        // ... additional logic or state changes based on the href value
      }else {
      console.log(dataPayload)
    }
    
    
  
  }
  

  
   
};

  return (
    <>
      {showWebViewAgain ? (
        <Fragment>
        <View style={[styles.container, { backgroundColor: colors.background }]}>


<View style={styles.searchBar}>
        


<SearchableDropdown
        multi={true}
        selectedItems={selectedItems}
        onItemSelect={handleItemSelect}
        containerStyle={{ padding: 10 }}
        onRemoveItem={handleRemoveItem}
        textInputStyle={{
          backgroundColor: 'black',

        }}
        itemStyle={{
          padding: 10,
          marginTop: 2,
          backgroundColor: '#ddd',
          borderColor: '#bbb',
          borderWidth: 1,
          borderRadius: 5,
        }}
        itemTextStyle={{ color: '#222' }}
        itemsContainerStyle={{ maxHeight: 140 }}
        items={items}
        defaultIndex={2}
        chip={true}
        resetValue={false}
        textInputProps={{
          placeholder: "placeholder",
          underlineColorAndroid: "transparent",
          style: {
            padding: 12,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
          
          },
          // onTextChange: console.log(text),
        }}
        listProps={{
          nestedScrollEnabled: true,
        }}
      />


        <View
          style={[
            styles.progressBar,
            {
              width: `${loadingProgress * 100}%`,
              opacity: loadingBarVisible ? 1 : 0,
              backgroundColor: colors.primary,
            },
          ]}
        ></View>
        <View
          style={{
            position: 'absolute',
            // right: 10,
            borderRadius: 5,
            backgroundColor: colors.background,
          }}
        >
          <TouchableOpacity onPress={() => {setTarget(url); setFlatList(false)}}>
            <Ionicons
              name={'arrow-forward-circle-outline'}
              size={35}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
        {/* <View style={styles.searchBar}>
        
          <TextInput
            style={[
              styles.searchBarInput,
              { borderColor: colors.primary, color: colors.text },
            ]}
            selection={!isFocused ? { start: 0, end: 0 } : null}
            blurOnSubmit
            keyboardType="url"
            onChangeText={text => {
              setUrl(text);
              filterURLs(text);
            }}
            // onChangeText={(text) => setUrl(text)}
            onSubmitEditing={() => {
              Keyboard.dismiss;
              setTarget(upgradeURL(url));
              setFlatList(false);
            }}
            value={url}
            onFocus={() => {
              setIsFocused(true);
              setFlatList(true)
            }}
            onBlur={() =>{ setIsFocused(false);
              // setFlatList(false)
            }}
          />
          <View
            style={[
              styles.progressBar,
              {
                width: `${loadingProgress * 100}%`,
                opacity: loadingBarVisible ? 1 : 0,
                backgroundColor: colors.primary,
              },
            ]}
          ></View>
          <View
            style={{
              position: 'absolute',
              right: 10,
              borderRadius: 5,
              backgroundColor: colors.background,
            }}
          >
            <TouchableOpacity onPress={() => {setTarget(url); setFlatList(false)}}>
              <Ionicons
                name={'arrow-forward-circle-outline'}
                size={35}
                color={colors.text}
              />
            </TouchableOpacity>
          </View> */}

          
          
          
          
          {/* <FlatList
        data={suggestions}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setTarget(item)}>
            <Text style={{ padding: 10 }}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => item}
      /> */}
      


          
  
        
    {/* <Text>
        <AutocompleteDropdown
  clearOnFocus={false}
  closeOnBlur={true}
  closeOnSubmit={false}
  initialValue={{ id: '2' }} // or just '2'
  onSelectItem={setSelectedItem}
  dataSet={[
    { id: '1', title: 'Alpha' },
    { id: '2', title: 'Beta' },
    { id: '3', title: 'Gamma' },
  ]}
/>;
</Text> */}
        
        </View>
        {isFlatList && (
            <SafeAreaView style={styles.containerFlatList}>
        <FlatList
        data={[
          {key: 'http://new.circleftp.net/'},
          {key: 'http://circleftp.net/'},
          {key: 'http://172.16.50.4'},
          {key: 'http://circleftp.net/'},
          {key: 'http://circleftp.net/'},
          {key: 'http://circleftp.net/'},
          {key: 'http://circleftp.net/'},
          {key: 'http://circleftp.net/'},
          {key: 'http://circleftp.net/'},
          {key: 'http://circleftp.net/'},
          {key: 'http://circleftp.net/'},
          {key: 'http://circleftp.net/'},
          {key: 'http://circleftp.net/'},

        ]}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {
            
            setUrl(item.key);
            setTarget(item.key);
          setFlatList(false)
          }}>
            <Text style={styles.flatItem}>{item.key}</Text>
          </TouchableOpacity>
        )}
        
      />
          </SafeAreaView>
      )}
       
        <WebView
          allowsLinkPreview
          ref={browserRef}
          source={{ uri: target }}
          pullToRefreshEnabled
          pagingEnabled
          setSupportMultipleWindows={false}
          injectedJavaScript={getLink}
          onMessage={onMessage}
          onLoadStart={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            setLoadingBarVisible(nativeEvent.loading);
            setUrl(nativeEvent.url);
            setCanGoBack(nativeEvent.canGoBack);
            setCanGoForward(nativeEvent.canGoForward);
          }}
          onLoadEnd={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            setLoadingBarVisible(nativeEvent.loading);
            setTarget(nativeEvent.url);
          }}
          onLoadProgress={({ nativeEvent }) => {
            setLoadingProgress(nativeEvent.progress);
          }}
        />
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={goBack}>
            <Ionicons
              name="ios-arrow-back"
              size={32}
              color={canGoBack ? colors.primary : colors.background}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={reloadPage}>
            <Ionicons name="ios-refresh" size={32} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={goForward}>
            <Ionicons
              name="ios-arrow-forward"
              size={32}
              color={canGoForward ? colors.primary : colors.background}
            />
          </TouchableOpacity>
        </View>
      </View>
      </Fragment>
      ) : (
        <App
          videoUri={videoUrl}
          showWebViewAgain={handleShowWebViewAgain}
          // titleName={name}
        />
      )}
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  containerFlatList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    // backgroundColor: 'green'
    
  },
  flatItem: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: 'white'
  },
  searchBar: {
    backgroundColor: 'white',
   
    // flexDirection: 'row',
 
    flexDirection: 'column',
    flexWrap: 'wrap',

  },
  searchBarInput: {
    height: 40,
    borderWidth: 0.5,
    marginTop: 5,
    marginHorizontal: 10,
    padding: 5,
    paddingRight: 45,
    borderRadius: 5,
    width: '95%',
    overflow: 'hidden',
  },
  bottomBar: {
    width: '100%',
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  progressBar: {
    height: 2,
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    marginTop: '50%',
    width: '100%',
    maxHeight: '70%',
  },
  urlItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    color: 'white',
    width: '100%',
  },
  urlText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: 16,
  },
});

export default Web;
