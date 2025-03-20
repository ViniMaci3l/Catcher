class ChooseEnemyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ChooseEnemyScene' }); // Define a chave única para esta cena
    }

    preload() {
        // Carrega as imagens dos inimigos e do fundo
        this.load.image('presa1', 'assets/alien1.png');
        this.load.image('presa2', 'assets/passaro2.png');
        this.load.image('presa3', 'assets/tartaruga3.png');
        this.load.image('background1', 'assets/fundo2.png');
    }

    create() {
        // Adiciona a imagem de fundo centralizada e redimensionada para cobrir a tela
        this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "background1"
        ).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Cria três inimigos interativos com feedback visual ao passar o mouse
        const enemy1 = this.add.image(550, 450, 'presa1')
            .setInteractive() // Torna o inimigo interativo
            .on('pointerdown', () => this.startGame('presa1')) // Inicia o jogo ao clicar
            .on('pointerover', () => enemy1.setScale(1.1)) // Aumenta o tamanho ao passar o mouse
            .on('pointerout', () => enemy1.setScale(1)); // Volta ao tamanho original ao remover o mouse

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
        // Armazena o tipo de inimigo escolhido no registro global do Phaser
        this.registry.set('enemyType', enemyType);
        // Inicia a cena do tutorial
        this.scene.start('TutorialScene');
    }
}

class TutorialScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TutorialScene' }); // Define a chave única para esta cena
    }

    preload() {
        // Carrega a imagem de fundo
        this.load.image('background2', 'assets/fundo1.png');
    }

    create() {
        // Adiciona a imagem de fundo centralizada e redimensionada
        this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "background2"
        ).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Adiciona textos explicativos sobre o jogo
        this.add.text(this.cameras.main.centerX, 100, 'Bem-vindo ao Catcher!', { 
            fontSize: '50px', 
            fill: '#fff'
        }).setOrigin(0.5); // Centraliza o texto

        this.add.text(this.cameras.main.centerX, 200, 'Regras', { 
            fontSize: '24px', 
            fill: '#ff0'
        }).setOrigin(0.5);

        // Adiciona mais textos com as regras do jogo
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
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' }); // Define a chave única para esta cena
    }

    preload() {
        // Carrega as imagens de fundo e do botão de reiniciar
        this.load.image('background4', 'assets/fundo1.png');
        this.load.image('botão1', 'assets/botão.png');
    }

    create(data) {
        // Adiciona a imagem de fundo centralizada e redimensionada
        this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "background4"
        ).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Exibe o texto "Game Over!" centralizado
        this.add.text(this.cameras.main.centerX, 150, 'Game Over!', { 
            fontSize: '48px', 
            fill: '#f00' // Cor vermelha
        }).setOrigin(0.5);

        // Exibe a quantidade de presas capturadas
        this.add.text(this.cameras.main.centerX, 250, `Presas capturadas: ${data.score}`, { 
            fontSize: '32px', 
            fill: '#fff' // Cor branca
        }).setOrigin(0.5);

        // Exibe o recorde máximo de presas capturadas
        this.add.text(this.cameras.main.centerX, 300, `Recorde: ${data.maxScore}`, { 
            fontSize: '32px', 
            fill: '#0f0' // Cor verde
        }).setOrigin(0.5);

        // Adiciona um botão de reiniciar o jogo
        const restartButton = this.add.image(this.cameras.main.centerX, 450, 'botão1').setScale(1);

        // Torna o botão interativo
        restartButton.setInteractive();

        // Define o comportamento ao clicar no botão
        restartButton.on('pointerdown', () => {
            this.scene.start('ChooseEnemyScene'); // Reinicia o jogo, voltando para a cena de escolha do inimigo
        });

        // Adiciona feedback visual ao passar o mouse sobre o botão
        restartButton.on('pointerover', () => {
            restartButton.setScale(1.1); // Aumenta o tamanho do botão
        });

        // Retorna o botão ao tamanho original ao remover o mouse
        restartButton.on('pointerout', () => {
            restartButton.setScale(1);
        });
    }
}

class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' }); // Define a chave única para esta cena
    }

    preload() {
        // Carrega as imagens de fundo e do botão de reiniciar
        this.load.image('background5', 'assets/fundo1.png');
        this.load.image('botão1', 'assets/botão.png');
    }

    create(data) {
        // Adiciona a imagem de fundo centralizada e redimensionada
        this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "background5"
        ).setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Exibe o texto "Você Venceu" centralizado
        this.add.text(this.cameras.main.centerX, 150, 'Você Venceu', { 
            fontSize: '48px', 
            fill: '#0f0' // Cor verde
        }).setOrigin(0.5);

        // Exibe a quantidade de presas capturadas
        this.add.text(this.cameras.main.centerX, 250, `Presas capturadas: ${data.score}`, { 
            fontSize: '32px', 
            fill: '#fff' // Cor branca
        }).setOrigin(0.5);

        // Exibe o recorde máximo de presas capturadas
        this.add.text(this.cameras.main.centerX, 300, `Recorde: ${data.maxScore}`, { 
            fontSize: '32px', 
            fill: '#0f0' // Cor verde
        }).setOrigin(0.5);

        // Adiciona um botão de reiniciar o jogo
        const restartButton = this.add.image(this.cameras.main.centerX, 450, 'botão1').setScale(1);

        // Torna o botão interativo
        restartButton.setInteractive();

        // Define o comportamento ao clicar no botão
        restartButton.on('pointerdown', () => {
            this.scene.start('ChooseEnemyScene'); // Reinicia o jogo, voltando para a cena de escolha do inimigo
        });

        // Adiciona feedback visual ao passar o mouse sobre o botão
        restartButton.on('pointerover', () => {
            restartButton.setScale(1.1); // Aumenta o tamanho do botão
        });

        // Retorna o botão ao tamanho original ao remover o mouse
        restartButton.on('pointerout', () => {
            restartButton.setScale(1);
        });
    }
}
const config = {
    type: Phaser.AUTO, // Usa WebGL ou Canvas automaticamente
    width: 1835, // Largura da tela
    height: 1000, // Altura da tela
    scene: [ChooseEnemyScene, TutorialScene, GameScene, GameOverScene, WinScene], // Lista de cenas
    physics: {
        default: 'arcade', // Usa física arcade
        arcade: { debug: false } // Desativa o modo de debug
    }
};

const game = new Phaser.Game(config); // Inicializa o jogo com a configuração