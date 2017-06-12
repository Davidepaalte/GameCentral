module.exports = Store;

var Game = require('./game.js');
Store.storeType = {
	"Steam" : 0,
	"Origin" : 1,
	"Uplay" : 2
}

Store.games = [];

function Store(userID, type, installPath) {
	Store.id = id;
	Store.name = name;
	Store.installPath = installPath;
	Store.type = type;

	switch (type) {
		case Store.storeType.Steam:
			Store.icon = 'https://steamstore-a.akamaihd.net/public/shared/images/responsive/share_steam_logo.png';
			break;
		case default:
			Store.icon = '';
	}
}

Store.addGame = function () {
	if (!Store.games)
		Store.games = [];
	
	newGame = new Game(arguments);
	
	for (var i=0; i < Store.games.length; i++) {
		if (Store.games[i].isSameGameAs(newGame)) {
			Store.games[i].update(
				newGame.bannerURL,
				newGame.imageGallery,
				newGame.installPath,
				newGame.name);
			return "Game already existed. Content replaced."
		}
	}
	
	Store.games.push(newGame);
}

Store.getGame(id) {
	if (!Store.games) {
		Store.games = [];
		console.log("game id "+id+" not found")
		return null;
	}
	
	for (var i=0; i<Store.games.length; i++) {
		if (Store.games[i].id === id) {
			return Store.games[i];
		}
	}
	
	console.log("Game was not found in this store.");
}

Store.isSameStoreAs = function (anotherStore) {
	if (Store.type === anotherStore.type) {
		return true;
	}
	else return false;
}

Store.update = function (bannerURL, imageGallery, installPath, name) {
	Store.bannerURL = bannerURL;
	Store.imageGallery = imageGallery;
	Store.installPath = installPath;
	Store.name = name;
}
