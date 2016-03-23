import * as states from './states';

otsimo.onSettingsChanged(function (settings, sound) {
    otsimo.game.sound.mute = !sound
});


otsimo.run(function () {
    
    let game = new Phaser.Game(otsimo.width, otsimo.height, Phaser.CANVAS, 'gameContainer');
    Object.keys(states).forEach(state => game.state.add(state, states[state]));

    otsimo.game = game;

    game.state.start('Boot');
});
