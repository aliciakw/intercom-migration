// settings
var mapFileName = 'medproviders';
//var mapFileName =  'bhps';
var env = 'PROD';

// constants
var idsMap = require('./data/' + mapFileName + '.json');
var request = require('request');
var creds = require('./creds.json');

var INTERCOM_URL = 'https://api.intercom.io/users';
var auth = 'Basic ' + new Buffer(creds[env]['INTERCOM_APP_ID'] + ':' + creds[env]['INTERCOM_API_KEY']).toString('base64');


// logging
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/log/'+ mapFileName + '.log', {flags : 'w'});
var log_stdout = process.stdout;

logInfo = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};
function requestErr (user_id) {
  logInfo('READ ERROR for intercom account [user_id=' + user_id + ']\n');
}
function updateErr (oldUserId, intercomId) {
  logInfo('UPDATE ERROR for intercom account [user_id:' + oldUserId + '] [intercomId' + intercomId + ']\n');
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
        logInfo(id + ' --> ' + newUserId + ' ok\n');
        return;
      } else {
        logInfo(data.body);
        updateErr(oldUserId, newUserId, id)
      }
    } else {
      if (err) {
        logInfo(err);
      }
      updateErr(oldUserId, newUserId, id);
    }
  });
}

function updateIntercomUserId (idsMap, collabIds, i, max) {
  if (i < max) {

    collabId = collabIds[i]; // new user_id
    moyoId = idsMap[collabId]; // current user_id

    request({
      method: 'GET',
      url: INTERCOM_URL + '?user_id=' + moyoId,
      headers: {
        'Authorization' : auth,
        'Accept': 'application/json'
      }
    }, function (err, data) {
      if (data && data.body) {
        var record = JSON.parse(data.body);
        if (record.id) {
          logInfo('GET Intercom Id ' + record.id + ' ok');
          updateUserId(record.id, collabId, moyoId);   // updateUserId (id, newUserId, oldUserId)
        } else {
          logInfo(data.body);
          requestErr(moyoId);
        }
      } else {
        if (err) {
          logInfo(err);
        }
        requestErr(moyoId);
      }
      setTimeout(function () {
        updateIntercomUserId(idsMap, collabIds, (i + 1), max);
        return;
      }, 100);
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
