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
		},
		leoaws: {
			profile: "default", // set in ~/.aws/credentials
			region: "us-west-2"
		}
	},
	/**------------------------ User defined Systems ----------------------**/
	prod: {
		database: function() {
			return this.leoaws.secrets.getSecret("mysql_test_secret");
		},
		dynamodbSetting: function(cache) {
			return cache(this.leoaws.dynamodb.get("DevBus-LeoSettings-14HODE41JWL2O", "healthSNS_data"));
		},
		kmsEncrypted: function(cache) {
			// this.leoaws.kms.encrypt("a5bede8a-4e63-4275-899d-30d97f8baa35", "I encrypted this with KMS");
			return cache(this.leoaws.kms.decrypt("AQICAHjPqXpvMEzdW6UaJYb0j5mC6Qd3OD81ZyxQBe248hmgAQG+kzHQzVl3R4DfxHymzR32AAAAdzB1BgkqhkiG9w0BBwagaDBmAgEAMGEGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMBK771xuMUY4B/KagAgEQgDSVwzTvTtKiFi6ceia27UjXUW8AGgrGTV/LsAK6ZfDt1RkOZO5QimKydV22KXri26FAPmzV"));
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
	},
	dev: {
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
	}
};
