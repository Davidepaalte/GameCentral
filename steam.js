var request = require("request");

var whereis = require('whereis');
var steamPath = "";

whereis('/R C:\\ chrome.exe', function(err, path) {
	if (err){
		console.log("Steam folder not found");
	}
	else {
		steamPath = path;
	}
});


// STEAM ID API
var SteamID = require('steamid');
var sid = SteamID.fromIndividualAccountID(83485388);

var apiKey = "F1D8AE622347C33F3040EFB7EB84FC19";
var include_appinfo = 1;
var userId = sid.getSteamID64();
var format = "json";

var getOwnedGames = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key="+apiKey
+"&include_appinfo="+include_appinfo
+"&steamid="+userId
+"&format="+format;

console.log(getOwnedGames);
request(getOwnedGames, function(error, response, body) {
	var ownedGames = JSON.parse(body);
	
	console.log(ownedGames);
	
	for (var i=0; i < ownedGames["response"]["games"].length; i++) {
		var game = ownedGames["response"]["games"][i];
		document.getElementById("output").innerHTML +=
			"<h3>"+game["name"]+"</h3>"+
			"<p>App ID: "+game["appid"]+"</p>"+
			"<img src='"+getImageURL(game["appid"], game["img_icon_url"])+"'/><br/>"+
			"<img src='"+getImageURL(game["appid"], game["img_logo_url"])+"'/><br/><br/>";
	}
});

function getImageURL(appId, imageName) {
	return "http://media.steampowered.com/steamcommunity/public/images/apps/"+appId+"/"+imageName+".jpg";
}