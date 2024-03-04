import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';

import { style } from "../screens/style/base";
import { movie } from "../screens/style/movie";

import heart from "../assets/images/heart.png";
import FastImage from 'react-native-fast-image';
class MovieListWatchList extends Component{
    constructor(props){
        super(props);
        console.log(this.props.data);
        this.state = {
            el: this.props.data,
            width: this.props.width,
            height: 1.5 * (this.props.width || 0)
        }
    }

    render(){
        return (
            <>
                <View style={[movie.movie, movie.imageCont, this.state.width ? {width: this.state.width, height: this.state.height, marginRight: 0} : {}]}>
                    {/* <Image source={{uri:`http://image.tmdb.org/t/p/original${this.state.el.poster_path}`}} style={[movie.moviePoster, this.state.width ? {width: this.state.width, height: this.state.height} : {}]} resizeMode="cover"/> */}
                    <FastImage
                    source={{ uri: `http://image.tmdb.org/t/p/w500${this.state.el['poster_path']}` , priority: FastImage.priority.high}}
                    style={[movie.moviePoster, this.state.width ? {width: this.state.width, height: this.state.height} : {}]}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
                <View style={[movie.movie, movie.details, this.state.width ? {width: this.state.width, marginRight: 0} : {}]}>
                    <Text style={[movie.title, this.state.width ? {width: this.state.width + 3} : {}]} numberOfLines={1} ellipsizeMode="tail">{this.state.el['original_title']}</Text>
                    {/* <Text style={movie.subText} numberOfLines={1} ellipsizeMode="tail">{`${this.state.el.runtime} mins | ${this.state.el.mpa_rating || '-'} | ${this.state.el.language}`}</Text> */}
                    <View style={[style.flexboxContainer, style.verticalMiddle]}>
                        <View style={[style.flexbox, style.flexboxContainer]}>
                            {<Text style={[movie.subText, style.border, movie.posterGenre]}>{this.state.el['vote_average']}</Text>}
                            {/* <Image source={heart} style={movie.heartIcon}/> */}
                        </View>
                        <View style={[style.flexbox, style.flexboxContainer, style.flexEnd]}>
                            {/* <Image source={heart} style={movie.heartIcon}/> */}
                            {/* <Text style={[movie.subText, style.textRight]}>{this.state.el.vote_average}</Text> */}
                        </View>
                    </View>
                </View>
            </>
        )
    }
}

export default MovieListWatchList;