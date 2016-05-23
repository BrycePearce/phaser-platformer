//run from http server, already installed globally.
//Just navigate to where html file is in cmd, then just type http-server
//then type in localhost:8080 in browser
//https://www.npmjs.com/package/http-server for commands

//shift alt f to format code

//pathfinding https://gamedevacademy.org/how-to-use-pathfinding-in-phaser/
//------------------------------------------------------------------------------


//weather affects via http://phaser.io/examples/v2/particles/rain
//homing missles http://gamemechanicexplorer.com/#homingmissiles-5

//fix slow shooting while running http://phaser.io/examples/v2/games/tank#comments





/*

ADD TUTORIAL LEVEL:

make clouds into sprites, add powerup on last cloud?

add starting level, minimal white background black platforms,

(maybe add signs for the jump portion, holding up leads to defeat)
mid level intro
long stretch of land seemingly without obstacle, lights shut off (queue digging sound)
skeletons pop up followed by spooky scary skeletons song (8 bit?)
grab torch and jump over enemies so player is visible (skeletals patrol certian areas, precision jumps)

test max jump length, perhaps two messages for double jump (first test is holding down, second is delayed second)

switch to make obstacle disappear (similar to rain switch)


so


top of level will be jumping obstacles, then switch opens up entry to lower level,

add cool stuff like trampolines to scale big walls for lower level

level ends on same side level began


make sure to implement rain switch idea
*/





BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};





//included in every phaser game, creates initial game object and specifying the preloaded functions (create, update, etc.)
var sprite,
    platforms,
    leftKey,
    turret,
    rightKey,
    ground,
    enemiesAlive,
    jumps = 0;

//define game here so don't have to repeat this.game over and over.
//var game = this.game
//add to alllll cancer

BasicGame.Game.prototype = {
    create: function () {

        //We're going to be using physics, so enable the Arcade Physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //add the map
        this.map = this.game.add.tilemap('background');



        //bind left and right and jump keys
        leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);




        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = this.game.add.group();

        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;

        // Here we create the ground.
        var ground = platforms.create(0, this.game.world.height - 110, 'ground');

        //  Scale it to fit the width of the game
        ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        //first platform
        var plat1 = platforms.create(28, 150, 'platform2');
        plat1 = plat1.body.immovable = true;

        //The player and its settings
        player = this.game.add.sprite(32, this.game.world.height - 520, 'user');

        //We need to enable physics on the player
        this.game.physics.arcade.enable(player);

        //Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300; //weight of character
        player.body.collideWorldBounds = true;

        //two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);


        //this code block adds rain *****
        var emitter = this.game.add.emitter(this.game.world.centerX, 0, 400);
        //sets rain emitter witdth to game world width
        emitter.width = this.game.world.width;

        // emitter.angle = 30; - uncomment to set an angle for the rain.
        //**make rain move with player?**
        emitter.makeParticles('rain');

        emitter.minParticleScale = 0.1;
        emitter.maxParticleScale = 0.5;

        //speed
        emitter.setYSpeed(300, 500);
        emitter.setXSpeed(-5, 5);

        emitter.minRotation = 0;
        emitter.maxRotation = 0;

        emitter.start(false, 1600, 5, 0);
        //*****
    },










    update: function () {


        cursors = this.game.input.keyboard.createCursorKeys();



        //  Collide the player and the stars with the platforms
        this.game.physics.arcade.collide(player, platforms);

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;


        //set movement speed and animations for moving left/right
        if (cursors.left.isDown || leftKey.isDown) {
            //  Move to the left
            player.body.velocity.x = -150;

            player.animations.play('left');
        }
        else if (cursors.right.isDown || rightKey.isDown) {
            //  Move to the right
            player.body.velocity.x = 150;

            player.animations.play('right');
        }
        else {
            //  Stand still
            player.animations.stop();

            player.frame = 4;
        }

        // Set a variable that is true when the player is touching the ground
        // and a variable for when the player is in the air
        var onTheGround = player.body.touching.down;
        console.log(jumps);
        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown || upKey.isDown) {
            if (onTheGround && jumps == 0) {
                jumps = 1;
                console.log(jumps);
                //jump
                player.body.velocity.y = -200;
            }
            else if (!onTheGround && jumps == 1 && player.body.velocity.y >= -150) {
                player.body.velocity.y = -100;
                jumps = 2;
                console.log(jumps);
            }
            else if (jumps == 2) {
                jumps = 0;
            }

        }



    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};


/*

Notes:

Double jump bugged (needs to be double key press)

*/