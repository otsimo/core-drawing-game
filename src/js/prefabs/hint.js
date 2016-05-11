export default class Hint {
    constructor({game, stars}) {
        this.game = game;
        this.stars = stars;
        this.step = 0;
        this.timerArr = [];
        this.tweenArr = [];
        this.timer = undefined;
        this.tween = undefined;
        this.arrow = undefined;
        this.flag = false;
    }

    /**
     * Call hint timer
     * Timer is calls hint otsimo.settings.hint_duration seconds with delay
     * @param {integer} delay for outside conditions
     */
    call(delay) {
        //console.log("call hint");
        //console.log("call: stars = ", this.stars);
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
        //console.log("showing hint");
        let fT = undefined;
        let lT = undefined;
        let next = { func: Phaser.Easing.Sinusoidal.Out, id: 'out' };
        this.swap = function (prev) {
            switch (prev.id) {
                case ('out'):
                    prev.func = Phaser.Easing.Sinusoidal.In;
                    prev.id = 'in';
                    break;
                case ('in'):
                    prev.func = Phaser.Easing.Sinusoidal.Out;
                    prev.id = 'out';
                    break;
            }
        }
        //console.log("this.stars: ", this.stars);
        this.arrow = otsimo.game.add.sprite(this.stars[0].world.x + this.stars[0].width / 2, this.stars[0].world.y + this.stars[0].height * 1.5, 'hand');
        this.arrow.anchor.set(0, 0);
        this.arrow.anchor.set(this.stars[0].anchor.x, this.stars[0].anchor.y);
        for (let i of this.stars) {
            if (i != this.stars[0]) {
                let t = otsimo.game.add.tween(this.arrow).to({ y: i.world.y + i.height * 1.5, x: i.world.x + i.width / 2 }, otsimo.kv.game.hint_hand_duration, Phaser.Easing.Linear.Out, false);
                this.tweenArr.push(t);
                this.swap(next);
            }
        }
        for (let i = 0; i < this.tweenArr.length - 1; i++) {
            if (i == 0) {
                fT = this.tweenArr[i];
            } else if (i == this.tweenArr.length - 2) {
                lT = this.tweenArr[i + 1];
            }
            this.tweenArr[i].chain(this.tweenArr[i + 1]);
        }
        this.tween = fT;
        if (this.stars.length == 1) {
            otsimo.game.time.events.add(otsimo.kv.game.hint_hand_duration * 2, this.kill, this);
            this.call(otsimo.kv.game.hint_hand_duration * 1.5);
        } else {
            fT.start();
            lT.onComplete.add(this.kill, this);
            let delay = this.tweenArr.length * otsimo.kv.game.hint_hand_duration;
            this.call(delay);
        }
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
        let temp = this.tween;
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
        if (this.tween) {
            this.tween.stop();
        }
    }

    getStep() {
        return this.step;
    }

}

