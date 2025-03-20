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