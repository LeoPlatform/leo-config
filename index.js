"use strict";
const merge = require('lodash.merge');
let system = process.env.NODE_ENV;
let isLocal = process.env.LEO_LOCAL || 'false';
let settingCache = {};
async function cacheSetting(key, promise, time = null) {
	return settingCache[key] = await promise;
}

let ui = {};

let config = {
	env: system,
	leoaws: {},
	bootstrap: function(params) {
		if (typeof params == "string") {
			params = require(params);
		}

		//prebuild the UI stuff
		for (var key in params) {
			if (key != '_local' && key != '_global') {
				ui[key] = merge(params._global && params._global.ui, params[key].ui);
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
			if (!(propKey in settingCache)) {
				return orig.call(config, cacheSetting.bind(config, propKey));
			}
			return settingCache[propKey];
		} else {
			return orig;
		}
	}
});

// Try and bootstrap
if (process.env.leo_config_bootstrap_path) {
	try {
		module.exports.bootstrap(require(process.env.leo_config_bootstrap_path));
	} catch (e) {
		// Not bootstrapped
	}
}
