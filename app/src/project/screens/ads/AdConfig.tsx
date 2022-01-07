export default class AdConfig{

	static isTest = true;

	static getVideoId(){
		let realId = 'ca-app-pub-8536961271956342/4714443541';
		let testId = "ca-app-pub-3940256099942544/5135589807";
		return AdConfig.isTest ? testId : realId;
	}
}