console.log("hello from main.js");
/*
$Redesign the game's artwork, UI, and sound to change its theme/aesthetic (to something other than sci-fi) (60)
-- SpaceShips->Bats Rocket->Arrow Starfield->Cloudy Night Sky Explosions->Blood Splats Base sounds->Custom sounds
$Display the time remaining (in seconds) on the screen (10)
$Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
$Track a high score that persists across scenes and display it in the UI (5)
$Allow the player to control the Rocket after it's fired (5)
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

let highScore = 0;

borderUISize = game.config.height / 15;
borderPadding = borderUISize / 3;
