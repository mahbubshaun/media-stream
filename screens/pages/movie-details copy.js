import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View, Image, StatusBar, ScrollView, TouchableOpacity } from 'react-native';

import { config } from '../../components/constant';
import MovieList from "../../components/movie-list";

import { style } from "../style/base";
import { movie } from "../style/movie";
import { movieDetails } from "../style/movie-details";

import heart from "../../assets/images/heart.png";
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setTabbarVisible } from '../../features/files/tabbarStyleSlice';
import { useNavigation } from '@react-navigation/native';


const MovieDetails = ({ route, navigation }) => {
    const { data, cameFromSearch } = route.params || {};
    const dispatch = useAppDispatch();
    const [details, setDetails] = useState(data);
    const [poster, setPoster] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [suggested, setSuggested] = useState([]);
    console.log('Data in setdetails:', details);
    
    console.log('Data in details:', route.params.data);

    useEffect(() => {
        console.log('setting false');
        dispatch(setTabbarVisible(false));
        console.log('Data in details:', route.params.data);
        // setDetails(route.params.data);
        const fetchData = async () => {
            let img = details.background_image || details.background_image_original;
            img = img.split('/');
            img[img.length - 1] = 'large-screenshot1.jpg';

            setPoster(img.join('/'));
            setLoaded(true);

            dispatch(setTabbarVisible(false));
            try {
                const suggested = await axios.get(`${config.API_URL}/movie_suggestions.json?movie_id=${details.id}`);
                route.params.sug = suggested.data.data.movies;
                console.log("creating sug: ", route.params.sug)
                setSuggested(suggested.data.data.movies);
            } catch (error) {
                console.error('Error fetching suggested movies:', error);
            }
            

    
        };

        fetchData();
        return () => {
            console.log('setting true');
            // dispatch(setTabbarVisible(true));
            console.log(cameFromSearch);
            console.log(route.name);
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
   
 
    
    

    return (
        <ScrollView style={style.main} key={details}>
            {/* <StatusBar backgroundColor="#ffffff" barStyle="light-content" /> */}
            <View style={[style.flexboxContainer, style.flexColumn, {paddingBottom: 30}]}>
                <View style={[movieDetails.moviePoster, style.relative]}>
                    <TouchableOpacity style={style.customBack} onPress={() => {navigation.goBack()}}>
                        <View style={[style.border, style.customBackArrow]}></View>
                    </TouchableOpacity>
                    <Image source={{uri: poster || details.background_image}} style={[movieDetails.moviePoster]} resizeMode="cover"/>
                    <LinearGradient colors={['rgba(49,54,74,0.2)', 'rgba(49,54,74,0.4)', '#31364A']} angle={180} style={[movieDetails.gradiend, style.flexboxContainer, style.centerAligned, style.flexColumn]}>
                        {details.yt_trailer_code !== undefined && 
                            <TouchableOpacity style={[style.centerAligned]} onPress={() => {navigation.push('Trailer', {data: details.yt_trailer_code})}}>
                                <View style={[style.border, style.centerAligned, style.fullHeight, movieDetails.playButton]}>
                                    <View style={[style.relative, movieDetails.playTriangle]}></View>
                                </View>
                                <Text style={[style.textUppercase, style.textCenter, {marginTop: 10, fontWeight: "700", color: '#FFFFFF', fontSize: 13}]}>View trailer</Text>
                            </TouchableOpacity>
                        }
                    </LinearGradient>
                </View>

                <View style={[movieDetails.detailsContainer, style.relative]}>
                    <View style={[style.flexboxContainer, style.flexStart]}>
                        <View style={[movie.movie, movieDetails.selectedMoviePoster, movie.imageCont]}>
                            <Image source={{uri: details.medium_cover_image || details.large_cover_image}} style={[movieDetails.selectedMoviePoster]} resizeMode="cover"/>
                        </View>
                        <View style={[style.flexbox]}>
                            <Text style={[movieDetails.title, movieDetails.leftWidth]} numberOfLines={1} ellipsizeMode="tail">{details.title_english || details.title}</Text>
                            <Text style={[movieDetails.subText, movieDetails.leftWidth, {marginBottom: 5, fontWeight: "500"}]} numberOfLines={1} ellipsizeMode="tail">{`${details.runtime} mins | ${details.mpa_rating || '-'} | ${details.language}`}</Text>
                            <View style={[style.flexboxContainer, style.flexStart, {marginBottom: 5, fontWeight: "500"}]}>
                                <Image source={heart} style={movieDetails.heartIcon}/>
                                <Text style={[movieDetails.subText]}>{details.rating}</Text>
                            </View>
                            <View style={[style.flexboxContainer, style.flexStart, style.flexWrap, movieDetails.leftWidth]}>
                                {
                                    details.genres.map((el, index) => (
                                        <Text style={[movieDetails.subText, style.border, movie.posterGenre, {marginRight: 10, marginBottom: 10, fontWeight: "500"}]} key={index}>{el}</Text>
                                    ))
                                }
                            </View>
                        </View>
                    </View>
                    <View style={{paddingTop: 15}}>
                        <Text style={movieDetails.description}>{details.description_full || details.summary || details.synopsis}</Text>
                    </View>
                    
                    <TouchableOpacity style={{marginTop: 35}} onPress={() => {navigation.push('Movie', {data: details})}}>
                        <LinearGradient colors={['#FE6FA1', '#FF6EA0', '#FD70AF']} angle={180} style={style.btn}>
                            <Text style={[style.btnText, style.textCenter, style.textUppercase]}>Watch Movie</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={[style.flexbox, style.sectionBox]}>
                    <View style={[style.flexboxContainer, style.verticalMiddle, movie.headingContainer]}>
                        <View style={style.flexbox}>
                            <Text style={movie.heading}>Similar Films</Text>
                        </View>
                    </View>
                    <ScrollView horizontal={true} style={style.bothsideOverFlow}>
                        <View style={[style.flexboxContainer, {paddingRight: 15}]}>
                        {
                            suggested.map((el, index) => (
                                <TouchableOpacity style={[style.flexbox]} key={index} onPress={() => {navigation.push('Details', {data: el, cameFromSearch: false})}}>
                                    <MovieList data={el}/>
                                </TouchableOpacity>
                            ))
                        }
                        </View>
                    </ScrollView>
                </View>
            </View>
        </ScrollView>
    )
                    }
export default MovieDetails;