var game = new Phaser.Game(1024, 768, Phaser.CANVAS, 'draw-prototype-game');
game.state.add('boot', Game.Boot);
game.state.add('preloader', Game.Preloader);
game.state.add('mainMenu', Game.MainMenu);
game.state.add('alphabetMenu', Game.AlphabetMenu);
game.state.add('alphabetGame', Game.AlphabetGame);

game.state.start('boot');
