var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'draw-prototype-game');
game.state.add('boot', Game.Boot);
game.state.add('preloader', Game.Preloader);
game.state.add('mainMenu', Game.MainMenu);
game.state.add('alphabetMenu', Game.AlphabetMenu);
game.state.add('game', Game.Game);
game.state.add('alphabetGame', Game.AlphabetGame);

/* yo phaser:state new-state-files-put-here */
game.state.start('boot');
