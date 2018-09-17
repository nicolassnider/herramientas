class ConfigBusiness {
	static get(configKey) {
		let configData = JSON.parse(localStorage.getItem("configBusiness"));
		//return configData[configKey];
		return this.index(configData, configKey);
	}

	static index(obj, is, value) {
	    if (typeof is === 'string') {
	        return this.index(obj,is.split('.'), value); }
	    else if (is.length===1 && value!==undefined)
	        return obj[is[0]] = value;
	    else if (is.length===0)
	        return obj;
	    else {
	    	if(!obj[is[0]] && value!==undefined) obj[is[0]] = {};
	        return this.index(obj[is[0]],is.slice(1), value);
		}
	}
}

export default ConfigBusiness;