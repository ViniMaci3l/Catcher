
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