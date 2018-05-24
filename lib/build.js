const fs = require("fs");
const path = require("path");
const merge = require('lodash.merge');

function findParentFiles(dir, filename) {
	var paths = [];
	do {
		paths.push(dir);

		var lastDir = dir;
		dir = path.resolve(dir, "../");
	} while (dir != lastDir);

	var matches = [];
	paths.forEach(function(dir) {
		var file = path.resolve(dir, filename);
		if (fs.existsSync(file)) {
			matches.push(file);
		}
	});
	return matches;
}


let settingCache = {};

async function cacheSetting(key, promise, time = null) {
	if (!(key in settingCache)) {
		settingCache[key] = await promise;
	}

	return settingCache[key];
}

module.exports = {
	build: function(files) {
		let system = process.env.NODE_ENV;
		let isLocal = process.env.LEO_LOCAL || 'false';

		let config = {};
		files.forEach((file) => {
			let d = require(file);
			//Lets check if they have a global
			if ("_global" in d) {
				if (typeof d._global == "function") {
					merge(config, d._global());
				} else {
					merge(config, d._global);
				}
			}

			if (system in d) {
				if (typeof d[system] == "function") {
					merge(config, d[system]());
				} else {
					merge(config, d[system]);
				}
			}

			//Lets check if they have a global
			if (isLocal === 'true' && "_local" in d) {
				console.log('getting into loca');
				if (typeof d._local == "function") {
					merge(config, d._local());
				} else {
					merge(config, d._local);
				}
			}
		});

		return new Proxy(config, {
			get: function(target, propKey) {
				const orig = target[propKey];
				if (orig && typeof orig == "function") {
					return orig.call(config, cacheSetting.bind(config, propKey));
				} else {
					return orig;
				}
			}
		});
	},
	dynamicBuild: function(directory) {
		let matches = findParentFiles(directory, "leo_config.js").reverse();
		return this.build(matches);
	}
};
