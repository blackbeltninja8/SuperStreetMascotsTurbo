var BootScene = new Phaser.Class({
 Extends: Phaser.Scene,
initialize:

function BootScene() {
	Phaser.Scene.call(this, {key: 'BootScene'});
},

preload: function()
{
	var progressBar = this.add.graphics();
	var progressBox = this.add.graphics();
	progressBox.fillStyle(0x222222, 0.8);
	progressBox.fillRect(240, 270, 320, 50);
	this.load.on('progress', function(value) {
		console.log(value);
		progressBar.clear();
		percentText.setText(parseInt(value * 100) + '%');
		progressBar.fillStyle(0xffffff, 1);
		progressBar.fillRect(250, 280, 300 * value, 30);
	});
	this.load.on('fileprogress', function(file) {
		console.log(file.src);
	});
	this.load.on('complete', function() {
		console.log('complete');
		progressBar.destroy();
		progressBox.destroy();
		loadingText.destroy();
		percentText.destroy();
	}); //960 / 540 = 480, 220
	var loadingText = this.make.text({
		x: 480,
		y: 220,
		text: 'Loading...',
		sytle: {
			font: '20px monospace',
			fill: '#ffffff'
		}
	});
	loadingText.setOrigin(0.5, 0.5);
	var percentText = this.make.text({
		x: 480,
		y: 265,
		text: '0%',
		style: {
			font: '18px monospace',
			fill: '#ffffff'
		}
	});
	percentText.setOrigin(0.5, 0.5);

	
	
	this.load.image('background', 'SpriteSheetImages/blackGround.jpg');
	this.load.image('ground', 'SpriteSheetImages/green.png');
	
	this.load.spritesheet('idle', 'SpriteSheets/idle.png', {frameWidth: 210, frameHeight: 375});
	this.load.spritesheet('basicAttack', 'SpriteSheets/LPLKHPHK2.png', {frameWidth: 210 , frameHeight: 375});
	this.load.spritesheet('crouchBig','SpriteSheets/crounchAttaksBig.png', {frameWidth: 306, frameHeight: 250});
	this.load.spritesheet('fallSpecial','SpriteSheets/fallSpecial.png', {frameWidth: 210, frameHeight: 375});
	this.load.spritesheet('HK','SpriteSheets/HK.png', {frameWidth: 330, frameHeight: 335});
	this.load.spritesheet('trans', 'SpriteSheets/transparent.png', {frameWidth: 210, frameHeight: 375}); //100 by 31 hitbox, roughly 100 pixels down from top 
},

create: function()
{
	this.scene.start('splashScreen');
}
});

var splashScreen = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize:
	function splashScreen()
	{
		Phaser.Scene.call(this, {key: 'splashScreen'});
	},
	preload: function()
	{
		
	},
	create: function() {
		
	start = this.add.sprite(320, 240, 'background').setInteractive();	
	start.on('pointerdown', function(event) {
		this.scene.start('MainScreen');
	}, this);
	}/*,
	update: function(time, delta) {
		if (this.keys.q.isDown() {
			this.scene.start('MainScreen');
		}
	}*/
	
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
	heavy = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
	this.anims.create({
		key: 'idleAnim',
		frames: this.anims.generateFrameNumbers('idle', {frames: [1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 8, 8, 7, 7, 5, 5, 6, 6, 5, 5, 7, 7, 8, 8]}),
		frameRate: 6,
		repeat: true
	});
	this.anims.create({
		key: 'lP',
		frames: this.anims.generateFrameNumbers('basicAttack', {frames: [0]}),
		frameRate: 6,
		repeat: false
	});
	this.anims.create({
		key: 'hP',
		frames: this.anims.generateFrameNumbers('HK', {frames: [0, 1, 2, 3, 2, 1, 0]}),
		duration: 1500,
		//frameRate: 1000,
		repeat: false
	});
	this.anims.create({
		key: 'crounch',
		frames: this.anims.generateFrameNumbers('crouchBig', {frames: [0, 1]}),
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
	hit = 0;
	jump = 0;
	lag = false;
	console.log(this);
	this.player.anims.setTimeScale(2);
},


update: function (time, delta)
{
	this.player.on('animationcomplete', flagChange, this);
	function flagChange() {
		lag = false;
		console.log('I changed');
	}
	function heavyKick(player) {
		lag = true;
		player.anims.play('hP', false);
		//player.on('animationcomplete', flagChange, this);
		console.log('I reached this line');
	}
	this.player.body.setVelocity(0);
	if (lag == false) {
	if (/*(this.keys.e.isUp) &&*/ (this.keys.q.isUp)) {
	this.player.anims.play('idleAnim', 6);
}
	//this.player.anims.play('hP', true);
	if (this.cursors.left.isDown && this.cursors.down.isUp) {
		this.player.body.setVelocityX(-80);
	}
	else if (this.cursors.right.isDown && this.cursors.down.isUp) {
		this.player.body.setVelocityX(80);
	}
	if (this.cursors.up.isDown && /*this.player.body.touching.down &&*/ jump <= 0) {
		this.player.body.setVelocityY(-6500);
		jump += 1;
	}
	if (this.player.body.touching.down) {
		jump = 0;
	}
	if (this.cursors.down.isDown) {
		this.player.body.setVelocityY(80);
		this.player.anims.play('crounch', 6);
		this.player.body.setSize(120, 190, 0, 0);
		this.player.body.setOffset(30, 20);
	}
	//if (this.keys.e.isDown) {
		//heavyKick(this.player);
	//this.player.anims.play('hP', 1);
	//this.anim.speed = 100;
	//this.player.animations.currentAnim.speed = 20;
	//}
	if (Phaser.Input.Keyboard.JustDown(heavy)) {
		//console.log('e');
		//this.player.anims.play('hP', false);
		this.player.anims.stop();
		lag = true;
		heavyKick(this.player);
	}
	if (this.keys.q.isDown && this.cursors.right.isUp && this.cursors.left.isUp) {
		this.player.anims.play('lP', 6);
		if (hit != 1) {
		this.hitbox.create(((this.player.x) +40), ((this.player.y) -110), 'trans')/*.setScale(.09)*/.setSize(70, 30, 0, 0);
		//this.hitbox.getFirstAlive().setScale(.09)/*.setOffset(60, -90)*/;
		//this.hitbox.kill();
		this.hitbox.clear(true, true);
		
		hit = 1;
	}
	}
	if (this.keys.q.isUp) {
		hit = 0;
	}
		if (this.cursors.down.isUp) {
		this.player.body.setSize(120, 300, 0, 0);
		this.player.body.setOffset(30, 20);
	}
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
splashScreen,
MainScreen
]
};
var game = new Phaser.Game(config);
