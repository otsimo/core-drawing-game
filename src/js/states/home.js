import Balloon from '../prefabs/balloon'
import {calculateConstraint} from '../utils'

export default class Home extends Phaser.State {

    create() {
        this.game.stage.backgroundColor = otsimo.kv.home_screen.background_color

        let pb = calculateConstraint(otsimo.kv.home_screen.play_btn_constraint)
        let btn = this.game.add.button(pb.x, pb.y, 'playButton', this.playAction, this, 2, 1, 0);
        btn.anchor = otsimo.kv.home_screen.play_btn_constraint.anchor;

        let bp = calculateConstraint(otsimo.kv.game.back_btn_constraint)
        this.game.add.button(bp.x, bp.y, otsimo.kv.game.back_btn_image, otsimo.quitgame, this);
    }

    playAction() {
        this.game.state.start('Play');
    }

    render() {
        if (otsimo.debug) {
            this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
        }
    }
}





