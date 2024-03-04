import React from "react";
import { Pressable, StyleSheet, ImageBackground } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
const ContentCard = ({

	imageSource,
	id,
	category,
	width,
	height,
	rating,
	title,
	item,
	route
}) => {
	const theme = useTheme();
	const navigation = useNavigation();

	
	const navigateToDetails = () => {
		// Log the data before navigating
		console.log('Data before navigating:', item);
	
		// Navigate to 'Details' screen with parameters
		navigation.navigate('Details', { data: item, cameFromSearch: true });
	  };

	return (
		<Pressable
			style={{ width: width, margin: 5 }}
			onPress={navigateToDetails}>
			<ImageBackground
				style={{ width: width, height: height }}
				imageStyle={{ borderRadius: 15 }}
				source={{ uri: imageSource }}>
				<Text
					style={{
						...styles.ratingTextStyle,
						backgroundColor: '#31364A',
					}}>
					{rating ? rating : "N/A"}
				</Text>
			</ImageBackground>
			<Text numberOfLines={1} style={styles.titleStyle}>
				{title}
			</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	ratingTextStyle: {
		width: 40,
		margin: 3,
		padding: 5,
		textAlign: "center",
		fontSize: 12,
		borderRadius: 10,
		color: "black",
		fontWeight: "bold",
		color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 13,
        marginBottom: 5
	},
	titleStyle: {
		textAlign: "center",
		fontSize: 14,
		marginVertical: 3,
		fontWeight: "700",
        fontSize: 15,
        color: '#FFFFFF',
        marginBottom: 5
	},
});

export default ContentCard;
