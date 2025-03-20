class ChooseEnemyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ChooseEnemyScene' });
    }

    preload() {
        // Caminhos relativos para as imagens
        this.load.image('presa1', './assets/presa1.png');
        this.load.image('presa2', './assets/presa2.png');
        this.load.image('presa3', './assets/presa3.png');
        this.load.image('background1', './assets/background1.png');
    }

    create() {
        // Adiciona o fundo ao centro da tela e dimensiona para cobrir toda a área
        this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "background1"
        ).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Cria botões interativos para escolher a presa
        const enemy1 = this.add.image(550, 450, 'presa1')
            .setInteractive()
            .on('pointerdown', () => this.startGame('presa1'))
            .on('pointerover', () => enemy1.setScale(1.1))
            .on('pointerout', () => enemy1.setScale(1));

        const enemy2 = this.add.image(900, 450, 'presa2')
            .setInteractive()
            .on('pointerdown', () => this.startGame('presa2'))
            .on('pointerover', () => enemy2.setScale(1.1))
            .on('pointerout', () => enemy2.setScale(1));

        const enemy3 = this.add.image(1250, 450, 'presa3')
            .setInteractive()
            .on('pointerdown', () => this.startGame('presa3'))
            .on('pointerover', () => enemy3.setScale(1.1))
            .on('pointerout', () => enemy3.setScale(1));
    }

    startGame(enemyType) {
        // Define a presa escolhida no registro global e inicia a cena do tutorial
        this.registry.set('enemyType', enemyType);
        this.scene.start('TutorialScene');
    }
}

class TutorialScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TutorialScene' });
    }

    preload() {
        // Caminho relativo para a imagem de fundo
        this.load.image('background2', './assets/background2.png');
    }

    create() {
        // Adiciona o fundo ao centro da tela e dimensiona para cobrir toda a área
        this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "background2"
        ).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Exibe textos explicativos sobre as regras do jogo
        this.add.text(this.cameras.main.centerX, 100, 'Bem-vindo ao Catcher!', { 
            fontSize: '50px', 
            fill: '#fff'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, 200, 'Regras', { 
            fontSize: '24px', 
            fill: '#ff0'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, 250, 'Você tem 30 segundos para capturar o máximo de presas', { 
            fontSize: '24px', 
            fill: '#fff'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, 300, 'Se capturar menos de 60 presas, você perde', { 
            fontSize: '24px', 
            fill: '#fff'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, 350, 'Se capturar 60 ou mais, você vence', { 
            fontSize: '24px', 
            fill: '#fff'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, 400, 'Clique nas presas com o botão esquerdo do mouse ou do touch pad para capturá-las', { 
            fontSize: '24px', 
            fill: '#fff'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, 450, 'Ao capturar 15 presas e pressionar o espaço no seu teclado, você pode parar o tempo por 3 segundos', { 
            fontSize: '24px', 
            fill: '#fff'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, 500, 'Clique em qualquer lugar para começar', { 
            fontSize: '24px', 
            fill: '#0f0'
        }).setOrigin(0.5);

        // Inicia o jogo ao clicar em qualquer lugar da tela
        this.input.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Caminhos relativos para as imagens
        this.load.image('background3', './assets/background2.png');
        this.load.image('platform', './assets/platform.png');
    }

    create() {
        // Adiciona o fundo ao centro da tela e dimensiona para cobrir toda a área
        this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "background3"
        ).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Configurações iniciais
        this.score = 0;
        this.timeLeft = 30;
        this.enemyType = this.registry.get('enemyType');
        this.isTimePaused = false;
        this.canPauseTime = false;
        this.nextPauseThreshold = 15;

        // Placar
        this.scoreText = this.add.text(
            this.cameras.main.centerX,
            16,
            'Presas: 0', 
            { fontSize: '32px', fill: '#fff' }
        ).setOrigin(0.5, 0);

        // Temporizador
        this.timerText = this.add.text(
            this.cameras.main.centerX,
            60,
            'Tempo: 30', 
            { fontSize: '32px', fill: '#fff' }
        ).setOrigin(0.5, 0);

        // Texto de feedback para pausa do tempo
        this.pauseText = this.add.text(
            this.cameras.main.centerX,
            120,
            '', 
            { fontSize: '32px', fill: '#0f0' }
        ).setOrigin(0.5, 0).setVisible(false);

        // Texto "FREEZE"
        this.freezeText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'FREEZE', 
            { fontSize: '64px', fill: '#00f', fontStyle: 'bold' }
        ).setOrigin(0.5).setVisible(false);

        // Adiciona plataformas
        this.platforms = this.physics.add.staticGroup();

        // Plataforma esquerda
        this.platforms.create(500, this.cameras.main.height - 400, 'platform')
            .setScale(0.5, 0.5)
            .refreshBody();

        // Plataforma direita
        this.platforms.create(this.cameras.main.width - 500, this.cameras.main.height - 600, 'platform')
            .setScale(0.5, 0.5)
            .refreshBody();

        // Grupo de presas
        this.enemies = this.physics.add.group();

        // Evento para adicionar presas
        this.enemySpawnEvent = this.time.addEvent({
            delay: 200,
            callback: this.addEnemy,
            callbackScope: this,
            loop: true
        });

        // Atualiza o temporizador
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // Configura colisão entre presas e plataformas
        this.physics.add.collider(this.enemies, this.platforms, this.enemyHitPlatform, null, this);

        // Configura o evento de tecla Espaço
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    addEnemy() {
        if (this.isTimePaused) return;

        // Adiciona uma nova presa com posição e velocidade aleatórias
        const enemy = this.enemies.create(
            Phaser.Math.Between(100, this.cameras.main.width - 100),
            Phaser.Math.Between(100, this.cameras.main.height - 100),
            this.enemyType
        );

        // Define uma velocidade aleatória para a presa
        enemy.setVelocity(
            Phaser.Math.Between(-500, 500),
            Phaser.Math.Between(-500, 500)
        );

        // Torna a presa clicável
        enemy.setInteractive();

        // Define o que acontece quando o jogador clica na presa
        enemy.on('pointerdown', () => this.catchEnemy(enemy));
    }

    catchEnemy(enemy) {
        if (!enemy.active) return;

        // Remove a presa
        enemy.destroy();

        // Aumenta a pontuação
        this.score++;
        this.scoreText.setText(`Presas: ${this.score}`);

        // Verifica se o jogador pode pausar o tempo
        if (this.score >= this.nextPauseThreshold && !this.canPauseTime) {
            this.canPauseTime = true;
            this.pauseText.setText('Poder de parar o tempo pronto!').setVisible(true);

            // Oculta o texto após 3 segundos
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
        if (this.isTimePaused) return;

        // Decrementa o tempo restante
        this.timeLeft--;
        this.timerText.setText(`Tempo: ${this.timeLeft}`);

        // Verifica se o tempo acabou
        if (this.timeLeft <= 0) {
            this.endGame();
        }
    }

    pauseTime() {
        if (this.isTimePaused || !this.canPauseTime) return;

        this.isTimePaused = true;
        this.canPauseTime = false;
        this.freezeText.setVisible(true);

        // Pausa o evento de geração de presas
        this.enemySpawnEvent.paused = true;

        // Congela todas as presas
        this.enemies.getChildren().forEach(enemy => {
            enemy.setVelocity(0, 0);
        });

        // Retoma o tempo após 5 segundos
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                this.isTimePaused = false;
                this.freezeText.setVisible(false);

                // Retoma o movimento das presas
                this.enemies.getChildren().forEach(enemy => {
                    enemy.setVelocity(
                        Phaser.Math.Between(-500, 500),
                        Phaser.Math.Between(-500, 500)
                    );
                });

                // Retoma o evento de geração de presas
                this.enemySpawnEvent.paused = false;

                // Define o próximo limite de presas para ativar a pausa
                this.nextPauseThreshold += 15;
            },
            loop: false
        });
    }

    update() {
        // Verifica se o jogador pressionou a tecla Espaço e pode pausar o tempo
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.pauseTime();
        }
    }

    endGame() {
        // Recupera a pontuação máxima do localStorage
        let maxScore = localStorage.getItem('maxScore') || 0;

        // Verifica se a pontuação atual é maior que a pontuação máxima
        if (this.score > maxScore) {
            maxScore = this.score;
            localStorage.setItem('maxScore', maxScore);
        }

        // Passa a pontuação atual e máxima para as cenas de Game Over ou Vitória
        if (this.score >= 60) {
            this.scene.start('WinScene', { score: this.score, maxScore: maxScore });
        } else {
            this.scene.start('GameOverScene', { score: this.score, maxScore: maxScore });
        }
    }

    enemyHitPlatform(enemy, platform) {
        // Define uma nova velocidade aleatória para a presa
        const newVelocityX = Phaser.Math.Between(-500, 500);
        const newVelocityY = Phaser.Math.Between(-500, 500);

        // Aplica a nova velocidade à presa
        enemy.setVelocity(newVelocityX, newVelocityY);

        // Adiciona um efeito visual (opcional)
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

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    preload() {
        this.load.image('background4', './assets/background2.png');
        this.load.image('botão1', './assets/botão1.png');
    }

    create(data) {
        // Adiciona o fundo ao centro da tela e dimensiona para cobrir toda a área
        this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "background4"
        ).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Exibe o texto "Game Over!"
        this.add.text(this.cameras.main.centerX, 150, 'Game Over!', { 
            fontSize: '48px', 
            fill: '#f00'
        }).setOrigin(0.5);

        // Exibe a pontuação atual
        this.add.text(this.cameras.main.centerX, 250, `Presas capturadas: ${data.score}`, { 
            fontSize: '32px', 
            fill: '#fff'
        }).setOrigin(0.5);

        // Exibe a pontuação máxima
        this.add.text(this.cameras.main.centerX, 300, `Recorde: ${data.maxScore}`, { 
            fontSize: '32px', 
            fill: '#0f0'
        }).setOrigin(0.5);

        // Adiciona o botão de reiniciar
        const restartButton = this.add.image(this.cameras.main.centerX, 450, 'botão1').setScale(1);

        // Torna o botão interativo
        restartButton.setInteractive();

        // Configura o evento de clique no botão
        restartButton.on('pointerdown', () => {
            this.scene.start('ChooseEnemyScene');
        });

        // Efeito ao passar o mouse sobre o botão
        restartButton.on('pointerover', () => {
            restartButton.setScale(1.1);
        });

        // Efeito ao tirar o mouse do botão
        restartButton.on('pointerout', () => {
            restartButton.setScale(1);
        });
    }
}

class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
    }

    preload() {
        this.load.image('background5', './assets/background2.png');
        this.load.image('botão1', './assets/botão1.png');
    }

    create(data) {
        // Adiciona o fundo ao centro da tela e dimensiona para cobrir toda a área
        this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "background5"
        ).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Exibe o texto "Você Venceu"
        this.add.text(this.cameras.main.centerX, 150, 'Você Venceu', { 
            fontSize: '48px', 
            fill: '#0f0'
        }).setOrigin(0.5);

        // Exibe a pontuação atual
        this.add.text(this.cameras.main.centerX, 250, `Presas capturadas: ${data.score}`, { 
            fontSize: '32px', 
            fill: '#fff'
        }).setOrigin(0.5);

        // Exibe a pontuação máxima
        this.add.text(this.cameras.main.centerX, 300, `Recorde: ${data.maxScore}`, { 
            fontSize: '32px', 
            fill: '#0f0'
        }).setOrigin(0.5);

        // Adiciona o botão de reiniciar
        const restartButton = this.add.image(this.cameras.main.centerX, 450, 'botão1').setScale(1);

        // Torna o botão interativo
        restartButton.setInteractive();

        // Configura o evento de clique no botão
        restartButton.on('pointerdown', () => {
            this.scene.start('ChooseEnemyScene');
        });

        // Efeito ao passar o mouse sobre o botão
        restartButton.on('pointerover', () => {
            restartButton.setScale(1.1);
        });

        // Efeito ao tirar o mouse do botão
        restartButton.on('pointerout', () => {
            restartButton.setScale(1);
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1835,
    height: 1000,
    scene: [ChooseEnemyScene, TutorialScene, GameScene, GameOverScene, WinScene],
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    }
};

const game = new Phaser.Game(config);