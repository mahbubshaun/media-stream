/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { VLCPlayer, VlCPlayerView } from './react-native-vlc-media-player';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
// import Orientation from 'react-native-orientation';
import { setTabbarVisible } from '../features/files/tabbarStyleSlice';

const calcVLCPlayerHeight = (windowWidth, aspetRatio) => {
  return windowWidth * aspetRatio;
};

const { width, height } = Dimensions.get('window');
const App: ({}) => React$Node = (props) => {
  const dispatch = useAppDispatch();
  const [someValue, setSomeValue] = useState(null);
  const [pickerData, setPickerData] = useState(null);
  const [dataReceived, setDataReceived] = useState(false); // Flag to track if data is received
  // Function to handle the data from onLoad in App component
  const handleSomeOtherFunction = (data) => {
    // Do something with the data
    setSomeValue(data);
  };

  useEffect(() => {
    dispatch(setTabbarVisible(false));

    return () => {
      dispatch(setTabbarVisible(true));
    };
  }, []);
  const [screenDimensions, setScreenDimensions] = useState(
    Dimensions.get('window')
  );

  useEffect(() => {
    const updateScreenDimensions = () => {
      setScreenDimensions(Dimensions.get('window'));
      console.log(Dimensions.get('window').width);
      console.log(Dimensions.get('window').height);
    };

    // Event listener to update dimensions on orientation change
    Dimensions.addEventListener('change', updateScreenDimensions);

    // Cleanup event listener on component unmount
    return () => {
      Dimensions.removeEventListener('change', updateScreenDimensions);
    };
  }, []);
  const { videoUri, showWebViewAgain, titleName } = props;

  // Function to handle the condition that triggers showing the WebView again
  const handleConditionMet = () => {
    // Do some logic here to determine if the condition is met
    // For example, you can check a state or some other variable

    // When the condition is met, call the showWebViewAgain function
    showWebViewAgain();
  };

  const handleVideoLoad = (data) => {
    // Do something with the data from onLoad callback
    console.log('Video loaded:', data);
    // You can perform any other actions with the data here
    if (!dataReceived) {
      // Do something with the data if needed
      // For example, update the state with the received data
      setPickerData(data);
      setDataReceived(true); // Set the flag to true so that data won't be updated again
    }
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          // // style={styles.scrollView}>
          // style={{ width, height }}
          // contentContainerStyle={{ flexGrow: 1 }}>
          style={[
            styles.scrollView,
            { width: screenDimensions.width, height: screenDimensions.height },
          ]}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.container}>
            {/* <VLCPlayer
            source={{
              initType: 2,
              hwDecoderEnabled: 1,
              hwDecoderForced: 1,
              uri:
                'http://ftp4.circleftp.net/FILE/English%20%26%20Foreign%20TV%20Series/%28Un%29Well%20%28TV%20Series%202020-%29/Unwell.S01.1080p.NF.WEBRip.DDP5.1.x264-AMRAP%5Brartv%5D/Unwell.S01E01.1080p.WEB.H264-AMRAP.mkv',
              initOptions: [
                // '--no-audio',
                '--rtsp-tcp',
                // '--network-caching=150',
                // '--rtsp-caching=150',
                // '--no-stats',
                // '--tcp-caching=150',
                // '--realrtsp-caching=150',
              ],
            }}
            autoplay={true}
            autoAspectRatio={true}
            resizeMode="cover" 
            // videoAspectRatio={"4:3"}
            isLive={true}
            autoReloadLive={true}
            style={{ height: calcVLCPlayerHeight( Dimensions.get('window').width, 3/4), marginTop: 30}}
            enableControls={true}
          /> */}
            {/* <View style={{ width: 100%, height: 800, backgroundColor: 'red' }} /> */}
            <VlCPlayerView
              url={videoUri}
              ggUrl={videoUri}
              autoplay={false}
              showControls={true}
              showSlider={true}
              showLeftButton={false}
              showRightButton={true}
              title={titleName}
              autoAspectRatio={true}
              resizeMode="cover"
              showTitle={true}
              //Orientation={Orientation}
              // Pass the callback function as a prop
              onLoad={handleVideoLoad}
              pickerData={pickerData}
              onLeftPress={() => {
                handleConditionMet();
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  // scrollView: {
  //   flex: 1,
  //   backgroundColor: 'red',

  //   // justifyContent: 'center',
  //   // alignItems: 'center',

  // },
  // heading:{
  //   fontSize: 30,
  //   fontWeight: '700',
  //   color: Colors.black,
  // },
  // engine: {
  //   position: 'absolute',
  //   right: 0,
  // },
  // body: {

  //   // backgroundColor: Colors.white,
  //   flex: 1,

  // },
  // sectionContainer: {
  //   marginTop: 10,
  //   paddingHorizontal: 24,
  // },
  // sectionTitle: {
  //   fontSize: 24,
  //   fontWeight: '600',
  //   color: Colors.black,
  // },
  // sectionDescription: {
  //   marginTop: 8,
  //   fontSize: 18,
  //   fontWeight: '400',
  //   color: Colors.dark,
  // },
  // highlight: {
  //   fontWeight: '700',
  // },
  // footer: {
  //   color: Colors.dark,
  //   fontSize: 12,
  //   fontWeight: '600',
  //   padding: 4,
  //   paddingRight: 12,
  //   textAlign: 'right',
  // },
  scrollView: {
    width,
    height,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});

export default App;
