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