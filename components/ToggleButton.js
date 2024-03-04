import React, { useState } from "react";
import { Button, useTheme } from "react-native-paper";

const ToggleButton = ({ title, filters, setFilters, value }) => {
	const theme = useTheme();

	const [toggled, setToggled] = useState(
		filters.includes(value) ? true : false,
	);

	const handlePress = () => {
		if (toggled) {
			let temp = filters;
			temp = temp.filter(item => item !== value);
			setFilters(temp);
			setToggled(false);
		} else {
			setFilters([...filters, value]);
			setToggled(true);
		}
	};

	return (
		<Button
			mode={toggled ? "contained" : "outlined"}
			onPress={handlePress}
			style={{
				margin: 10,
				borderColor: 'white',
				borderWidth: 2.5,
				color: "white",
				
			}}
			labelStyle={{ fontWeight: "bold", color:"white" }}>
			{title}
		</Button>
	);
};

export default ToggleButton;
