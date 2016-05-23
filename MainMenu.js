
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;
//  this.gameMessageText = null;
};

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.music = this.add.audio('titleMusic');
		this.music.play();
		
		 //add text
   //  this.gameMessageText = this.add.text(this.BasicGame.world.centerX, 280, 'click to start', { font: "20px Arial", fill: "#000000", align: "center" });
  //   this.gameMessageText.anchor.setTo(0.5, 0);

		this.add.sprite(0, 0, 'titlepage');
		
		//add a click handler
     //   this.BasicGame.input.onDown.add(this.click, this);

		//this.playButton = this.add.button(400, 600, 'playButton', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
    this.playButton = this.add.button(350, 350, 'playButton', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		this.music.stop();

		//	And start the actual game
		this.state.start('LevelOne');

	}

};
