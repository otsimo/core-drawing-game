import Balloon from '../prefabs/balloon'
import {calculateConstraint} from '../utils'

export default class Over extends Phaser.State {
    create() {
        this.game.add.button((this.game.width) * 0.37, (this.game.height) * 0.47, 'playButton', this.playAction, this);

        let bp = calculateConstraint(otsimo.kv.game.back_btn_constraint)
        this.game.add.button(bp.x, bp.y, otsimo.kv.game.back_btn_image, this.backAction, this);

        Balloon.random()
    }

    playAction() {
        this.game.state.start('Play');
    }

    backAction() {
        this.game.state.start('Home');
    }

}