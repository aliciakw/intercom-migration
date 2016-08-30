// constants
var INTERCOM_URL = 'https://api.intercom.io/users';
var INTERCOM_APP_ID = 'vpei6msd', // 'gstxhewl',
    INTERCOM_API_KEY = '79e34a7b9a5d3a006fd6f5554fdd991dbe0b9465'; //'8ccc29e87c8a8fb0455c745065a38e9f90c6a95a';
var idsMap = require('./data/stage_bhpproviders_map.json');

// logging
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/errors.log', {flags : 'w'});
var log_stdout = process.stdout;

logError = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};


// intercom api calls
var request = require('request');
//require('request-debug')(request);
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
      logError('ERROR updating intercom account with user_id', collabId);
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
    var statusCode = (data && data.statusCode) ? data.statusCode : 500;
    if (statusCode == 429) {
      logError('429 Too Many Requests... retrying ' + collabId);
    } else if (data && data.body && data.statusCode) {
      var record = JSON.parse(data.body);
      if (record.id) {
        console.log(collabId, moyoId, record.id);
        // updateUserId(record.id, moyoId);
      }
    } else {
      if (err) {
        console.log(err);
      };
      logError('ERROR accessing intercom account with user_id ' + collabId);
    }
  });
};
function requestErr (collabId) {
  logError('READ ERROR for intercom account [collabId=' + collabId + ']');
}
function updateErr (collabId, moyoId, intercomId) {
  logError('UPDATE ERROR for intercom account [collabId:' + collabId + '] [moyoId=' + moyoId + '] [intercomId' + intercomId + ']');
}

var collabId, moyoId, intercomId;

function updateIntercomUserId (idsMap, collabIds, i, max) {
  if (i < max) {
    collabId = collabIds[i];
    moyoId = idsMap[collabId];

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
          console.log(collabId, moyoId, record.id);
          // updateUserId(record.id, moyoId);
        } else {
          requestErr(collabId);
        }
      } else if (data && data.statusCode == 429) {
        logError('429 Too Many Requests... retrying ' + collabId);
        setTimeout(function () {
          getIntercomAcct (collabId, moyoId);
          updateIntercomUserId(idsMap, collabIds, i, max);
          return;
        }, 3000);
      } else {
        if (err) {
          console.log(err);
        };
        requestErr(collabId);
      }
      updateIntercomUserId(idsMap, collabIds, (i + 1), max);
    });
  }
}

var collabIds = Object.keys(idsMap);
var l = collabIds.length;

// run the script
console.log('Convert Intercom user_id values....');
updateIntercomUserId (idsMap, collabIds, 0, l);
