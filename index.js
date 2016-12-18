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
        deleteSnapshot(Math.min.apply(null, droplet.snapshot_ids));
      }
      //Make a snapshot
      createSnapshot(droplet.id);
    }
  }
}

function deleteSnapshot(snapshotId) {
  request.delete({
    url: `https://api.digitalocean.com/v2/snapshots/${snapshotId}`,
    headers: header,
  });
}

function createSnapshot(dropletId) {
  request.post({
    url: `https://api.digitalocean.com/v2/droplets/${dropletId}/actions`,
    headers: header,
    form: {
      type: "snapshot",
      name: "backup " + new Date().toDateString()
    },
  });
}

console.log("Backup script started");
setInterval(function(){
  request.get(optionsDroplets, dropletsCallback);
}, 86400000 * config.intervalDays);
