import React, { Component } from 'react';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { Text, Image, View, StatusBar, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

import MovieListWatchList from "../components/movie-list copy";
import { config } from '../components/constant';

import { style } from "../screens/style/base";
import { movie } from "../screens/style/movie";

import loading from "../assets/images/loading.gif";
import { Storage } from "../components/Storage";
import { withNavigationFocus } from '@react-navigation/native';
class Watchlist extends Component{
    constructor(props){
        super(props);
        this.state = {
            // order: this.props.route.params.order,
            // genre: this.props.route.params.genre,
            name: this.props.route.params.name,
            // id: this.props.route.params.id,
            movies: [],
            page: 1,
            loading: false,
            refresh: false,
            hasMore: true,

            data: this.getInitialListData(this.props.route.params.name),
            
            width: ((Dimensions.get('window').width < Dimensions.get('window').height ? Dimensions.get('window').width : Dimensions.get('window').height)/2) - 23,

            sortBy: 'rating'
        };
        this.sortByChange = this.sortByChange.bind(this);
    }

    getInitialListData(name) {
        // Use a switch statement or any other logic to determine the initial sortBy value based on the name
        switch (name) {
          case 'WatchList':
            return 'watchlist';
          case 'HistoryList':
            return 'historylist';
          case 'RatedList':
            return 'ratinglist'  
          // Add more cases as needed
          default:
            return 'watchlist'; // Default value if the name doesn't match any case
        }
      }

    getMovies(){
        if(!this.state.loading && this.state.hasMore){
            this.setState({
                loading: true
            }, () => {
                // Storage.clearAll();
                const watchlist = Storage.getString(this.state.data) ? JSON.parse(Storage.getString(this.state.data)) : {};
                storedData = watchlist;
                if (storedData && typeof storedData === 'object') {
                    // Convert object values into an array
                    const dataArray = Object.entries(storedData).map(([key, value]) => ({ id: key, ...value }));
                
                    console.log('store data:', dataArray);

                    const uniqueMovies = dataArray.filter((dataItem) =>
    this.state.movies.every((movie) => movie.id !== dataItem.id)
  );

  // Only add unique movies to the state
  const updatedMovies = [...this.state.movies, ...uniqueMovies];
                
                    this.setState({
                      movies: updatedMovies,
                      loading: false,
                      
                      // hasMore: dataArray.length === 0 ? false : true
                    });
                  } else {
                    console.error('Invalid data format retrieved from watchlist:', storedData);
                  }
            })
        }
    }

    sortByChange(sortBy){
        this.setState({
            sortBy: sortBy,
            movies: [],
            page: 1,
            hasMore: true
        }, () => {
            this.getMovies()
        })
    }

    // scroll(e){
	// 	let nevent = e.nativeEvent;
    //     if(nevent.contentSize.height < (nevent.contentOffset.y + nevent.layoutMeasurement.height + 250) && !this.state.loading) this.getMovies();
	// }

    componentDidMount(){
        this.getMovies();
    }
    componentDidUpdate(prevProps) {

        this.props.navigation.addListener('focus', () => {
            //do your api call
            this.getMovies();
        });

        // // Check if the focus status has changed
        // if (this.props.isFocused !== prevProps.isFocused) {
        //   // If the screen is now focused, trigger a refresh and fetch data
        //   if (this.props.isFocused) {
        //     this.setState({ refresh: !this.state.refresh }, () => {
        //       this.getMovies();
        //     });
        //   }
        // }
      }

    render(){
        return (
            <View style={style.main}>
                {/* <StatusBar backgroundColor="#ffffff" barStyle="light-content" /> */}
                <ScrollView scrollEventThrottle={10}  >
                    <View style={[style.flexboxContainer, style.flexColumn]}>
                        {/* Popular movie listing */}
                        <View style={[style.flexbox, style.border, style.sectionBox, {marginTop: 40, marginBottom: 20, paddingBottom: 20}]}>
                            <View style={[style.flexboxContainer, style.verticalMiddle, movie.headingContainer, {paddingBottom: 0}]}>
                                <View style={style.flexbox}>
                                    <Text style={movie.heading}>{this.state.name}</Text>
                                </View>
                                {/* {this.state.order === undefined && 
                                    <View style={style.flexbox}>
                                        <Picker selectedValue={this.state.sortBy} onValueChange={this.sortByChange} mode="dropdown" textStyle={style.pickerText}>
                                            <Picker.Item label="Rating" value="rating" />
                                            <Picker.Item label="Like count" value="like_count" />
                                            <Picker.Item label="Title" value="title" />
                                            <Picker.Item label="Year" value="year" />
                                            <Picker.Item label="Date added" value="date_added" />
                                            <Picker.Item label="Peers" value="peers" />
                                            <Picker.Item label="Seeds" value="seeds" />
                                            <Picker.Item label="Download count" value="download_count" />
                                        </Picker>
                                    </View>
                                } */}
                            </View>
                        </View>
                        <View style={[style.flexboxContainer, style.flexStart, style.flexWrap, {paddingLeft: 15, paddingRight: 15}]}>
                        {
                            this.state.movies.map((el, index) => (
                                <TouchableOpacity style={[style.flexbox, style.half, {marginBottom: 15, paddingLeft: (index % 2 !== 0 ? 8 : 0)}]} key={index} onPress={() => {this.props.navigation.navigate('Details', {data: el})}}>
                                    <MovieListWatchList data={el} width={this.state.width}/>
                                </TouchableOpacity>
                            ))
                        }
                        </View>
                        {
                            this.state.loading &&
                            <View style={[style.flexboxContainer, style.centerAligned, {marginBottom: 50}]}>
                                <Image source={loading} style={{width: 25, height: 25, marginRight: 10}}/>
                                <Text style={[style.textCenter, style.loadingText]}>Loading...</Text>
                            </View>
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default Watchlist;