import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Text,
  View,
  Image,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';

import { config } from '../../components/constant';
import MovieList from '../../components/movie-list';
import ItemSeparator from '../../components/itemSeparator';
import ItemsCard from '../../components/itemsCard';
import CastList from '../../components/CastList';
import { Storage } from '../../components/Storage';
import { style } from '../style/base';
import { movie } from '../style/movie';
import { movieDetails } from '../style/movie-details';
import { IconButton, Snackbar } from 'react-native-paper';
import heart from '../../assets/images/heart.png';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setTabbarVisible } from '../../features/files/tabbarStyleSlice';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Rating, AirbnbRating } from 'react-native-ratings';
import FastImage from 'react-native-fast-image';

import App from '../Appvv';
import { stringSimilarity } from 'string-similarity-js';
import { BackHandler } from 'react-native';
const { width } = Dimensions.get('screen');

const setWidth = (w) => (width / 100) * w;
const CastCard = ({ name, role, imageUrl }) => {
  return (
    <View style={{ flexDirection: 'row', margin: 10 }}>
      <FastImage
        source={{
          uri: 'https://image.tmdb.org/t/p/original' + imageUrl,
          priority: FastImage.priority.high,
        }}
        style={{ width: 70, height: 100, borderRadius: 50 }}
      />
      <View style={{ justifyContent: 'center' }}>
        <Text
          style={{ marginHorizontal: 5, fontWeight: 'bold', color: 'white' }}
        >
          {name}
        </Text>
        <Text style={{ margin: 5, color: 'white' }}>{role}</Text>
      </View>
    </View>
  );
};

const MovieDetails = ({ route, navigation }) => {
  const { data, cameFromSearch } = route.params || {};
  const dispatch = useAppDispatch();
  const [details, setDetails] = useState(data);
  const [poster, setPoster] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [suggested, setSuggested] = useState([]);
  const [trailer, setTrailer] = useState('');
  const [cast, setCast] = useState(null);
  const useProxy = Storage.getBoolean('useProxy');
  const contentWithSeasons = ['series', 'tvshows', 'asian-series'];
  const watchlistString = Storage.getString('watchlist');
  const historylistString = Storage.getString('historylist');
  const ratingString = Storage.getString('ratinglist');
  const watchlist = watchlistString ? JSON.parse(watchlistString) : {};
  const historylist = historylistString ? JSON.parse(historylistString) : {};
  const ratinglist = ratingString ? JSON.parse(ratingString) : {};
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [historySnackbarVisible, setHistorySnackbarVisible] = useState(false);
  const [seasonsSelectorVisible, setSeasonsSelectorVisible] = useState(false);
  const { width } = Dimensions.get('screen');
  const [activeGenre, setActiveGenre] = useState('Cast');
  const [reviews, setReviews] = useState([]);
  const linkListString = Storage.getString('linklist');
  const linkList = linkListString ? JSON.parse(linkListString) : {};
  const [showWebViewAgain, setShowWebViewAgain] = useState(true);
  const [videoUrl, setVideoUrl] = useState('');
  let savedTitle = linkList[details.title]?.title || '';

  console.log(stringSimilarity('I.S.S', 'I.S.S.'));

//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
//         navigation.goBack();
//     });
  
//     return () => backHandler.remove();
//   }, []);

  // if (linkList[details.title]['title'])
  // {

  //     savedTitle = linkList[details.title]['title'];
  // }

  // Check if the value is undefined
  // if (watchlistString !== undefined) {
  //     // Parse the JSON string
  //     const watchlist = JSON.parse(watchlistString);

  //     // Now you can use the 'watchlist' variable
  //     console.log(watchlist);
  //   } else {
  //     // Handle the case where the key doesn't exist or is undefined
  //     console.log("Watchlist is not set or is undefined.");
  //   }
  console.log(linkList);
  console.log(savedTitle);
  // Your JSON string
  // const jsonString = linkList
  // // Parse the JSON string into a JavaScript object
  // const parsedObject = JSON.parse(jsonString);

  // // Accessing the values using the keys
  // const title = Object.keys(parsedObject)[0]; // "The Beekeeper"
  // const mediaLink = parsedObject[title].media_link; // "http://index2.circleftp.net/FILE/English%20Movies/2024/The%20Beekeeper%20%282024%29%201080p%20WEBRip%20x264/The%20Beekeeper%20%282024%29%201080p%20WEBRip%20x264.mp4"

  // // Now you can use 'title' and 'mediaLink' in your code as needed
  // console.log("Title:", title);
  // console.log("Media Link:", mediaLink);

  // console.log(linkList[details.title]['title']);
  console.log('in watchlist');
  console.log(watchlist);
  const [inWatchList, setInWatchList] = useState(
    watchlist && watchlist.hasOwnProperty(details.id) ? true : false
  );

  const [inHistoryList, setInHistoryList] = useState(
    historylist && historylist.hasOwnProperty(details.id) ? true : false
  );

  const [inRatingList, setRatingList] = useState(
    ratinglist && ratinglist.hasOwnProperty(details.id)
      ? ratinglist[details.id]?.rating || 0
      : 0
  );

  console.log('Rating for this movie', ratinglist[details.id]?.rating);
  console.log(ratinglist[details.id]);
  console.log('Data in setdetails:', details);

  console.log('Data in details:', route.params.data);
  useEffect(() => {
    dispatch(setTabbarVisible(false));
  }, []);

  useEffect(() => {
    console.log('setting false');
    dispatch(setTabbarVisible(false));
    // setDetails(route.params.data);
    const fetchData = async () => {
      const headers = {
        // Add any headers you need here
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNjlmNWFhODMxZGU2Y2NhM2Q4NmU3ZWI4NzY1NGNjYSIsInN1YiI6IjY1NWE5YmVhZWE4NGM3MTA5NmRmN2YyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7aB76asDpvkHNrf60M2VQ1GZYtK5i8VO8o4tvnufxnI',
        'Content-Type': 'application/json',
      };
      // let img = details.background_image || details.background_image_original;
      // img = img.split('/');
      // img[img.length - 1] = 'large-screenshot1.jpg';

      setPoster(`https://image.tmdb.org/t/p/original${details.poster_path}`);
      setLoaded(true);

      try {
        const trailer = await axios.get(
          `${config.API_URL}/movie/${details.id}/videos?language=en-US`,
          { headers }
        );
        const trailers = trailer.data.results;

        // Filter out only the trailers
        const trailerResults = trailers.filter(
          (trailer) => trailer.type === 'Trailer'
        );
        const videoId = trailerResults[0].key;
        setTrailer(videoId);
      } catch (error) {
        console.error('Error fetching trailer for this movies:', error);
      }

      try {
        const suggested = await axios.get(
          `${config.API_URL}/movie/${details.id}/recommendations?language=en-US&page=1`,
          { headers }
        );
        setSuggested(suggested.data.results);
      } catch (error) {
        console.error('Error fetching suggested movies:', error);
      }
      const castName = await axios.get(
        `${config.API_URL}/movie/${details.id}/credits?language=en-US`,
        { headers }
      );
      console.log('cast details');
      console.log(castName.data);
      setCast(castName.data.cast);

      try {
        const revieData = await axios.get(
          `${config.API_URL}/movie/${details.id}/reviews?language=en-US&page=1`,
          { headers }
        );
        setReviews(revieData.data.results);
      } catch (error) {
        console.error('Error fetching reviews data:', error);
      }

      //getCast(details.id, 'movies').then(json => setCast(json));
    };

    fetchData();
    return () => {
      console.log('setting true');
      dispatch(setTabbarVisible(true));
      console.log(cameFromSearch);
      // if (cameFromSearch) {
      //   // If there is a screen to go back to, go back
      // //   dispatch(setTabbarVisible(true));
      //   navigation.navigate('Search', { immediate: true });

      // } else {
      //   // Otherwise, navigate to 'Movies'
      //   navigation.goBack();
      // }
    };
  }, [details]);

  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'Cast',
    },
    // {
    //   id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    //   title: 'Reviews',
    // },
  ];

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  const getCast = async (tmdbId, category) => {
    const headers = {
      // Add any headers you need here
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNjlmNWFhODMxZGU2Y2NhM2Q4NmU3ZWI4NzY1NGNjYSIsInN1YiI6IjY1NWE5YmVhZWE4NGM3MTA5NmRmN2YyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7aB76asDpvkHNrf60M2VQ1GZYtK5i8VO8o4tvnufxnI',
      'Content-Type': 'application/json',
    };

    return await axios
      .get(
        `${config.API_URL}/${
          category == 'movies' ? 'movie' : 'tv'
        }/${tmdbId}/credits?language=en-US`,
        { headers }
      )
      .then((response) => response.json())
      .then((json) => {
        console.log('cast list', json);
        if (json.cast) {
          return json.cast;
        } else {
          return 'N/A';
        }
      })
      .catch((e) => console.error(e));
  };
  const handleWatchList = () => {
    if (inWatchList) {
      delete watchlist[details.id];
      setSnackbarVisible(false);
    } else {
      Object.assign(watchlist, {
        [details.id]: {
          media_type: details.media_type,
          poster_path: details.poster_path,
          backdrop_path: details.backdrop_path,
          original_title: details.original_title,
          vote_average: details.vote_average,
          overview: details.overview,
        },
      });
      setSnackbarVisible(true);
      setTimeout(() => setSnackbarVisible(false), 2500);
    }

    Storage.set('watchlist', JSON.stringify(watchlist));
    setInWatchList(!inWatchList);
  };

  const handleHistoryList = () => {
    if (inHistoryList) {
      delete historylist[details.id];
      setHistorySnackbarVisible(false);
    } else {
      Object.assign(historylist, {
        [details.id]: {
          media_type: details.media_type,
          poster_path: details.poster_path,
          backdrop_path: details.backdrop_path,
          original_title: details.original_title,
          vote_average: details.vote_average,
          overview: details.overview,
        },
      });
      setHistorySnackbarVisible(true);
      setTimeout(() => setHistorySnackbarVisible(false), 2500);
    }

    Storage.set('historylist', JSON.stringify(historylist));
    setInHistoryList(!inHistoryList);
  };

  const handleShowWebViewAgain = () => {
    setVideoUrl('');
    setShowWebViewAgain(true);
  };

  const layout = useWindowDimensions();

  const handleStream = () => {
    setVideoUrl(linkList[details.title]['media_link']);
    setShowWebViewAgain(false);
  };

  const handleFinishRating = (rating) => {
    // This function will be called when the user finishes rating
    // You can do something with the rating value here
    //setRating(rating);
    console.log(`User rated: ${rating}`);
    Object.assign(ratinglist, {
      [details.id]: {
        rating: rating,
      },
    });
    Storage.set('ratinglist', JSON.stringify(ratinglist));
  };

  return (
    <>
      {showWebViewAgain ? (
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView style={style.main} key={details}>
            {/* <StatusBar backgroundColor="#ffffff" barStyle="light-content" /> */}
            <View
              style={[
                style.flexboxContainer,
                style.flexColumn,
                { paddingBottom: 30 },
              ]}
            >
              <View style={[movieDetails.moviePoster, style.relative]}>
                <TouchableOpacity
                  style={style.customBack}
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <View style={[style.border, style.customBackArrow]}></View>
                </TouchableOpacity>
                <FastImage
                  source={{
                    uri: `https://image.tmdb.org/t/p/original${details.backdrop_path}`,
                    priority: FastImage.priority.high,
                  }}
                  style={[movieDetails.moviePoster]}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={[
                    'rgba(49,54,74,0.2)',
                    'rgba(49,54,74,0.4)',
                    '#31364A',
                  ]}
                  angle={180}
                  style={[
                    movieDetails.gradiend,
                    style.flexboxContainer,
                    style.centerAligned,
                    style.flexColumn,
                  ]}
                >
                  {trailer != '' && (
                    <TouchableOpacity
                      style={[style.centerAligned]}
                      onPress={() => {
                        navigation.push('Trailer', { data: trailer });
                      }}
                    >
                      <View
                        style={[
                          style.border,
                          style.centerAligned,
                          style.fullHeight,
                          movieDetails.playButton,
                        ]}
                      >
                        <View
                          style={[style.relative, movieDetails.playTriangle]}
                        ></View>
                      </View>
                      <Text
                        style={[
                          style.textUppercase,
                          style.textCenter,
                          {
                            marginTop: 10,
                            fontWeight: '700',
                            color: '#FFFFFF',
                            fontSize: 13,
                          },
                        ]}
                      >
                        View trailer
                      </Text>
                    </TouchableOpacity>
                  )}
                </LinearGradient>
              </View>

              <View style={[movieDetails.detailsContainer, style.relative]}>
                <View style={[style.flexboxContainer, style.flexStart]}>
                  <View
                    style={[
                      movie.movie,
                      movieDetails.selectedMoviePoster,
                      movie.imageCont,
                    ]}
                  >
                    <FastImage
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500${details.poster_path}`,
                        priority: FastImage.priority.high,
                      }}
                      style={[movieDetails.selectedMoviePoster]}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={[style.flexbox]}>
                    <Text
                      style={[movieDetails.title, movieDetails.leftWidth]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {details.title_english || details.title}
                    </Text>
                    {/* <Text style={[movieDetails.subText, movieDetails.leftWidth, {marginBottom: 5, fontWeight: "500"}]} numberOfLines={1} ellipsizeMode="tail">{`${details.runtime} mins | ${details.mpa_rating || '-'} | ${details.language}`}</Text> */}
                    <Text
                      style={[movieDetails.date, movieDetails.leftWidth]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      Release Date: {details.release_date}
                    </Text>
                    <View style={[style.con]}>
                      <Text
                        style={[
                          movie.subText,
                          style.border,
                          movie.posterGenre,
                          { marginTop: 10, height: 25, fontWeight: '700' },
                        ]}
                      >
                        {details.vote_average.toFixed(1)}
                      </Text>

                      <IconButton
                        icon={
                          inWatchList
                            ? 'bookmark-minus'
                            : 'bookmark-minus-outline'
                        }
                        size={25}
                        // Set the specific rating here
                        onPress={handleWatchList}
                        style={style.margin}
                      />

                      <IconButton
                        icon={inHistoryList ? 'check' : 'plus'}
                        size={25}
                        // Set the specific rating here
                        onPress={handleHistoryList}
                        style={style.margin}
                      />
                    </View>

                    {/* <View style={[style.flexboxContainer, style.flexStart, style.flexWrap, movieDetails.leftWidth]}>
                               {
                                   details.genre_ids.map((el, index) => (
                                       <Text style={[movieDetails.subText, style.border, movie.posterGenre, {marginRight: 10, marginBottom: 10, fontWeight: "500"}]} key={index}>{el}</Text>
                                   ))
                               }
                           </View> */}
                  </View>
                </View>
                <View>
                  <Text
                    style={[
                      style.textCenter,
                      { color: 'white', fontWeight: '800' },
                    ]}
                  >
                    Rate this movie
                  </Text>
                  <AirbnbRating
                    count={11}
                    reviews={[
                      'Terrible',
                      'Bad',
                      'Meh',
                      'OK',
                      'Good',
                      'Hmm...',
                      'Very Good',
                      'Wow',
                      'Amazing',
                      'Unbelievable',
                      'Mind bending',
                    ]}
                    defaultRating={ratinglist[details.id]?.rating || 0}
                    onFinishRating={handleFinishRating}
                    size={20}
                  />
                </View>

                <View style={{ paddingTop: 15 }}>
                  <Text style={movieDetails.description}>
                    {details.overview}
                  </Text>
                </View>
                {savedTitle === details.title && (
                  <TouchableOpacity
                    style={{ marginTop: 35 }}
                    onPress={handleStream}
                  >
                    <LinearGradient
                      colors={['#FE6FA1', '#FF6EA0', '#FD70AF']}
                      angle={180}
                      style={style.btn}
                    >
                      <Text
                        style={[
                          style.btnText,
                          style.textCenter,
                          style.textUppercase,
                        ]}
                      >
                        Stream Now!
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>

              {/* <View style={{ flexDirection: "row", margin: 10 }}> */}

              {/* </View> */}
              <View style={styles.genreListContainer}>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={DATA}
                  ItemSeparatorComponent={() => <ItemSeparator width={20} />}
                  ListHeaderComponent={() => <ItemSeparator width={20} />}
                  ListFooterComponent={() => <ItemSeparator width={20} />}
                  renderItem={({ item }) => (
                    <ItemsCard
                      genreName={item.title}
                      active={item.title === activeGenre ? true : false}
                      onPress={setActiveGenre}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                />
              </View>

              <View>
                {activeGenre === 'Cast' && (
                  <FlatList
                    data={cast}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    ItemSeparatorComponent={() => <ItemSeparator width={20} />}
                    ListHeaderComponent={() => <ItemSeparator width={20} />}
                    ListFooterComponent={() => <ItemSeparator width={20} />}
                    renderItem={({ item }) => (
                      <CastCard
                        name={item.name}
                        role={item.known_for_department}
                        imageUrl={item.profile_path}
                        key={item.name + item.known_for_department}
                      />
                    )}
                  />
                )}
              </View>
              <View style={[style.flexbox, style.sectionBox]}>
                <View
                  style={[
                    style.flexboxContainer,
                    style.verticalMiddle,
                    movie.headingContainer,
                  ]}
                >
                  <View style={style.flexbox}>
                    <Text style={movie.heading}>Similar Films</Text>
                  </View>
                </View>
                <ScrollView horizontal={true} style={style.bothsideOverFlow}>
                  <View style={[style.flexboxContainer, { paddingRight: 15 }]}>
                    {suggested.map((el, index) => (
                      <TouchableOpacity
                        style={[style.flexbox]}
                        key={index}
                        onPress={() => {
                          navigation.push('Details', {
                            data: el,
                            cameFromSearch: false,
                          });
                        }}
                      >
                        <MovieList data={el} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>
          </ScrollView>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSeasonsSelectorVisible(false)}
            action={{
              label: 'Undo',
              onPress: handleWatchList,
            }}
          >
            Added to Watchlist
          </Snackbar>
          <Snackbar
            visible={historySnackbarVisible}
            onDismiss={() => setSeasonsSelectorVisible(false)}
            action={{
              label: 'Undo',
              onPress: handleHistoryList,
            }}
          >
            Added to HistoryList
          </Snackbar>
        </SafeAreaView>
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
  genreListContainer: {
    paddingVertical: 10,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'white',
    paddingVertical: 8,
    elevation: 3,
    marginVertical: 2,
    width: '25',
  },
  item: {
    //   backgroundColor: '#f9c2ff',
    //   padding: 20,
    //   marginVertical: 8,
    //   marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'white',
    paddingVertical: 8,
    elevation: 3,
    marginVertical: 2,
    width: setWidth(25),
  },
  title: {
    fontSize: 13,
    color: 'black',
    fontFamily: 'bold',
  },
});
export default MovieDetails;
