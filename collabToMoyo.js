// settings
var mapFile = './data/stage_bhpproviders_map.json';
var env = 'STAGE';

// constants
var idsMap = require(mapFile),
    creds = require('./creds.json'),
    request = require('request');

var INTERCOM_URL = 'https://api.intercom.io/users';
var auth = 'Basic ' + new Buffer(creds[env]['INTERCOM_APP_ID'] + ':' + creds[env]['INTERCOM_API_KEY']).toString('base64');


// logging
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/errors.log', {flags : 'w'});
var log_stdout = process.stdout;

logError = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};
function requestErr (collabId) {
  logError('READ ERROR for intercom account [collabId=' + collabId + ']\n');
}
function updateErr (collabId, moyoId, intercomId) {
  logError('UPDATE ERROR for intercom account [collabId:' + collabId + '] [moyoId=' + moyoId + '] [intercomId' + intercomId + ']\n');
}


// intercom api calls

function updateUserId (id, newUserId, oldUserId) {
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
    if (data && data.body) {
      if (data.statusCode == 200) {
        return;
      } else {
        logError(data.body);
        updateErr(oldUserId, newUserId, id)
      }
    } else {
      if (err) {
        logError(err);
      }
      updateErr(oldUserId, newUserId, id);
    }
  });
}

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
          updateUserId(record.id, moyoId, collabId);
        } else {
          logError(data.body);
          requestErr(collabId);
        }
      } else if (data && data.statusCode == 429) {
        logError('429 Too Many Requests... retrying ' + collabId + '\n');
        // wait one minute
        setTimeout(function () {
          getIntercomAcct (collabId, moyoId);
          updateIntercomUserId(idsMap, collabIds, i, max);
          return;
        }, 60000);
      } else {
        if (err) {
          logError(err);
        }
        requestErr(collabId);
      }
      updateIntercomUserId(idsMap, collabIds, (i + 1), max);
    });
  } else if (i === max ) {
     console.log('Done.')
  }

}


// run the script

var collabId, moyoId, intercomId;
var collabIds = Object.keys(idsMap);
var l = collabIds.length;

console.log('Convert Intercom user_id values...\n');
updateIntercomUserId (idsMap, collabIds, 0, l);
