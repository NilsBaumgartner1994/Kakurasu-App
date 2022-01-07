import React, {useEffect, useState} from "react";
import {Skeleton, Text, View} from "native-base";
import {Kakurasu} from "kakurasu";
import {Field} from "./Field";
import {TouchableOpacity, Vibration} from "react-native";
import App from "../../KitchenHelper/App";

const size = 50;

const DURATION_VIBRATION_FIELD_ACTIVATE = [200];
const DURATION_VIBRATION_GAME_WOM = [25, 50, 100, 200];

export const Game = (props) => {

	console.log(props);
	const [loaded, setLoaded] = useState(false);
	const [game, setGame] = useState(null);
	const [gamestate, setGamestate] = useState("");
	const [amountPlayedGames, setAmountPlayedGames] = useState("");

	async function loadData(){
		console.log("Load: ")
		await loadNewGame();
		setLoaded(true);
	}

	async function loadNewGame() {
		let newGame = new Kakurasu();
		let amountPlayedGames = await App.storage.get("amountPlayedGames");
	    setAmountPlayedGames(amountPlayedGames);
		await updateGame(newGame);
	}

	function renderOuterCell(content) {
		return (
			<View
				style={{
					width: size,
					height: size,
					alignItems: "center",
					justifyContent: "center",
				}}>
				{content}
			</View>
		);
	}

	function renderWeight(weight) {
		return renderOuterCell(
			<Text style={{color: "gray"}}>{weight}</Text>
		);
	}

	function renderRowConstraint(rowIndex) {
		let constraintValue = game.getConstraintValueForRow(rowIndex);
		let isSatisfied = game.isRowConstraintSatisfied(rowIndex);
		return renderConstraint(constraintValue, isSatisfied);
	}

	function renderRow(rowIndex) {
		let fieldsInRow = game.getFieldsInRow(rowIndex);
		let weight = game.getWeight(rowIndex);

		let fields = [];
		fields.push(renderWeight(weight));

		for (let i = 0; i < fieldsInRow.length; i++) {
			let field = fieldsInRow[i];
			fields.push(<Field data={field} game={game} handlePressField={handlePressField.bind(this)} handleLongPressField={handleLongPressField.bind(this)} size={size} />);
		}

		fields.push(renderRowConstraint(rowIndex));

		let row = (
			<View
				style={{
					flexDirection: "row",
					justifyContent: "flex-start",
				}}>
				{fields}
			</View>
		);

		return row;
	}

	async function updateGame(game) {

		setGame(game);
		setGamestate(JSON.stringify(game.asJSON()))
		let isGameWon = game.isGameWon();
		if(isGameWon){
			vibrateGameWon();
			let numberamountPlayedGames = parseInt(amountPlayedGames) || 0;
			numberamountPlayedGames++;
			setAmountPlayedGames(numberamountPlayedGames+"")
			App.storage.set("amountPlayedGames", numberamountPlayedGames);
		}
	}

	function vibrateFieldSet(){
		Vibration.vibrate(DURATION_VIBRATION_FIELD_ACTIVATE, false);
	}

	function vibrateGameWon(){
		Vibration.vibrate(DURATION_VIBRATION_GAME_WOM, false);
	}

	function handlePressField(field) {
		let row = field.row;
		let column = field.column;
		let isClear = field.isClear();
		let isActive = field.isActive();

		if (isClear) {
			let changeStatus = game.setFieldActive(row, column);
			vibrateFieldSet();
		} else if (isActive) {
			let changeStatus = game.setFieldFlagged(row, column);
		} else {
			let changeStatus = game.setFieldClear(row, column);
		}
		updateGame(game);
	}

	function handleLongPressField(field) {
		let row = field.row;
		let column = field.column;
		let isFlagged = field.isFlagged();

		if (!isFlagged) {
			let changeStatus = game.changeFlagStatus(row, column);
		} else {
			let changeStatus = game.setFieldClear(row, column);
		}
		updateGame(game);
	}

	function renderColumnWeights() {
		let fields = [];
		fields.push(renderOuterCell(null)); //empty corner

		let columns = game.getAmountColumns();
		for (let i = 0; i < columns; i++) {
			let weight = game.getWeight(i);
			fields.push(renderWeight(weight));
		}

		return (
			<View
				style={{
					flexDirection: "row",
					justifyContent: "flex-start",
				}}>
				{fields}
			</View>
		);
	}

	function renderConstraint(value, isSatisfied) {
		let textStyle = {
			fontWeight: "bold",
		};
		if (isSatisfied) {
			textStyle.color = "gray";
			textStyle.fontWeight = "normal";
		}

		return (
			<View
				style={{
					width: size,
					height: size,
					alignItems: "center",
					justifyContent: "center",
				}}>
				<Text style={textStyle}>
					{value}
				</Text>
			</View>
		);
	}


	function renderColumnConstraints() {
		let fields = [];
		fields.push(renderOuterCell(null)); //empty corner

		let columns = game.getAmountColumns();
		for (let i = 0; i < columns; i++) {
			let constraintValue = game.getConstraintValueForColumn(i);
			let isSatisfied = game.isColumnConstraintSatisfied(i);
			fields.push(renderConstraint(constraintValue, isSatisfied));
		}

		return (
			<View
				style={{
					flexDirection: "row",
					justifyContent: "flex-start",
				}}>
				{fields}
			</View>
		);
	}

	function redoMove() {
		game.redoMove();
		this.updateGame(game);
	}

	function renderRedo() {
		return renderToolButton("Redo", null, redoMove.bind(this));
	}

	function renderNewGame() {
		return renderToolButton("New", null, loadNewGame.bind(this));
	}

	async function handleNextGame(){
		//await GameData.increaseAmountPlayedGames();
		await loadNewGame();
	}

	function renderNextGame() {
		return renderToolButton("Next Game", null, handleNextGame.bind(this));
	}

	function undoMove() {
		game.undoMove();
		updateGame(game);
	}

	function renderUndo() {
		return renderToolButton("Undo", null, undoMove.bind(this));
	}

	function renderToolButton(label, icon, callback) {
		let toolButtonStyle = {
			borderRadius: 10,
			margin: 5,
			paddingHorizontal: 20,
			paddingVertical: 10,
			backgroundColor: "lightblue",
			justifyContent: "center",
		};

		return (
			<TouchableOpacity style={toolButtonStyle} onPress={callback}>
				<Text>{label}</Text>
			</TouchableOpacity>
		);
	}

	function renderToolbar() {
		let amountMoves = game.getAmountMoves();
		let tools = [];

		if(game.isGameWon()){
			tools.push(renderNextGame());
		} else {
			tools.push(renderNewGame());
			tools.push(renderRedo());
			tools.push(renderUndo());
		}
		tools.push(renderToolButton(amountPlayedGames, "game", () => {}));

		return (
			<View
				style={{
					flexDirection: "row",
					justifyContent: "flex-start",
				}}>
				{tools}
			</View>
		);
	}

	function renderGamefield() {
		let amountRows = game.getAmountRows();

		let rows = [];
		rows.push(renderColumnWeights());

		for (let i = 0; i < amountRows; i++) {
			rows.push(renderRow(i));
		}

		rows.push(renderColumnConstraints());

		let holder = (
			<View
				style={{
					flexDirection: "column",
					justifyContent: "flex-start",
				}}>
				{rows}
			</View>
		);

		return holder;
	}

	// corresponding componentDidMount
	useEffect(() => {
		loadData();
	}, [])

	if(!loaded){
		return (
			<Skeleton />
		)
	}

	return(
		<>
			{renderToolbar()}
			{renderGamefield()}
		</>
	)
}