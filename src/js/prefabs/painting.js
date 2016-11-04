
import { Hint } from './hint'

function copyTouch(touch) {
    return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}

function is_touch_device() {
    return 'ontouchstart' in window        // works on most browsers 
        || navigator.maxTouchPoints;       // works on IE10/11 and Surface
};
export class OtsimoPainting {
    constructor({game, parent, paintingStep, checkPoints, visiblePos}) {
        this.game = game;
        this.parentGroup = parent;
        this.drawing = false;
        this.steps = [];
        this.onfinishdrawing = null;
        this.steps.push(newPaintingStep(parent));
        this.paintingStep = paintingStep;
        this.checkPoints = checkPoints;
        this.visiblePos = visiblePos;
        this.firstOrangeStarX = this.checkPoints[0].x + (this.visiblePos.x - this.parentGroup.sprite.width * 0.5);
        this.firstOrangeStarY = this.checkPoints[0].y + (this.visiblePos.y - this.parentGroup.sprite.height * 0.5);
        this.secondOrangeStarX = this.checkPoints[this.checkPoints.length - 1].x + (this.visiblePos.x - this.parentGroup.sprite.width * 0.5);
        this.secondOrangeStarY = this.checkPoints[this.checkPoints.length - 1].y + (this.visiblePos.y - this.parentGroup.sprite.height * 0.5);
        this.startWith = 0;
        this.preparingnextstep = false;

        if (is_touch_device()) {
            this.startup()
        } else {
            this.game.input.addMoveCallback(this.input.bind(this));
        }
    }
    startup() {
        var el = document.getElementsByTagName("canvas")[0];
        this.hts = this.handleTouchStart.bind(this)
        this.hte = this.handleTouchEnd.bind(this)
        this.htc = this.handleTouchCancel.bind(this)
        this.htm = this.handleTouchMove.bind(this)
        el.addEventListener("touchstart", this.hts, false);
        el.addEventListener("touchend", this.hte, false);
        el.addEventListener("touchcancel", this.htc, false);
        el.addEventListener("touchmove", this.htm, false);
    }

    handleTouchStart(e) {
        e.preventDefault();
        let touches = e.changedTouches;
        if (touches.length >= 1) {
            let touch = copyTouch(touches[0]);
            this.input({ isMouse: false, isDown: false, isUp: false }, touch.pageX, touch.pageY);
        }
    }
    handleTouchEnd(e) {
        e.preventDefault();
        let touches = e.changedTouches;
        if (touches.length >= 1) {
            let touch = copyTouch(touches[0]);
            this.input({ isMouse: false, isDown: false, isUp: true }, touch.pageX, touch.pageY);
        }
    }
    handleTouchMove(e) {
        e.preventDefault();
        let touches = e.changedTouches;
        if (touches.length >= 1) {
            let touch = copyTouch(touches[0]);
            this.input({ isMouse: false, isDown: true }, touch.pageX, touch.pageY);
        }
    }
    handleTouchCancel(e) {
        e.preventDefault();
        let touches = e.changedTouches;
        if (touches.length >= 1) {
            let touch = copyTouch(touches[0]);
            this.input({ isMouse: false, isDown: false, isUp: true }, touch.pageX, touch.pageY);
        }
    }

    getLastStep() {
        return this.steps[this.steps.length - 1];
    }

    input(pointer, x, y) {
        // if active pointer collides with first star
        if (pointer.isDown && this.firstCircleCollision(x, y)) {
            console.log("---------------FIRSTCIRCLECOLLISION-------------")
            console.log("firstCircleCollision, startWith: ", this.startWith);
            if (this.startWith == 0) {
                this.startWith = 1;
            } else if (this.startWith == 2) {
                this.onfinishdrawing(this.getLastStep());
                /*setTimeout(() => {
                    this.preparingnextstep = false;
                }, 300);*/
                this.startWith = 0;
            } else {
                return;
            }
            console.log("startWith changed to: ", this.startWith);
        }

        // if active pointer collides with second star
        if (pointer.isDown && this.secondCircleCollision(x, y)) {
            console.log("---------------SECONDCIRCLECOLLISION-------------")            
            console.log("secondCircleCollision, startWith:", this.startWith);
            if (this.startWith == 0) {
                this.startWith = 2;
            } else if (this.startWith == 1) {
                this.onfinishdrawing(this.getLastStep());
                /*setTimeout(() => {
                    this.preparingnextstep = false;
                }, 300);*/
                this.startWith = 0;
            } else {
                return;
            }
            console.log("startWith changed to: ", this.startWith);
        }

        if (!this.drawing && pointer.isDown) {
            this.drawing = true;
            this.onDown(pointer, x, y);
        } else if (this.drawing && pointer.isDown) {
            this.onMove(pointer, x, y);
        } else if (this.drawing && pointer.isUp) {
            this.onUp(pointer, x, y);
        }
    };

    newStep() {
        this.steps.push(newPaintingStep(this.parentGroup));
    }

    clearCtx() {
        var step = this.getLastStep();
        clearStep(step);
        this.steps.pop();
    };

    clear() {
        this.game.input.deleteMoveCallback(this.input);
    }

    onDown(pointer, x, y) {
        this.hint.kill();
        this.hint.removeTimer();
        this.hint.removeTimer(false);
        this.hint.kill();
        let step = this.getLastStep();
        step.lastPoint = { x: x, y: y };
        step.points.push(step.lastPoint);
    }

    onMove(pointer, x, y) {
        this.hint.kill();
        this.hint.removeTimer();
        if (this.preparingnextstep) {
            console.log("preparingnextstep");
            return;
        }
        var step = this.getLastStep();

        var currentPoint = { x: x, y: y };
        var dist = distanceBetween(step.lastPoint, currentPoint);
        var angle = angleBetween(step.lastPoint, currentPoint);

        if (step.lastPoint.x == 0) {
            step.lastPoint = currentPoint;
            return;
        }

        var ctx = step.ctx;

        step.points.push(currentPoint);

        for (var i = 0; i < dist; i += 5) {

            x = step.lastPoint.x + (Math.sin(angle) * i);
            y = step.lastPoint.y + (Math.cos(angle) * i);

            var radgrad = ctx.createRadialGradient(x, y, 15, x, y, 30);

            radgrad.addColorStop(0, '#FFFF00');
            radgrad.addColorStop(0.5, 'rgba(255,255,0,0.5)');
            radgrad.addColorStop(1, 'rgba(255,255,0,0)');

            ctx.fillStyle = radgrad;
            ctx.fillRect(x - 30, y - 30, 60, 60);
        }

        step.lastPoint = currentPoint;
        for (let i of step.points) {
            this.paintingStep.push(i);
        }
    }

    onUp(pointer, x, y) {
        this.hint.call(0);
        this.drawing = false;
        //console.log("onfinishdrawing:", this.onfinishdrawing);
        if (this.onfinishdrawing) {
            this.onfinishdrawing(this.getLastStep());
        }
    }

    cleanupEvents() {
        if (is_touch_device()) {
            var el = document.getElementsByTagName("canvas")[0];
            el.removeEventListener("touchstart", this.hts, false);
            el.removeEventListener("touchend", this.hte, false);
            el.removeEventListener("touchcancel", this.htc, false);
            el.removeEventListener("touchmove", this.htm, false);
        }
    }

    updateCheckpoints(new_points) {
        console.log("------------CHECKPOINTS UPDATED----------------")
        console.log("checkPoints before: ", this.checkPoints);
        console.log("updateCheckpoints: ", new_points);
        this.checkPoints = new_points;
        this.firstOrangeStarX = this.checkPoints[0].x + (this.visiblePos.x - this.parentGroup.sprite.width * 0.5);
        this.firstOrangeStarY = this.checkPoints[0].y + (this.visiblePos.y - this.parentGroup.sprite.height * 0.5);
        this.secondOrangeStarX = this.checkPoints[this.checkPoints.length - 1].x + (this.visiblePos.x - this.parentGroup.sprite.width * 0.5);
        this.secondOrangeStarY = this.checkPoints[this.checkPoints.length - 1].y + (this.visiblePos.y - this.parentGroup.sprite.height * 0.5);
        this.startWith = 0;
    }

    /**
     * 
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    firstCircleCollision(x, y) {
        //console.log("x: ", x, "y: ", y, "star's x:", this.firstOrangeStarX, "star's y:", this.firstOrangeStarY)
        let diameter = 10;
        let circle = new Phaser.Circle(this.firstOrangeStarX, this.firstOrangeStarY, diameter);
        circle.radius = diameter / 2;
        return Phaser.Circle.contains(circle, x, y);
    }

    /**
     * 
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    secondCircleCollision(x, y) {
        //console.log("x: ", x, "y: ", y, "star's x:", this.secondOrangeStarX, "star's y:", this.secondOrangeStarY)
        let diameter = 30;
        let circle = new Phaser.Circle(this.secondOrangeStarX, this.secondOrangeStarY, diameter);
        circle.radius = diameter / 2;
        return Phaser.Circle.contains(circle, x, y);
    }

    addHint(hint) {
        this.hint = hint;
    }
}

function newPaintingStep(parent) {
    let myBitmap = otsimo.game.add.bitmapData(otsimo.game.width, otsimo.game.height);
    let sprite = otsimo.game.add.sprite(0, 0, myBitmap, null, parent);
    sprite.anchor.set(0.5, 0.5);

    let ctx = myBitmap.context;
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.globalAlpha = 0.2;
    return {
        points: [],
        bitmap: myBitmap,
        ctx: ctx,
        lastPoint: { x: 0, y: 0 }
    }
}

function addPointToStep(step, point) {
    step.points.push(point);
}

function clearStep(step) {
    var ctx = step.ctx;
    step.points = [];
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    step.bitmap.destroy();
}

function distanceBetween(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function angleBetween(point1, point2) {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
}

export { distanceBetween, angleBetween }