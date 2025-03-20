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