//const { Phaser } = require("../../lib/phaser")

class Spaceship extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, texture, frame, pointValue)
    {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = 3;

    }

    update()
    {
        //move left constantly
        this.x -= this.moveSpeed;
        //wrap around 
        if(this.x <= 0 - this.width)
        {
            this.reset();
        }
    }

    reset()
    {
        this.x = game.config.width;
    }
}