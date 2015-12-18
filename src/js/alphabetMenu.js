Game.AlphabetMenu = function () {
};

Game.AlphabetMenu.prototype = {
  create: function () {
    console.log("AlphabetMenu create");

    var text = this.add.text(this.game.width * 0.5, this.game.height * 0.5,
      'Alphabets', {
        font: '42px Arial', fill: '#ffffff', align: 'center'
      });
    text.anchor.set(0.5);
    game.stage.backgroundColor = '#ff0000';
    this.input.onDown.add(this.onDown, this);
  },

  update: function () {

  },

  onDown: function () {
    this.game.state.start('alphabetGame');
  }
};

