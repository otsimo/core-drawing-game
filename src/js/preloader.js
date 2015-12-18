Game.Preloader = function () {
  this.asset = null;
  this.ready = false;
};

Game.Preloader.prototype = {
  preload: function () {
    this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
    this.load.setPreloadSprite(this.asset);

    // this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    // this.loadResources();

    this.ready = true;
  },

  loadResources: function () {
    // load your assets here
  },

  create: function () {

  },

  update: function () {
    // if (!!this.ready) {
    this.game.state.start('mainMenu');
    // }
  },

  onLoadComplete: function () {
    // this.ready = true;
  }
};

