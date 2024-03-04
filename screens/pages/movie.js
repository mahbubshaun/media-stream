import React, { Component } from 'react';
import axios from 'axios';
import Swiper from 'react-native-swiper'
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View,styleheet, Image, ScrollView, StatusBar, TouchableOpacity} from 'react-native';

import MovieList from "../../components/movie-list";
import { config } from '../../components/constant';

import { style } from "../style/base";
import { movie } from "../style/movie";
import { movieDetails } from "../style/movie-details";

import heart from "../../assets/images/heart.png";
import loading from "../../assets/images/loading.gif";
import FastImage from 'react-native-fast-image';
import { TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

class Movies extends Component{
	
    constructor(props){
        super(props);
        this.state = {
			featured: [],
			popular: [],
			recent: [],
			action: [],
			adventure: [],
			loaded: false,
			searchQuery: '',
            searchResults: [],
			init: false
		}
	}

	  // Function to handle search and fetch data from TMDB API
	  searchMovies = async () => {
		const { searchQuery } = this.state;
		if (searchQuery.trim() === '') {
		  // Clear search results if the query is empty
		  this.setState({ searchResults: [] });
		  return;
		}
	
		try {
		  const response = await axios.get(`${config.API_URL}/search/movie`, {
			params: {
			  query: searchQuery,
			  include_adult: false,
			  language: 'en-US',
			  page: 1,
			},
			headers: {
				'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNjlmNWFhODMxZGU2Y2NhM2Q4NmU3ZWI4NzY1NGNjYSIsInN1YiI6IjY1NWE5YmVhZWE4NGM3MTA5NmRmN2YyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7aB76asDpvkHNrf60M2VQ1GZYtK5i8VO8o4tvnufxnI',
				'Content-Type': 'application/json',
			},
		  });
	
		  // Update state with search results
		  this.setState({
			searchResults: response.data.results,
		  });
		} catch (error) {
		  console.error('Error fetching search results:', error);
		}
	  };
	
	  // Function to handle text input changes in the search bar
	  handleSearchInputChange = (text) => {
		this.setState({ searchQuery: text });
	  };
	
	
	loadMoreSection(){
		const headers = {
			// Add any headers you need here
			'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNjlmNWFhODMxZGU2Y2NhM2Q4NmU3ZWI4NzY1NGNjYSIsInN1YiI6IjY1NWE5YmVhZWE4NGM3MTA5NmRmN2YyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7aB76asDpvkHNrf60M2VQ1GZYtK5i8VO8o4tvnufxnI',
			'Content-Type': 'application/json',
		  };
		axios.all([
			// axios.get(`${config.API_URL}/list_movies.json?genre=action&sort_by=rating&order_by=desc&limit=${config.RESULT_SIZE}`),
			// axios.get(`${config.API_URL}/list_movies.json?genre=adventure&sort_by=rating&order_by=desc&limit=${config.RESULT_SIZE}`)
			//axios.get(`${config.API_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=28`, { headers }),
			//axios.get(`${config.API_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=12`, { headers }),
		])
		.then(axios.spread((popular, recent) => {
			this.setState({
				loaded: true,
				// action: popular.data.results,
				// adventure: recent.data.results
			})
		}))
	}

	scroll(e){
		let nevent = e.nativeEvent;
        if(nevent.contentSize.height < (nevent.contentOffset.y + nevent.layoutMeasurement.height + 250) && !this.state.notLoaded){
			this.loadMoreSection();
        }
	}

    componentDidMount(){
		const headers = {
			// Add any headers you need here
			'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNjlmNWFhODMxZGU2Y2NhM2Q4NmU3ZWI4NzY1NGNjYSIsInN1YiI6IjY1NWE5YmVhZWE4NGM3MTA5NmRmN2YyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7aB76asDpvkHNrf60M2VQ1GZYtK5i8VO8o4tvnufxnI',
			'Content-Type': 'application/json',
		  };
		axios.all([
			axios.get(`${config.API_URL}/trending/movie/day?language=en-US&page=1`, { headers }),
			axios.get(`${config.API_URL}/movie/popular?language=en-US&page=1`, { headers }),
			axios.get(`${config.API_URL}/movie/top_rated?language=en-US&page=1`, { headers }),
		])
		.then(axios.spread((featured, popular, recent) => {
			console.log(featured.data.results)
			this.setState({
				featured: featured.data.results,
				popular: popular.data.results,
				recent: recent.data.results,
				init: true
			})
		}))
		.catch((err) => {
			console.log(err);
		})
    }

    render() {
        return (
            <View style={style.main}>
				<View style={style.searchBarParentStyle}>
						<TextInput
							placeholder="Search"
							mode="flat"
							style={{
								...style.searchBarStyle,
								backgroundColor: "rgb(186, 193, 204)",
							}}
							left={
								<TextInput.Icon
									icon="magnify"
									iconColor={"rgb(186, 193, 204)"}
								/>
							}
							underlineColor="transparent"
							activeUnderlineColor="transparent"
							cursorColor="black"
							onChangeText={this.handleSearchInputChange}
            onSubmitEditing={this.searchMovies}
							placeholderTextColor={"black"}
						/>
						{/* <Icon
							name="sliders"
							size={27}
							color={"black"}
							style={{
								...style.iconStyle,
								backgroundColor: "rgb(186, 193, 204)",
								borderColor: 'rgb(170, 207, 202)'
							}}
							onPress={() => bottomSheetRef.current.open()}
						/> */}
					</View>
		{this.state.searchResults.length > 0 && (
          <View style={[style.flexbox, style.border, style.sectionBox]}>
		  <ScrollView horizontal={true} style={style.bothsideOverFlow}>
			  <View style={[style.flexboxContainer, {paddingRight: 15}]}>
			  {
				  this.state.searchResults.map((el, index) => (
					  <TouchableOpacity style={[style.flexbox]} key={index} onPress={() => {this.props.navigation.navigate('Details', {data: el, cameFromSearch: true})}}>
						  <MovieList data={el}/>
					  </TouchableOpacity>
				  ))
			  }
			  </View>
		  </ScrollView>
	  </View>
        )}
				{/* <StatusBar/> */}
				{!this.state.init && 
					<View style={[style.flexboxContainer, style.centerAligned, style.fullHeight]}>
						<Image source={loading} style={{width: 25, height: 25, marginRight: 10}}/>
						<Text style={[style.textCenter, style.loadingText]}>Loading...</Text>
					</View>
				}
                {this.state.init && 
				
					<ScrollView scrollEventThrottle={16} onScroll={(e) => this.scroll(e)}>
						<View style={style.flexbox}>
										<Text style={[movie.heading, {marginLeft: 5,  marginBottom: 10 }]}>Trending Now</Text>
									</View>
						<Swiper loop={true} style={style.relative} height={380} index={0} autoplay={true} autoplayTimeout={5} dot={<View style={style.dot}/>} activeDot={<View style={style.activeDot} />}>
							{
								this.state.featured.map((el, index) => (
									<TouchableOpacity style={[movieDetails.moviePoster]} key={index} onPress={() => {this.props.navigation.navigate('Details', {data: el, cameFromSearch: false})}}>
										{/* <Image source={{uri:`https://image.tmdb.org/t/p/w500${el.backdrop_path}`}} style={[movieDetails.moviePoster]} resizeMode="cover"/> */}
										<FastImage
                    source={{ uri: `https://image.tmdb.org/t/p/original${el.backdrop_path}` , priority: FastImage.priority.high}}
                    style={[movieDetails.moviePoster]}
                    resizeMode={FastImage.resizeMode.cover}
                  />
										<LinearGradient colors={['rgba(49,54,74,0.2)', 'rgba(49,54,74,0.4)', '#31364A']} angle={180} style={[movieDetails.gradiend]}></LinearGradient>
										
										<View style={[style.flexboxContainer, style.flexStart, {position: 'absolute', bottom: 15, left: 15}]}>
											<View style={[movie.movie, movieDetails.selectedMoviePoster, movie.imageCont]}>
												{/* <Image source={{uri:`https://image.tmdb.org/t/p/w400${el.poster_path}`}} style={[movieDetails.selectedMoviePoster]} resizeMode="cover"/> */}
												<FastImage
                    source={{ uri: `https://image.tmdb.org/t/p/w185${el.poster_path}` , priority: FastImage.priority.high}}
                    style={[movieDetails.selectedMoviePoster]}
                    resizeMode={FastImage.resizeMode.cover}
                  />
											</View>
											<View style={[style.flexbox]}>
												<Text style={[movieDetails.title, movieDetails.leftWidth]} numberOfLines={1} ellipsizeMode="tail">{el.title_english || el.title}</Text>
												{/* <Text style={[movie.subText, movieDetails.leftWidth, {marginBottom: 5, fontWeight: "500"}]} numberOfLines={1} ellipsizeMode="tail">{`${el.runtime} mins | ${el.mpa_rating || '-'} | ${el.language}`}</Text> */}
												{/* <View style={[style.flexboxContainer, style.flexStart, {marginBottom: 5, fontWeight: "500"}]}>
													<Image source={heart} style={movie.heartIcon}/>
													<Text style={[movie.subText]}>{el.rating}</Text>
												</View> */}
												<View style={[style.flexboxContainer, style.flexStart, style.flexWrap, movieDetails.leftWidth]}>
												<Text style={[movie.subText, style.border, movie.posterGenre, {marginRight: 10, marginBottom: 10, fontWeight: "700"}]} >{el.vote_average.toFixed(1)}</Text>
													{/* {
														el.genre_ids.map((el, index) => (
															<Text style={[movie.subText, style.border, movie.posterGenre, {marginRight: 10, marginBottom: 10, fontWeight: "500"}]} key={index}>{el}</Text>
														))
													} */}
												</View>
											</View>
										</View>
									</TouchableOpacity>
								))
							}
						</Swiper>
						

						<View style={[style.flexboxContainer, style.flexColumn]}>
							{/* Popular movie listing */}
							<View style={[style.flexbox, style.border, style.sectionBox, {paddingTop: 0, marginTop: -5}]}>
								<View style={[style.flexboxContainer, style.verticalMiddle, movie.headingContainer]}>
									<View style={style.flexbox}>
										<Text style={movie.heading}>Popular</Text>
									</View>
									<TouchableOpacity style={[style.flexbox, style.relative]} onPress={() => {this.props.navigation.navigate('List', {order: 'rating', name: 'Popular'})}}>
									{/* <TouchableOpacity style={[style.flexbox, style.relative]} onPress={() => {this.props.navigation.navigate('List', {data: el})}}> */}
										<Text style={[style.textRight, movie.seeAll]}>See All</Text>
										<View style={[style.border, movie.seeAllArrow]}></View>
									</TouchableOpacity>
								</View>
								<ScrollView horizontal={true} style={style.bothsideOverFlow}>
									<View style={[style.flexboxContainer, {paddingRight: 15}]}>
									{
										this.state.popular.map((el, index) => (
											<TouchableOpacity style={[style.flexbox]} key={index} onPress={() => {this.props.navigation.navigate('Details', {data: el})}}>
												<MovieList data={el}/>
											</TouchableOpacity>
										))
									}
									</View>
								</ScrollView>
							</View>
							
							{/* Genre listing */}
							<View style={[style.flexbox, style.border, style.sectionBox]}>
								<View style={[style.flexboxContainer, style.verticalMiddle, movie.headingContainer]}>
									<View style={style.flexbox}>
										<Text style={movie.heading}>Movie genre</Text>
									</View>
									{/* <TouchableOpacity style={[style.flexbox, style.relative]}>
										<Text style={[style.textRight, movie.seeAll]}>See All</Text>
										<View style={[style.border, movie.seeAllArrow]}></View>
									</TouchableOpacity> */}
								</View>
								<ScrollView horizontal={true} style={style.bothsideOverFlow}>
									<View style={[style.flexboxContainer, {paddingRight: 15}]}>
									{
										config.GENRE.map((el, index) => (
											<TouchableOpacity style={[style.flexbox, style.relative, movie.movie, {width: 'auto'}]} key={index} onPress={() => {this.props.navigation.navigate('List', {genre: el.slug, name: el.name, id: el.id})}}>
												<Image source={{uri: `${config.GENRE_IMAGE_URL}${el.shortName}.jpg`}} style={[movie.genreImage]} resizeMode="cover"/>
												<LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)', '#000']} angle={180} style={[style.flexboxContainer, style.fullHeight, movie.shadow]}>
													<View style={[style.flexbox, {justifyContent: "flex-end"}]}>
														<Text style={[movie.title, movie.genreTitle]} numberOfLines={1} >{ el.name }</Text>
													</View>
												</LinearGradient>
											</TouchableOpacity>
										))
									}
									</View>
								</ScrollView>
							</View>

							{/* Recent movie listing */}
							<View style={[style.flexbox, style.border, style.sectionBox]}>
								<View style={[style.flexboxContainer, style.verticalMiddle, movie.headingContainer]}>
									<View style={style.flexbox}>
										<Text style={movie.heading}>Top Rated</Text>
									</View>
									<TouchableOpacity style={[style.flexbox, style.relative]} onPress={() => {this.props.navigation.navigate('List', {order: 'year', name: 'Top Rated'})}}>
										<Text style={[style.textRight, movie.seeAll]}>See All</Text>
										<View style={[style.border, movie.seeAllArrow]}></View>
									</TouchableOpacity>
								</View>
								<ScrollView horizontal={true} style={style.bothsideOverFlow}>
									<View style={[style.flexboxContainer, {paddingRight: 15}]}>
									{
										this.state.recent.map((el, index) => (
											<TouchableOpacity style={[style.flexbox]} key={index} onPress={() => {this.props.navigation.navigate('Details', {data: el, cameFromSearch: true})}}>
												<MovieList data={el}/>
											</TouchableOpacity>
										))
									}
									</View>
								</ScrollView>
							</View>
							
							
							{!this.state.loaded &&
								<View style={[style.flexboxContainer, style.centerAligned, {marginTop: 20, marginBottom: 50}]}>
									<Image source={loading} style={{width: 25, height: 25, marginRight: 10}}/>
									<Text style={[style.textCenter, style.loadingText]}>Loading...</Text>
								</View>
							}
						</View>
					</ScrollView>
				}
            </View>
        )
    }
}

export default Movies;