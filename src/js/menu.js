Game.MainMenu = function () {
};

Game.MainMenu.prototype = {
  create: function () {
    console.log("MainMenu create");

    var text = this.add.text(this.game.width * 0.5, this.game.height * 0.5,
      'MENU', {
        font: '42px Arial', fill: '#ffffff', align: 'center'
      });
    text.anchor.set(0.5);
    this.input.onDown.add(this.onDown, this);
  },

  update: function () {

  },

  onDown: function () {
    console.log("mainMenu onDown");
    this.game.state.start('alphabetMenu');
  }
};

