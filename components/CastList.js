import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import FastImage from 'react-native-fast-image';
const CastCard = ({ name, role, imageUrl }) => {
	return (
		<View style={{ flexDirection: "row", margin: 10 }}>
			<FastImage
				source={{ uri: "https://image.tmdb.org/t/p/original" + imageUrl ,  priority: FastImage.priority.high}}
				style={{ width: 70, height: 100, borderRadius: 50 }}
			/>
			<View style={{ justifyContent: "center" }}>
				<Text style={{ marginHorizontal: 5, fontWeight: "bold", color: "white" }}>{name}</Text>
				<Text style={{ margin: 5, color: "white" }}>{role}</Text>
			</View>
		</View>
	);
};

const CastList = ({ castList }) => {
	if (castList !== null) {
		return (
			<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
				{castList.slice(0, 10).map(item => (
					<CastCard
						name={item.name}
						role={item.known_for_department}
						imageUrl={item.profile_path}
						key={item.name + item.known_for_department}
					/>
				))}
			</ScrollView>
		);
	} else {
		return;
	}
};

export default CastList;
