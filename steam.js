var fs = require('fs');
var request = require("request");
var vdf = require('simple-vdf');

getSteamPath(function(err, steamPath) {
	if (!err) {

		// STEAM ID API
		var SteamID = require('steamid');
		var sid = SteamID.fromIndividualAccountID(getInstalledUsers(steamPath)[0]);

		var apiKey = "F1D8AE622347C33F3040EFB7EB84FC19";
		var include_appinfo = 1;
		var userId = sid.getSteamID64();
		var format = "json";

		var getOwnedGames = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key="+
			apiKey+"&include_appinfo="+include_appinfo+"&steamid="+userId+"&format="+format;

		console.log("Current user ID is "+userId);
		request(getOwnedGames, function(error, response, body) {
			var ownedGames = JSON.parse(body);

			console.log(ownedGames);

			getProfileInfo(apiKey, userId, function(error, response, profileInfo) {
				var container = document.getElementById("output");
				profile = JSON.parse(profileInfo)["response"]["players"][0];

				container.innerHTML =
					"<h1>Hi, " + profile["realname"] + "! Welcome back!</h1>" +
					"<p>Name: " + profile["personaname"] + "</p>" +
					"<img src='"+profile["avatar"]+"'/><br><br>";

				for (var i=0; i < ownedGames["response"]["games"].length; i++) {
					var game = ownedGames["response"]["games"][i];

					container.innerHTML +=
						"<div id='steam_"+game["appid"]+"'><h3><a href='steam://rungameid/"+game["appid"]+"'>"+game["name"]+"</a></h3>"+
						"<p>App ID: "+game["appid"]+"</p>"+
						"<img src='"+getImageURL(game["appid"], game["img_icon_url"])+"'/><br/>"+
						"<img src='"+getImageURL(game["appid"], game["img_logo_url"])+"'/></div><br/><br/>";


					getInstalledGames(steamPath, function(err, gameIDs) {
						for (var i = 0; i < gameIDs.length; i++) {
							document.getElementById("steam_" + 	gameIDs[i]).style.backgroundColor = "lightblue";
						}
					});
				}
			});
		});
	}
});

function getProfileInfo(apiKey, steam64id, callback) {
	var url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key="+apiKey+"&steamids="+steam64id;
	request(url, callback);
}

function getImageURL(appId, imageName) {
	if (imageName != '')
		return 'http://media.steampowered.com/steamcommunity/public/images/apps/'+appId+'/'+imageName+'.jpg';
	else
		return './img/icon.png';
}

function getInstalledUsers(steamPath) {
	console.log('looking for installed users in '+steamPath);
	paths = fs.readdirSync(steamPath + "userdata");

	for (var i = 0; i < paths.length; i++) {
		if (parseInt(paths[i]) == NaN) {
			console.log(paths[i] + " is not a user. Removed from users list.");
			paths = paths.splice(i, 1);
			i--;
		}
	}

	console.log('Installed users found:');
	console.log(paths);
	return paths;
}

var _steamPath = "";
function getSteamPath(callback) {
	console.log('Looking for Steam instalation...');

	var executeCallback = function(err, arg){
		if (!err) {
			_steamPath = arg.replace(/^\s+|\s+$/g, '');
			_steamPath = _steamPath.slice(0, _steamPath.length - "Steam.exe".length);
			console.log('Steam instalation found on '+_steamPath);
		}
		callback(err, _steamPath);
	}

	if (_steamPath != "" && fs.existsSync(_steamPath)) {
		console.log('Steam instalation already found on '+_steamPath);
		callback(null, _steamPath);
	}
	else {
		var whereis = require('whereis');

		whereis('C:\\Program Files (x86)', 'Steam.exe', function(err, path) {
			if (err){
				whereis('C:\\', 'Steam.exe', function(err, path) {
					if (err){
						console.log("Steam folder not found in C:\\");
						_steamPath = "";
					}
					else {
						executeCallback(err, path);
					}
				});
			}
			else {
				executeCallback(err, path);
			}
		});
	}
}

function getInstalledGames (steamPath, callback) {	// calback(err, gameIDs)
		getInstalledLibraries(steamPath, function(err, libs) {
			var gameIDs = [];

			for (var i = 0; i < libs.length; i++) {
				gameIDs = gameIDs.concat(fs.readdirSync(libs[i]));
			}
			//console.log(libs);
			//console.log(gameIDs);

			for (var i = 0; i < gameIDs.length; i++) {
				var isManifest = /^appmanifest_\d+.acf$/.test(gameIDs[i]);

				if (isManifest) {
					gameIDs[i] = gameIDs[i].slice("appmanifest_".length, gameIDs[i].length - ".acf".length);
					gameIDs[i] = parseInt(gameIDs[i]);
				}
				else {
					gameIDs.splice(i, 1);
					i--;
				}
			}

			callback(null, gameIDs);
		});
}

function getInstalledLibraries(steamPath, callback) {	// callback(err, libs)
	readVdf(steamPath + 'steamapps\\libraryfolders.vdf', function (err, vdfObj) {
		console.log("libraryfolders.vdf successefully read.");
		var paths = [steamPath + 'steamapps\\'];

		var libFolders = vdfObj["LibraryFolders"];
		var i = 1;
		while(typeof (libFolders[i]) !== 'undefined') {
			paths.push(libFolders[i]+"\\steamapps\\");
			i++;
		}

		callback(err, paths);
	});
}

function readVdf(path, callback) {	// callback (err, vstObject)
    try {
        var filename = require.resolve(path);
        fs.readFile(filename, 'utf8', function(err, vdf_text) {
					//Transform VDF in Object
					data = vdf.parse(vdf_text);
					// Call default callback with the created Object
					callback(null, data);
				});
    } catch (e) {
      callback(e, null);
    }
}
