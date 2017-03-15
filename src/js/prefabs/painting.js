import { Hint } from './hint'

function copyTouch(touch) {
    return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}

function is_touch_device() {
    return 'ontouchstart' in window        // works on most browsers 
        || navigator.maxTouchPoints;       // works on IE10/11 and Surface
};
export class OtsimoPainting {
    constructor({ game, parent, paintingStep }) {
        this.game = game;
        this.parentGroup = parent;
        this.drawing = false;
        this.steps = [];
        this.onfinishdrawing = null;
        this.steps.push(newPaintingStep(parent));
        this.paintingStep = paintingStep;

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
    };

    clearCtx() {
        var step = this.getLastStep();
        clearStep(step);
        this.steps.pop();
    };

    clear() {
        this.game.input.deleteMoveCallback(this.input);
    }

    onDown(pointer, x, y) {
        this.hint.removeTimer(false);
        this.hint.kill();
        let step = this.getLastStep();
        step.lastPoint = { x: x, y: y };
        step.points.push(step.lastPoint);
    }

    onMove(pointer, x, y) {
        var step = this.getLastStep();

        var currentPoint = { x: x, y: y };
        var dist = distanceBetween(step.lastPoint, currentPoint);
        var angle = angleBetween(step.lastPoint, currentPoint);

        var ctx = step.ctx;

        step.points.push(currentPoint);

        for (var i = 0; i < dist; i += 5) {

            x = step.lastPoint.x + (Math.sin(angle) * i);
            y = step.lastPoint.y + (Math.cos(angle) * i);

            var radgrad = ctx.createRadialGradient(x, y, 20, x, y, 40);

            radgrad.addColorStop(0, '#FFFF00');
            radgrad.addColorStop(0.5, 'rgba(255,255,0,0.5)');
            radgrad.addColorStop(1, 'rgba(255,255,0,0)');

            ctx.fillStyle = radgrad;
            console.log(50);
            // x - 30, y - 30, 60, 60 
            ctx.fillRect(x - 40, y - 40, 80, 80);
        }

        step.lastPoint = currentPoint;
        for (let i of step.points) {
            this.paintingStep.push(i);
        }
    }

    onUp(pointer, x, y) {
        this.hint.call(0);
        this.drawing = false;
        if (this.onfinishdrawing) {
            this.onfinishdrawing(this.getLastStep())
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