var idsMap = require('./data/stage_bhpproviders_map.json');
var collabIds = Object.keys(idsMap);
var collabId;

var request = require('request');
//require('request-debug')(request);
var INTERCOM_URL = 'https://api.intercom.io/users';
var INTERCOM_APP_ID = 'vpei6msd', // 'gstxhewl',
    INTERCOM_API_KEY = '79e34a7b9a5d3a006fd6f5554fdd991dbe0b9465'; //'8ccc29e87c8a8fb0455c745065a38e9f90c6a95a';

var auth = 'Basic ' + new Buffer(INTERCOM_APP_ID + ':' + INTERCOM_API_KEY).toString('base64');

function printUser (id) {
  request({
    method: 'GET',
    url: INTERCOM_URL + '/' + id,
    headers: {
      'Authorization' : auth,
      'Accept': 'application/json'
    }
  }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      var record = JSON.parse(data.body);
      console.log(record.id, record.email, 'user_id =', record.user_id);
    }
  });
}

function updateUserId (id, newUserId) {
  request({
    method: 'POST',
    url: INTERCOM_URL,
    headers: {
      'Authorization' : auth,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: id, user_id: newUserId })
  }, function (err, data) {
    if (err) {
      console.log(err);
    }
    console.log(data.body);
  });
}

function getIntercomAcct (collabId, moyoId) {
  request({
    method: 'GET',
    url: INTERCOM_URL + '?user_id=' + collabId,
    headers: {
      'Authorization' : auth,
      'Accept': 'application/json'
    }
  }, function (err, data) {
    if (data && data.body) {
      var record = JSON.parse(data.body);
      if (record.id) {
        updateUserId(record.id, moyoId);
      }
    } else {
      console.log('ERROR accessing intercom account with user_id', collabId);
      if (err) {
        console.log(err);
      }
    }
  });
};

console.log('Converting BHP userIds...');

for (var i = 0; i < collabIds.length; i++) {
  collabId = collabIds[i];
  getIntercomAcct(collabId, idsMap[collabId]);
};


//GET
//curl https://api.intercom.io/users -u gstxhewl:8ccc29e87c8a8fb0455c745065a38e9f90c6a95a -H 'Accept:application/json'
//curl https://api.intercom.io/users?user_id=32897 -u vpei6msd:79e34a7b9a5d3a006fd6f5554fdd991dbe0b9465 -H 'Accept:application/json'

//UPDATE
//curl https://api.intercom.io/users -X POST -u vpei6msd:79e34a7b9a5d3a006fd6f5554fdd991dbe0b9465 -H 'Accept: application/json' -H 'Content-Type: application/json'
// -d '{ "id": "576ad823ad870eee05000751", "user_id": "66666" }'


//32987 57bc9b0e-6405-4040-9d76-50af1c7e9fd1 577d92a2961e2033c60005e6
//32897 1e43c0f7-c776-5f6d-18fa-18c3590cdbef 576845681104899b330018d0
//32928 57bc989e-7092-43d5-ae39-d0ba82d4e2eb 576ad823ad870eee05000751
