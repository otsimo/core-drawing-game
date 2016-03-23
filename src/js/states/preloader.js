import {setConstraint} from '../utils'

export default class Preloader extends Phaser.State {
    preload() {
        this.game.stage.backgroundColor = otsimo.kv.loading_screen.background_color;
        if (otsimo.kv.loading_screen.only_image) {
            this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
            this.load.setPreloadSprite(this.asset);
        } else {
            let loadingMessage = otsimo.kv.loading_screen.text
            let loadingFont = otsimo.kv.loading_screen.font
            let loadingColor = otsimo.kv.loading_screen.text_color

            var loading = this.game.add.text(this.game.world.centerX, this.game.world.centerY, loadingMessage, { font: loadingFont, fill: loadingColor });
            setConstraint(loading, otsimo.kv.loading_screen.text_constraint);
        }
        this.game.sound.mute = !otsimo.sound
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

