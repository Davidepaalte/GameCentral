module.exports = Game;

Game.imageGallery = [];

function Game(id, name, bannerURL, installPath) {
	Game.id = id;
	Game.name = name;
	Game.bannerURL = bannerURL;
	Game.installPath = installPath;
}

Game.isSameGameAs = function (anotherGame) {
	return Game.id === anotherGame.id;
}

Game.update = function (bannerURL, imageGallery, installPath, name) {
	Game.bannerURL = bannerURL;
	Game.imageGallery = imageGallery;
	Game.installPath = installPath;
	Game.name = name;
}
