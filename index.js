"use strict";
const merge = require('lodash.merge');
let system = process.env.NODE_ENV;
let isLocal = process.env.LEO_LOCAL || 'false';
async function cacheSetting(key, promise, time = null) {
	if (!(key in settingCache)) {
		settingCache[key] = await promise;
	}

	return settingCache[key];
}

let ui = {};

let config = {
	env: system,
	bootstrap: function(params) {
		if (typeof params == "string") {
			params = require(params);
		}

		//prebuild the UI stuff
		for (var key in params) {
			if (key != '_local' && key != '_global') {
				ui[key] = merge(params._global.ui, params[key].ui);
			}
		}
		//Lets check if they have a global
		if ("_global" in params) {
			if (typeof params._global == "function") {
				merge(config, params._global.call(config));
			} else {
				merge(config, params._global);
			}
		}
		if (system in params) {
			if (typeof params[system] == "function") {
				merge(config, params[system].call(config));
			} else {
				merge(config, params[system]);
			}
		}
		//Lets check if they have a global
		if (isLocal === 'true' && "_local" in params) {
			if (typeof params._local == "function") {
				merge(config, params._local.call(config));
			} else {
				merge(config, params._local);
			}
		}
		global.leosdk = config.leosdk;
		return module.exports;
	}
};
module.exports = new Proxy(config, {
	get: function(target, propKey) {
		const orig = target[propKey];
		if (propKey == "_leo_prebuilt_ui") {
			return ui;
		} else if (propKey == "bootstrap") {
			return orig;
		} else if (orig && typeof orig == "function") {
			return orig.call(config, cacheSetting.bind(config, propKey));
		} else {
			return orig;
		}
	}
});
