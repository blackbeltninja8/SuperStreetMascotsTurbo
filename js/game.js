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
	this.load.spritesheet('basicAttack', 'SpriteSheets/LPLKHPHK2.png', {frameWidth: 260 , frameHeight: 375});
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
	timerVar = 0;
	var begin = this.make.text({
		x: 400,
		y: 240,
		text: 'Click to start',
		/*style: {
			font: '180 px monospace'
		}*/
	});
	//this.timer = this.game.time.events.loop(Phaser.Timer.SECOND, this.blink(), this);
	this.timer = this.time.addEvent({
		delay: 1000,
		callback: blink,
		loop: true
	});
	function blink() {
		begin.visible = !begin.visible;
	}
	},
	/*update: function(time, delta) {
			timerVar = timer.getElapsed();
			if (timer >= 1000) {
				timer -= 100;
				begin.visible = !begin.visible
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
	this.player2 = this.physics.add.sprite(500, 390, 'idleAnim', 2);
	this.player2.body.setSize(120, 300, 0, 0);
	this.player2.body.setOffset(30, 20);
	this.player2.setCollideWorldBounds(true);
	this.cursors = this.input.keyboard.createCursorKeys();
	this.keys = this.input.keyboard.addKeys('q');
	heavy = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
	heavyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
	lightK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
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
		key: 'lK',
		frames: this.anims.generateFrameNumbers('basicAttack', {frames: [6, 7, 6, 5]}),
		duration: 1000,
		repeat: false
	});
	this.anims.create({
		key: 'hP',
		frames: this.anims.generateFrameNumbers('basicAttack', {frames: [1, 2, 3, 4, 4, 3, 3, 2, 1]}),
		frameRate: 6,
		duration: 1200,
		repeat: false
	});
	this.anims.create({
		key: 'hK',
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
	this.anims.create({
		key: 'hurtHK',
		frames: this.anims.generateFrameNumbers('fallSpecial', {frames: [5, 6, 5]}),
		duration: 1000,
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
	this.physics.add.collider(this.player2, this.ground);
	this.physics.add.collider(this.player, this.player2);
	p1atk = this.physics.add.overlap(this.hitbox, this.player2)
	
	/*this.input.keyboard.on('keydown_q', function(event){
		this.player.anims.play('lP');
	}*/
	hit = 0;
	jump = 0;
	frame  = 0;
	lag = false;
	this.player.anims.setTimeScale(2);
	this.player2.anims.setTimeScale(2);
	this.attackLK = this.time.addEvent({
		delay: 500,
		callback: hurtBoxLK(frame),
		loop: true
	});
	function hurtBoxLK(frame) {
		switch(frame) {
		case 1:
			console.log('frame 1');
			frame++;
			break;
		case 2:
			console.log('frame 2');
			frame++;
			break;
		case 3:
			frame++;
			console.log('frame 3');
			break;
		default:
			console.log('frame 4');
			frame = 0;
			break;
		}
	}
},


update: function (time, delta)
{
	this.player.on('animationcomplete', flagChange, this);
	this.player.body.setVelocity(0);
	this.player2.body.setVelocity(0);
	if (lag == false) {
	if (/*(this.keys.e.isUp) &&*/ (this.keys.q.isUp)) {
	this.player.anims.play('idleAnim', 6);
	this.player2.anims.play('idleAnim', 6);
	this.player2.flipX= true;
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
		hitBoxTime = this.time.delayedCall(400, HKhit, this.player2, this);
		
	}
	if (Phaser.Input.Keyboard.JustDown(heavyP)) {
		this.player.anims.stop();
		lag = true;
		heavyPunch(this.player);
		hitBoxTime = this.time.delayedCall(250, HPhit, [], this);
	}
	if (Phaser.Input.Keyboard.JustDown(lightK)) {
		//attackLK.resume;
		this.player.anims.stop();
		lag = true;
		lightKick(this.player);
		hitBoxTime = this.time.delayedCall(200, LKhit, [], this);
	}
	if (this.keys.q.isDown && this.cursors.right.isUp && this.cursors.left.isUp) {
		this.player.anims.play('lP', 6);
		if (hit != 1) {
		this.hitbox.create(((this.player.x) +20), ((this.player.y) - 110), 'trans')/*.setScale(.09)*/.setSize(70, 30, 0, 0);
		//this.hitbox.getFirstAlive().setScale(.09)/*.setOffset(60, -90)*/;
		//this.hitbox.kill();
		this.hitbox.clear(true, true);
		
		hit = 1;
	}
	}
	/*if (this.keys.q.isUp) {
		hit = 0;
	}*/
		if (this.cursors.down.isUp) {
		this.player.body.setSize(120, 300, 0, 0);
		this.player.body.setOffset(30, 20);
	}
}
}


});
	function LKhit() {
		if (hit != 1) {
		this.hitbox.create(((this.player.x) +20), ((this.player.y) - 30), 'trans')/*.setScale(.09)*/.setSize(110, 50, 0, 0);
		//this.hitbox.getFirstAlive().setScale(.09)/*.setOffset(60, -90)*/;
		//this.hitbox.kill();
		this.hitbox.clear(true, true);
		hit = 1;
		}
	}
	function HKhit(player2) {
		if (hit != 1) {
		this.hitbox.create(((this.player.x) +20), ((this.player.y) - 70), 'trans')/*.setScale(.09)*/.setSize(150, 50, 0, 0);
		//this.hitbox.getFirstAlive().setScale(.09)/*.setOffset(60, -90)*/;
		//this.hitbox.kill();
		if(p1atk) {
			console.log('yass queen');
			damage(this.player2);
		}
		/*if(this.physics.overlap(this.player2, this.hitbox)) {
			console.log('we have collided');
		}*/
		this.hitbox.clear(true, true);
		hit = 1;
		}
	}
	function HPhit() {
		if (hit != 1) {
		this.hitbox.create(((this.player.x) +20), ((this.player.y) - 110), 'trans')/*.setScale(.09)*/.setSize(70, 30, 0, 0);
		//this.hitbox.getFirstAlive().setScale(.09)/*.setOffset(60, -90)*/;
		//this.hitbox.kill();
		this.hitbox.clear(true, true);
		hit = 1;
		}
	}
	function damage(player2) {
		player2.anims.play('hurtHK', false);
	}
	
	function flagChange() {
		lag = false;
		hit = 0;
	}
	function heavyKick(player) {
		lag = true;
		player.anims.play('hK', false);
		//player.on('animationcomplete', flagChange, this);
	}
	function heavyPunch(player) {
		lag = true;
		player.anims.play('hP', false);
	}
	function lightKick(player) {
		lag = true;
		player.anims.play('lK', false);
	}

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
