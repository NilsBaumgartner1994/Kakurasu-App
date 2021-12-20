import React, {useState} from "react";
import {Text} from "native-base";
import {TouchableOpacity} from "react-native";

export const Field = (props) => {

	console.log(props);

	let field = props.data;
	let game = props.game;

	const [loaded, setLoaded] = useState(false);

	let supportModeActive = true;

	let colorActive = "orange";
	let colorSatisfied = "white";
	let colorClear = "gray";
	let colorReadOnly = "yellow";

	let isClear = field.isClear();
	let isActive = field.isActive();
	let isFlagged = field.isFlagged();
	let isReadOnly = field.isReadOnly();
	let isSolution = field.isSolution();

	let isRowSatisfied = game.isRowConstraintSatisfied(field.row);
	let isColumnSatisfied = game.isColumnConstraintSatisfied(field.column);
	let isSatisfied = isRowSatisfied || isColumnSatisfied;

	let text = "?";
	let backgroundColor = colorClear;

	if (supportModeActive) {
		if (isSatisfied) {
			text = "";
			backgroundColor = colorSatisfied;
		}
	}

	if (isActive) {
		text = "";
		backgroundColor = colorActive;
	}
	if (isFlagged) {
		text = "x";
		backgroundColor = colorSatisfied;
	}
	if (isReadOnly) {
		text = "";
		backgroundColor = colorReadOnly;
	}

	let isGameWon = game.isGameWon();
	let disabled = isReadOnly || isGameWon;

	return (
		<TouchableOpacity
			style={{
				width: props.size,
				height: props.size,
				backgroundColor: backgroundColor,
				alignItems: "center",
				justifyContent: "center",
				borderColor: "black",
				borderWidth: 1,
			}}
			disabled={disabled}
			onPress={props.handlePressField.bind(this, field)}
			onLongPress={props.handleLongPressField.bind(this, field)}>
			<Text>{text}</Text>
		</TouchableOpacity>
	);
}