export default class Hint {
    constructor({game, stars}) {
        this.game = game;
        this.stars = stars;
        this.step = 0;
        this.timerArr = [];
        this.tweenArr = [];
        this.timer = undefined;
        this.fT = undefined;
        this.arrow = undefined;
        this.flag = false;
    }

    /**
     * Call hint timer
     * Timer is calls hint otsimo.settings.hint_duration seconds with delay
     * @param {integer} delay for outside conditions
     */
    call(delay) {
        if (!otsimo.settings.show_hint || this.stars.length == 0) {
            return;
        }
        this.removeTimer(false);
        this.timer = otsimo.game.time.events.add(delay + (otsimo.settings.hint_duration * 1000), this.hint, this);
        this.timerArr.push(this.timer);
    }

    /**
     * Kill hint from scene or paint
     * Also destroys tweens
     */
    kill() {
        this.tweenArr = [];
        this.killArrow();
    }

    /**
     * Removes timer calls if there was any
     * Does not affect active tweens
     */
    removeTimer(fl) {
        if (fl) {
            this.flag = true;
        } else {
            this.flag = false;
            otsimo.game.time.events.stop(false);
        }
        if (this.timer) {
            otsimo.game.time.events.remove(this.timer);
            this.timer = undefined;
        }
        otsimo.game.time.events.start();
    }

    incrementStep() {
        this.step++;
    }

    /**
     * Creates hint arrow and its tweens.
     * Calls hint again with a delay of tween animations.
     */

    hint() {
        if (this.flag == true || this.stars.length == 0) {
            return;
        }
        this.incrementStep();

        let lTdelay = 300;
        let xC = this.stars[0].width * (1 - otsimo.kv.game.hand_scale_constant);
        let yC = 1.5 * this.stars[0].height * otsimo.kv.game.hand_scale_constant;

        this.arrow = otsimo.game.add.sprite(this.stars[0].world.x + xC, this.stars[0].world.y + yC, 'hand');
        this.arrow.anchor.set(this.stars[0].anchor.x, this.stars[0].anchor.y);

        this.addTweensToStars(xC, yC);
        this.chainTweens();

        if (this.stars.length == 1) {
            otsimo.game.time.events.add(otsimo.kv.game.hint_hand_duration * 2, this.kill, this);
            this.call(otsimo.kv.game.hint_hand_duration * 1.5);
        } else {
            this.fT.start();
            this.lT.onComplete.add(this.kill, this);
            let delay = (this.tweenArr.length + 5) * otsimo.kv.game.hint_hand_duration;
            this.call(delay);
        }
    }

    //add a tween to every star
    addTweensToStars(xC, yC, lTdelay) {

        // first tween for scaling
        this.fT = otsimo.game.add.tween(this.arrow.scale).to(
            {
                x: otsimo.kv.game.hand_scale_constant,
                y: otsimo.kv.game.hand_scale_constant
            },
            otsimo.kv.game.hint_hand_duration * 2.5, Phaser.Easing.Sinusoidal.Out, false
        );

        //tweens for arrow move
        for (let i of this.stars) {
            // i is the last star & there are more multiple stars
            if (i == this.stars[this.stars.length - 1] && this.stars.length != 1) {
                let lTx = (i.world.x - this.stars[this.stars.length - 2].world.x);
                let lTy = (i.world.y - this.stars[this.stars.length - 2].world.y);

                let t = otsimo.game.add.tween(this.arrow).to(
                    {
                        y: i.world.y + yC + lTy * 0.5,
                        x: i.world.x + xC + lTx * 0.35
                    },
                    otsimo.kv.game.hint_hand_duration * 2, Phaser.Easing.Sinusoidal.In, false
                );

                this.tweenArr.push(t);
            } else {

                let easingFunc = Phaser.Easing.Linear.In;

                // i is the first or second star
                if (i == this.stars[0] || i == this.stars[1]) {
                    easingFunc = Phaser.Easing.Sinusoidal.Out;
                }

                let t = otsimo.game.add.tween(this.arrow).to(
                    {
                        y: i.world.y + yC,
                        x: i.world.x + xC
                    },
                    otsimo.kv.game.hint_hand_duration, easingFunc, false
                );

                this.tweenArr.push(t);
            }
        }

        //last tween for scaling back
        this.lT = otsimo.game.add.tween(this.arrow.scale).to(
            {
                x: 0.8,
                y: 0.8
            },
            otsimo.kv.game.hint_hand_duration * 2.5, Phaser.Easing.Sinusoidal.In, false, lTdelay
        );

    }

    chainTweens() {
        this.fT.chain(this.tweenArr[0]);
        for (let i = 0; i < this.tweenArr.length - 1; i++) {
            this.tweenArr[i].chain(this.tweenArr[i + 1]);
            if (i == this.tweenArr.length - 2) {
                this.tweenArr[i].onComplete.add(this.lastTween, this);
            }
        }
    }

    lastTween() {
        this.lT.start();
    }

    /**
     * Kills the hint object if it exists
     */

    killArrow() {
        if (this.arrow) {
            this.arrow.kill();
            this.arrow = undefined;
        }
    }

    /**
     * Kills all tweens in tweenArr 
     */

    killTween() {
        let temp = this.fT;
        for (let i of this.tweenArr) {
            temp = i;
            while (temp.chainedTween != null) {
                let k = temp.chainedTween;
                otsimo.game.tweens.remove(temp.chainedTween);
                temp = k;
            }
            otsimo.game.tweens.remove(i);
            i = undefined;
        }
        if (this.fT) {
            this.fT.stop();
        }
    }

    getStep() {
        return this.step;
    }

}

