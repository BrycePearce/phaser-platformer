//http://www.html5gamedevs.com/topic/5446-how-to-create-multiple-levels/

//this.state.start('LevelOne');



/*http://www.joshmorony.com/create-a-running-platformer-game-in-phaser-with-tilemaps/ */

//https://www.youtube.com/watch?v=qKtrk6dgfsc

//maybe just make the first level into 3 different levels
//1 mario style outside, then second goes into ground and is spooker level

//or one level and mario tunnel goes to spoopy town


/*
Pick one tilemap for each level
*/

/*
jumping
and platforming with clouds
powerups
*/


/*first obstacle
turret shoots platforms*/
/*
KNOWN BUGS:

can jump while falling
W key does not work for double jump
*/

BasicGame.LevelOne = function (game) {

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


BasicGame.LevelOne.prototype = {






    create: function () {


        //We're going to be using physics, so enable the Arcade Physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //set map equal to the level one map
        map = this.game.add.tilemap('level1');

        //add tilesheets
        map.addTilesetImage('ground_1x1');
        map.addTilesetImage('walls_1x2');
        map.addTilesetImage('tiles2');
        map.addTilesetImage('stuff');
        map.addTilesetImage('tilesheet');
        map.addTilesetImage('phaser_tilemap_collision');
        map.addTilesetImage('tiles');
        map.addTilesetImage('outside');
        map.addTilesetImage('outside2');
        
        //create the layers
        layer = map.createLayer('Tile Layer 1');
        layer2 = map.createLayer('Tile Layer 2');
        layer3 = map.createLayer('Tile Layer 3'); //background layer
        layer.resizeWorld();



        //just create a new sprite sheet, save it over `1x1 and everything should work
        //remember change collision between
       // map.setCollisionBetween(1, 5000, ');
       
    //Before you can use the collide function you need to set what tiles can collide
    map.setCollisionBetween(1, 100, true, 'Tile Layer 1');
    map.setCollisionBetween(1, 2000, true, 'Tile Layer 2');














        //bind left and right and jump keys
        leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);

        //add music
        this.music = this.add.audio('lvl1music');
        //lower the music volume a bit
        this.music.volume -= 0.7;
        //play the music
        this.music.play();
        
        //  Here we create our coins group
        coins = this.game.add.group();
        coins.enableBody = true;

        //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
        map.createFromObjects('Object Layer 1', 34, 'coin', 0, true, false, coins);

        //  Add animations to all of the coin sprites
        coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
        coins.callAll('animations.play', 'animations', 'spin');

        //add player sprite
        p = this.game.add.sprite(32, 32, 'user');

        this.game.physics.enable(p);

        this.game.physics.arcade.gravity.y = 250;

        p.body.bounce.y = 0.2;
        p.body.linearDamping = 1;
        p.body.collideWorldBounds = true;

        //two animations, walking left and right.
        p.animations.add('left', [0, 1, 2, 3], 10, true);
        p.animations.add('right', [5, 6, 7, 8], 10, true);



        this.game.camera.follow(p);

        cursors = this.game.input.keyboard.createCursorKeys();
    },


    update: function () {

        this.game.physics.arcade.collide(p, layer);
        this.game.physics.arcade.collide(p, layer2);
        this.game.physics.arcade.overlap(p, coins, collectCoin, null, this);

        p.body.velocity.x = 0;




        //set movement speed and animations for moving left/right
        if (cursors.left.isDown || leftKey.isDown) {
            //  Move to the left
            p.body.velocity.x = -150;

            p.animations.play('left');
        }
        else if (cursors.right.isDown || rightKey.isDown) {
            //  Move to the right
            p.body.velocity.x = 150;

            p.animations.play('right');
        }
        else {
            //  Stand still
            p.animations.stop();

            //rest frame
            p.frame = 4;
        }


        // Set a variable that is true when the player is touching the ground
        var onTheGround = p.body.onFloor();

        // If the player is touching the ground, let him have 2 jumps
        if (onTheGround) {
            this.jumps = 2;
            this.jumping = false;
        }

        // Jump!
        if (this.jumps > 0 && this.upInputIsActive(5)) {
            p.body.velocity.y = -150;
            this.jumping = true;
        }

        // Reduce the number of available jumps if the jump input is released
        if (this.jumping && this.upInputReleased()) {
            this.jumps--;
            
            this.jumping = false;
        }












        /*
        
                // Set a variable that is true when the player is touching the ground
                // and a variable for when the player is in the air
                var onTheGround = p.body.onFloor();
                console.log(jumps);
                //  Allow the player to jump if they are touching the ground.
                if (cursors.up.isDown || upKey.isDown) {
                    if (onTheGround && jumps === 0) {
                        jumps = 1;
                        console.log(jumps);
                        //jump
                        p.body.velocity.y = -180;
                    }
                    //  else if (!onTheGround && jumps == 1 && p.body.velocity.y >= -150) {
                    //just make two clicks
                    else if (!onTheGround && jumps === 1) {
                        p.body.velocity.y = -180;
                        jumps = 2;
                        console.log(jumps);
                    }
                    else if (jumps == 2) {
                        jumps = 0;
                    }
        
                }*/
    }



};

function collectCoin(player, coin) {

    coin.kill();

}

function render() {

    // game.debug.body(p);
    game.debug.bodyInfo(p, 32, 320);
}


/*need to add duration to 'W' jump key so it times properly*/


// This function should return true when the player activates the "jump" control
// In this case, either holding the up arrow or tapping or clicking on the center
// part of the screen.
BasicGame.LevelOne.prototype.upInputIsActive = function (duration) {
    var isActive = false;

    isActive = this.input.keyboard.downDuration(Phaser.Keyboard.UP, duration) &&
        cursors.up.isDown || upKey.isDown
    isActive |= (this.game.input.activePointer.justPressed(duration + 1000 / 60) &&
        this.game.input.activePointer.x > this.game.width / 4 &&
        this.game.input.activePointer.x < this.game.width / 2 + this.game.width / 4);

    return isActive;
};

// This function returns true when the player releases the "jump" control
BasicGame.LevelOne.prototype.upInputReleased = function () {
    var released = false;

    released = this.input.keyboard.upDuration(Phaser.Keyboard.UP) ||
        upKey.isDown;
    released |= this.game.input.activePointer.justReleased();

    return released;
};