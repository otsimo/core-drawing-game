(function () {
  'use strict';

  function AlphabetGame() {
  }

  AlphabetGame.prototype = {
    create: function () {
      this.input.onDown.add(this.onInputDown, this);
    },

    update: function () {

    },

    onInputDown: function () {
      this.game.state.start('menu');
    }
  };

  window['draw-prototype'] = window['draw-prototype'] || {};
  window['draw-prototype'].AlphabetGame = AlphabetGame;
}());
