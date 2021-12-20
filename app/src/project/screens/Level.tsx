import React, {useEffect, useState} from "react";
import {Game} from "./Game";
import {View} from "native-base";

export const Level = (props) => {

	// corresponding componentDidMount
	useEffect(() => {

	}, [props.route.params])

	return(
		<View style={{width: "100%", height: "100%", alignItems: "center"}}>
			<Game />
		</View>
	)
}