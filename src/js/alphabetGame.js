Game.AlphabetGame = function () {
};

Game.AlphabetGame.prototype = {
  create: function () {
    console.log("AlphabetGame create");
    game.stage.backgroundColor = '#ff00FF';
    this.input.onDown.add(this.onInputDown, this);
  },

  update: function () {

  },

  onInputDown: function () {
    this.game.state.start('alphabetMenu');
  }
};

