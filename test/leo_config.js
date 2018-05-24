const leoaws = require("leo-aws");

module.exports = {
	/**Added on every system**/
	_global: {
		"usepconnect": true
	},
	/**Added on every system if running locally**/
	_local: {
		"leo-auth": {
			user: {
				"ip": "127.0.0.1"
			},
			steve: true
		}
	},
	/**------------------------ User defined Systems ----------------------**/
	/** Can be a function**/
	prod: function() {
		return {
			leoaws: leoaws({
				profile: 'prod',
				region: "us-west-2"
			}),
			database: function() {
				return this.leoaws.secrets.getSecret("mysql_test_secret");
			},
			dynamodbSetting: function(cache) {
				return cache(this.leoaws.dynamodb.get("DevBus-LeoSettings-14HODE41JWL2O", "healthSNS_data"));
			},
			"leo-sdk": {
				"region": "us-west-2",
				"resources": {
					"Region": "us-west-2",
					"LeoArchive": "DevBus-LeoArchive-EV40AV12VN7Y",
					"LeoCron": "DevBus-LeoCron-1FLNC9Z5KSB72",
					"LeoEvent": "DevBus-LeoEvent-15BW5AWF2WDL",
					"LeoFirehoseStream": "DevBus-LeoFirehoseStream-WLRD5KQ5ISSP",
					"LeoKinesisStream": "DevBus-LeoKinesisStream-1LGSWLTEDERND",
					"LeoS3": "devbus-leos3-1vgbqr50913nz",
					"LeoSettings": "DevBus-LeoSettings-14HODE41JWL2O",
					"LeoStream": "DevBus-LeoStream-UY635GZGFIUQ",
					"LeoSystem": "DevBus-LeoSystem-AHQC22IPM23A"
				},
				"firehose": "DevBus-LeoFirehoseStream-WLRD5KQ5ISSP",
				"kinesis": "DevBus-LeoKinesisStream-1LGSWLTEDERND",
				"s3": "devbus-leos3-1vgbqr50913nz"
			}
		};
	},
	/** Or can be a simple object **/
	dev: function() {
		return {
			database: {
				username: 'root',
				password: 'a',
			},
			"test": {
				something: "Some cool test"
			},
			"leo-sdk": {
				"region": "us-west-2",
				"resources": {
					"Region": "us-west-2",
					"LeoArchive": "DevBus-LeoArchive-EV40AV12VN7Y",
					"LeoCron": "DevBus-LeoCron-1FLNC9Z5KSB72",
					"LeoEvent": "DevBus-LeoEvent-15BW5AWF2WDL",
					"LeoFirehoseStream": "DevBus-LeoFirehoseStream-WLRD5KQ5ISSP",
					"LeoKinesisStream": "DevBus-LeoKinesisStream-1LGSWLTEDERND",
					"LeoS3": "devbus-leos3-1vgbqr50913nz",
					"LeoSettings": "DevBus-LeoSettings-14HODE41JWL2O",
					"LeoStream": "DevBus-LeoStream-UY635GZGFIUQ",
					"LeoSystem": "DevBus-LeoSystem-AHQC22IPM23A"
				},
				"firehose": "DevBus-LeoFirehoseStream-WLRD5KQ5ISSP",
				"kinesis": "DevBus-LeoKinesisStream-1LGSWLTEDERND",
				"s3": "devbus-leos3-1vgbqr50913nz"
			}
		};
	}
};
