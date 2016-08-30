# Collab to Moyo Ids Translation Script
This code loops through a json object that maps collab ids to corresponding moyo ids. Any failures are outputted to a file.

`node collabToMoyo.js`


### Basic API calls
The script makes use of the Intercom API, uses the user's current `user_id` to get their Intercom `id` from the database, and then uses that to update with the new `user_id`.

#####GET
curl https://api.intercom.io/users -u gstxhewl:8ccc29e87c8a8fb0455c745065a38e9f90c6a95a -H 'Accept:application/json'

curl https://api.intercom.io/users?user_id=32897 -u vpei6msd:79e34a7b9a5d3a006fd6f5554fdd991dbe0b9465 -H 'Accept:application/json'

#####UPDATE
//curl https://api.intercom.io/users -X POST -u vpei6msd:79e34a7b9a5d3a006fd6f5554fdd991dbe0b9465 -H 'Accept: application/json' -H 'Content-Type: application/json'
// -d '{ "id": "576ad823ad870eee05000751", "user_id": "66666" }'


### References
* https://developers.intercom.io/reference#rate-limiting
Request rates are limited to 500 requests per minute. If the rate limit is exceeded,
the API will return a response code of '429 Too Many Requests'.

There is also an option to upload bulk tasks if this is exceeded.

e.g.
```
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Date: Wed, 02 Apr 2014 14:01:40 GMT
X-RateLimit-Limit: 180
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1396447320
```

##### Example Stage Mappings
```
  Collab Id  |  Moyo Id                               |  Intercom Id  
----------------------------------------------------------------------------------
  32987      |  57bc9b0e-6405-4040-9d76-50af1c7e9fd1  |  577d92a2961e2033c60005e6
  32897      |  1e43c0f7-c776-5f6d-18fa-18c3590cdbef  |  576845681104899b330018d0
  32928      |  57bc989e-7092-43d5-ae39-d0ba82d4e2eb  |  576ad823ad870eee05000751
```


### Debugging Request

```
var request = require('request');
require('request-debug')(request);
```
