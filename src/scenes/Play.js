//const { Phaser } = require("../../lib/phaser");

class Play extends Phaser.Scene
{
    constructor()
    {
        super("playScene");
    }

    preload()
    {
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('splat', './assets/splat.png', {frameWidth: 44, frameHeight: 31, startFrame: 0, endFrame: 2});
        this.load.image('rocket','assets/Arrow.png');
        this.load.image('spaceship', 'assets/BatPix.png');
        this.load.image('starfield', 'assets/CloudyNight.png');
        this.load.image('arrow', 'assets/Arrow.png');
    }

    create()
    {
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x68030a).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x00000).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x00000).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x00000).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x00000).setOrigin(0, 0);

        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        //add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);


        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'bloodsplat',
            frames: this.anims.generateFrameNumbers('splat', { start: 0, end: 2, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;
        
          // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#00000',
            color: '#68030a',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }

        let highScoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#00000',
            color: '#68030a',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 150
        }

        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FFFFF',
            color: '#68030a',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }

        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        this.saveScore = this.add.text(borderUISize + borderPadding*20, borderUISize + borderPadding*2, `High:${highScore}`, highScoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        this.remaining = this.clock.getRemainingSeconds();

        this.timeLeft = this.add.text(borderUISize + borderPadding*43, borderUISize + borderPadding*2, this.remaining, timeConfig);
    }

    update()
    {
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR))
        {
            if(this.p1Score > highScore)
                highScore = this.p1Score;
            this.scene.restart(highScore);
        }
        //highscore
        if(this.p1Score > highScore)
        {
            highScore = this.p1Score;
            this.saveScore.setText(`High:${highScore}`);
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) 
        {
            this.scene.start("menuScene");
        }

        //scroll background on update
        this.starfield.tilePositionX -= 4;

        this.timeLeft.text = this.clock.getRemainingSeconds();

        //update rocket and spaceships while game is not over
        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        } 

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) 
        {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) 
        {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) 
        {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship) 
    {
        // simple AABB checking
        //check if a rocket and ship have overlapping sprites
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) 
            {
                return true;
        } 
        else 
        {
            return false;
        }
    }

    shipExplode(ship) 
    {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('bloodsplat');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });


        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#00000',
            color: '#68030a',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            }
        }

        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score; 
        let remaining = this.clock.getRemaining(); 
        this.clock.remove();
        this.clock = this.time.delayedCall(remaining + 5000, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            
        }, null, this);

        //play explosion sound
        this.sound.play('sfx_explosion');
    }

}
