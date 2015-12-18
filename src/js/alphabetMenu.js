var alphabet_categories = [
  {
    char: "A",
    icon_url: "char_A.png"
  },
  {
    char: "B",
    icon_url: "char_B.png"
  }
];


Game.AlphabetMenu = function () {
};

Game.AlphabetMenu.prototype = {
  create: function () {
    var menuGroup = game.add.group();

    //HEADER
    var style = {font: "Arial", fill: "#FFFFFF", align: "center", fontSize: "64px"};
    var text = game.add.text(game.world.centerX, game.height * 0.08, "Alfabe", style);
    menuGroup.add(text);
    text.anchor.set(0.5, 0.5);

    for (var i = 0; i < alphabet_categories.length; i++) {
      var category = image_categories[i];
      addButtonToAlphabet(menuGroup, category, game.world.centerX + (((i % 6) - 6) * 100), game.world.centerY)
    }
  },

  update: function () {

  }
};


function addButtonToAlphabet(menuGroup, category, x, y) {
  function buttonClicked() {
    this.game.state.start("alphabetGame");
  }

  var button = game.make.button(x, y, "atlas", buttonClicked, this, category.icon_url, category.icon_url, category.icon_url);
  button.anchor.set(0.5, 0.5);
  menuGroup.add(button);
}