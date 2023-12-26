import React, { useState } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

import DefaultSettingsButton from "../components/DefaultSettingsButton";
import DefaultSettingsSwitch from "../components/DefaultSettingsSwitch";
import RNRestart from "react-native-restart";

const GeneralSettingsScreen = ({ navigation }) => {
	const theme = useTheme();


	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}>
			<DefaultSettingsSwitch
				color={theme.colors.primary}
				text="AMOLED Theme"
				
				
			/>
			<DefaultSettingsSwitch
				color={theme.colors.primary}
				text="Use Proxy for Akwam"
				
				
			/>
			<DefaultSettingsButton
				label="Force Update Content"
				iconName="update"
				onPress={() => navigation.navigate("Loading")}
			/>
		</View>
	);
};

export default GeneralSettingsScreen;
