class Config {
	static get(configKey) {
		let configData = JSON.parse(localStorage.getItem("config"));
		return configData[configKey];
	}
}

export default Config;