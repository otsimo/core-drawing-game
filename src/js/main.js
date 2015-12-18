window.addEventListener('load', function () {
  'use strict';

  var ns = window['draw-prototype'];
  var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'draw-prototype-game');
  game.state.add('boot', ns.Boot);
  game.state.add('preloader', ns.Preloader);
  game.state.add('mainMenu', ns.MainMenu);
  game.state.add('alphabetMenu', ns.AlphabetMenu);
  game.state.add('game', ns.Game);
  game.state.add('alphabetGame', ns.AlphabetGame);

  /* yo phaser:state new-state-files-put-here */
  game.state.start('boot');
}, false);
