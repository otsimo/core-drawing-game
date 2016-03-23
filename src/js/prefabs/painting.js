
export class OtsimoPainting {


    constructor({game, parent}) {
        this.game = game;
        this.parentGroup = parent;
        this.drawing = false;
        this.steps = [];
        this.onfinishdrawing = null;

        this.steps.push(newPaintingStep(parent));
        this.game.input.addMoveCallback(this.input.bind(this));
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

            var radgrad = ctx.createRadialGradient(x, y, 15, x, y, 30);

            radgrad.addColorStop(0, '#FFFF00');
            radgrad.addColorStop(0.5, 'rgba(255,255,0,0.5)');
            radgrad.addColorStop(1, 'rgba(255,255,0,0)');

            ctx.fillStyle = radgrad;
            ctx.fillRect(x - 30, y - 30, 60, 60);
        }

        step.lastPoint = currentPoint;
    }

    onUp(pointer, x, y) {
        this.drawing = false;
        if (this.onfinishdrawing) {
            this.onfinishdrawing(this.getLastStep())
        }
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

export {distanceBetween, angleBetween}