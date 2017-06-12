module.exports = Config;

var fs = require('fs');
var Store = require('./store.js');

var data = fs.readFileSync('./configData.json');

try {
	Config = JSON.parse(data);
	console.dir(Config);
}
catch (err) {
	console.log('There has been an error parsing the config file.')
	console.log(err);

	// STEAM DATA
	Config.Store = [];
	Config.Steam.ID = 0;
	Config.Steam.path = "";
	Config.Steam.installedGames = [];
}

Config.addStore = function() {
	if (!Config.Store)
		Config.Store = [];
	
	Config.Store.push(new Store(arguments));
}

Config.getStore = function(storeType) {
	for (var i=0; i< Config.Store.length; i++) {
		if (Config.Store[i].type === storeType) {
			return Config.Store[i];
		}
	}
	
	console.log("Store was not found in configs.");
}

Config.save = function () {
	var data = JSON.stringify(Config);
	
	fs.writeFile('./configData.json', data, function (err) {
    if (err) {
      console.log('There has been an error saving your configuration data.');
      console.log(err.message);
      return;
    }
    console.log('Configuration saved successfully.')
  });
}