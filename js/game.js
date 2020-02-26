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

	
	this.load.audio('bg', ['Sounds/mega.mp3']);
	this.load.audio('op', ['Sounds/op.m4a']);
	this.load.image('background', 'SpriteSheetImages/blackGround.jpg');
	this.load.image('ground', 'SpriteSheetImages/green.png');
	
	this.load.spritesheet('idle', 'SpriteSheets/idle.png', {frameWidth: 210, frameHeight: 375});
	this.load.spritesheet('idleFlip', 'SpriteSheets/idleFlip.png', {frameWidth: 210, frameHeight: 375});
	this.load.spritesheet('basicAttack', 'SpriteSheets/LPLKHPHK2.png', {frameWidth: 260 , frameHeight: 375});
	this.load.spritesheet('basicAttackFlip', 'SpriteSheets/LPLKHPHK2flip.png', {frameWidth: 260, frameHeight: 375});
	this.load.spritesheet('crouchBig','SpriteSheets/crounchAttaksBig.png', {frameWidth: 306, frameHeight: 250});
	this.load.spritesheet('crouchBigFlip','SpriteSheets/crounchAttaksBigflip.png', {frameWidth: 186, frameHeight: 250});
	this.load.spritesheet('hurting', 'SpriteSheets/hurt.png', {frameWidth: 201, frameHeight: 345});
	this.load.spritesheet('hurtingFlip', 'SpriteSheets/hurtFlip.png', {frameWidth: 201, frameHeight: 345});
	this.load.spritesheet('HK','SpriteSheets/HK.png', {frameWidth: 330, frameHeight: 335});
	this.load.spritesheet('HKflip', 'SpriteSheets/HKflip.png', {frameWidth: 330, frameHeight: 335});
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
	op = this.sound.add('op');
	op.play();
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
	bg = this.sound.add('bg');
	op.stop();
	bg.play();
	hit = 0;
	hit2 = 0;
	jump = 0;
	jump2 = 0;
	frame  = 0;
	player1Health = 100;
	player2Health = 100;
	lag = false;
	lag2 = false;
	timeVar = 99;
	this.add.image(320, 240, 'background');
	this.player = this.physics.add.sprite(320, 390, 'idleAnim', 2);
	//this.player.body.setSize(120, 300, 0, 0);
	//this.player.body.setOffset(30, 20);
	var timeText = this.make.text({
		x: 400,
		y: 0,
		text: '99',
		style: {
			font: '39px monospace',
			fill: '#e3b129'
		}
	});
	timeText.setOrigin(0.5, 0);
	health1Box = this.add.graphics();
	health1 = this.add.graphics();
	health1Box.fillStyle(0x222222, 0.8);
	health1Box.fillRect(240, 270, 320, 50);
	health1Box.setX(-220);
	health1Box.setY(-260);
	health1.setX(-220);
	health1.setY(-260);
	health1.fillStyle(0x1cf70c, 1);
	health1.fillRect(250, 280, 3 * player1Health, 30);

	health2Box = this.add.graphics();
	health2 = this.add.graphics();
	health2Box.fillStyle(0x222222, 0.8);
	health2Box.fillRect(240, 270, 320, 50);
	health2Box.setX(220);
	health2Box.setY(-260);
	health2.setX(220);
	health2.setY(-260);
	health2.fillStyle(0x1cf70c, 1);
	health2.fillRect(250, 280, 3 * player2Health, 30);
	
	this.physics.world.bounds.width = 960;
	this.physics.world.bounds.height = 540;
	this.player.setCollideWorldBounds(true);
	this.player2 = this.physics.add.sprite(500, 390, 'idleAnimFlip', 2).setOffset(500, 500);
	//this.player2.body.setSize(120, 300, 0, 0);
	//this.player2.body.setOffset(30, 20);
	this.player2.setCollideWorldBounds(true);
	this.cursors = this.input.keyboard.createCursorKeys();
	this.upKey = this.input.keyboard.addKeys('w');
	this.leftKey = this.input.keyboard.addKeys('a');
	this.rightKey = this.input.keyboard.addKeys('d');
	this.downKey = this.input.keyboard.addKeys('s');
	heavy = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
	heavyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
	lightK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
	lightP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
	heavy2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
	heavyP2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
	lightK2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
	lightP2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
	this.anims.create({
		key: 'idleAnim',
		frames: this.anims.generateFrameNumbers('idle', {frames: [1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 8, 8, 7, 7, 5, 5, 6, 6, 5, 5, 7, 7, 8, 8]}),
		frameRate: 6,
		repeat: true
	});
	this.anims.create({
		key: 'idleAnimFlip',
		frames: this.anims.generateFrameNumbers('idleFlip', {frames: [1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 8, 8, 7, 7, 5, 5, 6, 6, 5, 5, 7, 7, 8, 8]}),
		frameRate: 6,
		repeat: true
	});
	this.anims.create({
		key: 'lP',
		frames: this.anims.generateFrameNumbers('basicAttack', {frames: [0, 0, 0]}),
		frameRate: 6,
		duration: 500,
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
		key: 'lPflip',
		frames: this.anims.generateFrameNumbers('basicAttackFlip', {frames: [0, 0, 0]}),
		frameRate: 6,
		duration: 500,
		repeat: false
	});
	this.anims.create({
		key: 'lKflip',
		frames: this.anims.generateFrameNumbers('basicAttackFlip', {frames: [6, 7, 6, 5]}),
		duration: 1000,
		repeat: false
	});
	this.anims.create({
		key: 'hPflip',
		frames: this.anims.generateFrameNumbers('basicAttackFlip', {frames: [1, 2, 3, 4, 4, 3, 3, 2, 1]}),
		frameRate: 6,
		duration: 1200,
		repeat: false
	});
	this.anims.create({
		key: 'hKflip',
		frames: this.anims.generateFrameNumbers('HKflip', {frames: [0, 1, 2, 3, 2, 1, 0]}),
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
		key: 'crounchFlip',
		frames: this.anims.generateFrameNumbers('crouchBigFlip', {frames: [0, 1]}),
		frameRate: 6,
		repeat: false
	});	
	this.anims.create({
		key: 'hurtHK',
		frames: this.anims.generateFrameNumbers('hurting', {frames: [0, 1, 2]}),
		duration: 1000,
		repeat: false
	});
	this.anims.create({
		key: 'hurtHP',
		frames: this.anims.generateFrameNumbers('hurting', {frames: [0, 1, 2]}),
		duration: 800,
		repeat: false
	});
	this.anims.create({
		key: 'hurtLK',
		frames: this.anims.generateFrameNumbers('hurting', {frames: [0, 1, 2]}),
		duration: 700,
		repeat: false
	});
		this.anims.create({
		key: 'hurtLP',
		frames: this.anims.generateFrameNumbers('hurtingFlip', {frames: [0, 1, 2]}),
		duration: 600,
		repeat: false
	});
	this.anims.create({
		key: 'hurtHKFlip',
		frames: this.anims.generateFrameNumbers('hurtingFlip', {frames: [0, 1, 2]}),
		duration: 1000,
		repeat: false
	});
	this.anims.create({
		key: 'hurtHPFlip',
		frames: this.anims.generateFrameNumbers('hurtingFlip', {frames: [0, 1, 2]}),
		duration: 800,
		repeat: false
	});
	this.anims.create({
		key: 'hurtLKFlip',
		frames: this.anims.generateFrameNumbers('hurtingFlip', {frames: [0, 1, 2]}),
		duration: 700,
		repeat: false
	});
		this.anims.create({
		key: 'hurtLPFlip',
		frames: this.anims.generateFrameNumbers('hurtingFlip', {frames: [0, 1, 2]}),
		duration: 600,
		repeat: false
	});
	this.ground = this.physics.add.staticGroup();
	this.ground.create(480, 805, 'ground');
	this.hitbox = this.physics.add.group();
	this.hitbox.maxSize = 1;
	this.block1 = this.physics.add.group();
	this.block1.maxSize = 1;
	this.block2 = this.physics.add.group();
	this.block2.maxSize = 1;
	this.physics.add.collider(this.hitbox, this.block1);
	this.physics.add.collider(this.hitbox, this.block2);
	this.physics.add.collider(this.player, this.ground);
	this.physics.add.collider(this.player2, this.ground);
	this.physics.add.collider(this.player, this.player2);
	this.physics.add.collider(this.hitbox, this.player2);
	this.physics.add.collider(this.hitbox, this.hitbox);

	this.player.anims.setTimeScale(2);
	this.player2.anims.setTimeScale(2);
	this.grandTimer = this.time.addEvent({
		delay: 1000,
		callback: tick,
		loop: true
	});
	function tick() {
	/*if (time == 99000) {
		grandTimer.paused = true;
	}*/
			timeVar = timeVar - 1;
			timeText.setText(timeVar);
		
	}
},


update: function (time, delta)
{
	console.log(timeVar);
	if (/*(time >= 103000)*/(timeVar == 0) || (player1Health <= 0) || (player2Health <= 0)) {
		//this.physics.pause();
		if ((player1Health == 0) || (player2Health > player1Health)) {
		this.make.text({
		x: 400,
		y: 240,
		text: 'Player 2 Wins!'
	});
	}
	else if ((player2Health == 0) || (player1Health > player2Health)) {
		var begin = this.make.text({
		x: 400,
		y: 240,
		text: 'Player 1 Wins',
	});
	}
	else {
		var begin = this.make.text({
		x: 400,
		y: 240,
		text: 'Tie Game',
	});
	}
		this.grandTimer.paused = true;
		hitBoxTime = this.time.delayedCall(5000, restart, [], this);
	}

	this.player.on('animationcomplete', flagChange, this);
	this.player2.on('animationcomplete', flagChange2, this);
	this.player.body.setVelocity(0);
	this.player2.body.setVelocity(0);
	if (lag2 == false) {
	this.player2.body.setSize(120, 300, 0, 0);
	this.player2.body.setOffset(30, 20);
	}
	if (lag == false) {
		this.player.body.setSize(120, 300, 0, 0);
		this.player.body.setOffset(30, 20);
	}
	if (lag == false) {
	this.player.anims.play('idleAnim', 6);
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
	if (this.cursors.down.isDown && this.cursors.right.isUp && this.cursors.left.isUp) {
		this.player.body.setVelocityY(80);
		this.player.anims.play('crounch', 6);
		this.player.body.setSize(120, 190, 0, 0);
		this.player.body.setOffset(30, 20);
		this.block1 = this.physics.add.sprite((this.player.x - 33), ((this.player.y - 80)), 'trans', 0).setSize(30, 150, 0, 0);
		//this.block1.destroy();
	}
	else if (this.cursors.right.isDown && this.cursors.down.isDown) {
		this.player.body.setVelocityX(50);
	}
	else if (this.cursors.left.isDown && this.cursors.down.isDown) {
		this.player.body.setVelocityX(-50);
		this.block1 = this.physics.add.sprite((this.player.x + 23), ((this.player.y - 140)), 'trans', 0).setSize(30, 200, 0, 0);
	}
	if (Phaser.Input.Keyboard.JustDown(heavy)) {
		this.player.anims.stop();
		lag = true;
		heavyKick(this.player);
		hitBoxTime = this.time.delayedCall(400, HKhit, [], this);		
	}
	if (Phaser.Input.Keyboard.JustDown(heavyP)) {
		this.player.anims.stop();
		lag = true;
		heavyPunch(this.player);
		hitBoxTime = this.time.delayedCall(250, HPhit, [], this);
	}
	if (Phaser.Input.Keyboard.JustDown(lightK)) {
		this.player.anims.stop();
		lag = true;
		lightKick(this.player);
		hitBoxTime = this.time.delayedCall(200, LKhit, [], this);
	}
	if (Phaser.Input.Keyboard.JustDown(lightP)) {
		this.player.anims.stop();
		lag = true;
		lightPunch(this.player);
		hitBoxTime = this.time.delayedCall(0, LPhit, [], this);
	}
		/*if (this.cursors.down.isUp) {
		this.player.body.setSize(120, 300, 0, 0);
		this.player.body.setOffset(30, 20);
	}*/
}
doubleTapTwo = Phaser.Input.Keyboard.DownDuration((this.leftKey.a),1000);
	//player 2 stuff
	if (lag2 == false) {
		this.player2.anims.play('idleAnimFlip', 6);
	if (this.leftKey.a.isDown && this.downKey.s.isUp) {
/*		if (Phaser.Input.Keyboard.UpDuration((this.leftKey.a),1000)) {
			console.log('a key double tapped'); 
		}*//* if (doubleTapTwo) { 
		this.player2.body.setVelocityX(-160);
		}*/
		
		this.player2.body.setVelocityX(-80);
	
	}
	else if (this.rightKey.d.isDown && this.downKey.s.isUp) {
		this.player2.body.setVelocityX(80);
	
	}
	if (this.upKey.w.isDown && /*this.player.body.touching.down &&*/ jump2 <= 0) {
		this.player2.body.setVelocityY(-6500);
		jump2 += 1;
	}
	if (this.player2.body.touching.down) {
		jump2 = 0;
	}
	if (this.downKey.s.isDown && this.leftKey.a.isUp && this.rightKey.d.isUp) {
		this.player2.body.setVelocityY(80);
		this.player2.anims.play('crounchFlip', false);
		this.player2.body.setSize(120, 190, 0, 0);
		this.block2 = this.physics.add.sprite((this.player2.x - 65), ((this.player2.y - 80)), 'trans', 0).setSize(30, 150, 0, 0);
		//this.block2.destroy();
	}
	else if (this.leftKey.a.isDown && this.downKey.s.isDown) {
		this.player2.body.setVelocityX(-50);
	}
	else if (this.rightKey.d.isDown && this.downKey.s.isDown) {
		this.player2.body.setVelocityX(50);
		this.block2 = this.physics.add.sprite((this.player2.x - 83), ((this.player2.y - 140)), 'trans', 0).setSize(30, 200, 0, 0);

	}
	if (Phaser.Input.Keyboard.JustDown(heavy2)) {
		this.player2.anims.stop();
		lag2 = true;
		this.player2.setX((this.player2.x-60))
		this.player2.anims.play('hKflip', false);
		//this.player2.body.setSize(120, 300, 0, 0);
		this.player2.body.setOffset(200, 0);
		hitBoxTime = this.time.delayedCall(400, HKhit2, [], this);
		hitBoxTime = this.time.delayedCall(600, jumpbackHk, [], this);
		
	}
	if (Phaser.Input.Keyboard.JustDown(heavyP2)) {
		this.player2.anims.stop();
		lag2 = true;
		this.player2.setX((this.player2.x-60))
		this.player2.anims.play('hPflip', false);
		this.player2.body.setOffset(135, 0);
		hitBoxTime = this.time.delayedCall(250, HPhit2, [], this);
		hitBoxTime = this.time.delayedCall(610, jumpbackHp, [], this);
	}
	if (Phaser.Input.Keyboard.JustDown(lightK2)) {
		this.player2.anims.stop();
		lag2 = true;
		this.player2.setX((this.player2.x-60))
		this.player2.anims.play('lKflip', false);
		this.player2.body.setOffset(135, 40);
		hitBoxTime = this.time.delayedCall(200, LKhit2, [], this);
		hitBoxTime = this.time.delayedCall(500, jumpbackLk, [], this);
	}
	if (Phaser.Input.Keyboard.JustDown(lightP2)) {
		this.player2.anims.stop();
		lag2 = true;
		this.player2.setX((this.player2.x-60))
		this.player2.anims.play('lPflip', false);
		this.player2.body.setOffset(130, 0);
		hitBoxTime = this.time.delayedCall(0, LPhit2, [], this);
		hitBoxTime = this.time.delayedCall(5, jumpbackLp, [], this);

	}
}
}


});
	function restart() {
		this.scene.start('splashScreen');
		time = 0;
	}
	function jumpbackLk() {
		this.player2.setX((this.player2.x+60));
	}
	function jumpbackLp() {
		this.player2.setX((this.player2.x+60));
	}
	function jumpbackHp() {
		this.player2.setX((this.player2.x+60));
	}
	function jumpbackHk() {
		this.player2.setX((this.player2.x+60));
	}
	function jumpbackLk2() {
		this.player.setX((this.player.x-5));
	}
	function jumpbackLp2() {
		this.player.setX((this.player.x-5));
	}
	function jumpbackHp2() {
		this.player.setX((this.player.x-5));
	}
	function jumpbackHk2() {
		this.player.setX((this.player.x-5));
	}
	function LKhit() {
		if (hit != 1) {
		this.hkHit = this.physics.add.sprite(((this.player.x) +20), ((this.player.y) - 30), 'trans', 0).setSize(110, 50, 0, 0);;
		this.physics.add.overlap(this.player2, this.hkHit, this.notification, null, this);
		this.physics.add.overlap(this.block2, this.hkHit, this.notification, null, this);
		if (this.physics.overlap(this.block2, this.hkHit)) {
			this.player.setX((this.player.x - 5));
			this.player2.setX((this.player2.x+30));
		}
		else if (this.physics.overlap(this.player2, this.hkHit)) {
			this.player.setX((this.player.x - 5));
			damageLK(this.player2);
			this.player2.setX((this.player2.x+30));

		}
		this.hkHit.destroy();
		hit = 1;
		}
	}
	function HKhit() {
		if (hit != 1) {
		this.hkHit = this.physics.add.sprite((this.player.x + 20), ((this.player.y) - 70), 'trans', 0).setSize(150, 50, 0, 0);
		this.physics.add.overlap(this.player2, this.hkHit, this.notification, null, this);
		this.physics.add.overlap(this.block2, this.hkHit, this.notification, null, this);
		if (this.physics.overlap(this.block2, this.hkHit)) {
			this.player.setX((this.player.x - 10));
			this.player2.setX((this.player2.x+50));
		}
		else if (this.physics.overlap(this.player2, this.hkHit)) {
				this.player.setX((this.player.x - 10));
				damageHK(this.player2);			
				this.player2.setX((this.player2.x+50));
		}
		this.hkHit.destroy();
		hit = 1;
		}
	}
	function HPhit() {
		if (hit != 1) {
		this.hkHit = this.physics.add.sprite((this.player.x + 20), ((this.player.y) - 110), 'trans', 0).setSize(70, 30, 0, 0);
		this.physics.add.overlap(this.player2, this.hkHit, this.notification, null, this);
		this.physics.add.overlap(this.block2, this.hkHit, this.notification, null, this);
		if (this.physics.overlap(this.block2, this.hkHit)) {
			this.player2.setX((this.player2.x+23));
		}
		else if(this.physics.overlap(this.player2, this.hkHit)) {
				damageHP(this.player2);
				this.player2.setX((this.player2.x+23));
		}
		this.hkHit.destroy();
		hit = 1;
		}
	}
	function LPhit() {
		if (hit != 1) {
		this.hkHit = this.physics.add.sprite((this.player.x + 20), ((this.player.y) - 110), 'trans', 0).setSize(70, 30, 0, 0);
		this.physics.add.overlap(this.player2, this.hkHit, this.notification, null, this);
		this.physics.add.overlap(this.block2, this.hkHit, this.notification, null, this);
		if (this.physics.overlap(this.block2, this.hkHit)) {
			this.player.setX((this.player.x - 5));
			this.player2.setX((this.player2.x+18));
		}
		else if (this.physics.overlap(this.player2, this.hkHit)) {
			this.player.setX((this.player.x - 5));
				damageLP(this.player2);
				this.player2.setX((this.player2.x+18));
		}
		this.hkHit.destroy();
		hit = 1;
		}
	}
	function LKhit2() {
		if (hit2 != 1) {
		this.hkHit2 = this.physics.add.sprite(((this.player2.x) -110), ((this.player2.y) - 30), 'trans', 0).setSize(110, 50, 0, 0);;
		this.physics.add.overlap(this.player, this.hkHit2, this.notification, null, this);
		this.physics.add.overlap(this.block1, this.hkHit2, this.notification, null, this);
		if (this.physics.overlap(this.block1, this.hkHit2)) {
			this.player2.setX((this.player2.x + 5));
			this.player.setX((this.player.x-30));
		}
		else if(this.physics.overlap(this.player, this.hkHit2)) {
			lag = true;
			this.player2.setX((this.player2.x + 5));
			damageLK2(this.player);
			this.player.setX((this.player.x-30));

		}
		this.hkHit2.destroy();
		hit2 = 1;
		}
	}
	function HKhit2() {
		if (hit2 != 1) {
		this.hkHit2 = this.physics.add.sprite((this.player2.x - 150), ((this.player2.y) - 70), 'trans', 0).setSize(150, 50, 0, 0);

		this.physics.add.overlap(this.player, this.hkHit2, this.notification, null, this);
		console.log(this.physics.overlap(this.player, this.hkHit2));
		this.physics.add.overlap(this.block1, this.hkHit2, this.notification, null, this);
		if (this.physics.overlap(this.block1, this.hkHit2)) {
			this.player2.setX((this.player2.x + 5));
			this.player.setX((this.player.x-30));
		}
		else if (this.physics.overlap(this.player, this.hkHit2)) {
			lag = true;
			this.player2.setX((this.player2.x + 10));
			damageHK2(this.player);
			this.player.setX((this.player.x-50));
		}
		this.hkHit2.destroy();
		hit2 = 1;
		}
	}
	function HPhit2() {
		if (hit2 != 1) {
		this.hkHit2 = this.physics.add.sprite((this.player2.x - 60), ((this.player2.y) - 110), 'trans', 0).setSize(70, 30, 0, 0);
		this.physics.add.overlap(this.player, this.hkHit2, this.notification, null, this);
		this.physics.add.overlap(this.block1, this.hkHit2, this.notification, null, this);
		if (this.physics.overlap(this.block1, this.hkHit2)) {
			this.player2.setX((this.player2.x + 5));
			this.player.setX((this.player.x-30));
		}
		else if (this.physics.overlap(this.player, this.hkHit2)) {
				damageHP2(this.player);
				this.player.setX((this.player.x-23));
				lag = true;
		}
		this.hkHit2.destroy();
		hit2 = 1;
		}
	}
	function LPhit2() {
		if (hit2 != 1) {
		this.hkHit2 = this.physics.add.sprite((this.player2.x - 60), ((this.player2.y) - 110), 'trans', 0).setSize(70, 30, 0, 0);
		this.physics.add.overlap(this.player, this.hkHit2, this.notification, null, this);
		this.physics.add.overlap(this.block1, this.hkHit2, this.notification, null, this);
		if (this.physics.overlap(this.block1, this.hkHit2)) {
			this.player2.setX((this.player2.x + 5));
			this.player.setX((this.player.x-30));
		}
		else if (this.physics.overlap(this.player, this.hkHit2)) {
			lag = true;
			this.player2.setX((this.player2.x + 5));
			damageLP2(this.player);
			this.player.setX((this.player.x-20));
		}
		this.hkHit2.destroy();
		hit2 = 1;
		}
	}
	function flagChange() {
		lag = false;
		hit = 0;
	}
		function flagChange2() {
		lag2 = false;
		hit2 = 0;
	}
	function heavyKick(player) {
		lag = true;
		player.anims.play('hK', false);
	}
	function heavyPunch(player) {
		lag = true;
		player.anims.play('hP', false);
	}
	function lightKick(player) {
		lag = true;
		player.anims.play('lK', false);
	}
	function lightPunch(player) {
		lag = true;
		player.anims.play('lP', false);
	}
	function heavyKick2(player2) {
		lag2 = true;
		player2.anims.play('hKflip', false);
	}
	function heavyPunch2(player2) {
		lag2 = true;
		player2.anims.play('hPflip', false);
	}
	function lightKick2(player2) {
		lag2 = true;
		player2.anims.play('lKflip', false);
	}
	function lightPunch2(player2) {
		lag2 = true;
		//player2.body.setScale(500);
		player2.anims.play('lPflip', false);
	}
	function damageHK(player2) {
		player2.anims.stop();
		lag2 = true;
		console.log('so this is triggered');
		player2.anims.play('hurtHKFlip', false);
		player2Health = player2Health - 6;
		health2.clear();
		if (player2Health >= 66) {
			health2.fillStyle(0x1cf70c);
		}
		else if(player2Health >= 20) {
		health2.fillStyle(0xd7f542, 1);
		}
		else if(player2Health >= 0) {
			health2.fillStyle(0xff1100);
		}
		health2.fillRect(250, 280, 3 * player2Health, 30);
	}
	function damageLP(player2) {
		player2.anims.stop();
		lag2 = true;
		console.log('so this is triggered');
		player2.anims.play('hurtLPFlip', false);
		player2Health = player2Health - 2;
		health2.clear();
		if (player2Health >= 66) {
			health2.fillStyle(0x1cf70c);
		}
		else if(player2Health >= 20) {
		health2.fillStyle(0xd7f542, 1);
		}
		else if(player2Health >= 0) {
			health2.fillStyle(0xff1100);
		}
		health2.fillRect(250, 280, 3 * player2Health, 30);
	}
	function damageHP(player2) {
		player2.anims.stop();
		lag2 = true;
		console.log('so this is triggered');
		player2.anims.play('hurtHPFlip', false);
		player2Health = player2Health - 10;
		health2.clear();
		if (player2Health >= 66) {
			health2.fillStyle(0x1cf70c);
		}
		else if(player2Health >= 20) {
		health2.fillStyle(0xd7f542, 1);
		}
		else if(player2Health >= 0) {
			health2.fillStyle(0xff1100);
		}
		health2.fillRect(250, 280, 3 * player2Health, 30);
	}
	function damageLK(player2) {
		player2.anims.stop();
		lag2 = true;
		console.log('so this is triggered');
		player2.anims.play('hurtLKFlip', false);
		player2Health = player2Health - 4;
		health2.clear();
		if (player2Health >= 66) {
			health2.fillStyle(0x1cf70c);
		}
		else if(player2Health >= 20) {
		health2.fillStyle(0xd7f542, 1);
		}
		else if(player2Health >= 0) {
			health2.fillStyle(0xff1100);
		}
		health2.fillRect(250, 280, 3 * player2Health, 30);
	}
	function damageHK2(player) {
		player.anims.stop();
		lag = true;
		console.log('so this is triggered');
		player.anims.play('hurtHK', false);
		player1Health = player1Health - 6;
		health1.clear();
		health1.fillStyle(0xd7f542, 1);
		health1.fillRect(250, 280, 3 * player1Health, 30);
	}
	function damageLP2(player) {
		player.anims.stop();
		lag = true;
		console.log('so this is triggered');
		player.anims.play('hurtLP', false);
		player1Health = player1Health - 2;
		health1.clear();
		if (player1Health >= 66) {
			health1.fillStyle(0x1cf70c);
		}
		else if(player1Health >= 20) {
		health1.fillStyle(0xd7f542, 1);
		}
		else if(player1Health >= 0) {
			health1.fillStyle(0xff1100);
		}
		health1.fillRect(250, 280, 3 * player1Health, 30);
	}
	function damageHP2(player) {
		player.anims.stop();
		lag = true;
		console.log('so this is triggered');
		player.anims.play('hurtHP', false);
		player1Health = player1Health - 10;
		health1.clear();
		if (player1Health >= 66) {
			health1.fillStyle(0x1cf70c);
		}
		else if(player1Health >= 20) {
		health1.fillStyle(0xd7f542, 1);
		}
		else if(player1Health >= 0) {
			health1.fillStyle(0xff1100);
		}
		health1.fillRect(250, 280, 3 * player1Health, 30);
	}
	function damageLK2(player) {
		player.anims.stop();
		lag = true;
		console.log('so this is triggered');
		player.anims.play('hurtLK', false);
		player1Health = player1Health - 4;
		health1.clear();
		if (player1Health >= 66) {
			health1.fillStyle(0x1cf70c);
		}
		else if(player1Health >= 20) {
		health1.fillStyle(0xd7f542, 1);
		}
		else if(player1Health >= 0) {
			health1.fillStyle(0xff1100);
		}
		health1.fillRect(250, 280, 3 * player1Health, 30);
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
