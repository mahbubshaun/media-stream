import React, { useState, useEffect, useRef } from "react";

import { View, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import RBSheet from "react-native-raw-bottom-sheet";
import ToggleButton from "../components/ToggleButton";
import { useTheme, Text, IconButton } from "react-native-paper";
import CentredActivityIndicator from "../components/CentredActivityIndicator";
import ContentCard from "../components/ContentCard";
import MovieList from "../components/movie-list";
import { SafeAreaView } from "react-native-safe-area-context";
import ReactNativeBlobUtil from "react-native-blob-util";
import { getPaletteSync } from "@assembless/react-native-material-you";
import axios from 'axios';
import { config } from '../components/constant';

import { useNavigation } from '@react-navigation/native';
import { style } from "../screens/style/base";
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { setTabbarVisible } from '../features/files/tabbarStyleSlice';

const SearchScreen = ({ route, navigation }) => {
	// Both web and native return the Rollbar.js interface here.
    // const navigation = useNavigation();
    const categories = [
		{
			"label": "Movies",
			"key": "movies"
		},
		{
			"label": "Series",
			"key": "series"
		},
		{
			"label": "Anime",
			"key": "anime"
		},
		{
			"label": "Asian Series",
			"key": "asian-series"
		},
		{
			"label": "Arabic Series",
			"key": "arabic-series"
		},
		{
			"label": "Arabic Movies",
			"key": "arabic-movies"
		},
		{
			"label": "TV Shows",
			"key": "tvshows"
		}
	]
	const genres = [
		"Netflix",
		"Ramadan",
		"Fantasy",
		"Music",
		"Reality-tv",
		"News",
		"Youth",
		"Psychological",
		"Family",
		"History",
		"Crime",
		"Sport",
		"Life",
		"Mystery",
		"Drama",
		"Biography",
		"Science Fiction",
		"Zombies",
		"Animation",
		"Adventure",
		"Film-noir",
		"Animated",
		"Romance",
		"School",
		"Friendship",
		"Comdey",
		"Sports",
		"Kids",
		"Western",
		"Musical",
		"Talk-show",
		"Melodrama",
		"Dubbed",
		"Game-show",
		"Office",
		"War",
		"Comedy",
		"Thriller",
		"Horror",
		"Documentary",
		"Sci-fi",
		"Short",
		"Action",
		"Supernatural"
	]
	const dispatch = useAppDispatch();

	React.useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
		  // The screen is focused
		  // Call any action
		  console.log("Search is now focused");
		  dispatch(setTabbarVisible(true));
		});
	
		// Return the function to unsubscribe from the event so it gets removed on unmount
		return unsubscribe;
	  }, [navigation]);
	const theme = useTheme();
	const palette = getPaletteSync();
	const [searchText, setSearchText] = useState("");
	const [allData, setAllData] = useState(null);
	const [featuredContent, setFeaturedContent] = useState(null);
	const bottomSheetRef = useRef(null);
	const [appliedFilters, setAppliedFilters] = useState([]);
	const [selectedGenres, setSelectedGenres] = useState([]);
	const [data, setData] = useState(null);
	const [start, setStart] = useState(0);
	const [end, setEnd] = useState(20);
	const pageNumber = end / 20;

	const handleNext = () => {
		setStart(end);
		setEnd(end + 20);
	};

	const handlePrevious = () => {
		if (start !== 0) {
			setStart(start - 20);
			setEnd(end - 20);
		} else {
			// pass
		}
	};

	
	useEffect(() => {
		console.log(route.name);
		const fetchData = async () => {
			try {
			  const [featured, popular, recent] = await axios.all([
				axios.get(`${config.API_URL}/list_movies.json?sort_by=like_count&order_by=desc&limit=10`),
				axios.get(`${config.API_URL}/list_movies.json?sort_by=rating&order_by=desc&limit=${config.RESULT_SIZE}`),
				axios.get(`${config.API_URL}/list_movies.json?sort_by=year&order_by=desc&limit=${config.RESULT_SIZE}`)
			  ]);
	        //   console.log("featured content");
			//   console.log(featured.data.data.movies);
			  setFeaturedContent(featured.data.data.movies);
			  setAllData({
				content: [...popular.data.data.movies, ...recent.data.data.movies]
			  });
			  setData(featured.data.data.movies);
			} catch (err) {
			  console.log(err);
			}
		  };
	  
		  fetchData();
		}, []);
	

	const applyFilter = item => {
		const genreIntersection = item["genres"].filter(value =>
	
			selectedGenres.includes(value),
		);
		console.log(item["category"]);
		console.log(appliedFilters);
		if (
			appliedFilters.includes(item["category"]) ||
			genreIntersection.length > 0
		) {
			return item;
		} else {
			// pass
			//return item;
		}
	};

	useEffect(() => {
		setStart(0);
		setEnd(20);
		console.log("inside useeffect");
		if (allData && featuredContent) {
			if (searchText !== "") {
				var searched = allData.content.filter(item => {
					if (
						item["title"].toLowerCase().includes(searchText.toLocaleLowerCase())
					) {
						return item;
					} else {
						// pass
					}
				});
			} else {
				// pass
			}

            console.log("before applied filters");
			try{
			if (appliedFilters.length !== 0 || selectedGenres.length !== 0) {
				console.log("inside applied filters");
				const toUse = searchText === "" ? allData.content : searched;
				const filtered = toUse.filter(applyFilter);
				console.log(toUse);
				console.log(filtered);
				setData(filtered);
			} else {
				console.log("inside else filters");
				if (searchText !== "") {
					console.log("inside else search text no null filters");
					setData(searched);
				} else {
					console.log("inside else search text null filters");
					setData(featuredContent);
					
				}
			}
		}catch(err)
		{
			console.log(err);
		}
		} else {
			// pass
		}
	}, [searchText, appliedFilters, selectedGenres]);

	if (data !== null && allData !== null) {
		return (
	  <View style={styles.main}>
			<SafeAreaView>
				<ScrollView>
					<View style={styles.searchBarParentStyle}>
						<TextInput
							placeholder="Search"
							mode="flat"
							style={{
								...styles.searchBarStyle,
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
							onChangeText={text => setSearchText(text)}
							placeholderTextColor={"black"}
						/>
						<Icon
							name="sliders"
							size={27}
							color={"black"}
							style={{
								...styles.iconStyle,
								backgroundColor: "rgb(186, 193, 204)",
								borderColor: 'rgb(170, 207, 202)'
							}}
							onPress={() => bottomSheetRef.current.open()}
						/>
					</View>

					{data.length === 0 && searchText !== "" ? (
						<View style={styles.imageParentStyle}>
							<Image
								source={require("../assets/NotFound.png")}
								style={{ width: 860 * 0.3, height: 571 * 0.3 }}
							/>
							<Text
								style={{
									...styles.notFoundTextStyle,
									// color: theme.colors.primary,
								}}>
								Not Found
							</Text>
							<Text style={styles.descriptionTextStyle}>
								Sorry, the keywords you entered could not be found. Try to check
								again or search with different keywords.
							</Text>
						</View>
					) : (
						<ScrollView
							horizontal={true}
							contentContainerStyle={{
								flexWrap: "wrap",
								flex: 1,
								justifyContent: "center",
							}}>
					
							{data.slice(start, end).map(item => (
								// <ContentCard
								// 	width={180}
								// 	height={270}
								// 	item={item}
								// 	id={item["id"]}
								// 	category={'movies'}
								// 	title={item["title"]}
								// 	rating={item["rating"]}
								// 	imageSource={item["medium_cover_image"]}
								// 	key={item["id"]}
								// />
                                <View >
								<TouchableOpacity style={[style.flexbox]}  onPress={() => {navigation.navigate('Details', {data: item, cameFromSearch: false})}}>
                                    <MovieList data={item}/>
                                </TouchableOpacity>
								</View>
							))}
				
						</ScrollView>
					)}

					{data.length > 20 && (
						<View
							style={{
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
							}}>
							{start > 0 && (
								<IconButton
									icon="chevron-left"
									size={30}
									onPress={handlePrevious}
								/>
							)}
							<Text style={{ marginHorizontal: 10 }}>{pageNumber}</Text>
							{end < data.length && (
								<IconButton
									icon="chevron-right"
									size={30}
									onPress={handleNext}
								/>
							)}
						</View>
					)}

					<RBSheet
						ref={bottomSheetRef}
						closeOnDragDown={true}
						closeOnPressMask={true}
						height={Dimensions.get("window").height * 0.9}
						customStyles={{
							wrapper: {
								backgroundColor: 'black',
							},
							draggableIcon: {
								backgroundColor: "white",
							},
							container: {
								borderRadius: 30,
								backgroundColor: '#31364A',
							}
							// draggableIcon: {
							// 	backgroundColor: theme.colors.primary,
							// },
							// container: {
							// 	borderRadius: 30,
							// 	backgroundColor: theme.colors.background,
							// },
							
						}}>
						<Text style={styles.filterTitleStyle}>Filter</Text>
						<View style={styles.separatorStyle} />
						<Text style={styles.filterSectionStyle}>Categories</Text>
						<View style={{ flexWrap: "wrap", flexDirection: "row" }}>
							{categories.map(category => (
								<ToggleButton
									title={category.label}
									filters={appliedFilters}
									setFilters={setAppliedFilters}
									value={category.key}
									key={category.key}
								/>
							))}
						</View>
						<Text style={styles.filterSectionStyle}>Genre</Text>
						<ScrollView
							contentContainerStyle={{
								flexWrap: "wrap",
								flexDirection: "row",
							}}>
							{genres.map(genre => (
								<ToggleButton
									title={genre}
									filters={selectedGenres}
									setFilters={setSelectedGenres}
									value={genre}
									key={genre}
								/>
							))}
						</ScrollView>
					</RBSheet>
				</ScrollView>
			</SafeAreaView>
			</View>

			
		);
	} else {
		return <CentredActivityIndicator />;
	}
};

const styles = StyleSheet.create({
	main: {
        backgroundColor: '#31364A',
        height: '100%'
    },
	searchBarStyle: {
		margin: 20,
		marginRight: 10,
		borderRadius: 10,
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
		flex: 1,
	},
	iconStyle: {
		marginRight: 20,
		borderRadius: 15,
		padding: 15,
	},
	searchBarParentStyle: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	filterTitleStyle: {
		color: 'white',
		fontSize: 26,
		fontWeight: "bold",
		textAlign: "center",
		padding: 15,
		letterSpacing: 1.15,
	},
	separatorStyle: {
		borderBottomColor: "white",
		borderBottomWidth: 3,
		flex: 1,
		width: Dimensions.get("window").width * 0.875,
		alignSelf: "center",
	},
	filterSectionStyle: {
		color: 'white',
		fontSize: 24,
		fontWeight: "bold",
		margin: 15,
	},
	imageParentStyle: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
	notFoundTextStyle: {
		fontWeight: "bold",
		fontSize: 26,
		margin: 20,
	},
	descriptionTextStyle: {
		textAlign: "center",
		marginHorizontal: 10,
		fontSize: 16,
		letterSpacing: 0.75,
	},
});

export default SearchScreen;
