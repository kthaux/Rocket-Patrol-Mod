console.log("hello from main.js");
/*
$Redesign the game's artwork, UI, and sound to change its theme/aesthetic (to something other than sci-fi) (60)
-- SpaceShips->Bats Rocket->Arrow Starfield->Cloudy Night Sky Explosions->Blood Splats Base sounds->Custom sounds






*/
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
