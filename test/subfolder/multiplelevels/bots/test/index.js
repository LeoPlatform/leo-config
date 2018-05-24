"use strict";

const config = require("../../../../../index.js");
// const config = require("leo-config");

exports.handler = async function(event, context, callback) {
	console.log(config.test);
	let dbConfig = await config.database;
	console.log(dbConfig);

	let dynamodbsetting = await config.dynamodbSetting;
	console.log(dynamodbsetting);

	console.log(await config.kmsEncrypted);


	callback();
};
