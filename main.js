class ChooseEnemyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ChooseEnemyScene' }); // Define a chave da cena
    }

    preload() {
        // Carrega as imagens das presas e do fundo
        this.load.image('presa1', ' assets/presa1.png');
        this.load.image('presa2', 'assets/presa2.png');
        this.load.image('presa3', 'assets/presa3.png');
        this.load.image('background1', 'assets/background1.png');
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
            .setInteractive() // Torna a imagem interativa
            .on('pointerdown', () => this.startGame('presa1')) // Inicia o jogo com a presa 1
            .on('pointerover', () => enemy1.setScale(1.1)) // Aumenta a escala ao passar o mouse
            .on('pointerout', () => enemy1.setScale(1)); // Volta à escala original ao tirar o mouse

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
        super({ key: 'TutorialScene' }); // Define a chave da cena
    }

    preload() {
        // Carrega a imagem de fundo
        this.load.image('background2', 'assets/background2.png');
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
            fill: '#fff' // Cor branca
        }).setOrigin(0.5); // Centraliza o texto

        this.add.text(this.cameras.main.centerX, 200, 'Regras', { 
            fontSize: '24px', 
            fill: '#ff0' // Cor amarela
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

        this.add.text(this.cameras.main.centerX, 400, 'Clique nas presas com o botão esquerdo do mouse ou do touch pad para capturalas ', { 
            fontSize: '24px', 
            fill: '#fff'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, 450, 'Ao capturar 15 presas e precionar o espaço no seu teclado vai poder parar o tempo por 3 segundos ', { 
            fontSize: '24px', 
            fill: '#fff'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, 500, 'Clique em qualquer lugar para começar', { 
            fontSize: '24px', 
            fill: '#0f0' // Cor verde
        }).setOrigin(0.5);

        // Inicia o jogo ao clicar em qualquer lugar da tela
        this.input.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' }); // Define a chave da cena
    }

    preload() {
        // Carrega a imagem de fundo e as plataformas
        this.load.image('background3', 'assets/background2.png');
        this.load.image('platform', 'assets/platform.png');
    }

    create() {
        // Adiciona o fundo ao centro da tela e dimensiona para cobrir toda a área
        this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "background3"
        ).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Configurações iniciais
        this.score = 0; // Pontuação do jogador
        this.timeLeft = 30; // Tempo restante
        this.enemyType = this.registry.get('enemyType'); // Tipo de presa escolhida
        this.isTimePaused = false; // Controla se o tempo está pausado
        this.canPauseTime = false; // Controla se o jogador pode pausar o tempo
        this.nextPauseThreshold = 15; // Próximo limite de presas para ativar a pausa

        // Placar
        this.scoreText = this.add.text(
            this.cameras.main.centerX,
            16,
            'Presas: 0', 
            { fontSize: '32px', fill: '#fff' }
        ).setOrigin(0.5, 0); // Centraliza o texto horizontalmente

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
        ).setOrigin(0.5, 0).setVisible(false); // Inicialmente invisível

        // Texto "FREEZE"
        this.freezeText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'FREEZE', 
            { fontSize: '64px', fill: '#00f', fontStyle: 'bold' }
        ).setOrigin(0.5).setVisible(false); // Inicialmente invisível

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
            delay: 200, // Intervalo de 200ms
            callback: this.addEnemy,
            callbackScope: this,
            loop: true // Repete indefinidamente
        });

        // Atualiza o temporizador
        this.time.addEvent({
            delay: 1000, // Intervalo de 1 segundo
            callback: this.updateTimer,
            callbackScope: this,
            loop: true // Repete indefinidamente
        });

        // Configura colisão entre presas e plataformas
        this.physics.add.collider(this.enemies, this.platforms, this.enemyHitPlatform, null, this);

        // Configura o evento de tecla Espaço
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    addEnemy() {
        if (this.isTimePaused) return; // Não adiciona presas se o tempo estiver pausado

        // Adiciona uma nova presa com posição e velocidade aleatórias
        const enemy = this.enemies.create(
            Phaser.Math.Between(100, this.cameras.main.width - 100),
            Phaser.Math.Between(100, this.cameras.main.height - 100),
            this.enemyType
        );

        // Define uma velocidade aleatória para a presa
        enemy.setVelocity(
            Phaser.Math.Between(-500, 500), // Velocidade X aleatória
            Phaser.Math.Between(-500, 500) // Velocidade Y aleatória
        );

        // Torna a presa clicável
        enemy.setInteractive();

        // Define o que acontece quando o jogador clica na presa
        enemy.on('pointerdown', () => this.catchEnemy(enemy));
    }

    catchEnemy(enemy) {
        if (!enemy.active) return; // Verifica se o inimigo ainda está ativo

        // Remove a presa
        enemy.destroy();

        // Aumenta a pontuação
        this.score++;
        this.scoreText.setText(`Presas: ${this.score}`);

        // Verifica se o jogador pode pausar o tempo
        if (this.score >= this.nextPauseThreshold && !this.canPauseTime) {
            this.canPauseTime = true; // Habilita o poder de pausar o tempo
            this.pauseText.setText('Poder de parar o tempo pronto!').setVisible(true); // Exibe feedback visual

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
        if (this.isTimePaused) return; // Não decrementa o tempo se estiver pausado

        // Decrementa o tempo restante
        this.timeLeft--;
        this.timerText.setText(`Tempo: ${this.timeLeft}`);

        // Verifica se o tempo acabou
        if (this.timeLeft <= 0) {
            this.endGame();
        }
    }

    pauseTime() {
        if (this.isTimePaused || !this.canPauseTime) return; // Evita múltiplas pausas ou pausas sem poder

        this.isTimePaused = true; // Pausa o tempo
        this.canPauseTime = false; // Desabilita o poder até atingir o próximo limite
        this.freezeText.setVisible(true); // Exibe o texto "FREEZE"

        // Pausa o evento de geração de presas
        this.enemySpawnEvent.paused = true;

        // Congela todas as presas
        this.enemies.getChildren().forEach(enemy => {
            enemy.setVelocity(0, 0); // Para o movimento das presas
        });

        // Retoma o tempo após 5 segundos
        this.time.addEvent({
            delay: 5000, // 5 segundos
            callback: () => {
                this.isTimePaused = false; // Retoma o tempo
                this.freezeText.setVisible(false); // Oculta o texto "FREEZE"

                // Retoma o movimento das presas
                this.enemies.getChildren().forEach(enemy => {
                    enemy.setVelocity(
                        Phaser.Math.Between(-500, 500), // Velocidade X aleatória
                        Phaser.Math.Between(-500, 500) // Velocidade Y aleatória
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
            maxScore = this.score; // Atualiza a pontuação máxima
            localStorage.setItem('maxScore', maxScore); // Salva no localStorage
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
        const newVelocityX = Phaser.Math.Between(-500, 500); // Velocidade X aleatória
        const newVelocityY = Phaser.Math.Between(-500, 500); // Velocidade Y aleatória

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
        this.load.image('background4', 'assets/background2.png');
        this.load.image('botão1', 'assets/botão1.png');
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
            this.scene.start('ChooseEnemyScene'); // Reinicia o jogo
        });

        // Efeito ao passar o mouse sobre o botão
        restartButton.on('pointerover', () => {
            restartButton.setScale(1.1); // Aumenta o tamanho do botão
        });

        // Efeito ao tirar o mouse do botão
        restartButton.on('pointerout', () => {
            restartButton.setScale(1); // Volta ao tamanho original
        });
    }
}

class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
    }

    preload() {
        this.load.image('background5', 'assets/background2.png');
        this.load.image('botão1', 'assets/botão1.png');
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
            this.scene.start('ChooseEnemyScene'); // Reinicia o jogo
        });

        // Efeito ao passar o mouse sobre o botão
        restartButton.on('pointerover', () => {
            restartButton.setScale(1.1); // Aumenta o tamanho do botão
        });

        // Efeito ao tirar o mouse do botão
        restartButton.on('pointerout', () => {
            restartButton.setScale(1); // Volta ao tamanho original
        });
    }
}

// Configuração do Phaser
const config = {
    type: Phaser.AUTO, // Renderização automática (WebGL ou Canvas)
    width: 1835, // Largura da tela
    height: 1000, // Altura da tela
    scene: [ChooseEnemyScene, TutorialScene, GameScene, GameOverScene, WinScene], // Cenas do jogo
    physics: {
        default: 'arcade', // Usa física arcade
        arcade: { debug: false } // Desativa o modo de depuração
    }
};

// Inicializa o jogo
const game = new Phaser.Game(config);