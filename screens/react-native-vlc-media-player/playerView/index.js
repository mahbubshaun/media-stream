/**
 * Created by yuanzhou.xu on 2018/5/15.
 */

import React, { Component } from 'react';
import {
  StatusBar,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
  Dimensions,
  BackHandler,
} from 'react-native';
// import { Slider } from 'react-native-slider';


import VLCPlayerView from './VLCPlayerView';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getStatusBarHeight } from './SizeController';
import Orientation from 'react-native-orientation-locker';
const statusBarHeight = getStatusBarHeight();
const _fullKey = 'commonVideo_android_fullKey';
let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;
export default class CommonVideo extends Component {
  constructor(props) {
    super(props);
    this.url = '';
    this.initialHeight = 200;

    if (props.widthCamera) {
      deviceWidth = props.widthCamera
    }
  }

  static navigationOptions = {
    header: null,
  };

  state = {
    isEndGG: false,
    isFull: false,
    currentUrl: '',
    storeUrl: '',
    currentPosition: 0,
  };

  static defaultProps = {
    height: 250,
    showGG: false,
    ggUrl: '',
    url: '',
    showBack: true,
    showTitle: false,
  };

  static propTypes = {
    /**
     * 视频播放结束
     */
    onEnd: PropTypes.func,

    /**
     * 广告头播放结束
     */
    onGGEnd: PropTypes.func,
    /**
     * 开启全屏
     */
    startFullScreen: PropTypes.func,
    /**
     * 关闭全屏
     */
    closeFullScreen: PropTypes.func,
    /**
     * 返回按钮点击事件
     */
    onLeftPress: PropTypes.func,
    /**
     * 标题
     */
    title: PropTypes.string,
    /**
     * 是否显示返回按钮
     */
    showBack: PropTypes.bool,
    /**
     * 是否显示标题
     */
    showTitle: PropTypes.bool,

    onGoLivePress: PropTypes.func,

    onReplayPress: PropTypes.func,
  };

  _onOrientationDidChange = (orientation) => {
    if (orientation == 'LANDSCAPE-LEFT') {
      //do something with landscape left layout
    } else {
      //do something with portrait layout
    }
  };

  
  componentWillMount() {
    //The getOrientation method is async. It happens sometimes that
    //you need the orientation at the moment the js starts running on device.
    //getInitialOrientation returns directly because its a constant set at the
    //beginning of the js code.
    var initial = Orientation.getInitialOrientation();
    Orientation.lockToPortrait();
    if (initial === 'PORTRAIT') {
      //do stuff
    } else {
      //do other stuff
    }
  }

  onPressButton = () => {
    // Get the callback from props
    const { onCallback } = this.props;

    // Call the callback with data
    const dataToSend = 'Information from child component';
    onCallback(dataToSend);
  };

  static getDerivedStateFromProps(nextProps, preState) {
    let { url } = nextProps;
    let { currentUrl, storeUrl } = preState;
    if (url && url !== storeUrl) {
      if (storeUrl === "") {
        return {
          currentUrl: url,
          storeUrl: url,
          isEndGG: false,
        };
      } else {
        return {
          currentUrl: "",
          storeUrl: url,
          isEndGG: false,
        };
      }
    }
    return null;
  }


  componentDidUpdate(prevProps, prevState) {

    

    if (this.props.url !== prevState.storeUrl && this._componentMounted) {
      this.setState({
        storeUrl: this.props.url,
        currentUrl: this.props.url
      })
    }
  }

  componentDidMount() {

    Orientation.getAutoRotateState((rotationLock) => this.setState({rotationLock}));
    //this allows to check if the system autolock is enabled or not.

    Orientation.lockToPortrait(); //this will lock the view to Portrait
    //Orientation.lockToLandscapeLeft(); //this will lock the view to Landscape
    //Orientation.unlockAllOrientations(); //this will unlock the view to all Orientations

    //get current UI orientation
    /*
    Orientation.getOrientation((orientation)=> {
      console.log("Current UI Orientation: ", orientation);
    });

    //get current device orientation
    Orientation.getDeviceOrientation((deviceOrientation)=> {
      console.log("Current Device Orientation: ", deviceOrientation);
    });
    */

    Orientation.addOrientationListener(this._onOrientationDidChange);

    this._componentMounted = true
    StatusBar.setBarStyle("light-content");
    let { style, isGG } = this.props;

    if (style && style.height && !isNaN(style.height)) {
      this.initialHeight = style.height;
    }
    this.setState({
      currentVideoAspectRatio: deviceWidth + ":" + this.initialHeight,
    });

    let { isFull } = this.props;
    console.log(`isFull == ${isFull}`);
    if (isFull) {
      this._toFullScreen();
    }
  }
  // componentWillMount() {
  //   //The getOrientation method is async. It happens sometimes that
  //   //you need the orientation at the moment the js starts running on device.
  //   //getInitialOrientation returns directly because its a constant set at the
  //   //beginning of the js code.
  //   var initial = Orientation.getInitialOrientation();
  //   console.log('initial value');
  //   console.log(initial);
  //   if (initial === 'PORTRAIT') {
  //     //do stuff
  //   } else {
  //     //do other stuff
  //   }
  // }
  componentWillUnmount() {
    Orientation.removeOrientationListener(this._onOrientationDidChange);

    this._componentMounted = false;

    let { isFull } = this.props;
    if (isFull) {
      this._closeFullScreen();
    }
  }

  _closeFullScreen = () => {
    let { closeFullScreen, BackHandle } = this.props;
    // if (this._componentMounted) {
    //   this.setState({ isFull: false, currentVideoAspectRatio: deviceWidth + ":" + this.initialHeight, });
    // }
    this.setState({ isFull: false });
    BackHandle && BackHandle.removeBackFunction(_fullKey);
    StatusBar.setHidden(false);
    Orientation.lockToPortrait();
    //StatusBar.setTranslucent(false);
    // this._componentMounted && closeFullScreen && closeFullScreen();
  };

  _toFullScreen = () => {
    console.log("orientation called");
    let { BackHandle } = this.props;
    StatusBar.setHidden(true);

    var initial = Orientation.getInitialOrientation();
    console.log('initial value');
    console.log(initial);
    Orientation.lockToLandscapeLeft();
    this.setState({ isFull: true });
    BackHandle && BackHandle.addBackFunction(_fullKey, this._closeFullScreen);
    if (initial === 'PORTRAIT') {
      //do stuff
      //Orientation.lockToLandscapeLeft();
      //this.setState({ isFull: true });

     // BackHandle && BackHandle.addBackFunction(_fullKey, this._closeFullScreen);
     // Orientation.lockToPortrait();
      //do other stuff
    }
    //Orientation.lockToLandscapeLeft;
    // let { startFullScreen, BackHandle, Orientation } = this.props;
    // //StatusBar.setTranslucent(true);
    
    // startFullScreen && startFullScreen();
     //Orientation && Orientation.lockToLandscapeLeft && Orientation.lockToLandscapeLeft;
    // // console.log('to full screen');
    // // console.log(deviceHeight + ":" + deviceWidth);
    // // this.setState({ isFull: true, currentVideoAspectRatio: '774.7555555555556' + ":" + '384' });
    // StatusBar.setHidden(true);
    // BackHandle && BackHandle.addBackFunction(_fullKey, this._closeFullScreen);
  };

  _onLayout = (e) => {
    let { width, height } = e.nativeEvent.layout;
    console.log(e.nativeEvent.layout);
    if (width * height > 0) {
      this.width = width;
      this.height = height;
      if (!this.initialHeight) {
        this.initialHeight = height;
      }
    }
  }
  
  render() {
    let { url, pickerData, ggUrl, showGG, onGGEnd, onEnd, style, height, title, onLeftPress, onLoad, showBack, showTitle, closeFullScreen, videoAspectRatio, fullVideoAspectRatio, showRightButton } = this.props;
    let { isEndGG, isFull, currentUrl } = this.state;
    let currentVideoAspectRatio = '';
    // if (isFull) {
    //   currentVideoAspectRatio = fullVideoAspectRatio;
    // } else {
    //   currentVideoAspectRatio = videoAspectRatio;
    // }
    if (!currentVideoAspectRatio) {
      let { width, height } = this.state;
      currentVideoAspectRatio = this.state.currentVideoAspectRatio;
    }
    let realShowGG = false;
    let type = '';
    let ggType = '';
    let showVideo = false;
    let showTop = false;
    if (showGG && ggUrl && !isEndGG) {
      realShowGG = true;
    }
    if (currentUrl) {
      if (!showGG || (showGG && isEndGG)) {
        showVideo = true;
      }
      if (currentUrl.split) {
        let types = currentUrl.split('.');
        if (types && types.length > 0) {
          type = types[types.length - 1];
        }
      }
    }
    if (ggUrl && ggUrl.split) {
      let types = ggUrl.split('.');
      if (types && types.length > 0) {
        ggType = types[types.length - 1];
      }
    }
    if (!showVideo && !realShowGG) {
      showTop = true;
    }
    const windowHeight = Dimensions.get('window').height;
    return (
      <View
        //onLayout={this._onLayout}
        style={[false ? styles.container : { flex: 1, backgroundColor: '#000' }, style]}>
        {showTop && <View style={styles.topView}>
          <View style={styles.backBtn}>
            {showBack && <TouchableOpacity
              onPress={() => {
                if (false) {
                  closeFullScreen && closeFullScreen();
                } else {
                  onLeftPress && onLeftPress();
                }
              }}
              style={styles.btn}
              activeOpacity={0.8}>
              <Icon name={'chevron-left'} size={30} color="#fff" />
            </TouchableOpacity>
            }
            <View style={{ justifyContent: 'center', flex: 1, marginRight: 10 }}>
              {showTitle &&
                <Text style={{ color: '#fff', fontSize: 16 }} numberOfLines={1}>{title}</Text>
              }
            </View>
          </View>
        </View>
        }
        {realShowGG && (
          <VLCPlayerView
            {...this.props}
            videoAspectRatio={currentVideoAspectRatio}
            uri={ggUrl}
            source={{ uri: ggUrl, type: ggType }}
            type={ggType}
            isGG={true}
            showBack={showBack}
            showTitle={showTitle}
            showRightButton={showRightButton}
            isFull={isFull}
            onEnd={() => {
              onGGEnd && onGGEnd();
              this.setState({ isEndGG: true });
            }}
            onLeftPress={onLeftPress}
            startFullScreen={this._toFullScreen}
            closeFullScreen={this._closeFullScreen}
          />
        )}

        {showVideo && (
          // <View>
          <VLCPlayerView
            {...this.props}
            uri={currentUrl}
            videoAspectRatio={'2.35:1'}
            onLeftPress={onLeftPress}
            title={title}
            type={type}
            isFull={isFull}
            showBack={showBack}
            showTitle={showTitle}
            showRightButton={showRightButton}
            hadGG={true}
            isEndGG={isEndGG}
            pickerData={pickerData}
            //initPaused={this.state.paused}
            style={showGG && !isEndGG ? { position: 'absolute', zIndex: -1 } : {}}
            source={{ uri: currentUrl, type: type }}
            startFullScreen={this._toFullScreen}
            closeFullScreen={this._closeFullScreen}
            onEnd={() => {
              onEnd && onEnd();
            }}
            onPress={this.onPressButton}
          />
          //  <Slider
          //   style={{ width: '100%', marginTop: 5 }}
          //   minimumValue={0}
          //   maximumValue={100}
          //   value={this.state.currentPosition}
          //   onValueChange={(value) => {
          //     // Handle seekbar value change
          //     // You may want to update the video position here
          //     // based on the value of the slider
          //   }}
          // />
         
        //  </View>
        )}
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#000'
    backgroundColor: 'red'
  },
  topView: {
    top: Platform.OS === 'ios' ? statusBarHeight : 0,
    left: 0,
    height: 45,
    position: 'absolute',
    width: '100%'
  },
  backBtn: {
    height: 45,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  btn: {
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    height: 40,
    borderRadius: 20,
    width: 40,
  }
});
