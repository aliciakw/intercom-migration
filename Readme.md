# Collab to Moyo Ids Translation Script
This code loops through a json object that maps collab ids to corresponding


### Basic API calls
The script makes use of the Intercom API, and basically gets the user

#####GET
curl https://api.intercom.io/users -u gstxhewl:8ccc29e87c8a8fb0455c745065a38e9f90c6a95a -H 'Accept:application/json'

curl https://api.intercom.io/users?user_id=32897 -u vpei6msd:79e34a7b9a5d3a006fd6f5554fdd991dbe0b9465 -H 'Accept:application/json'

#####UPDATE
//curl https://api.intercom.io/users -X POST -u vpei6msd:79e34a7b9a5d3a006fd6f5554fdd991dbe0b9465 -H 'Accept: application/json' -H 'Content-Type: application/json'
// -d '{ "id": "576ad823ad870eee05000751", "user_id": "66666" }'


### References
* https://developers.intercom.io/reference#rate-limiting
Request rates are limited to ____ requests per ______. If the rate limit is exceeded,
the API will return a response code of '429 Too Many Requests'.

e.g. 
```
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Date: Wed, 02 Apr 2014 14:01:40 GMT
X-RateLimit-Limit: 180
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1396447320
```
