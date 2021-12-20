import {Level} from "./screens/Level";
import {BaseTemplate} from "../KitchenHelper/templates/BaseTemplate";
import {RegisteredRoutesMap} from "../KitchenHelper/navigation/RegisteredRoutesMap";
import {MenuItem} from "../KitchenHelper/navigation/MenuItem";
import {MyMenuRegisterer} from "../KitchenHelper/navigation/MyMenuRegisterer";
import {GameTemplate} from "./templates/GameTemplate";

export default class Project {

	static topPluginContent(){
		return null;
	}

	static registerRoutes(){
		// Resource detail
		RegisteredRoutesMap.registerRoute(Level, GameTemplate, "Level", "level");

		RegisteredRoutesMap.setInitialRouteName("level");

		// Side Menu

		// Side Menu for User
		MyMenuRegisterer.registerCommonMenu(new MenuItem("play", "Play", Level));

	}

	static async initApp() {
		console.log("Project init")
	}

}