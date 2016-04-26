import Balloon from '../prefabs/balloon'
import {gameVisibleName, calculateConstraint} from '../utils'

let defaultPlayButton = {
    anchor: {
        x: 0.5, y: 0.5
    },
    x: {
        multiplier: 0.5,
        constant: 0
    },
    y: {
        multiplier: 0.7,
        constant: 0
    }
}

export default class Home extends Phaser.State {

    create() {
        if (otsimo.kv.home_screen.background_color) {
            this.game.stage.backgroundColor = otsimo.kv.home_screen.background_color;
        }
        if (otsimo.kv.home_screen.background_image) {
            let back = this.game.add.image(this.game.world.centerX, this.game.world.centerY, otsimo.kv.home_screen.background_image)
            back.anchor.set(0.5, 0.5);
        }
        let pb = calculateConstraint(otsimo.kv.home_screen.play_btn_constraint)
        let btn = this.game.add.button(pb.x, pb.y, 'playButton', this.playAction, this, 2, 1, 0);
        btn.anchor = otsimo.kv.home_screen.play_btn_constraint.anchor;

        let bp = calculateConstraint(otsimo.kv.game.back_btn_constraint)
        this.game.add.button(bp.x, bp.y, otsimo.kv.game.back_btn_image, this.quitGame, this);

        /*let vn = gameVisibleName();
        let q = calculateConstraint(otsimo.kv.gameNameLayout);
        let text = otsimo.game.add.text(q.x, q.y, vn, otsimo.kv.gameNameTextStyle);
        text.anchor.set(q.anchor.x, q.anchor.y);
        if (otsimo.kv.name_shadow) {
            text.setShadow(otsimo.kv.name_shadow.x, otsimo.kv.name_shadow.y, otsimo.kv.name_shadow.color, otsimo.kv.name_shadow.blur, true, false);
        }*/
        if (otsimo.currentMusic) {
            otsimo.currentMusic.volume = otsimo.kv.game_music.volume_home_screen;
        }
    }

    playAction() {
        if (otsimo.clickSound) {
            otsimo.clickSound.play()
        }
        this.game.state.start('Play');
    }
    
    quitGame() {
        if (otsimo.clickSound) {
            otsimo.clickSound.play()
        }
        otsimo.quitgame();
    }

    render() {
        if (otsimo.debug) {
            this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
        }
    }
}





