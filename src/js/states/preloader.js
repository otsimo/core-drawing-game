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
        this.loadAssets();
    }

    create() {
        if (otsimo.debug) {
            this.game.time.advancedTiming = true;
        }
        if (otsimo.kv.game_music) {
            let audio = this.game.add.audio(otsimo.kv.game_music.music, otsimo.kv.game_music.volume, otsimo.kv.game_music.loop);
            otsimo.currentMusic = audio.play();
            otsimo.currentMusic.volume = otsimo.kv.game_music.volume_load_screen;
        }
        if (otsimo.kv.game.click_sound) {
            otsimo.clickSound = this.game.add.audio(otsimo.kv.game.click_sound);
        }
        if (otsimo.kv.game.balloon_sound) {
            otsimo.popSound = this.game.add.audio(otsimo.kv.game.balloon_sound);
        }
        
        if (otsimo.kv.game.correct_sound) {
            otsimo.correctSound = this.game.add.audio(otsimo.kv.game.correct_sound);
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

