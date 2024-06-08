/**
 * Created by yuanzhou.xu on 2018/5/16.
 */
import React, { Component } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from 'react-native-slider';
import PropTypes from 'prop-types';
import TimeLimt from './TimeLimit';
import { Picker } from '@react-native-picker/picker';
import RBSheet from 'react-native-raw-bottom-sheet';

export default class ControlBtn extends Component {
  constructor(props) {
    super(props);
    this.slider = React.createRef();
    console.log('audio tracks:', this.props.pickerData.audioTracks);
    console.log('sub tracks:', this.props.pickerData.textTracks);
    this.audioTracks = this.props.pickerData.audioTracks || [];

    this.subTracks = this.props.pickerData.textTracks || [];

    this.bottomSheetRef = React.createRef();
    this.options = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      // Add more options as needed
    ];
    this.state = {
      audioTrackData: 1,
      selectedValue: 1, // Set a default value
      selectedValueForSub: 2, // Set a default value
      subTrackData: 2,
      pickerItems: [
        { label: 'Rating', value: 'rating' },
        { label: 'Like count', value: 'like_count' },
        { label: 'Title', value: 'title' },
        // Add more default items as needed
      ],
      showDropdown: false, // Add this state for dropdown visibility
    };
  }
  static defaultProps = {
    titleGolive: 'Go live',
    showLeftButton: true,
    showMiddleButton: true,
    showRightButton: true,
  };

  // Function to add a new item to the Picker dynamically
  addPickerItem = (label, value) => {
    // Create a new item object
    const newItem = { label, value };

    // Update state to include the new item
    this.setState((prevState) => ({
      pickerItems: [...prevState.pickerItems, newItem],
    }));
  };

  handleSlidingComplete = (value) => {
    const { minimumValue, maximumValue } = this.slider;
    const touchPercent = (value - minimumValue) / (maximumValue - minimumValue);
    const newValue =
      minimumValue + touchPercent * (maximumValue - minimumValue);
    this.props.currentTime = newValue;
    console.log(newValue);
  };

  _getTime = (data = 0) => {
    let hourCourse = Math.floor(data / 3600);
    let diffCourse = data % 3600;
    let minCourse = Math.floor(diffCourse / 60);
    let secondCourse = Math.floor(diffCourse % 60);
    let courseReal = '';
    if (hourCourse) {
      if (hourCourse < 10) {
        courseReal += '0' + hourCourse + ':';
      } else {
        courseReal += hourCourse + ':';
      }
    }
    if (minCourse < 10) {
      courseReal += '0' + minCourse + ':';
    } else {
      courseReal += minCourse + ':';
    }
    if (secondCourse < 10) {
      courseReal += '0' + secondCourse;
    } else {
      courseReal += secondCourse;
    }
    return courseReal;
  };

  render() {
    let {
      paused,
      isFull,
      showGG,
      showSlider,
      showGoLive,
      onGoLivePress,
      onReplayPress,
      onPausedPress,
      onFullPress,
      onValueChange,
      onSlidingComplete,
      currentTime,
      totalTime,
      onLeftPress,
      title,
      onEnd,
      titleGolive,
      showLeftButton,
      showMiddleButton,
      showRightButton,
      style,
    } = this.props;
    const { selectedValue, pickerItems, selectedValueForSub } = this.state;
    const { showDropdown } = this.state;

    return (
      <View style={[styles.controls, style]}>
        <View style={styles.controlContainer}>
          <TouchableOpacity style={styles.controlContent} activeOpacity={1}>
            <View>
              {showSlider && totalTime > 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 10,
                    // Add padding horizontally
                  }}
                >
                  <View style={{}}>
                    <Text style={{ fontSize: 15, color: '#fff' }}>
                      {this._getTime(currentTime) || 0}
                    </Text>
                  </View>
                  <View style={{}}>
                    <Text
                      style={{ fontSize: 15, color: '#fff', marginRight: 10 }}
                    >
                      {this._getTime(totalTime) || 0}
                    </Text>
                  </View>
                </View>
              )}

              {showSlider && totalTime > 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    // Add padding horizontally
                    marginBottom: 10,
                  }}
                >
                  <View style={styles.progress}>
                    <Slider
                      minimumTrackTintColor="#30a935"
                      thumbStyle={styles.thumb}
                      style={{ flex: 1 }} // Adjust width to take remaining space
                      value={currentTime}
                      maximumValue={totalTime}
                      step={1}
                      onValueChange={(value) => {
                        onValueChange && onValueChange(value);
                      }}
                      onSlidingComplete={(value) => {
                        onSlidingComplete && onSlidingComplete(value);
                      }}
                    />
                  </View>
                </View>
              )}
            </View>
            <View>
              {showMiddleButton && (
                <TouchableOpacity
                  activeOpacity={1}
                  // onPress={() => {
                  //   onPausedPress && onPausedPress(!paused);
                  // }}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center', // Center the children vertically
                  }}
                >
                  <Icon
                    name={'subtitles'}
                    size={30}
                    color="#fff"
                    style={{ marginRight: 10 }}
                    onPress={() => this.bottomSheetRef.current.open()}
                  />

                  <Icon
                    name={
                      paused ? 'play-circle-outline' : 'pause-circle-outline'
                    }
                    onPress={() => {
                      onPausedPress && onPausedPress(!paused);
                    }}
                    size={40}
                    color="#fff"
                    style={{ marginRight: '0%' }}
                  />

                  <Icon
                    name={isFull ? 'fullscreen-exit' : 'fullscreen'}
                    size={30}
                    color="#fff"
                    onPress={() => {
                      onFullPress && onFullPress(!isFull);
                    }}
                  >
                    {' '}
                  </Icon>
                </TouchableOpacity>
              )}
            </View>
            <View>
              <RBSheet
                ref={this.bottomSheetRef}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={Dimensions.get('window').height * 0.9}
                customStyles={{
                  wrapper: {
                    backgroundColor: 'black',
                  },
                  draggableIcon: {
                    backgroundColor: 'white',
                  },
                  container: {
                    borderRadius: 30,
                    backgroundColor: '#31364A',
                    alignItems: 'center',
                    justifyContent: 'flex-start', // Adjusted to push contents to the top
                    paddingTop: 120, // Add top padding to further push contents up
                  },
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  Select Audio Track
                </Text>
                <Picker
                  selectedValue={selectedValue}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({ selectedValue: itemValue });
                    this.props.updateAudioTrack(itemValue);
                  }}
                  style={{
                    color: 'white',
                    width: '100%',
                    textAlign: 'center',
                    marginTop: 20,
                  }} // Set text color and center the text for the Picker
                  dropdownIconColor="white"
                  dropdownIconRippleColor="white"
                  color="red"
                  itemStyle={{ backgroundColor: 'red', color: 'red' }} // Set the background color of the items
                >
                  {this.audioTracks.map((track, index) => (
                    <Picker.Item
                      key={index}
                      label={track.name}
                      value={track.id}
                    />
                  ))}
                </Picker>

                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  Select Sub-title
                </Text>
                <Picker
                  selectedValue={selectedValueForSub}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({ selectedValueForSub: itemValue });
                    this.props.updateSubTrack(itemValue);
                  }}
                  style={{
                    color: 'white',
                    width: '100%',
                    textAlign: 'center',
                    marginTop: 20,
                  }} // Set text color and center the text for the Picker
                  dropdownIconColor="white"
                  dropdownIconRippleColor="white"
                  color="red"
                  itemStyle={{ backgroundColor: 'red', color: 'red' }} // Set the background color of the items
                >
                  {this.subTracks.map((track, index) => (
                    <Picker.Item
                      key={index}
                      label={track.name}
                      value={track.id}
                    />
                  ))}
                </Picker>
              </RBSheet>
              {/* {showDropdown && (
              <DropDownPicker
                items={this.options}
                containerStyle={{ marginTop: 10, marginLeft: 10, marginRight: 10 }}
                style={{ backgroundColor: '#fafafa' }}
                itemStyle={{ justifyContent: 'flex-start' }}
                dropDownStyle={{ backgroundColor: '#fafafa' }}
                onChangeItem={(item) => {
                  // Handle the selected item
                  this.setState({
                    showDropdown: false,
                  });
                }}
              />
            )} */}
            </View>
            <View style={styles.controlContent2}>
              <View style={styles.right}>
                {showLeftButton ? (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      onReplayPress && onReplayPress();
                    }}
                    style={{
                      width: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name={'replay'} size={30} color="#fff" />
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: 50 }} />
                )}
                <Text style={{ fontSize: 11, color: '#fff' }}> </Text>
              </View>

              <View style={styles.right}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    onGoLivePress && onGoLivePress();
                  }}
                >
                  <Text style={{ fontSize: 11, color: '#fff' }}>
                    {showGoLive ? titleGolive : '       '}
                  </Text>
                </TouchableOpacity>
                {true ? (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      onFullPress && onFullPress(!isFull);
                    }}
                  >
                    <Icon
                      name={isFull ? 'fullscreen-exit' : 'fullscreen'}
                      size={30}
                      color="#fff"
                    />
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: 50 }} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#000',
  },
  controls: {
    width: '100%',
    height: 1500,
    fontWeight: '600',
  },
  rateControl: {
    flex: 0,
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
    //backgroundColor: 'rgba(0,0,0,0.5)',
    width: 120,
    height: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,
  },
  controlOption: {
    textAlign: 'center',
    fontSize: 13,
    color: '#fff',
    width: 30,
    fontWeight: '600',
    //lineHeight: 12,
  },
  controlContainer: {
    // flex: 1,
    //padding: 5,
    // alignItems: 'center',
    // justifyContent: 'center',
    marginBottom: 20,
    fontWeight: '600',
    height: 200,
  },

  controlContent: {
    width: '100%',
    height: 100,
    //borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
    fontWeight: '600',
    height: 200,
  },
  controlContent2: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    fontWeight: '600',
    height: 200,
  },

  progress: {
    flex: 1,
    borderRadius: 500,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    //flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  GG: {
    backgroundColor: 'rgba(255,255,255,1)',
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
