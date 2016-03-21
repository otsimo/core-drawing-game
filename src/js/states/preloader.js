export default class Preloader extends Phaser.State {
    preload() {
        this.game.stage.backgroundColor = otsimo.kv.homeBackgroundColor;
        this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
        this.load.setPreloadSprite(this.asset);
        this.loadAssets()
    }

    create() {
        if (otsimo.debug) {
            this.game.time.advancedTiming = true;
        }
        this.game.state.start('Home');
    }

    loadAssets() {
        let loader = this.game.load;
        for (let asset of otsimo.kv.preload) {
            if (asset.type === "atlas") {
                loader.atlas(asset.name, asset.path, asset.data);
            } else {
                loader[asset.type](asset.name, asset.path);
            }
        }
    }
}

