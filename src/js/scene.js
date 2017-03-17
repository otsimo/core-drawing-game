import { Randomizer } from './randomizer'
import Introduction from './prefabs/intro'
import { calculateConstraint } from './utils'
import Paint from './prefabs/paint'
import Hint from './prefabs/hint'

export default class Scene {
    constructor({ session, delegate }) {
        this.session = session;
        this.delegate = delegate;
        this._random = new Randomizer()
        this.steps = []
        this.step = 0
    }

    get random() {
        return this._random;
    }

    get step() {
        return this.current_step | 0;
    }

    set step(value) {
        this.current_step = value;
    }

    /**
     * intializes scene with randomly chosed item
     * @returns {boolean} whether a new step can be created
     */
    next() {
        this.step = this.step + 1;
        if (this.step > otsimo.kv.game.session_step) {
            return false;
        }
        this.random.next((item) => {
            this.answerItem = item;
            let intro = new Introduction({ game: otsimo.game, question: item });
            this.intro = intro;
            intro.onComplete.addOnce(this.onIntroCompleted, this);
            intro.show();
        });
        return true;
    }

    onIntroCompleted() {
        this.intro.makeObjectImageSmall();
        this.show();
    }

    show() {
        this.session.startStep();
        let paint = otsimo.game.pool.filter((i) => {
            return i.item.kind == this.answerItem.kind;
        })[0];
        paint.bindSession(this.session);
        paint.init();
        paint.moveIn();
        paint.onFinishDrawing.addOnce(this.onFinishDrawing, this);
        this.paint = paint;
        this.showBasket();
        //console.log("show stepGroup: ", this.paint.stepGroup);
        let hint = new Hint({ game: otsimo.game, stars: this.paint.stepGroup });
        hint.call(300);
        this.hint = hint;
        this.paint.addHint(this.hint);
    }

    showBasket() {
        let pc = calculateConstraint(otsimo.kv.play_screen.bucket_constraint);
        let bucket = otsimo.game.add.image(pc.x, pc.y, otsimo.kv.play_screen.bucket.atlas_or_image, otsimo.kv.play_screen.bucket.frame);
        bucket.y = otsimo.game.height + bucket.height;
        bucket.anchor = pc.anchor;

        otsimo.game.world.bringToTop(bucket);
        otsimo.game.add.tween(bucket).to({ y: pc.y }, 300, Phaser.Easing.Cubic.Out, true)

        let wp = new Phaser.Point(pc.x, pc.y)
        wp.y = wp.y + otsimo.kv.play_screen.bucket_star_y * bucket.height;
        wp.x = wp.x + otsimo.kv.play_screen.bucket_star_x * bucket.width;

        otsimo.starPos = wp

        this.bucket = bucket
    }

    hideBasket() {
        let tween = otsimo.game.add.tween(this.bucket).to({ y: otsimo.game.height + this.bucket.height }, 300, Phaser.Easing.Cubic.In, true)
        tween.onChildComplete.addOnce(this.bucket.destroy, this.bucket);
    }


    showEnding() {
        this.paint.starParticle();
        this.intro.goRightForEnding();
        this.paint.goLeftForEnding();
        this.hideBasket();

        setTimeout(() => {
            if (otsimo.game.state.current != "Play") {
                return false;
            }
            this.paint.moveOut();
            this.intro.hide();
        }, 1500);

        setTimeout(() => {
            if (!this.next()) {
                this.session.end();
                otsimo.game.state.start('Over');
            }
        }, 2000);
        setTimeout(() => {
            this.cleanup({ isBack: false });
        }, 1500);
    }

    onFinishDrawing() {
        this.session.updateScore();
        if (otsimo.correctSound) {
            otsimo.correctSound.play(null, null, 0.5);
        }
        setTimeout(() => {
            this.showEnding()
        }, 400);
        this.hint.kill();
        this.hint.removeTimer(true);
    }

    cleanup({ isBack }) {
        if (isBack) {
            let sounds = this.intro.soundArr;
            for (let i = 0; i < sounds.length; i++) {
                sounds[i].stop();
                delete sounds[i];
            }
        }
        if (this.paint) {
            this.paint.cleanup();
            this.paint._destroy();
        }
        this.paint = undefined;
    }
}
