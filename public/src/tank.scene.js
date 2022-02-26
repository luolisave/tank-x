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

        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        // this.ship = this.physics.add.image(400.5, 301.3, 'ship');
        // // ship = this.add.image(400.5, 301.3, 'ship');
    
        // this.cameras.main.startFollow(this.ship, true, 0.09, 0.09);
        // // this.cameras.main.roundPixels = true;
    
        // this.cameras.main.setZoom(4);

        this.tanks = [];
        this.myTank = this.add.image(8, 8, 'battle_city_sprites', 0);;

        for (var i = 0; i < 40; i++) { // max 40 tanks/players + current user = 41 players
            this.tanks[i] = this.add.image(8, 8, 'battle_city_sprites', 8);
        }

        this.counter = 0;
    }

    updateDirect(time, delta)
    {
        var MS_PER_FRAME_60FPS = 16.6667;
        var moveSpeed = 1 * (delta / MS_PER_FRAME_60FPS); // !!! delta can change due to monitor refresh rate!!!
        
        var keyboardPress = {
            leftIsDown: false,
            rightIsDown: false,
            upIsDown: false,
            downIsDown: false
        };

        // user control
        if (this.cursors.left.isDown) {
            keyboardPress.leftIsDown = true;
        } else if (this.cursors.right.isDown){
            keyboardPress.rightIsDown = true;
        } else if (this.cursors.up.isDown){
            keyboardPress.upIsDown = true;
        } else if (this.cursors.down.isDown){
            keyboardPress.downIsDown = true;
        }
        socket.emit('gameplay', {keyboardPress});

    }

    update(time, delta) 
    {
        this.updateDirect(time, delta);

        for (var i = 0; i < this.tanks.length; i++) {
            this.tanks[i].x = -128;
            this.tanks[i].y = -128;
            this.tanks[i].angle = 0;
        }

        this.tanks[1].x = 99;

        if(socketId && socketId !== '' ){
            for (var i = 0; i < tanksObjFromServerSide.length; i++) {
                if(tanksObjFromServerSide[i].id === socketId) {
                    this.myTank.x = tanksObjFromServerSide[i].x;
                    this.myTank.y = tanksObjFromServerSide[i].y;
                    this.myTank.angle = tanksObjFromServerSide[i].angle;
                } else {
                    this.tanks[i].x = tanksObjFromServerSide[i].x;
                    this.tanks[i].y = tanksObjFromServerSide[i].y;
                    this.tanks[i].angle = tanksObjFromServerSide[i].angle;
                }
            }
        }
        

        // chat enter space fix. bad fix for input not able to enter space
        if (this.keySpace.isDown) {
            input.focus();
        }
    }
}