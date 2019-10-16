var BootScene = new Phaser.Class({
 Extends: Phaser.Scene,
initialize:

function BootScene() {
	Phaser.Scene.call(this, {key: 'BootScene'});
},

preload: function()
{
	this.load.image('background', 'SpriteSheetImages/blackGround.jpg');
	this.load.image('ground', 'SpriteSheetImages/green.png');
	
	this.load.spritesheet('idle', 'SpriteSheets/idle.png', {frameWidth: 210, frameHeight: 375});
	this.load.spritesheet('basicAttack', 'SpriteSheets/LPLKHPHK.png', {frameWidth: 210 , frameHeight: 375});
	this.load.spritesheet('crouch','SpriteSheets/crounchAttaks.png', {frameWidth: 210, frameHeight: 200});
	this.load.spritesheet('fallSpecial','SpriteSheets/fallSpecial.png', {frameWidth: 210, frameHeight: 375});
	this.load.spritesheet('lPunch', 'SpriteSheets/lightPunchRe.png', {frameWidth: 210, frameHeight: 375}); //100 by 31 hitbox, roughly 100 pixels down from top 
	this.load.spritesheet('trans', 'SpriteSheets/transparent.png', {frameWidth: 210, frameHeight: 375}); //100 by 31 hitbox, roughly 100 pixels down from top 
},

create: function()
{
	this.scene.start('MainScreen');
}
});

var MainScreen = new Phaser.Class({
Extends: Phaser.Scene,

initialize:

function MainScreen()
{
	Phaser.Scene.call(this, {key: 'MainScreen'});
},
preload: function()
{

},

create: function()
{	
	this.add.image(320, 240, 'background');
	this.player = this.physics.add.sprite(320, 390, 'idleAnim', 2);
	this.player.body.setSize(120, 300, 0, 0);
	this.player.body.setOffset(30, 20);

	this.physics.world.bounds.width = 960;
	this.physics.world.bounds.height = 540;
	this.player.setCollideWorldBounds(true);
	this.cursors = this.input.keyboard.createCursorKeys();
	this.keys = this.input.keyboard.addKeys('q');
	this.anims.create({
		key: 'idleAnim',
		frames: this.anims.generateFrameNumbers('idle', {frames: [1, 2, 3, 4, 3, 2, 8, 7, 5, 6, 5, 7, 8]}),
		frameRate: 6,
		repeat: true
	});
	this.anims.create({
		key: 'lP',
		frames: this.anims.generateFrameNumbers('lPunch', {frames: [0]}),
		frameRate: 6,
		repeat: false
	});
	/*var forwardDash = this.input.keyboard.createCombo(['39', '39'] {
		resetOnWrongKey: true, 
		maxKeyDelay: 1000, 
		resetOnMatch: true, 
		deleteOnMatch: false});*/
	this.ground = this.physics.add.staticGroup();
	this.ground.create(480, 805, 'ground');
	this.hitbox = this.physics.add.group();
	this.hitbox.maxSize = 1;
	this.physics.add.collider(this.player, this.ground);
	/*this.input.keyboard.on('keydown_q', function(event){
		this.player.anims.play('lP');
	}*/

},


update: function (time, delta)
{
	this.player.body.setVelocity(0);
	this.player.anims.play('idleAnim', true);
	if (this.cursors.left.isDown) {
		this.player.body.setVelocityX(-80);
	}
	else if (this.cursors.right.isDown) {
		this.player.body.setVelocityX(80);
	}
	if (this.cursors.up.isDown && this.player.body.touching.down) {
		this.player.body.setVelocityY(-6500);
	}
	else if (this.cursors.down.isDown) {
		this.player.body.setVelocityY(80);
	} //x and y respectively: +60, -90
	if (this.keys.q.isDown && this.cursors.right.isUp && this.cursors.left.isUp) {
		this.hitbox.create(((this.player.x) +60), ((this.player.y) -90), 'trans')/*.setScale(.09)*/.setSize(54, 30, 0, 0);
		//this.hitbox.getFirstAlive().setScale(.09)/*.setOffset(60, -90)*/;
		this.player.anims.play('lP', 0);
		//this.hitbox.kill();
		this.hitbox.clear(true, true);
	}

}


});

var config = {
	type: Phaser.AUTO,
	parent: 'content',
width: 960,
height: 540,
pixelArt: true,
physics: {
	default: 'arcade',
arcade: {
	gravity: {y: 9000},
	debug: true
}
},
scene: [
BootScene,
MainScreen
]
};
var game = new Phaser.Game(config);
