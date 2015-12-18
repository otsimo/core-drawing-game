Game.MainMenu = function () {
};

var image_categories = [
  {
    icon_url: "alphabet_button.png",
    game_name: "alphabetMenu"
  },
  {
    icon_url: "numbers_button.png",
    game_name: "alphabetMenu"
  }
];

Game.MainMenu.prototype = {
  create: function () {
    var backgroundImg = game.add.image(0, 0, "background.png");

    var menuGroup = game.add.group();

    //HEADER
    var style = {font: "Arial", fill: "#FFFFFF", align: "center", fontSize: "64px"};
    var text = game.add.text(game.world.centerX, game.height * 0.08, "Otsimo XYZ", style);
    menuGroup.add(text);
    text.anchor.set(0.5, 0.5);

    for (var i = 0; i < image_categories.length; i++) {
      var category = image_categories[i];
      addButtonToMenu(menuGroup, category, i * 200)
    }
  }
};

function addButtonToMenu(menuGroup, category, y) {
  function buttonClicked() {
    this.game.state.start(category.game_name);
  }

  var button = game.make.button(game.world.centerX, game.world.centerY + y, "atlas", buttonClicked, this, category.icon_url, category.icon_url, category.icon_url);
  button.anchor.set(0.5, 0.5);
  menuGroup.add(button);
}