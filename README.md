# leo-config
[example config fiile](https://github.com/LeoPlatform/leo-config/blob/master/test/leo_config.js)

Leo Config is designed as a NODE_ENV based system for storing configuration for as many deployment environments as you want
using a hierarchical approach, and securely accessing stored credentials.
 
We recommend using AWS Secrets Manager for storing database credentials.

#### Basic usage example
In your application, require leo-config, then you can use any of the configuration settings outlined in the following steps.
Note: Config uses async and wait, which, for example, enables the code to wait for database settings BEFORE trying to
connect to the database.
```javascript
const config = require('leo-config');

exports.handler = async function(event, context, callback) {
	// your config settings are now in the config object
	// use await to make sure your code waits for database credentials before trying to connect to the database
	let dbConfig = await config.database;
	
	// Output the database host for our environment
	console.log(dbConfig.host);
	
	callback();
}
```

#### Basic configuration example
Create a file named `leo_config.js` in any directory of your project that you use the LEO Platform.
#### Basic structure example
```javascript
const leoaws = require('leo-aws');

module.exports = {
    // configuration goes here
    _global: {},
    _local: {},
    prod: {},
    stage: {},
    dev: {},
    yourCustomEnvName: {},
    prodServer1: {},
    prodServer2: {}
}
```

### Configuration Options
Each configuration option can be written as a static object for basic configuration settings (not recommended for connection
information such as usernames, passwords, etc), or a dynamic function for getting settings such as database connection
information or other configuration settings you want to keep secret or stored somewhere secure.
##### Static object
```javascript
_global: {}
```
##### dynamic function
```javascript
_global: function() {}
```

#### Predefined options

```javascript
_global
```
Used for any configuration settings you want in all environments.

```javascript
_local
```
Used for when you're testing locally. Can be used to overwrite connection information for a local server for testing purposes.

#### Using custom ENV options
Any option in here should match exactly the NODE_ENV for the environment you will be deploying and running this code.
For this example, I will be using a basic `dev`, `stage`, `prod`, and `customEnv`, but you can use any value you like and have defined
in your NODE_ENV.
Each environment function can call another function environment to keep from duplicating settings that are the same
between environments.
```javascript
// if NODE_ENV=prod, use settings for the prod environment
prod: function() {
    return {
        leoaws: leoaws({
            profile: 'prod',
            region: 'us-west-2'
        }),
        // using database as a dynamic function, get the credentials from AWS Secrets Manager
        database: function() {
            return this.leoaws.secrets.getSecret('mysql_test_secret')
        }
    }
},
// if NODE_ENV=stage, use settings for the stage environment
stage: function() {
    return {
        leoaws: leoaws({
            profile: 'stage',
            region: 'us-west-2'
        }),
        // using database as a static object
        database: {
            username: 'root',
            password: 'mySuperSecretAndVerySecurePasswordNowStoredInTheCode',
            host: 'db.mydomain.com',
            port: '1234',
            database: 'test'
        }
    }
},
// if NODE_ENV=dev, use settings for the dev environment
dev: function() {
    // reuse the stage configuration, but overwrite a couple variables for the dev environment
    let config = this.stage();
    config.database.host = 'localhost';
    config.database.password = 'root';
    
    config.leoaws = leoaws({
        profile: 'stage',
        region: 'us-west-2'
    });
    
    return config;
},
// if NODE_ENV=customEnv, use the settings from the dev environment
customEnv: function() {
	return this.dev();
}
```

If you use a dynamic function as a config key=>object, you can cache the value by first passing in `cache` into the function,
then wrapping your call in the `cache` function.
##### Example
```javascript
dev: function() {
    dynamodbSettings: function(cache) {
        return cache(this.leoaws.dynamodb.get("DevBus-LeoSettings-14HODE41JWL2O", "healthSNS_data"));
    }
}
```

## Using AWS Secrets Manager for config settings
AWS Secrets manager is a powerful way to store your configuration options in a central location and can store an unlimited
number of settings. Here is an example using the secrets manager for all settings.

```javascript
myenv: function() {
    return this.leoaws.secrets.getSecret('my_app_settings');
}
```
If you want to take leverage Secrets Manager for settings, in Secrets Manager, your settings would need to be defined
using the Plaintext option, and look something like this:
```json
{
    "leo-sdk": {
        "region": "us-west-2",
        "resources": {
            "Region": "us-west-2",
            "LeoArchive": "DevBus-LeoArchive-AB01CD23EF45GH67IJ89KL0M",
            "LeoCron": "DevBus-LeoCron-CD23EF45GH67IJ89KL01MN2O",
            "LeoEvent": "DevBus-LeoEvent-EF45GH67IJ89KL01MN23OP4Q",
            "LeoFirehoseStream": "DevBus-LeoFirehoseStream-GH67IJ89KL01MN23OP45QR6S",
            "LeoKinesisStream": "DevBus-LeoKinesisStream-IJ89KL01MN23OP45QR67ST8U",
            "LeoS3": "devbus-leos3-KL01MN23OP45QR67ST89UV0W",
            "LeoSettings": "DevBus-LeoSettings-MN23OP45QR67ST89UV01WX2Y",
            "LeoStream": "DevBus-LeoStream-OP45QR67ST89UV01WX23YZ4A",
            "LeoSystem": "DevBus-LeoSystem-QR67ST89UV01WX23YZ45AB6C"
        },
        "firehose": "DevBus-LeoFirehoseStream-ST89UV01WX23YZ45AB67CD8E",
        "kinesis": "DevBus-LeoKinesisStream-UV01WX23YZ45AB67CD89EF0G",
        "s3": "devbus-leos3-WX23YZ45AB67CD89EF01GH2I"
    },
    "database": {
        "username": "myDbUsername",
        "password": "myDbPassword",
        "host": "myDb.host",
        "port": 9876
    }
}
```
Happy coding!

## Support
Want to hire an expert, or need technical support? Reach out to the Leo team: https://leoinsights.com/contact
