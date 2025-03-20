class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' }); // Define a chave única para esta cena
    }

    preload() {
        // Carrega as imagens de fundo e da plataforma
        this.load.image('background3', 'assets/fundo1.png');
        this.load.image('platform', 'assets/plataforma.png');
    }

    create() {
        // Adiciona a imagem de fundo centralizada e redimensionada
        this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "background3"
        ).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Inicializa variáveis do jogo
        this.score = 0; // Pontuação inicial
        this.timeLeft = 30; // Tempo restante
        this.enemyType = this.registry.get('enemyType'); // Tipo de inimigo escolhido
        this.isTimePaused = false; // Controle de pausa do tempo
        this.canPauseTime = false; // Habilita pausa do tempo após capturar 15 inimigos
        this.nextPauseThreshold = 15; // Próximo limite para habilitar pausa

        // Adiciona textos para exibir placar, tempo e mensagens de pausa
        this.scoreText = this.add.text(
            this.cameras.main.centerX,
            16,
            'Presas: 0', 
            { fontSize: '32px', fill: '#fff' }
        ).setOrigin(0.5, 0);

        this.timerText = this.add.text(
            this.cameras.main.centerX,
            60,
            'Tempo: 30', 
            { fontSize: '32px', fill: '#fff' }
        ).setOrigin(0.5, 0);

        this.pauseText = this.add.text(
            this.cameras.main.centerX,
            120,
            '', 
            { fontSize: '32px', fill: '#0f0' }
        ).setOrigin(0.5, 0).setVisible(false);

        this.freezeText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'FREEZE', 
            { fontSize: '64px', fill: '#00f', fontStyle: 'bold' }
        ).setOrigin(0.5).setVisible(false);

        // Cria plataformas estáticas
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(500, this.cameras.main.height - 400, 'platform')
            .setScale(0.5, 0.5)
            .refreshBody();
        this.platforms.create(this.cameras.main.width - 500, this.cameras.main.height - 600, 'platform')
            .setScale(0.5, 0.5)
            .refreshBody();

        // Cria grupo de inimigos
        this.enemies = this.physics.add.group();

        // Configura eventos de spawn de inimigos e atualização do tempo
        this.enemySpawnEvent = this.time.addEvent({
            delay: 200,
            callback: this.addEnemy,
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // Adiciona colisão entre inimigos e plataformas
        this.physics.add.collider(this.enemies, this.platforms, this.enemyHitPlatform, null, this);

        // Configura a tecla de espaço para pausar o tempo
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    addEnemy() {
        if (this.isTimePaused) return; // Não adiciona inimigos se o tempo estiver pausado

        // Cria um inimigo em uma posição aleatória
        const enemy = this.enemies.create(
            Phaser.Math.Between(100, this.cameras.main.width - 100),
            Phaser.Math.Between(100, this.cameras.main.height - 100),
            this.enemyType
        );

        // Define uma velocidade aleatória para o inimigo
        enemy.setVelocity(
            Phaser.Math.Between(-500, 500),
            Phaser.Math.Between(-500, 500)
        );

        // Torna o inimigo interativo
        enemy.setInteractive();
        enemy.on('pointerdown', () => this.catchEnemy(enemy));
    }

    catchEnemy(enemy) {
        if (!enemy.active) return; // Verifica se o inimigo ainda está ativo

        enemy.destroy(); // Remove o inimigo da tela
        this.score++; // Incrementa a pontuação
        this.scoreText.setText(`Presas: ${this.score}`); // Atualiza o texto do placar

        // Verifica se o jogador pode pausar o tempo
        if (this.score >= this.nextPauseThreshold && !this.canPauseTime) {
            this.canPauseTime = true;
            this.pauseText.setText('Poder de parar o tempo pronto!').setVisible(true);

            // Esconde a mensagem após 3 segundos
            this.time.addEvent({
                delay: 3000,
                callback: () => {
                    this.pauseText.setVisible(false);
                },
                loop: false
            });
        }
    }

    updateTimer() {
        if (this.isTimePaused) return; // Não atualiza o tempo se estiver pausado

        this.timeLeft--; // Decrementa o tempo restante
        this.timerText.setText(`Tempo: ${this.timeLeft}`); // Atualiza o texto do tempo

        // Verifica se o tempo acabou
        if (this.timeLeft <= 0) {
            this.endGame();
        }
    }

    pauseTime() {
        if (this.isTimePaused || !this.canPauseTime) return; // Verifica se o tempo pode ser pausado

        this.isTimePaused = true;
        this.canPauseTime = false;
        this.freezeText.setVisible(true); // Exibe o texto "FREEZE"

        this.enemySpawnEvent.paused = true; // Pausa o spawn de inimigos

        // Para o movimento de todos os inimigos
        this.enemies.getChildren().forEach(enemy => {
            enemy.setVelocity(0, 0);
        });

        // Retoma o jogo após 5 segundos
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                this.isTimePaused = false;
                this.freezeText.setVisible(false);

                // Retoma o movimento dos inimigos
                this.enemies.getChildren().forEach(enemy => {
                    enemy.setVelocity(
                        Phaser.Math.Between(-500, 500),
                        Phaser.Math.Between(-500, 500)
                    );
                });

                this.enemySpawnEvent.paused = false; // Retoma o spawn de inimigos
                this.nextPauseThreshold += 15; // Define o próximo limite para pausa
            },
            loop: false
        });
    }

    update() {
        // Verifica se a tecla de espaço foi pressionada
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.pauseTime();
        }
    }

    endGame() {
        // // Obtém o recorde máximo armazenado no localStorage
        // let maxScore = localStorage.getItem('maxScore') || 0;

        // // Atualiza o recorde se necessário
        // if (this.score > maxScore) {
        //     maxScore = this.score;
        //     localStorage.setItem('maxScore', maxScore);
        // }

        // Decide se o jogador venceu ou perdeu
        if (this.score >= 60) {
            this.scene.start('WinScene', { score: this.score, maxScore: maxScore });
        } else {
            this.scene.start('GameOverScene', { score: this.score, maxScore: maxScore });
        }
    }

    enemyHitPlatform(enemy, platform) {
        // Define uma nova velocidade aleatória para o inimigo ao colidir com a plataforma
        const newVelocityX = Phaser.Math.Between(-500, 500);
        const newVelocityY = Phaser.Math.Between(-500, 500);

        enemy.setVelocity(newVelocityX, newVelocityY);

        // Adiciona uma animação de escala ao inimigo
        this.tweens.add({
            targets: enemy,
            scaleX: 1.2,
            scaleY: 1.0,
            duration: 100,
            yoyo: true,
            repeat: 0
        });
    }
}