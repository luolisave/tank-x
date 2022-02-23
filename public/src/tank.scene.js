class TankScene extends Phaser.Scene
{
    constructor() {
        super();
    }

    preload() {
        this.load.image('background_image', 'assets/images/black_bg.png');
        this.load.spritesheet('battle_city_sprites', 'assets/tiled/battle_city.png', {frameWidth: 16, frameHeight: 16, startFrame: 0, endFrame: 400}); //  400 means the png file have 400 (16*16) tiles
        // this.load.image('ship', 'assets/sprites/fmship.png');
    }

    create() {
        this.cameras.main.setBounds(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
        this.add.image(0, 0, 'background_image').setOrigin(0).setScrollFactor(1);
    
        this.cursors = this.input.keyboard.createCursorKeys();

        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.INSERT);
    
        // this.ship = this.physics.add.image(400.5, 301.3, 'ship');
        // // ship = this.add.image(400.5, 301.3, 'ship');
    
        // this.cameras.main.startFollow(this.ship, true, 0.09, 0.09);
        // // this.cameras.main.roundPixels = true;
    
        // this.cameras.main.setZoom(4);

        this.tanks = [];
        this.tanks[0] = this.add.image(8, 8, 'battle_city_sprites', 0);
        this.tank = this.tanks[0];

        this.counter = 0;
    }

    updateDirect(time, delta)
    {
        var MS_PER_FRAME_60FPS = 16.6667;
        var moveSpeed = 1 * (delta / MS_PER_FRAME_60FPS); // !!! delta can change due to monitor refresh rate!!!
        if (this.cursors.left.isDown) {
            this.tank.setAngle(-90);
            this.tank.x -= moveSpeed;
        } else if (this.cursors.right.isDown){
            this.tank.setAngle(90);
            this.tank.x += moveSpeed;
        } else if (this.cursors.up.isDown){
            this.tank.setAngle(0);
            this.tank.y -= moveSpeed;
        } else if (this.cursors.down.isDown){
            this.tank.setAngle(-180);
            this.tank.y += moveSpeed;
        }
    }

    update(time, delta) 
    {
        this.updateDirect(time, delta);

        if (this.keySpace.isDown) {
            input.focus();
            // messages.style.background = 'rgba(127,255,212,0.3)';
            // messagesContainer.classList.remove("chat_off");
            // messagesContainer.classList.add("chat_on");
        }
    }
}