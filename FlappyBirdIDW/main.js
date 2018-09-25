var game = new Phaser.Game(400, 490);

var mainState = {
	preload: function() { 

        //Define a cor do background
        game.stage.backgroundColor = '#71c5cf';

        //Carrega as imagens
        game.load.image('bird', 'bird.png');  
        game.load.image('pipe', 'pipe.png'); 

        //Carrega os sons
        game.load.audio('jump', './jump.wav'); 
    },


    create: function() { 
        //Ativa a física, nesse caso vamos utilizar a ARCADE
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Instancia o cano e o tempo de intervalo entre eles
        this.pipes = game.add.group();
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);           

        //Instancia o pássaro, adciona a física a ele
        this.bird = game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000; 

        //Instancia uma âncora no nosso pássaro para ele virar um pouco, criando um movimento
        this.bird.anchor.setTo(-0.2, 0.5); 
 
        //Chama a função de pulo
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this); 
        game.input.onDown.add(this.jump, this);

        //Instancia a pontuação inicial e sua posição na tela
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });  

        //Adiciona o Som de pulo para a função jump
        this.jumpSound = game.add.audio('jump');
        this.jumpSound.volume = 0.2;
    },

    update: function() {
        if (this.bird.y < 0 || this.bird.y > game.world.height)
            this.restartGame(); 

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this); 
            
        if (this.bird.angle < 20)
            this.bird.angle += 1;  
    },

	jump: function() {
        if (this.bird.alive == false)
            return; 

        this.bird.body.velocity.y = -350;

        // Animação do pulo
        game.add.tween(this.bird).to({angle: -20}, 100).start();

        // Toca o som de pulo
        this.jumpSound.play();
    },

	//Colisão com o Cano
	hitPipe: function() {
        if (this.bird.alive == false)
            return;
            
        this.bird.alive = false;

        game.time.events.remove(this.timer);
    
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

	//Restart Game
	 restartGame: function() {
        game.state.start('main');
    },

	//Criar Cano
	addOnePipe: function(x, y) {
        var pipe = game.add.sprite(x, y, 'pipe');
        this.pipes.add(pipe);
        game.physics.arcade.enable(pipe);

        pipe.body.velocity.x = -200;  
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

	//Buraco no cano
	 addRowOfPipes: function() {
        var hole = Math.floor(Math.random()*5)+1;
        
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1) 
                this.addOnePipe(400, i*60+10);   
    
        this.score += 1;
        this.labelScore.text = this.score;  
    },
};
game.state.add('main', mainState);
game.state.start('main');