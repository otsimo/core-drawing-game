Game.AlphabetGame = function () {
  this.painting = null;
};

Game.AlphabetGame.prototype = {
  create: function () {
    console.log("AlphabetGame create");
    game.stage.backgroundColor = '#ffffff';
    this.input.onDown.add(this.onInputDown, this);
    this.painting = new OtsimoPainting(game, 1024, 768);
  },

  update: function () {

  },

  onInputDown: function () {
    //  this.game.state.start('alphabetMenu');
  }
};

