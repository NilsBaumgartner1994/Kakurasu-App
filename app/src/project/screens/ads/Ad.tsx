import React, {useEffect, useState} from "react";
import {Button, Text} from "native-base";
import {AdMobRewarded} from 'expo-ads-admob';
import App from "../../KitchenHelper/App";
import AdConfig from "./AdConfig";

declare type EventNameType = 'rewardedVideoDidRewardUser' |
	'rewardedVideoDidLoad' |
	'rewardedVideoDidFailToLoad' |
	'rewardedVideoDidOpen' |
	'rewardedVideoDidStart' |
	'rewardedVideoDidClose' |
	'rewardedVideoWillLeaveApplication';

export const Ad = (props) => {

	function registerCallbacks(){
		AdMobRewarded.addEventListener('rewardedVideoDidRewardUser',
			(type, amount) => console.log('rewardedVideoDidRewardUser', type, amount)
		);
		AdMobRewarded.addEventListener("rewardedVideoDidLoad", () =>
			console.log("videodidload")
		);
		AdMobRewarded.addEventListener("rewardedVideoDidFailToLoad", () =>
			console.log("didfailtoload")
		);
		AdMobRewarded.addEventListener("rewardedVideoDidOpen", () =>
			console.log("video didopen")
		);
		AdMobRewarded.addEventListener("rewardedVideoDidClose", () =>{
				console.log("didclose")
			}
		);
		AdMobRewarded.addEventListener("rewardedVideoWillLeaveApplication", () =>
			console.log("will leave application")
		);
	}

	async function downloadServerStatus(){
		// Display a rewarded ad
		let user = App.getUser();
		console.log(user);
		let user_id = user.id;
		console.log(user_id);

		try{
			console.log("Set ad Unit id")
			await AdMobRewarded.setAdUnitID(AdConfig.getVideoId()); // Test ID, Replace with your-admob-unit-id
			console.log("Request ad async");
			await AdMobRewarded.requestAdAsync({ servePersonalizedAds: true, additionalRequestParams: {app_user: user_id, test: 1}});
			console.log("show ad async");
			await AdMobRewarded.showAdAsync();
		} catch (err){
			console.log("error at add showing");
			console.log(err);
		}
	}

	// corresponding componentDidMount
	useEffect(() => {
		registerCallbacks();
	}, [props.route.params])

	return(
		<>
			<Text>{"Welcome to add testing"}</Text>
			<Button key={"addtest"} onPress={downloadServerStatus} ><Text>Start Add</Text></Button>
		</>
	)
}