open311-infobip
================

[![Build Status](https://travis-ci.org/CodeTanzania/open311-infobip.svg?branch=master)](https://travis-ci.org/CodeTanzania/open311-infobip)
[![Dependencies Status](https://david-dm.org/CodeTanzania/open311-infobip/status.svg?style=flat-square)](https://david-dm.org/CodeTanzania/open311-infobip)

sms transport for open311 messages using infobip

*Note!:It highly adviced to process start `infobip transport` in separate process for optiomal performance*

## Requirements
- [MongoDB 3.2+](https://www.mongodb.com/)
- [NodeJS v6.9.2+](https://nodejs.org)
- [Redis 2.8 +](https://redis.io/)

## Installation
```sh
$ npm install --save open311-infobip
```

## Usage
```js
const mongoose = require('mongoose');
const Message = require('open311-messages')(<options>);
const infobip = require('open311-infobip');
infobip.options = {
   from:<your_infobip_account_sender_id>,
   username:<your_infobip_account_username>,
   password:<your_infobip_account_password>
};

//queue message for sending
const message = new Message(<message_details>);
infobip.queue(message);


//start infobip sms worker(s) in background process(s)
//to process and send queued message(s) as sms(s)
infobip.start();
```

## Options
- `from:String` valid infobip account sms sender id
- `username:String` valid infobip account username
- `password:String` valid infobip account password
- `fake:Boolean` whether to fake sms sending. Default to false. [See](https://github.com/lykmapipo/bipsms#usage)
- All [kue supported configuration options](https://github.com/Automattic/kue#redis-connection-settings)



## Testing
* Clone this repository

* Install all development dependencies
```sh
$ npm install
```

* Then run unit test
```sh
$ npm test
```

* To run integration test ensure your exported below environment variables
```sh
export INFOBIP_FROM="my value"
export INFOBIP_USERNAME="my value"
export INFOBIP_PASSWORD="my value"
export INFOBIP_TEST_RECEIVER="my value"
```

Then run integration test
```sh
$ npm run integration
```


## Contribute
It will be nice, if you open an issue first so that we can know what is going on, then, fork this repo and push in your ideas. Do not forget to add a bit of test(s) of what value you adding.

## Licence
The MIT License (MIT)

Copyright (c) 2017 lykmapipo, CodeTanzania & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 