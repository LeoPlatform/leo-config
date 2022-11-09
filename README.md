Test Change
# Leo Configuration
Leo configuration consists of two files. leo_config.js and leo_cli_config.js. As their names suggest, they configure two different aspects of a Leo Microservice

[leo_config.js](#leo-config) - Configures the runtime of a Microservice

[leo_cli_config.js](#leo_cli_configjs) - Configures the [leo-cli](https://github.com/LeoPlatform/cli) to execute/publish/deploy a Microservice

## leo-config
[example config file](https://github.com/LeoPlatform/leo-config/blob/master/test/leo_config.js)

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
    
    // Example getting the database credentials:
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
    // predefined options
    _global: {},
    _local: {},
    
    // your user-defined configuration options
    prod: {},
    stage: {},
    dev: {},
    prodServer1: {},
    prodServer2: {},
    etc: {}
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
Sets default configuration settings for all environments. Any user-defined environment will override anything in global.

```javascript
_local
```
Used for when you're testing locally. Will override settings in your current environment when LEO_LOCAL=true

#### Using custom ENV options
Any option in here should match exactly the NODE_ENV for the environment you will be deploying and running this code.
For this example, I will be using a basic `dev`, `stage`, `prod`; but you can use any value you like and have defined
in your NODE_ENV.
```javascript
// if NODE_ENV=prod, use settings for the prod environment
prod: {
    // using database as a dynamic function, get the credentials from AWS Secrets Manager
    database: function() {
        return this.leoaws.secrets.getSecret('mysql_prod_secret')
    },
    // setting your AWS configuration
    "leo-sdk": {
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
    }
},
// if NODE_ENV=stage, use settings for the stage environment
stage: {
    database: function() {
        return this.leoaws.secrets.getSecret('mysql_stage_secret')
    }
},
// if NODE_ENV=dev, use settings for the dev environment
dev: {
    // using database as a static object
    database: {
        username: 'root',
        password: 'mySuperSecretAndVerySecurePasswordNowStoredInTheCode',
        host: 'db.mydomain.com',
        port: '1234',
        database: 'test'
    }
}
```
### Local testing
If you have an environment variable `LEO_LOCAL=true`, you can use `_local` and override any settings in _global and env section.
```javascript
_local: {
    // required for local testing with AWS.
    leoaws: {
        profile: "default", // set in your ~/.aws/credentials
        region: "us-west-2"
    }
}
```

If you use a dynamic function, you can cache the value by first passing in `cache` into the function, then wrapping
your call in the `cache` function.
##### Example
```javascript
dev: {
    dynamodbSettings: function(cache) {
        return cache(this.leoaws.dynamodb.get("DevBus-LeoSettings-14HODE41JWL2O", "healthSNS_data"));
    }
}
```

### UI Config
If you have created a [Leo React App](https://github.com/LeoPlatform/cli#create-a-react-application) you can a configuration profile that *may* be passed to the front end
```
'use strict';
module.exports = {
    _global: {
        ui: {
            cognito: {
                id: "some-cognito-id"
            },
            region: "some-aws-region"
        }
    }
}
```
Find the LEOCognito object [here](https://github.com/LeoPlatform/bus-ui/tree/master/ui/static/js)

The following shows examples of how to extract some or all of the leo_config via the `leo` server side object 
```
<html>
    <head>
        <base href="${leo.baseHref}" />
        <script>
            // Full UI Config from leo_config.js
            window.leo = ${leo}; 
            // Start LEOCognito 
            LEOCognito.start(leo.cognito.id, false, {region:leo.region, cognito_region: leo.cognito_region || leo.region});



            // Just parts of the UI Config
            window.leo = {
                cognitoId: "${leo.cognito.id}", 
                region: "${leo.region}",
                cognito_region: "${leo.region}"
            };            
            // Start LEOCognito 
            LEOCognito.start(leo.cognitoId, false, {region:leo.region, cognito_region: leo.cognito_region || leo.region});


            // Start LEOCognito using replacements
            LEOCognito.start("${leo.cognito.id}", false, {region:"${leo.region}", cognito_region: "${leo.region}"});

        </script>
    </head>
    <body>
        <p>Hello World</p>
    </body>
</html>
```
Also, note the `basehref` coming from `leo`. That is intended to be the HTML <base> so your urls are relative to the deployment

## leo_cli_config.js
```javascript
module.exports = { 
  linkedStacks: [
    "LeoBus" // must match the parameter name in deploy
  ],  
  publish: [{   
      leoaws: {
        profile: "default", // defined in ~/.aws/credentials
        region: "us-west-2" // supported regions: us-west-2 and us-east-1 
      },  
      public: false
  }],  
  deploy: {
    dev: {
      stack: "QuickStart",
      parameters: {
        LeoBus: "DevBus",
        AlarmEmail: "default@email.com"
      }   
    }   
  }
}
```
You may add a `test` section to configure an [application](https://github.com/LeoPlatform/cli#create-a-react-application) port
```
module.exports = {
    test: {
        port: 8080
    }
}
```

## Support
Want to hire an expert, or need technical support? Reach out to the Leo team: https://leoinsights.com/contact
