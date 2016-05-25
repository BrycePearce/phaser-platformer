
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, swap them for your own.
	this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.image('ground_1x1', 'assets/images/ground_1x1.png');
  this.game.load.image('walls_1x2', 'assets/images/walls_1x2.png');
	this.game.load.spritesheet('stuff', 'assets/images/stuff.png', 32, 32);
  this.game.load.image('tiles2', 'assets/images/tiles2.png');
	this.game.load.image('tiles2', 'assets/images/tiles2.png');
	this.game.load.image('tilesheet', 'assets/images/tilesheet.png');
	this.game.load.image('phaser_tilemap_collision', 'assets/images/phaser_tilemap_collision.png');
	this.game.load.image('tiles', 'assets/images/tiles.png');
	this.game.load.image('outside', 'assets/images/outside.png');
	this.game.load.image('outside2', 'assets/images/outside2.png');
  this.game.load.spritesheet('coin', 'assets/images/coin.png', 32, 32);
	
		
		
		
		
		this.load.image('titlepage', 'assets/images/title.png');
		this.load.atlas('playButton', 'assets/images/play_button.png', 'assets/images/play_button.json');
		this.load.audio('titleMusic', ['assets/audio/main_menu.mp3']);
		this.load.audio('lvl1music', ['assets/audio/heythere.wav']);
    this.load.image('background', 'assets/images/background.png');
    this.load.spritesheet('user', 'assets/images/player.png', 32, 48); //player
    this.load.spritesheet('rain', 'assets/images/rain.png', 17, 17);
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('platform', 'assets/images/platform.png');
    this.load.image('platform2', 'assets/images/platform2.png');
    this.load.image('bullet', 'assets/images/bullet_green.png');
    this.load.image('kaboom', 'assets/images/explosion.png');
		// this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');
		//	+ lots of other required assets here

	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	  this.game.state.start('MainMenu');
	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}

	}

};
