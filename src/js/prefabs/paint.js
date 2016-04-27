import {calculateConstraint} from '../utils'
import {OtsimoPainting, angleBetween, distanceBetween} from './painting'

export default class Paint extends Phaser.Group {
    constructor({game, item}) {
        super(game);
        this.item = item
        let p = calculateConstraint(otsimo.kv.play_screen.paint_constraint)

        let sprite = this.create(0, 0, item.image, item.frame);
        sprite.anchor.set(0.5, 0.5);

        this.hiddenPos = new Phaser.Point(p.x, otsimo.game.height + sprite.height);
        this.visiblePos = new Phaser.Point(p.x, p.y);

        this.x = this.hiddenPos.x;
        this.y = this.hiddenPos.y;
        this.sprite = sprite;
        this.currentStep = 0;
        this.drawSteps();

        this.onFinishDrawing = new Phaser.Signal()
    }

    init() {
        let self = this;
        this.paint = new OtsimoPainting({ game: otsimo.game, parent: this });
        this.paint.onfinishdrawing = function (step) {
            self.checkDrawing(step);
        }
    }

    moveIn() {
        otsimo.game.add.tween(this)
            .to({ x: this.visiblePos.x, y: this.visiblePos.y }, 300, Phaser.Easing.Cubic.Out, true)
    }

    moveOut() {
        let tween = otsimo.game.add.tween(this)
            .to({ y: this.hiddenPos.y }, 300, Phaser.Easing.Cubic.In, true)

        tween.onComplete.addOnce(this.destroy, this)
    }

    goLeftForEnding() {
        otsimo.game.add.tween(this)
            .to({ x: this.visiblePos.x / 2, y: this.visiblePos.y }, 300, Phaser.Easing.Cubic.Out, true)
        otsimo.game.add.tween(this.scale)
            .to({ x: 0.7, y: 0.7 }, 300, Phaser.Easing.Cubic.Out, true)
    }

    drawSteps() {
        var points = this.item.steps[this.currentStep];
        this.stepGroup = [];
        this.stepDist = 0;
        for (var i = 0; i < points.length; ++i) {
            var x = points[i].x;
            var y = points[i].y;
            var img = "star_middle.png";
            if (i == 0 || i == points.length - 1) {
                img = "start_end.png";
            }
            if (i > 0) {
                let d = distanceBetween(points[i], points[i - 1]);
                this.stepDist += d;
            }

            var starImg = otsimo.game.add.image(x - this.sprite.width / 2, y - this.sprite.height / 2, "atlas", img, this);
            starImg.anchor.set(0.5, 0.5);

            this.bringToTop(starImg);
            this.stepGroup.push(starImg);
        }
        console.log("step distance of stars: ", this.stepDist);
    }

    checkDrawing(step) {
        console.log("checkDrawing");
        console.log(step.points);
        let checkPoints = this.item.steps[this.currentStep];
        let checking = [];
        let totDist = 0;
        for (var j = 0; j < checkPoints.length; j++) {
            checking.push(false);
        }
        for (var i = 1; i < step.points.length; i++) {
            var pre = step.points[i - 1];
            var now = step.points[i];
            var dist = distanceBetween(pre, now);
            totDist += dist;
            var angle = angleBetween(pre, now);
            for (var t = 0; t < dist; t++) {
                var x = pre.x + (Math.sin(angle) * t);
                var y = pre.y + (Math.cos(angle) * t);
                for (var jj = 0; jj < checkPoints.length; jj++) {
                    var p = checkPoints[jj];
                    var x2 = otsimo.game.world.centerX - this.sprite.width / 2 + p.x;
                    var y2 = otsimo.game.world.centerY - this.sprite.height / 2 + p.y;

                    if (starContainsPoint({ x: x, y: y }, { x: x2, y: y2 })) {
                        checking[jj] = true;
                    }
                }
            }
        }
        for (let i of this.stepGroup) {

        }
        console.log("totDist: ", totDist);
        if (this.stepDist && this.stepDist * 1.2 < totDist) {
            console.log("returning");
            this.paint.clearCtx();
            this.paint.newStep();
            return;
        }
        for (var k = 0; k < checkPoints.length; k++) {
            if (checking[k] === false) {
                console.log("returning");
                this.paint.clearCtx();
                this.paint.newStep();
                return;
            }
        }
        this.finishStep();
    }

    finishStep() {
        console.log("finishStep", this.currentStep, this.item.steps.length);
        this.finishAnim();

        if (this.currentStep + 1 < this.item.steps.length) {
            this.paint.newStep();
            this.currentStep += 1;
            this.drawSteps();
        } else {
            this.finishGame();
        }
    }

    finishAnim() {
        for (var i = 0; i < this.stepGroup.length; i++) {
            moveSpriteTo(this.stepGroup[i]);
        }
        this.stepGroup = [];
    }

    finishGame() {
        console.log("finishgame");
        this.onFinishDrawing.dispatch();
        this.cleanup();
    }

    cleanup() {
        if (this.paint) {
            this.paint.cleanupEvents();
        }
    }
}

function starContainsPoint(point, p2) {
    var minx = p2.x - 30;
    var miny = p2.y - 30;
    var maxx = p2.x + 30;
    var maxy = p2.y + 30;
    var bRet = false;
    if (point.x >= minx && point.x <= maxx
        && point.y >= miny && point.y <= maxy) {
        bRet = true;
    }
    return bRet;
}

function moveSpriteTo(sprite) {
    var tween = otsimo.game.add.tween(sprite);

    let px = otsimo.starPos.x - otsimo.game.width / 2 + (Math.random() * otsimo.kv.play_screen.bucket_star_width)
    let py = otsimo.starPos.y - otsimo.game.height / 2 + (Math.random() * otsimo.kv.play_screen.bucket_star_height)

    tween.to({ y: py, x: px }, 300);
    tween.start();
}