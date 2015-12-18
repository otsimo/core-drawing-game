var alphabet_categories = [
  {
    char: "A",
    icon_url: "char_A.png",
    big: "big_A.png",
    object: "Ayakkabı",
    objectImg: "shoes.png",
    steps: [
      [
        {x: 138, y: 15},
        {x: 107, y: 64},
        {x: 80, y: 133},
        {x: 56, y: 194},
        {x: 34, y: 254},
        {x: 12, y: 313}
      ], [
        {x: 145, y: 15},
        {x: 176, y: 64},
        {x: 203, y: 133},
        {x: 227, y: 194},
        {x: 249, y: 254},
        {x: 271, y: 313}
      ], [
        {x: 46, y: 229},
        {x: 93, y: 229},
        {x: 142, y: 229},
        {x: 191, y: 229},
        {x: 238, y: 229}]
    ]
  },
  {
    char: "B",
    icon_url: "char_B.png",
    big: "big_A.png",
    object: "Ayakkabı",
    objectImg: "shoes.png"
  },
  {
    char: "C",
    icon_url: "char_C.png",
    big: "big_A.png",
    object: "Ayakkabı",
    objectImg: "shoes.png"
  },
  {
    char: "Ç",
    icon_url: "char_Ch.png",
    big: "big_A.png",
    object: "Ayakkabı",
    objectImg: "shoes.png"
  },
  {
    char: "D",
    icon_url: "char_D.png",
    big: "big_A.png",
    object: "Ayakkabı",
    objectImg: "shoes.png"
  },
  {
    char: "E",
    icon_url: "char_E.png",
    big: "big_A.png",
    object: "Ayakkabı",
    objectImg: "shoes.png"
  }
];


Game.AlphabetMenu = function () {
};

Game.AlphabetMenu.prototype = {
  create: function () {
    var backgroundImg = game.add.image(0, 0, "background.png");

    var menuGroup = game.add.group();

    //HEADER
    var style = {font: "Arial", fill: "#FFFFFF", align: "center", fontSize: "64px"};
    var text = game.add.text(game.world.centerX, game.height * 0.08, "Alfabe", style);
    menuGroup.add(text);
    text.anchor.set(0.5, 0.5);

    for (var i = 0; i < alphabet_categories.length; i++) {
      var category = alphabet_categories[i];
      addButtonToAlphabet(menuGroup, category, game.world.centerX + 80 + (i - 3) * 170, game.world.centerY)
    }
  },

  update: function () {

  }
};


function addButtonToAlphabet(menuGroup, category, x, y) {
  function buttonClicked() {
    Game.nextAlpha = category;
    this.game.state.start("alphabetGame");
  }

  var button = game.make.button(x, y, "atlas", buttonClicked, this, category.icon_url, category.icon_url, category.icon_url);
  button.anchor.set(0.5, 0.5);
  menuGroup.add(button);
}