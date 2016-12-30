var request = require('request');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var header = {authorization: `Bearer ${config.token}`};

var optionsDroplets = {
  url: 'https://api.digitalocean.com/v2/droplets?tag_name=backup',
  headers: header
};

function dropletsCallback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var droplets = JSON.parse(body).droplets;
    for (var i = 0; i < droplets.length; i++) {
      var droplet = droplets[i];
      //if there are more than 3 snapshots delete the oldest
      if (droplet.snapshot_ids.length >= config.maxSnapshots) {
        var oldestSnapshotId = Math.min.apply(null, droplet.snapshot_ids);
        log("Deleting old snapshot:" + oldestSnapshotId);
        deleteSnapshot(oldestSnapshotId);
      }
      //Make a snapshot
      log("Creating new snapshot for droplet: " + droplet.name);
      createSnapshot(droplet.id);
    }
  }
}

function deleteSnapshot(snapshotId) {
  request.delete({
    url: `https://api.digitalocean.com/v2/snapshots/${snapshotId}`,
    headers: header,
  }, logResponse);
}

function createSnapshot(dropletId) {
  request.post({
    url: `https://api.digitalocean.com/v2/droplets/${dropletId}/actions`,
    headers: header,
    form: {
      type: "snapshot",
      name: "backup " + new Date().toDateString()
    },
  }, logResponse);
}

//Logs any messages or logs any errors.
function logResponse(error, response, body){
  var message;
  try {
    if (body) message = JSON.parse(body).message;
  } catch (err){
    log(err);
  }
  if (error) log("Error occured:" + error);
  if (message) log("Message: " + message);
}

function backup(){
  log("Backup started");
  request.get(optionsDroplets, dropletsCallback);
}

function log(message){
  console.log("[" + new Date().toLocaleString() + "]: " + message);
}

//Backup first time this script is run
backup();

setInterval(function(){
  backup()
}, 86400000 * config.intervalDays);
