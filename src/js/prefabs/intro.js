import {calculateConstraint} from '../utils'

export default class Introduction extends Phaser.Group {
    constructor({game, question}) {
        super(game);
        this.onComplete = new Phaser.Signal();
        this.question = question;
        this.currentPage = 0;
        this.intro_type = sprintf("intro_%s", otsimo.kv.game.type);
    }

    _addOnPageCompleted(chain, txts) {
        let intro = otsimo.kv.play_screen[this.intro_type];

        chain.onComplete.addOnce(() => {
            let last = null;
            for (let txt of txts) {
                last = otsimo.game.add.tween(txt).to({ alpha: 0 }, intro.text_enter_duration, Phaser.Easing.Cubic.Out, false, intro.duration_each * 4);
                last.start();
            }
            this.currentPage = this.currentPage + 1
            if (this.currentPage < this.pageTweens.length) {
                last.chain(this.pageTweens[this.currentPage])
            } else {
                last.onComplete.addOnce(() => {
                    this.onComplete.dispatch();
                }, this)
            }
        }, this);
    }

    show() {
        if (otsimo.game.state.current != "Play") {
            return;
        }
        if (!otsimo.kv.game.show_intro_drawing) {
            otsimo.kv.play_screen[this.intro_type].question_constraint.x.multiplier = 2.9;
            for (let k = 0; k < otsimo.kv.play_screen[this.intro_type].pages.length; k++) {
                for (let i = 0; i < otsimo.kv.play_screen[this.intro_type].pages[k].length; i++) {
                    otsimo.kv.play_screen[this.intro_type].pages[k][i].position.x.multiplier = 0.5;
                }
            }
        } else {
            otsimo.kv.play_screen[this.intro_type].question_constraint.x.multiplier = 0.9;
            for (let k = 0; k < otsimo.kv.play_screen[this.intro_type].pages.length; k++) {
                for (let i = 0; i < otsimo.kv.play_screen[this.intro_type].pages[k].length; i++) {
                    otsimo.kv.play_screen[this.intro_type].pages[k][i].position.x.multiplier = 0.35;
                }
            }
        }
        this.soundArr = [];
        let q = this.question;
        let intro = otsimo.kv.play_screen[this.intro_type];
        let qp = calculateConstraint(intro.question_constraint);
        let question_image = this.game.add.image(qp.x, -otsimo.game.height, "img-atlas", q.atlas_key);
        question_image.anchor.set(qp.anchor.x, qp.anchor.y);
        let itween = otsimo.game.add.tween(question_image).to({ y: qp.y }, 300, Phaser.Easing.Cubic.Out);

        this.pageTweens = [itween];

        let count = 0;
        for (let i = 0; i < intro.pages.length; i++) {
            let chain = null;
            let txts = [];
            let page = intro.pages[i];
            for (let s = 0; s < page.length; s++) {
                let t = page[s];
                let pos = calculateConstraint(t.position);
                let text = sprintf(t.text, q);
                let style = intro.styles[t.style];

                let txt = otsimo.game.add.text(pos.x, pos.y, text, style, this);

                txt.audio = sprintf(t.audio, q);
                txt.anchor.set(0.5, 0.5);
                txt.alpha = 0;

                // load sound of k
                let sound = undefined;
                if (t.audio) {
                    sound = otsimo.game.add.audio(txt.audio);
                    this.soundArr.push(sound);
                }

                let tweenDur = intro.text_enter_duration;
                let delay = intro.duration_each + i * 300;
                if (sound) {
                    let soundDur = this.game.cache.getSoundData(sound.key).duration * 1000;
                    if (soundDur > delay) {
                        delay = soundDur;
                    }
                }

                if (t.audio) {
                    var k = otsimo.game.add.tween(txt).to({ alpha: 1 }, tweenDur, Phaser.Easing.Cubic.Out, false, delay * 0.35);
                } else {
                    var k = otsimo.game.add.tween(txt).to({ alpha: 1 }, tweenDur, Phaser.Easing.Cubic.Out, false, 300);
                }


                if (chain) {
                    chain.chain(k);
                } else {
                    if (this.pageTweens.length == 1) {
                        itween.chain(k);
                    }
                    this.pageTweens.push(k);
                }

                chain = k;
                txts.push(txt);
                count++;
            }
            this._addOnPageCompleted(chain, txts);
        }
        this.objectImage = question_image;
        this.pageTweens[this.currentPage].start();
        this.currentPage = this.currentPage + 1;
        this.startSound();
    }

    startSound() {
        let sounds = this.soundArr;
        let durations = [];
        let first = sounds[0];
        for (let i = 0; i < sounds.length; i++) {
            let dur = this.game.cache.getSoundData(sounds[i].key).duration * 1000;
            durations.push(dur);
        }
        if (otsimo.game.state.current) {
            first.play();
        }
        for (let i = 0; i < sounds.length; i++) {
            let sound = sounds[i];
            let timeout = this.totalPreviousDur(sounds, i);
            {
                setTimeout(() => {
                    if (otsimo.game.state.current == 'Play' && this.soundArr[i]) {
                        sound.play()
                    } else {
                        delete this.soundArr[i];
                    }
                }, timeout);
            }
        }
    }

    totalPreviousDur(sounds, index) {
        let totalDur = 0;
        if (!index || sounds.length == 0 || index >= sounds.length) {
            return totalDur;
        }
        for (let i = index - 1; i >= 0; i--) {
            totalDur += this.game.cache.getSoundData(sounds[i].key).duration * 1000;
        }
        return totalDur;
    }

    hide() {
        if (!otsimo.kv.game.show_intro_drawing) {
            return;
        }
        let img = this.objectImage;
        let t = otsimo.game.add.tween(img)
            .to({ x: otsimo.game.width + img.width }, 300, Phaser.Easing.Cubic.In, true);

        t.onComplete.addOnce(this.destroy, this);
    }

    makeObjectImageSmall() {
        if (!otsimo.kv.game.show_intro_drawing) {
            return;
        }
        let p = calculateConstraint(otsimo.kv.play_screen[this.intro_type].question_small_constraint);
        let img = this.objectImage;

        let co = otsimo.kv.play_screen[this.intro_type].question_small_size
        let xc = co.width.constant | 0;
        let yc = co.height.constant | 0;
        let mw = co.width.multiplier * otsimo.game.width + xc;
        let mh = co.height.multiplier * otsimo.game.height + yc;

        let s = img.scale.x;

        if (img.width > mw) {
            s = mw / img.width;
        }
        if ((img.height * s) > mh) {
            s = mh / (img.height * s);
        }

        if (Math.abs(s - img.scale.x) > 0.001) {
            otsimo.game.add.tween(img.scale)
                .to({ x: s, y: s }, 300, Phaser.Easing.Cubic.Out, true);
        }

        otsimo.game.add.tween(img)
            .to({ x: p.x, y: p.y }, 300, Phaser.Easing.Cubic.Out, true);

        if (p.anchor.x != img.anchor.x || p.anchor.y != img.anchor.y) {
            otsimo.game.add.tween(img.anchor).to({ x: p.anchor.x, y: p.anchor.y }, 300, Phaser.Easing.Cubic.Out, true)
        }


    }

    goRightForEnding() {
        if (!otsimo.kv.game.show_intro_drawing) {
            return;
        }
        let q = this.question// otsimo.kv.alphabet[0] //this.question;
        let intro = otsimo.kv.play_screen[this.intro_type];
        let qp = calculateConstraint(intro.question_constraint);
        let img = this.objectImage;

        otsimo.game.add.tween(img)
            .to({ x: qp.x, y: qp.y }, 300, Phaser.Easing.Cubic.Out, true)

        otsimo.game.add.tween(img.scale)
            .to({ x: 1, y: 1 }, 300, Phaser.Easing.Cubic.Out, true)

        otsimo.game.add.tween(img.anchor).to({ x: qp.anchor.x, y: qp.anchor.y }, 300, Phaser.Easing.Cubic.Out, true)
    }
}