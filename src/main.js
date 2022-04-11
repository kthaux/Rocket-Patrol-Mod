console.log("hello from main.js");

let config = 
{
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play]
}

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

borderUISize = game.config.height / 15;
borderPadding = borderUISize / 3;
